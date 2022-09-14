//import { google } from 'googleapis'
//import 'dotenv/config'
//
///**
// * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
// * from the client_secret.json file. To get these credentials for your application, visit
// * https://console.cloud.google.com/apis/credentials.
// */
//const oauth2Client = new google.auth.OAuth2(
//  process.env.GOOGLE_CLIENT_ID,
//  process.env.GOOGLE_CLIENT_SECRET,
//  process.env.GOOGLE_REDIRECT_URL
//)
//
//// Access scopes for read-only Drive activity.
//const scopes = ['email']
//
//// Generate a url that asks permissions for the Drive activity scope
//const authorizationUrl = oauth2Client.generateAuthUrl({
//  // 'online' (default) or 'offline' (gets refresh_token)
//  access_type: 'offline',
//  /** Pass in the scopes array defined above.
//   * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
//  scope: scopes,
//  // Enable incremental authorization. Recommended as a best practice.
//  include_granted_scopes: true,
//})
//
//import type { Load } from '@sveltejs/kit'
//import { redirect } from '@sveltejs/kit'
//
//export const load: Load = async ({ url }) => {
//  console.log(url.searchParams.get('code'))
//  if (!url.searchParams.get('code')) {
//    throw redirect(307, authorizationUrl)
//  }
//  throw redirect(307, '/')
//}
