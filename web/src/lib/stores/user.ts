import { writable } from 'svelte/store'

export interface User {
  // userID in database
  ID: number | null

  // username associated with account
  user: string | null

  // access_token for authentication
  accessToken: string

  // role for authorization
  role: string | null

  firstName: string | null
  lastName: string | null
  institution: string | null
  address: string | null

  // describes who manages the account, used for logout and profile logic
  accountManager: 'local' | 'GitHub' | 'Google' | null

  // shorthand for admin checking
  isAdmin?: boolean
}

const defaultUser = {
  ID: null,
  user: null,
  accessToken: '',
  role: null,

  firstName: null,
  lastName: null,
  institution: null,
  address: null,

  // utilities
  isAdmin: false,
  accountManager: null,
}

function createUser() {
  const { subscribe, update, set } = writable<User>(defaultUser)

  return {
    subscribe,
    update,
    login: (user: User) =>
      set({
        ...user,
        isAdmin: user.role != null && ['admin', 'librarian', 'curator'].includes(user.role),
      }),
    logout: () => set(defaultUser),
  }
}

const user = createUser()
export default user
