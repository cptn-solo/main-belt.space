export const PROD_ENV = process.env.VUE_APP_PROD_ENV === 'true'
export const NETWORK_HOST = process.env.VUE_APP_NETWORK_HOST
export const NETWORK_PORT = process.env.VUE_APP_NETWORK_PORT
export const NETWORK_PROTOCOL = process.env.VUE_APP_NETWORK_PROTOCOL
export const CHAIN_ID = process.env.VUE_APP_CHAIN_ID
export const NETWORK_NAME = process.env.VUE_APP_NETWORK_NAME
export const APP_NAME = process.env.VUE_APP_APP_NAME
export const APP_CODE = process.env.VUE_APP_CODE
export const NETWORK = {
  blockchain: 'eos',
  host: NETWORK_HOST,
  port: NETWORK_PORT,
  protocol: NETWORK_PROTOCOL,
  chainId: CHAIN_ID,
  token: {
    contract: 'eosio.token',
    symbol: 'EOS',
    decimals: 4,
  },
}

export const PROFILE_UNKNOWN = 0
export const PROFILE_REGISTERED = 1
export const PROFILE_LOGGEDIN = 2
export const PROFILE_INITIALIZED = 3

export const USER_PROFILE_STATE = [
  PROFILE_UNKNOWN,
  PROFILE_REGISTERED,
  PROFILE_LOGGEDIN,
  PROFILE_INITIALIZED,
]

export const GOOGLE_ANALYTICS_ID = process.env.VUE_APP_GOOGLE_ANALYTICS_ID
