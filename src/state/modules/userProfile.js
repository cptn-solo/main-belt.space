import * as constants from '../constants'
import {
  UserProfileLoadError,
  UserBalancesLoadError,
  UserTransferAssetError,
  UserProfileNoAccountError,
  UserProfileInitializationError,
} from '../../dialogs/userProfileErrors'

const initialState = {
  // internals
  profileState: constants.PROFILE_UNKNOWN,
  balances: [], // raw balance data as array [ "85 FND", "99820 ASTRO" ]
  // used in UI
  nickname: null, // in-game 'name' after init player
  eosBalance: 0, // only "99820"
  vipTime: 0, // vip-time left, ms
  vipTimeEnd: 0, // timestamp of the date till vip-status' end
  productsInfo: [], // products ready for render
}
export const state = Object.assign({}, initialState)

export const getters = {
  gameAPI(state, getters, rootState) {
    return rootState.engine.gameAPI
  },
  accountname(state, getters) {
    return getters.gameAPI.accountname
  },
  balances(state) {
    return state.balances
  },
  profileState(state) {
    return state.profileState
  },
  shouldRegisterAccount(state) {
    return state.profileState === constants.PROFILE_UNKNOWN
  },
  shouldPickAccount(state) {
    return state.profileState === constants.PROFILE_REGISTERED
  },
  shouldInitPlayer(state) {
    return state.profileState === constants.PROFILE_LOGGEDIN
  },
}

export const mutations = {
  setEosBalance(state, eosBalance) {
    state.eosBalance = eosBalance
  },
  setBalances(state, balances) {
    state.balances = balances
  },
  setProfileState(state, profileState) {
    state.profileState = profileState
  },
  logout(state) {},
  resetData: state => {
    for (var key in state) {
      if (initialState.hasOwnProperty(key)) {
        state[key] = initialState[key]
      }
    }
  },
}

export const actions = {
  async initPlayer({ commit, getters }, nickname) {
    const accountname = getters.accountname
    if (!accountname) throw new UserProfileNoAccountError()

    try {
      await getters.gameAPI.initPlayer({
        account: accountname,
      })
      commit('setProfileState', constants.PROFILE_INITIALIZED)
      return getters.profileState
    } catch (ex) {
      throw new UserProfileInitializationError(ex)
    }
  },
  async pickActiveAccount({ commit, dispatch, getters }, accountname) {
    getters.gameAPI.accountname = accountname

    if (!accountname) {
      commit('setProfileState', constants.PROFILE_UNKNOWN)
      commit('resetData')
      commit('logout')

      return false // не выбран
    }
    commit('setProfileState', constants.PROFILE_LOGGEDIN)
    try {
      const isInitialized = await dispatch(
        'loadAndProcessIngameProfile',
        accountname
      )
      if (isInitialized) {
        commit('setProfileState', constants.PROFILE_INITIALIZED)
      }
      return getters.profileState
    } catch (ex) {
      throw ex
    }
  },
  async loadAndProcessIngameProfile(
    { commit, dispatch, getters, rootGetters },
    accountname
  ) {
    try {
      const profileRows = await getters.gameAPI.getIngameProfileForAccount(
        accountname
      )
      let profileInitialized = false
      if (profileRows.length === 1 && profileRows[0].account === accountname) {
        profileInitialized = true
      }
      await dispatch('loadAccountBalances')
      return profileInitialized
    } catch (ex) {
      throw new UserProfileLoadError(ex)
    }
  },
  async loadAccountBalances({ commit, rootGetters, state }) {
    try {
      const balanceRows = (await rootGetters[
        'noscatter/gameAPI'
      ].getAccountBalances()).map(balance => balance.balance)
      commit('setBalances', balanceRows)
      if (balanceRows) {
        const balances = balanceRows.reduce((obj, row) => {
          const vals = row.split(' ')
          const assetAmount = parseFloat(vals[0])
          const assetSymbol = vals[1]
          obj[assetSymbol] = assetAmount
          return obj
        }, {})

        commit('setEosBalance', balances['EOS'] || 0)
      }
      return state.balances
    } catch (ex) {
      throw new UserBalancesLoadError(ex)
    }
  },
  async transferAsset(
    { dispatch, rootGetters },
    { account, amount, assetSymbol }
  ) {
    try {
      // TODO: check if scatter available first and form Request Transfer interaction
      await rootGetters['noscatter/gameAPI'].sendAsset(
        account,
        amount,
        assetSymbol
      )
      return await dispatch('loadAccountBalances', this.accountname)
    } catch (ex) {
      throw new UserTransferAssetError(ex)
    }
  },
}
