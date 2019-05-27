import * as constants from '../constants'
import availableLocales from '../../api/metaData/availableLocales.json'

const initialState = {
  availableLocales,
  selectedLocale: initialLocale(),
  networkProtocol: constants.NETWORK_PROTOCOL,
  networkHost: constants.NETWORK_HOST,
  networkPort: constants.NETWORK_PORT,
  useScatter: false,
  localKey: null,
  localAccount: null,
}

function initialLocale() {
  let clientLang = navigator.language
    .split('-')[0]
    .trim()
    .toLowerCase()

  if (clientLang === 'zh') clientLang = 'ch' // fix for internally used alias for chineese language family

  let clientLocale = null

  if (clientLang)
    clientLocale = availableLocales.find(l => l.lang === clientLang)

  return clientLocale || availableLocales[0]
}

export const state = Object.assign({}, initialState)

export const getters = {
  availableLocales(state) {
    return constants.PROD_ENV
      ? state.availableLocales.filter(l => l.lang !== 'dev')
      : state.availableLocales
  },
  selectedLocale(state) {
    return state.selectedLocale
  },
  eosNetwork(state) {
    const eosNetwork = Object.assign({}, constants.NETWORK)
    eosNetwork.host = state.networkHost
    eosNetwork.protocol = state.networkProtocol
    eosNetwork.port = state.networkPort
    return eosNetwork
  },
  endPoint(state, getters) {
    const eosNetwork = getters.eosNetwork
    const endPoint = `${eosNetwork.protocol}://${eosNetwork.host}:${
      eosNetwork.port
    }`
    return endPoint
  },
  useScatter(state) {
    return state.useScatter
  },
  localKey(state) {
    return state.localKey
  },
  localAccount(state) {
    return state.localAccount
  },
}

export const mutations = {
  setSelectedLocale(state, locale) {
    state.selectedLocale = locale
  },
  setNetworkProtocol(state, networkProtocol) {
    state.networkProtocol = networkProtocol
  },
  setNetworkHost(state, networkHost) {
    state.networkHost = networkHost
  },
  setNetworkPort(state, networkPort) {
    state.networkPort = networkPort
  },
  setUseScatter(state, useScatter) {
    state.useScatter = useScatter
  },
  setLocalKey(state, key) {
    state.backupRequired = !!key && (!state.localKey || state.localKey !== key)
    state.localKey = key
  },
  setLocalAccount(state, account) {
    state.localAccount = account
  },
  resetData: state => {
    for (var key in state) {
      if (initialState.hasOwnProperty(key)) {
        state[key] = initialState[key]
      }
    }
  },
}

export const actions = {
  setSelectedLang({ dispatch, getters }, lang) {
    const locale = getters.availableLocales.find(
      locale => locale.lang === lang.trim().toLowerCase()
    )
    if (locale) dispatch('setSelectedLocale', locale)
  },
  setSelectedLocale({ commit, dispatch, getters }, locale) {
    commit('setSelectedLocale', locale)
    dispatch('engine/applySelectedLocale', null, { root: true })
  },
  setNetworkProtocol({ commit }, networkProtocol) {
    commit('setNetworkProtocol', networkProtocol)
  },
  setNetworkHost({ commit }, networkHost) {
    commit('setNetworkHost', networkHost)
  },
  setNetworkPort({ commit }, networkPort) {
    commit('setNetworkPort', networkPort)
  },
  setUseScatter({ commit }, useScatter) {
    commit('setUseScatter', useScatter)
  },
  setLocalKey({ commit }, key) {
    commit('setLocalKey', key)
  },
  setLocalAccount({ commit }, account) {
    commit('setLocalAccount', account)
  },
}
