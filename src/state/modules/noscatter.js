import * as constants from '../constants'
import { Api, JsonRpc } from 'eosjs'
import { TextDecoder, TextEncoder } from 'text-encoding'
import LocalSignatureProvider from '../../sigprovider/localSigner'

import {
  UserProfileAccountsLoadError,
  UserProfileAccountsNotfoundError,
  UserProfileNoKeyGeneratedError,
  UserProfileNoKeyToImportError,
  UserProfileKeyExportError,
  UserProfileWrongKeyError
} from '../../dialogs/userProfileErrors'
import ApplicationError from '../../dialogs/applicationError'

const initialState = {
  signatureProvider: null,
  blockchainAccount: null
}

export const state = Object.assign({}, initialState)

export const getters = {
  signatureProvider(state) {
    return state.signatureProvider
  },
  publicKey(state) {
    const pubKeys = state.signatureProvider
      ? state.signatureProvider.publicKeys
      : []
    return pubKeys ? pubKeys[0] : null
  },
  gameAPI(state, getters, rootState) {
    return rootState.engine.gameAPI
  },
  accountname(state, getters) {
    return getters.gameAPI.accountname
  },
  localAccount(state, getters, rootState) {
    return rootState.settings.localAccount
  },
  eosNetwork(state, getters, rootState, rootGetters) {
    return rootGetters.eosNetwork
  },
  endPoint(state, getters, rootState, rootGetters) {
    return rootGetters.endPoint
  },
}

export const mutations = {
  setSignatureProvider: (state, provider) => {
    state.signatureProvider = provider
  },
  setBlockchainAccount: (state, account) => {
    state.blockchainAccount = account
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
  async login({ commit, dispatch, getters }, { accountname, privKey }) {
    try {
      if (await dispatch('importKey', privKey))
        dispatch('settings/setLocalKey', privKey, { root: true })

      commit('userProfile/setProfileState', constants.PROFILE_UNKNOWN, { root: true })
      dispatch('settings/setUseScatter', false, { root: true })
      dispatch('prepareAPI')

      const _pubKey = getters.publicKey      
      let _account = null
      try {
        _account = await dispatch('loadBlockchainAccount', accountname)          
      } catch (ex) {
        if (ex.networkError)
          throw ex
        
        await dispatch('settings/setLocalAccount', null, { root: true })
        throw new UserProfileAccountsNotfoundError()
      }
      let profileState = constants.PROFILE_REGISTERED
      commit('userProfile/setProfileState', profileState, { root: true })

      if (checkPermission(_account, _pubKey)) {
        await dispatch('settings/setLocalAccount', accountname, { root: true })
        profileState = await dispatch('userProfile/pickActiveAccount', accountname, { root: true })
      } else throw new UserProfileWrongKeyError()
      
      return profileState
    } catch (ex) {
      throw ex
    }
  },
  async logout({ commit, dispatch }) {
    commit('setSignatureProvider', null)
    await dispatch('settings/setLocalKey', null, { root: true })
    await dispatch('settings/setLocalAccount', null, { root: true })
    await dispatch('prepareAPI')
  },
  async generateKey({ commit, getters }, privateKey = null) {
    try {
      commit(
        'setSignatureProvider',
        await LocalSignatureProvider.createProvider(privateKey)
      )
      return getters.publicKey
    } catch (ex) {
      throw new UserProfileNoKeyGeneratedError(ex)
    }
  },
  async importKey({ commit, getters }, privateKey) {
    try {
      commit(
        'setSignatureProvider',
        await LocalSignatureProvider.createProvider(privateKey)
      )
      return getters.publicKey
    } catch (ex) {
      throw new UserProfileNoKeyToImportError(ex)
    }
  },
  async exportKey({ getters }) {
    try {
      if (!getters.signatureProvider || !getters.publicKey)
        throw new UserProfileKeyExportError('No key storage')

      const exportedKey = await getters.signatureProvider.exportKey(
        getters.publicKey
      )

      return exportedKey
    } catch (ex) {
      throw new UserProfileKeyExportError(ex)
    }
  },
  prepareAPI({ getters, rootGetters }, eos) {
    try {
      const rpc = new JsonRpc(rootGetters['settings/endPoint'])
      if (eos) {
        // scatter
        getters.gameAPI.setAPI(eos, rpc)
      } else {
        const api = new Api({
          rpc,
          signatureProvider:
            getters.signatureProvider || new LocalSignatureProvider(),
          textDecoder: new TextDecoder(),
          textEncoder: new TextEncoder(),
        })
        getters.gameAPI.setAPI(api, rpc)
      }
    } catch (ex) {
      throw new ApplicationError(ex)
    }
  },
  async loadBlockchainAccount({ commit, getters }, accountname) {
    try {
      const account = await getters.gameAPI.getAccount(accountname)
      commit('setBlockchainAccount', account)
      return account
    } catch (ex) {
      if (ex.networkError)
        throw ex
      
      throw new UserProfileAccountsLoadError(ex)
    }
  }
}

function checkPermission(accountData, pubKey) {
  const keys = accountData.permissions
    .filter(p => p.perm_name === 'active')
    .reduce((keys, p) => {
      const key = p.required_auth.keys.find(k => k.key === pubKey)
      if(key) 
        keys.push(key)
      return keys
    }, [])

  return keys.length > 0
}
