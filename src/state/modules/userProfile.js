import * as constants from '../constants'
import {
  UserProfileLoadError,
  UserBalancesLoadError,
  UserTransferAssetError,
  UserProfileNoAccountError,
  UserProfileForgetError,
  UserProfileInitializationError,
  LoadPlayerStakesError, 
  AddBranchStakesError,
} from '../../dialogs/userProfileErrors'

const initialState = {
  // internals
  profileState: constants.PROFILE_UNKNOWN,
  balances: [],
  // used in UI
  accountBalance: "0 EOS",
  player: {
    account: "",
    channel: "",
    idlevel: 0,
    activebalance: "0 EOS",
    vestingbalance: "0 EOS",
    tryposition: 0,
    currentposition: 0,
    triesleft: 0,
    status: 0,
    resulttimestamp: 0  
  },
  playerStakes: []
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
  setAccountBalance(state, balance) {
    state.accountBalance = balance
  },
  setPlayer(state, playerObj) {
    for (var key in playerObj) {
      if (state.player.hasOwnProperty(key)) {
        state.player[key] = playerObj[key]
      }
    }
  },
  setPlayerStakes(state, stakes) {
    state.playerStakes = stakes
  },
  setBalances(state, balances) {
    state.balances = balances
  },
  setProfileState(state, profileState) {
    state.profileState = profileState
  },
  logout(state) {
  },
  resetData: state => {
    setKeyValues(state, initialState)
    },
  cleanupPlayerData: state => {
    setKeyValues(state.player, initialState.player)
  }
}

function setKeyValues(obj, source) {
  for (var key in obj) {
    if (source.hasOwnProperty(key)) {
      if (key === "player") setKeyValues(obj[key], source[key])
      else obj[key] = source[key]
    }
  }
}

export const actions = {
  async signup({ dispatch, getters, rootState }) {
    const account = getters.accountname
    if (!account) throw new UserProfileNoAccountError()
    try {
      await getters.gameAPI.signup(rootState.settings.referrerCode)
      await dispatch('pickActiveAccount', account)
      return getters.profileState
    } catch (ex) {
      throw new UserProfileInitializationError(ex)
    }
  },
  async forget({ commit, getters }) {
    const account = getters.accountname
    if (!account) throw new UserProfileNoAccountError()
    try {
      await getters.gameAPI.forget()
      commit('setProfileState', constants.PROFILE_LOGGEDIN)
      commit('cleanupPlayerData')
      return getters.profileState
    } catch (ex) {
      throw new UserProfileForgetError(ex)
    }
  },
  async logout({ dispatch, rootState}) {
    if (rootState.settings.useScatter) {
      await dispatch('scatter/logout', null, { root: true })  
    } else {
      await dispatch('noscatter/logout', null, { root: true })
    }
    try {
      await dispatch('pickActiveAccount', null)
    } catch (ex) {
      throw ex
    }
  },
  async pickActiveAccount({ commit, dispatch, getters }, accountname) {
    getters.gameAPI.accountname = accountname

    if (!accountname) {
      commit('setProfileState', constants.PROFILE_UNKNOWN)
      commit('resetData')
      commit('logout')

      return false // not picked
    }
    commit('setProfileState', constants.PROFILE_LOGGEDIN)
    try {
      if (await dispatch('loadAndProcessIngameProfile')) 
        commit('setProfileState', constants.PROFILE_INITIALIZED)
      
      return getters.profileState
    } catch (ex) {
      throw ex
    }
  },
  async loadAndProcessIngameProfile(
    { commit, dispatch, getters }, account = null) {
    try {
      const accountname = account || getters.accountname      
      const profileRows = await getters.gameAPI.getIngameProfileForAccount(accountname)
      let profileInitialized = false
      let player = null
      if (profileRows.length === 1) {
        profileInitialized = true
        player = profileRows[0]
        commit('setPlayer', player)
        await dispatch('loadPlayerStakes')
        await dispatch('woffler/fetchGameContext', player.idlevel, { root: true })
      }
      await dispatch('loadAccountBalance')
      return profileInitialized
    } catch (ex) {
      throw new UserProfileLoadError(ex)
    }
  },
  async loadAccountBalance({ commit, getters, state }) {
    try {
      const balanceRows = (await getters.gameAPI.getAccountBalances())
        .map(balance => balance.balance)
      commit('setBalances', balanceRows)
      if (balanceRows) {
        const balances = balanceRows.filter(asset => asset.split(' ')[1] === constants.CURR_CODE)
        commit('setAccountBalance', balances[0] || 0)
      }
      return state.balances
    } catch (ex) {
      throw new UserBalancesLoadError(ex)
    }
  },
  async depositAsset({ commit, dispatch, getters }, asset) {
    try {
      await getters.gameAPI.depositAsset(asset)
      if (await dispatch('loadAndProcessIngameProfile')) 
        commit('setProfileState', constants.PROFILE_INITIALIZED)
    } catch (ex) {
      throw new UserTransferAssetError(ex)
    }
  },
  async withdrawAsset({ dispatch, getters }, asset ) {
    try {
      await getters.gameAPI.withdrawAsset(asset)
      await dispatch('loadAndProcessIngameProfile')
    } catch (ex) {
      throw new UserTransferAssetError(ex)
    }
  },
  async loadPlayerStakes({ getters, commit, state }) {
    try {      
      commit('setPlayerStakes', await getters.gameAPI.getPlayerStakes())
      return state.playerStakes
    } catch (ex) {
      throw new LoadPlayerStakesError(ex)//TODO
    }
  },
  async addBranchStake({ dispatch, getters }, { level, amount }) {
    try {
      await getters.gameAPI.playerAction({actionname: 'stkaddval', payload: {
        owner: getters.accountname, 
        idbranch: level.idbranch,
        amount: amount
      }})
      await dispatch('loadAndProcessIngameProfile')
      await dispatch('woffler/updateBranchStake', level, { root: true })
    } catch (ex) {
      throw new AddBranchStakesError(ex)//TODO
    }
  }

}
