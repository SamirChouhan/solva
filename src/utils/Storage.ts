export const LOCAL_ACCESS_TOKEN_KEY = 'token'
export const LOCAL_WALLET_ADDRESS_KEY = 'wallet-address'
export const LOCAL_USER_DETAILS_KEY = 'user-details'
export const saveAccessToken = (token: string) => localStorage.setItem(LOCAL_ACCESS_TOKEN_KEY, token)
export const disableAccessToken = () => localStorage.removeItem(LOCAL_ACCESS_TOKEN_KEY)
export const checkAccessToken = () => localStorage.getItem(LOCAL_ACCESS_TOKEN_KEY)
