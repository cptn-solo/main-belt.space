import {
  WflBranchMetasLoadError,
  WflBranchesLoadError,
  WflLevelsLoadError
} from '../../dialogs/wofflerErrors'

const initialState = {
    branches: [],
    brnchmetas: [],
    levels:[],
    selectedLevelInfo: null //lvl.branch.meta
  }

export const state = Object.assign({}, initialState)

export const getters = {
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
}
