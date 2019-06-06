export const state = {
  stakeDialog: false,
  depositDialog: false,
  withdrawDialog: false,
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