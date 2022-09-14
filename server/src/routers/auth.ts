import * as trpc from '@trpc/server'
import type { Context } from '../context'
import { z } from 'zod'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

import 'dotenv/config'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

export default trpc
  .router<Context>()

  .mutation('register.local', {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
      user: z.string(),
      pass: z.string(),
      institution: z.string().optional(),
      address: z.string().optional(),
    }),
    async resolve({ input, ctx: { prisma } }) {
      const existing_user = await prisma.users.findUnique({
        where: {
          user: input.user,
        },
      })

      if (existing_user != null) {
        throw new Error(`A user with the email: ${input.user} exists. Please login instead`)
      }

      // accessToken that the user can use to access protected routes
      const accessToken = jwt.sign({ user: input.user }, process.env.JWT_SECRET ?? '', {
        expiresIn: '1d',
      })

      // replace the password with a hashed one
      input.pass = await bcrypt.hash(input.pass, 10)

      const new_user = await prisma.users.create({
        data: {
          ...input,
          role: 'basic',
        },
      })

      // after new user is successfully created, email the new user
      const message = {
        from: `${process.env.EMAIL_ADDRESS}`,
        to: new_user.user,
        subject: 'Successfully Sign Up for UCI Machine Learning Repository',
        text: `
        Hello ${new_user.firstName} ${new_user.lastName},
        You are receiving this message because you have successfully created an account for the UCI Machine Learning Repository under this email address.`,
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
      })

      transporter.sendMail(message)

      return {
        ID: new_user.ID,
        user: new_user.user,
        accessToken,
        role: new_user.role,

        firstName: new_user.firstName,
        lastName: new_user.lastName,
        institution: new_user.institution,
        address: new_user.address,

        accountManager: 'Google' as const,
      }
    },
  })

  .mutation('login.local', {
    input: z.object({
      user: z.string(),
      pass: z.string(),
    }),
    async resolve({ input, ctx: { prisma } }) {
      const user = await prisma.users.findUnique({
        where: {
          user: input.user,
        },
      })

      if (!user) {
        throw new Error(`Failed to find user with email: ${input.user}`)
      }

      // if no password, then user should login with Google or GitHub
      if (user.pass == null) {
        throw new Error(`This account has already been registered under Google or GitHub`)
      }

      if (!(await bcrypt.compare(input.pass, user.pass))) {
        throw new Error(`Invalid password for user ${input.user}`)
      }

      // accessToken that the user can use to access protected routes
      const accessToken = jwt.sign({ user: user.user }, process.env.JWT_SECRET ?? '', {
        expiresIn: '1d',
      })

      return {
        ID: user.ID,
        user: user.user,
        accessToken,
        role: user.role,

        firstName: user.firstName,
        lastName: user.lastName,
        institution: user.institution,
        address: user.address,

        accountManager: 'local' as const,
      }
    },
  })

  // after authorizing on client side, Google returns a jwt containing information about the user
  // https://developers.google.com/identity/gsi/web/reference/js-reference#CredentialResponse
  .mutation('login.google', {
    input: z.string(),
    async resolve({ input, ctx: { prisma } }) {
      // using the authorization code provided by the callback route, get a token
      const { tokens } = await oauth2Client.getToken(input)

      const access_token = tokens.access_token

      oauth2Client.setCredentials(tokens)

      if (!tokens.id_token || !access_token) {
        throw new Error('Error')
      }

      const user = jwt.decode(tokens.id_token)

      // type guards for the user returned from decoding the id token
      if (typeof user === 'string') {
        throw new Error(`Unexpected response from google, received string: ${user}`)
      }

      if (!user?.email) {
        throw new Error(`Failed to get email from Google`)
      }

      // attempt to find an existing user with the email
      const existing_user = await prisma.users.findUnique({
        where: {
          user: user.email,
        },
      })

      // if user is already registered, just update and return user
      if (existing_user) {
        const updated_user = await prisma.users.update({
          where: {
            user: existing_user.user,
          },
          data: {
            accessToken: access_token,
            google: tokens.refresh_token,
          },
        })

        return {
          ...updated_user,
          accessToken: access_token,
          accountManager: 'Google' as const,
        }
      }

      //// else, register a new user
      //// Google Credential | user in database
      //// ------------------------------------
      //// given_name        | firstName
      //// family_name       | lastName
      //// email             | user
      //// sub               | google

      const new_user = await prisma.users.create({
        data: {
          firstName: user.given_name,
          lastName: user.family_name,
          user: user.email,

          // use refresh token for Google
          google: tokens.refresh_token,
          accessToken: access_token,
        },
      })

      return {
        ...new_user,
        accessToken: access_token,
        accountManager: 'Google' as const,
      }
    },
  })

  // after authorizing client, client sends the "code" search parameter to server
  // https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
  .mutation('login.github', {
    input: z.string(),
    async resolve({ input, ctx: { prisma } }) {
      // 1) use code to get an access token
      const githubResponse = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token',
        headers: {
          Accept: 'application/json',
        },
        data: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: input,
        },
      })

      const { access_token } = githubResponse.data

      // 2) use access token to authorize request for user info
      const userResponse = await axios({
        method: 'get',
        headers: {
          Authorization: 'token ' + access_token,
        },
        url: 'https://api.github.com/user',
      })

      const user = userResponse.data

      if (user.email == null) {
        throw new Error(
          `Email can't be identified for this GitHub account, please make sure it's public.`
        )
      }

      // create accessToken that the user can use to access protected routes
      const userAccessToken = jwt.sign({ user: user.email }, process.env.JWT_SECRET ?? '', {
        expiresIn: '1d',
      })

      // attempt to find existing user with the email
      const existing_user = await prisma.users.findUnique({
        where: {
          user: user.email,
        },
      })

      // if user exists, update the user's access token and then return the user
      // the "github" column = user's github access token is used to sign out the user
      if (existing_user != null) {
        const updated_user = await prisma.users.update({
          where: {
            user: user.email,
          },
          data: {
            github: access_token,
          },
        })

        return {
          ID: updated_user.ID,
          user: updated_user.user,
          accessToken: userAccessToken,
          role: updated_user.role,

          firstName: updated_user.firstName,
          lastName: updated_user.lastName,
          institution: updated_user.institution,
          address: updated_user.address,

          accountManager: 'GitHub' as const,
        }
      }

      // else, create a new user with Github
      // Github Credential | user in database
      // ------------------------------------
      // login             | firstName
      // ''                | lastName
      // email             | user
      // access_token      | github

      const new_user = await prisma.users.create({
        data: {
          firstName: user.login,
          lastName: '',
          user: user.email,
          github: access_token,
        },
      })

      return {
        ID: new_user.ID,
        user: new_user.user,
        accessToken: userAccessToken,
        role: new_user.role,

        firstName: new_user.firstName,
        lastName: new_user.lastName,
        institution: new_user.institution,
        address: new_user.address,

        accountManager: 'GitHub' as const,
      }
    },
  })

  // given a user ID (number), revoke the access token for this application,
  // e.g. logout the user and remove authorization for this web app to access their account
  .mutation('logout.github', {
    input: z.number(),
    async resolve({ input, ctx: { prisma } }) {
      const github_user = await prisma.users.findUnique({
        where: {
          ID: input,
        },
        select: {
          github: true,
        },
      })

      if (!github_user?.github) {
        throw new Error(`No Github associated with the userID: ${input}`)
      }

      const deleteResponse = await axios({
        method: 'delete',
        url: `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/grant`,
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Basic ${Buffer.from(
            process.env.GITHUB_CLIENT_ID + ':' + process.env.GITHUB_CLIENT_SECRET
          ).toString('base64')}`,
        },
        data: {
          access_token: github_user.github,
        },
      })

      return deleteResponse.data
    },
  })
