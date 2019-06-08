export const state = {
  depositDialog: false,
  withdrawDialog: false,  
  branchDialog: false,
  stakeDialog: false,
  levelInfoDialog: false,
  payload: null
}
export const mutations = {

}
export const actions = {
  showDialog({state}, {key, payload}) {
    console.log(key, payload)
    state[key] = !!payload
    state.payload = payload
  }
}