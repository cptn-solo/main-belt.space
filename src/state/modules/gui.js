export const state = {
  depositDialog: false,
  withdrawDialog: false,  
  branchDialog: false,
  stakeDialog: false,
  levelInfoDialog: false,
  resManagerDialog: false,
  payload: null,
  props: null,
}
export const mutations = {

}
export const actions = {
  showDialog({state}, {key, payload, props}) {
    console.log(key, payload, props)
    state[key] = !!payload
    state.payload = payload
    state.props = props
  }
}