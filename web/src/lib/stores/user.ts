import { writable } from 'svelte/store'

interface User {
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
}

interface UserStore extends User {
  // shorthand for admin checking
  isAdmin: boolean

  login: (newUser: User) => void
  logout: () => void
}

function createUser() {
  const { subscribe, update } = writable<UserStore>({
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

    login: () => update((k) => k),
    logout: () => update((k) => k),
  })

  return {
    subscribe,
    update,
  }
}

const user = createUser()
export default user
