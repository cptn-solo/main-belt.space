import {
  WflBranchMetasLoadError,
  WflBranchesLoadError,
  WflLevelsLoadError
} from '../../dialogs/wofflerErrors'

const initialState = {
    branches: [],
    brnchmetas: [],
    levels:[]
  }

export const state = Object.assign({}, initialState)

export const getters = {
  rootBranches(state) {
    return state.branches
      .filter(b => b.idparent === 0)
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
  resetData: state => {
    state.branches = []
    state.brnchmetas = []
    state.levels = []
  },
}

export const actions = {
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
