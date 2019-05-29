import {WflBranchesLoadError} from '../../dialogs/wofflerErrors'

const initialState = {
    branches: [],
    brnchmetas: [],
    levels:[]
  }

export const state = Object.assign({}, initialState)

export const getters = {
  rootBranches(state) {
    return state.branches.filter(b => b.idparent === 0)
  }
}

export const mutations = {
  setBranches: (state, branches) => (state.branches = branches),
  resetData: state => {
    state.branches = []
    state.brnchmetas = []
    state.levels = []
  },
}

export const actions = {
  async loadBranches({ commit, rootGetters, state }) {
    try {
      const branches = (await rootGetters[
        'noscatter/gameAPI'
      ].getBranches())
      commit('setBranches', branches)
      return state.branches
    } catch (ex) {
      throw new WflBranchesLoadError(ex)
    }
  }
}
