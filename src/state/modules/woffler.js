import {
  WflBranchMetasLoadError,
  WflBranchesLoadError,
  WflLevelsLoadError,
  WflBranchSwitchError,
  WflChildLevelsLoadError,
  WflParentLevelLoadError,
  WflPlayerActionError,
  WflModifyBranchMetaError,
  WflCreateBranchError,
  WflUnlockRootLevelError,
  WflUpdateBranchStakeError,
} from '../../dialogs/wofflerErrors'
import ApplicationError from '../../dialogs/applicationError'
import utils from './../../utils'
import gameAmounts from '../../woffler/gameAmounts'
import gamePermissions from '../../woffler/gamePermissions'

const initialState = {
    branches: [],
    brnchmetas: [],
    levels: [],
    currentLevelInfo: null,     
  }

export const state = Object.assign({}, initialState)

export const getters = {
  gameAPI(state, getters, rootState) {
    return rootState.engine.gameAPI
  },
  accountname(state, getters) {
    return getters.gameAPI.accountname
  },
  player(state, getters, rootState) {
    return rootState.userProfile.player
  },
  playerStakes(state, getters, rootState) {
    return rootState.userProfile.playerStakes
  },
  startLevels(state) {//returns levelInfo (level+branch+meta)
    const activeLevels = state.levels
      .filter(l => (l.idparent === 0))
      .reduce((ret, l) => {
        ret.push(Object.assign(l, { branch: state.branches.find(b => b.id === l.idbranch)}))
        return ret
      }, [])
    return activeLevels
  },
  lockedStartLevels(state) {
    const lockedLevels = state.levels
      .filter(l => (l.locked && l.idparent === 0))
      .reduce((ret, l) => {
        ret.push(Object.assign(l, { branch: state.branches.find(b => b.id === l.idbranch)}))
        return ret
      }, [])
    return lockedLevels

  }
}

function updateProps(obj, props) {
  if (!obj) return 
  
  for (var key in props) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = props[key]
      }
    }  
}

export const mutations = {
  setBranchMetas: (state, brnchmetas) => {
    state.brnchmetas = brnchmetas.reduce((ext, _meta) => {
      const stkmin = utils.assetAmount(_meta.stkmin)      
      const minPot = (stkmin * 100) / _meta.spltrate
      _meta['minPot'] = utils.asset(utils.parseAmount(minPot))
      ext.push(_meta)
      return ext
    }, [])
  },
  setBranches: (state, { branches, stakes }) => {
    state.branches = branches
      .reduce((ext, b) => {
        const meta = state.brnchmetas.find(m => m.id === b.idmeta) || { name: '' }
        const stake = stakes.find(s => s.idbranch === b.id) || { stake: null, revenue: null }
        ext.push({...b, meta, stake})
        return ext
      },[])
  },
  setLevels: (state, levels) => (state.levels = levels),
  updateBranchProps: (state, { id, props}) => {
    updateProps(state.branches.find(b => b.id === id), props)
  },
  updateLevelProps: (state, { id, props }) => {
    updateProps(state.levels.find(l => l.id === id), props)
  },
  setCurrentLevel: (state, levelInfo) => (state.currentLevelInfo = levelInfo),
  setChildLevels: (state, children) => (state.currentLevelInfo['children'] = children),
  resetData: state => {
    state.branches = []
    state.brnchmetas = []
    state.levels = []
  },  
}

export const actions = {
  async joinGame({ getters, dispatch }, idbranch) {
    const account = getters.accountname
    try {
      await getters.gameAPI.switchbrnch(account, idbranch)
      await dispatch('userProfile/loadAndProcessIngameProfile', account, { root: true })
    } catch (ex) {
      throw new WflBranchSwitchError(ex)
    }
  },
  async signupAndJoinGame({ dispatch }, levelInfo) {    
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
  async loadBranchMetas({ commit, getters, state }) {
    try {
      const metas = (await getters.gameAPI.getBranchMetas())
      commit('setBranchMetas', metas)
      return state.brnchmetas
    } catch (ex) {
      throw new WflBranchMetasLoadError(ex)
    }
  },
  async loadBranches({ commit, getters, state }) {
    try {
      const branches = (await getters.gameAPI.getBranches())
      commit('setBranches', { branches, stakes: getters.playerStakes })
      return state.branches
    } catch (ex) {
      throw new WflBranchesLoadError(ex)
    }
  },
  async loadLevels({ commit, getters, state }) {
    try {
      const levels = (await getters.gameAPI.getLevels())
      commit('setLevels', levels)
      return state.levels
    } catch (ex) {
      throw new WflLevelsLoadError(ex)
    }
  },
  async fetchGameContext({ dispatch, commit, state }, idlevel) {
    try {      
      commit('setCurrentLevel', (idlevel > 0 ? (await dispatch('loadGameContext', idlevel)) : null))
      return state.currentLevelInfo
    } catch (ex) {
      throw new WflLevelsLoadError(ex)
    }
  },
  async loadGameContext({ getters, dispatch }, idlevel) {
    try {
      let level = null
      const levels = (await getters.gameAPI.getLevels(idlevel))
      if (levels.length != 1) 
        throw new Error('No valid level found for id: '+idlevel)
        
      const _level = levels[0]      

      const branches = (await getters.gameAPI.getBranches(_level.idbranch))
      const metas = (await getters.gameAPI.getBranchMetas(_level.idmeta))
      const children = (await dispatch('loadChildLevels', idlevel))
      const next = (children.length ? children.find(l => l.idbranch === _level.idbranch) : null)
      const split = (children.length ? children.find(l => l.idbranch != _level.idbranch) : null)
      const splitBranches = (!split ? null : 
        (await getters.gameAPI.getBranches(split.idbranch)))

      const previous = (_level.idparent === 0 ? null : 
        (await dispatch('loadParentLevel', _level.idparent)))
      
      if (branches.length != 1) 
        throw new Error('No valid branch found for id: '+_level.idbranch)
      
      if (metas.length != 1) 
        throw new Error('No valid branch meta found for id: '+_level.idmeta)

      const meta = metas[0]
      const branch = Object.assign(branches[0], { 
        meta: metas[0] 
      })
      const splitBranch = splitBranches ? splitBranches[0] : null
      const amounts = gameAmounts.compute(
        _level, previous, next, branch, 
        split, splitBranch,
        meta)
      
      const permissions = gamePermissions.compute(
        getters.player, 
        _level, next, split, 
        branch, splitBranch,
        meta, amounts)
      
      level = Object.assign(_level, {
        amounts, permissions,
        previous, next, split,
        branch
      })                

      return level
    } catch (ex) {
      throw new WflLevelsLoadError(ex)
    }
  },
  async loadChildLevels({ getters }, idlevel) {
    try {
      const levels = (await getters.gameAPI.getChildLevels(idlevel))
      return levels
    } catch (ex) {
      throw new WflChildLevelsLoadError(ex)
    }
  },
  async loadParentLevel({ getters }, idparent) {
    try {
      const levels = (await getters.gameAPI.getLevels(idparent))
      if (levels.length != 1)
        throw new Error('No valid parent level for id: ' + idparent)
      
      return levels[0]        
    } catch (ex) {
      throw new WflParentLevelLoadError(ex)
    }
  },
  async playerAction({ getters, dispatch }, payload) {
    try {      
      await getters.gameAPI.playerAction(payload)
      await dispatch('userProfile/loadAndProcessIngameProfile', null, { root: true })
      await dispatch('fetchGameContext', getters.player.idlevel)
    } catch (ex) {
      throw new WflPlayerActionError(ex)
    }
  },  
  async changeMeta({ dispatch, getters }, { idmeta, meta }) {
    try {
      await getters.gameAPI.playerAction({actionname: 'brnchmeta', payload: {
        owner: getters.accountname, 
        idmeta, meta
      }})
      await dispatch('loadGameData')
    } catch (ex) {
      throw new WflModifyBranchMetaError(ex)
    }
  },  
  async deleteMeta({ dispatch, getters }, { idmeta }) {
    try {
      await getters.gameAPI.playerAction({actionname: 'rmbrmeta', payload: {
        owner: getters.accountname, idmeta
      }})
      await dispatch('loadGameData')
    } catch (ex) {
      throw new WflModifyBranchMetaError(ex)
    }
  },
  //payload: { owner, idmeta, pot}
  async createBranch({ dispatch, getters }, { idmeta, amount }) {
    try {
      await getters.gameAPI.playerAction({actionname: 'branch', payload: {
        owner: getters.accountname, 
        idmeta,
        pot: amount
      }})
      await dispatch('userProfile/loadAndProcessIngameProfile', null, { root: true})
      await dispatch('loadGameData')
    } catch (ex) {
      throw new WflCreateBranchError(ex)
    }
  },
  //payload: { owner, idlevel }
  async unlockRootLevel({ getters, commit }, idlevel) {
    try {
      const account = getters.accountname
      await getters.gameAPI.playerAction({actionname: 'unlocklvl', payload: { account, idlevel }})
      const level = (await getters.gameAPI.getLevels(idlevel))[0]
      commit('updateLevelProps', {id: level.id, props: { locked: level.locked }})
    } catch (ex) {
      throw new WflUnlockRootLevelError(ex)
    }
  },
  async updateBranchStake({ getters, commit }, levelinfo) {
    try {
      const level = (await getters.gameAPI.getLevels(levelinfo.id))[0]
      const branch = (await getters.gameAPI.getBranches(levelinfo.branch.id))[0]
      const stake = getters.playerStakes.find(s => s.idbranch === branch.id)
      commit('updateLevelProps', { 
        id: level.id, 
        props: { locked: level.locked }
      })
      commit('updateBranchProps', { 
        id: levelinfo.branch.id, 
        props: { totalstake: branch.totalstake, stake }
      })  
    } catch (ex) {
      throw new WflUpdateBranchStakeError(ex)
    }
  }
}
