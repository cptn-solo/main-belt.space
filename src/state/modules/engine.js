import gameAPI from '../../api/gameAPI'
import i18n from '../../lang/lang'
import ApplicationError from '../../dialogs/applicationError'

const initialState = {
  gameAPI,
  i18n,
  pendingGUIActions: [], //{icon (md icon name), title (localisation label), selector ('module/action/) | promise, payload (obj)}
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
  actionPicked({ dispatch, state }, idx) {
    try {      
      const action = state.pendingGUIActions[idx]
      dispatch('enqueueAction', action)
    } catch (ex) {//in case action is not queued
      throw new ApplicationError(ex)
    }    
  },
  enqueueAction({ commit }, action) {
    console.log('enqueueAction', action)
    commit('setCurrentAction', action)
  },
  async performEnqueuedAction({ dispatch, commit, state }) {
    try {      
      const action = state.currentGUIAction
      if (action.selector) {
        const result = await dispatch(action.selector, action.payload, { root: true })
        if (action.success) action.success(result)
      } else if (action.promise) {        
        const result = await action.promise
        if (action.success) action.success(result)
      }        
      commit('requestActions', [])//actions left queued if exception occured to allow retry
    } catch (ex) {
      throw new ApplicationError(ex)
    } finally {
      commit('setCurrentAction', null)
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
