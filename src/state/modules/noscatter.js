import * as constants from '../constants'
import { Api, JsonRpc } from 'eosjs'
import { TextDecoder, TextEncoder } from 'text-encoding'
import LocalSignatureProvider from '../../sigprovider/localSigner'

import {
  UserProfileAccountsLoadError,
  UserProfileNoKeyGeneratedError,
  UserProfileNoKeyToImportError,
  UserProfileKeyExportError,
} from '../../dialogs/userProfileErrors'
import ApplicationError from '../../dialogs/applicationError'

const initialState = {
  signatureProvider: null,
  keyAccounts: null,
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
  keyAccounts(state) {
    return state.keyAccounts
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
  setKeyAccounts: (state, keyAccounts) => {
    state.keyAccounts = keyAccounts
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
  async login({ commit, dispatch, getters }) {
    try {
      commit('userProfile/setProfileState', constants.PROFILE_UNKNOWN, {
        root: true,
      })
      dispatch('settings/setUseScatter', false, { root: true })
      dispatch('prepareAPI')
      const _accountname = getters.accountname || getters.localAccount
      const _pubKey = getters.publicKey
      const accounts = await dispatch('loadKeyAccounts', _pubKey)
      if (accounts.length === 0) {
        // no linked accounts. will register now
        await dispatch('settings/setLocalAccount', null, { root: true })
        return false
      } else {
        let profileState = constants.PROFILE_REGISTERED
        commit('userProfile/setProfileState', profileState, {
          root: true,
        })
        const activeAccount =
          accounts.length === 1
            ? accounts[0]
            : _accountname && accounts.find(account => account === _accountname)
              ? _accountname
              : null
        if (activeAccount) {
          profileState = await dispatch(
            'userProfile/pickActiveAccount',
            activeAccount,
            { root: true }
          )
        }
        return profileState
      }
    } catch (ex) {
      throw ex
    }
  },
  async forgetKey({ commit, dispatch }) {
    commit('setSignatureProvider', null)
    commit('setKeyAccounts', null)
    await dispatch('settings/setLocalKey', null, { root: true })
    await dispatch('prepareAPI')
    try {
      await dispatch('userProfile/pickActiveAccount', null, { root: true })
    } catch (ex) {
      throw ex
    }
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
  async loadKeyAccounts({ commit, getters }, pubkey) {
    try {
      commit(
        'setKeyAccounts',
        await getters.gameAPI.getAccountsForPublicKey(pubkey)
      )
      return getters.keyAccounts
    } catch (ex) {
      throw new UserProfileAccountsLoadError(ex)
    }
  },
}
