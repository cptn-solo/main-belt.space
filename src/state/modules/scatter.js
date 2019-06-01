import * as constants from '../constants'
import supportedNetworks from '../../api/metaData/supportedNetworks.json'

import { Api, JsonRpc } from 'eosjs'
import ScatterJS, { Network } from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs2'
import {
  ScatterConnectError,
  ScatterNotConnectedError,
  ScatterSuggestNetworkError,
  ScatterGetPublicKeyError,
  ScatterLinkAccountError,
  ScatterLoginError,
  ScatterRequestTransferError,
} from '../../dialogs/scatterErrors'

ScatterJS.plugins(new ScatterEOS())

const initialState = {
  scatter: null,
  identity: null,
}

export const state = Object.assign({}, initialState)

export const getters = {
  scatter(state) {
    return state.scatter
  },
  identity(state) {
    return state.identity
  },
  account: state => {
    const identity = state.identity
    if (identity) {
      if (identity.accounts) {
        if (identity.accounts.length > 0) {
          return identity.accounts[0]
        }
      }
    }
    return null
  },
  network(state, getters, rootState, rootGetters) {
    return Network.fromJson(rootGetters['settings/eosNetwork'])
  },
}

export const mutations = {
  setScatter: (state, scatter) => (state.scatter = scatter),
  setIdentity: (state, identity) => (state.identity = identity),
  resetData: state => {
    for (var key in state) {
      if (initialState.hasOwnProperty(key)) {
        state[key] = initialState[key]
      }
    }
  },
}

export const actions = {
  setScatter: ({ commit }, scatter) => commit('setScatter', scatter),
  setIdentity: ({ commit }, identity) => commit('setIdentity', identity),
  async connect({ commit, dispatch, getters }, network = getters.network) {
    try {
      if (getters.scatter) await getters.scatter.disconnect()

      const scatter = getters.scatter || ScatterJS.scatter
      const connected = await scatter.connect(
        constants.APP_NAME,
        { network }
      )
      if (connected) {
        if (!getters.scatter) commit('setScatter', scatter)

        dispatch('settings/setUseScatter', true, { root: true })

        // scatter.addEventHandler((event, payload) => {
        //   console.log('app event', event, payload);
        // })

        getters.scatter.suggestNetwork() // first call with no waiting (hanging workaround)
        window.ScatterJS = null
      } else {
        commit('setScatter', null)
      }
      await dispatch('setEosInstance')
      return connected
    } catch (ex) {
      return new ScatterConnectError(ex)
    }
  },
  async requestPublicKey({ dispatch, getters }) {
    try {
      if (await dispatch('connect')) {
        const scatter = getters.scatter
        try {
          await scatter.suggestNetwork(getters.network)
        } catch (ex) {
          throw new ScatterSuggestNetworkError(ex)
        }
        try {
          return await scatter.getPublicKey(constants.NETWORK.blockchain)
        } catch (ex) {
          throw new ScatterGetPublicKeyError(ex)
        }
      } else throw new ScatterNotConnectedError()
    } catch (ex) {
      throw ex
    }
  },
  async linkAccount({ dispatch, getters }, { publicKey, name }) {
    const network = getters.network
    const account = { publicKey, name, authority: 'active' }
    try {
      if (await dispatch('connect')) {
        const scatter = getters.scatter
        await scatter.linkAccount(account, network)
      } else throw new ScatterNotConnectedError()
    } catch (ex) {
      return new ScatterLinkAccountError(ex)
    }
  },
  async login({ commit, dispatch, getters }) {
    try {
      commit('userProfile/setProfileState', constants.PROFILE_UNKNOWN, {
        root: true,
      })
      if (await dispatch('connect')) {
        const scatter = getters.scatter
        try {
          await scatter.suggestNetwork() // second call with waiting
        } catch (ex) {
          throw new ScatterSuggestNetworkError(ex)
        }
        try {
          await dispatch('setEosInstance')
          commit('setIdentity', await scatter.login())
        } catch (ex) {
          throw new ScatterLoginError(ex)
        }
        return await dispatch(
          'userProfile/pickActiveAccount',
          getters.account.name,
          { root: true }
        )
      } else throw new ScatterNotConnectedError()
    } catch (ex) {
      throw ex
    }
  },
  async logout({ commit, dispatch, getters }) {
    try {
      if (await dispatch('connect')) await getters.scatter.logout()
    } finally {
      commit('setIdentity', null)
      commit('setScatter', null)
      dispatch('settings/setUseScatter', false, { root: true })
      dispatch('noscatter/prepareAPI', null, { root: true })
    }
  },
  async setEosInstance({ dispatch, getters }) {
    const endpoint = getters.network.fullhost()
    const rpc = new JsonRpc(endpoint)
    const eos = ScatterJS.eos(getters.network, Api, { rpc, beta3: true })
    dispatch('noscatter/prepareAPI', eos, { root: true })
  },
  async transferAsset({ dispatch, getters }, { assetInfo, account, memo }) {
    // assetInfo: CurrencyInfo.info //!! not used because of "symbol precision mismatch" in Scatter
    const network = getters.network
    const tokenDetails = {
      contract: 'eosio.token',
      symbol: assetInfo.symbol,
      decimals: assetInfo.decimals,
      memo,
    }
    try {
      const transferResults = await dispatch('requestTransferFromScatter', {
        network,
        tokenDetails,
        amount: assetInfo.fixed,
        address: account,
      })
      await dispatch('userProfile/loadAccountBalances', null, { root: true })
      return transferResults
    } catch (ex) {
      throw ex
    }
  },
  async purchasePack({ dispatch }, { paymentInfo, amount, aware }) {
    const network = ScatterJS.Network.fromJson(
      supportedNetworks[paymentInfo.blockchain]
    )
    const tokenDetails = {
      contract: 'eosio.token',
      symbol: 'EOS',
      memo: paymentInfo.paydata.memo,
      decimals: 4,
    }
    try {
      return await dispatch('requestTransferFromScatter', {
        network,
        tokenDetails,
        amount,
        address: paymentInfo.paydata.address,
      })
    } catch (ex) {
      if (aware) throw ex
      // no throw because this is an aux feature
    }
  },
  async requestTransferFromScatter(
    { dispatch, getters, rootState },
    { network, address, amount, tokenDetails }
  ) {
    const useScatter = rootState.settings.useScatter
    try {
      if (await dispatch('connect')) {
        // no await for result - user free to check all details in scatter
        getters.scatter.requestTransfer(network, address, amount, tokenDetails)
      } else throw new ScatterNotConnectedError()
    } catch (ex) {
      throw new ScatterRequestTransferError(ex)
    } finally {
      dispatch('settings/setUseScatter', useScatter, { root: true })
      if (!useScatter) dispatch('noscatter/prepareAPI', null, { root: true })
    }
  },
}
