import gameAPI from '../../api/gameAPI'
import i18n from '../../lang/lang'

import * as constants from '../constants'
import ApplicationError from '../../dialogs/applicationError'

const initialState = {
  gameAPI,
  i18n,
  pendingGUIActions: [], //{icon (md icon name), title (localisation label), selector ('module/action/), payload (obj)}
  currentGUIAction: null
}
export const state = Object.assign({}, initialState)

export const getters = {
  useScatter(state, getters, rootState) {
    return rootState.settings.useScatter
  },
  selectedLocale(state, getters, rootState) {
    return rootState.settings.selectedLocale
  },
  pendingActions(state) {
    return state.pendingGUIActions.length > 0
  }
 }

export const mutations = {
  requestActions: (state, actions) => (state.pendingGUIActions = actions),
  setCurrentAction: (state, action) => (state.currentGUIAction = action),
  resetData: state => {
    for (var key in state) {
      if (initialState.hasOwnProperty(key)) {
        state[key] = initialState[key]
      }
    }
    state.gameAPI.accountname = null
  },
}

export const actions = {
  launch({ dispatch }) {
    dispatch('applySelectedLocale')
  },
  applySelectedLocale({ state, getters }) {
    const _locale = getters.selectedLocale.locale
    state.i18n.locale = _locale
  },
  requestActions({ commit }, actions) {
    commit('requestActions', actions)
  },
  actionPicked({ commit, state }, idx) {
    try {      
      const action = state.pendingGUIActions[idx]
      commit('setCurrentAction', action)
    } catch (ex) {
      throw new ApplicationError(ex)
    }    
  },
  enqueueAction({ commit }, action) {
    commit('setCurrentAction', action)
  },
  async performEnqueuedAction({ dispatch, commit, state }) {
    try {      
      const action = state.currentGUIAction
      await dispatch(action.selector, action.payload, { root: true })
      commit('setCurrentAction', null)
      commit('requestActions', [])
    } catch (ex) {
      throw new ApplicationError(ex)
    }    
  },
  async checkSavedCredentials({ dispatch, getters, rootGetters }) {
    try {
      const localKey = rootGetters['settings/localKey']
      const localAccount = rootGetters['settings/localAccount']
      if (localKey) {
        return await dispatch('noscatter/login', { accountname: localAccount, privKey: localKey }, { root: true })
      } else if (getters.useScatter) {
        return await dispatch('scatter/login', null, { root: true })
      }
      return false
    } catch (ex) {
      throw new ApplicationError(ex)
    }
  },
  async wipeLocalData({ commit, state }) {
    await commit('userProfile/resetData', null, { root: true })
    await commit('noscatter/resetData', null, { root: true })
    await commit('scatter/resetData', null, { root: true })
    await commit('settings/resetData', null, { root: true })
    state.gameAPI.accountname = null
  },
}
