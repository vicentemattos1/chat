import Cookies from 'js-cookie'

const COOKIE_NAME = 'chat-token'

export const credentialsHelper = {
  set: (token: string) => {
    Cookies.set(COOKIE_NAME, token, { expires: 7 })
  },
  get: () => {
    return Cookies.get(COOKIE_NAME)
  },
  clear: () => {
    Cookies.remove(COOKIE_NAME)
  },
}
