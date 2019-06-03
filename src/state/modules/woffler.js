import {
  WflBranchMetasLoadError,
  WflBranchesLoadError,
  WflLevelsLoadError,
  WflBranchSwitchError
} from '../../dialogs/wofflerErrors'
import ApplicationError from '../../dialogs/applicationError'

const initialState = {
    branches: [],
    brnchmetas: [],
    levels: [],
    currentLevelInfo: null,
    selectedLevelInfo: null,
  }

export const state = Object.assign({}, initialState)

export const getters = {
  gameAPI(state, getters, rootState) {
    return rootState.engine.gameAPI
  },
  accountname(state, getters) {
    return getters.gameAPI.accountname
  },
  startLevels(state) {//returns levelInfo (level+branch+meta)
    const activeLevels = state.levels
      .filter(l => (!l.locked && l.idparent === 0))
      .reduce((ret, l) => {
        ret.push(Object.assign(l, { branch: state.branches.find(b => b.id === l.idbranch)}))
        return ret
      }, [])
    return activeLevels
  }
}

export const mutations = {
  setBranchMetas: (state, brnchmetas) => (state.brnchmetas = brnchmetas),
  setBranches: (state, branches) => {
    state.branches = branches
      .reduce((ext, b) => {
        const meta = state.brnchmetas.find(m => m.id === b.idmeta) || { name: '' }
        ext.push({...b, meta})
        return ext
      },[])
},
  setLevels: (state, levels) => (state.levels = levels),  
  setSelectedLevel: (state, levelInfo) => (state.selectedLevelInfo = levelInfo),
  setCurrentLevel: (state, levelInfo) => (state.currentLevelInfo = levelInfo),
  resetData: state => {
    state.branches = []
    state.brnchmetas = []
    state.levels = []
  },  
}

export const actions = {
  selectLevel({ commit }, levelInfo) {
    commit('setSelectedLevel', levelInfo)
  },
  async joinGame({ getters, dispatch }, idbranch) {
    const account = getters.accountname
    try {
      await getters.gameAPI.switchbrnch(account, idbranch)
      await dispatch('userProfile/loadAndProcessIngameProfile', account, { root: true })
    } catch (ex) {
      throw new WflBranchSwitchError(ex)
    }
  },
  async signupAndJoinGame({ getters, dispatch }, levelInfo) {
    const account = getters.accountname
    try {
      await dispatch('userProfile/signup', null, { root: true })
      await dispatch('joinGame', levelInfo)
    } catch (ex) {
      throw new WflBranchSwitchError(ex)
    }
  },
  async loadGameData({dispatch}) {
    try {
      await dispatch('loadBranchMetas')
      await dispatch('loadBranches')
      await dispatch('loadLevels')
    } catch (ex) {
      throw new ApplicationError(ex)
    }
  },
  async loadBranchMetas({ commit, rootGetters, state }) {
    try {
      const metas = (await rootGetters['noscatter/gameAPI'].getBranchMetas())
      commit('setBranchMetas', metas)
      return state.brnchmetas
    } catch (ex) {
      throw new WflBranchMetasLoadError(ex)
    }
  },
  async loadBranches({ commit, rootGetters, state }) {
    try {
      const branches = (await rootGetters['noscatter/gameAPI'].getBranches())
      commit('setBranches', branches)
      return state.branches
    } catch (ex) {
      throw new WflBranchesLoadError(ex)
    }
  },
  async loadLevels({ commit, rootGetters, state }) {
    try {
      const levels = (await rootGetters['noscatter/gameAPI'].getLevels())
      commit('setLevels', levels)
      return state.levels
    } catch (ex) {
      throw new WflLevelsLoadError(ex)
    }
  },
  async fetchCurrentLevel({ dispatch, commit, state }, idlevel) {
    try {      
      commit('setCurrentLevel', (idlevel > 0 ? (await dispatch('loadOneLevel', idlevel)) : null))
      return state.currentLevelInfo
    } catch (ex) {
      throw new WflLevelsLoadError(ex)
    }
  },
  async loadOneLevel({ rootGetters }, idlevel) {
    try {
      let level = null
      const levels = (await rootGetters['noscatter/gameAPI'].getLevels(idlevel))
      if (levels.length != 1) 
        throw new ApplicationError('No valid level found for id: '+idlevel, 'Error loading level')
        
      const _level = levels[0]

      const branches = (await rootGetters['noscatter/gameAPI'].getBranches(_level.idbranch))
      const metas = (await rootGetters['noscatter/gameAPI'].getBranchMetas(_level.idmeta))

      if (branches.length != 1) 
        throw new ApplicationError('No valid branch found for id: '+_level.idbranch, 'Error loading levels branch')
      
      if (metas.length != 1) 
        throw new ApplicationError('No valid branch meta found for id: '+_level.idmeta, 'Error loading levels branch meta')

      level = Object.assign(_level, {branch: Object.assign(branches[0], { meta: metas[0] })})          

      return level
    } catch (ex) {
      throw new WflLevelsLoadError(ex)
    }
  },

}
