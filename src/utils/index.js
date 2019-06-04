
import * as constants from '../state/constants'

export default {

  asset(amount) {
    return amount+' '+constants.CURR_CODE
  },
  parseAmount(text) {
    return this.truncateDecimals(parseFloat(text), constants.CURR_DECIMALS).toFixed(constants.CURR_DECIMALS)
  },
  truncateDecimals(number, digits) {
    const multiplier = Math.pow(10, digits)
    const adjustedNum = number * multiplier
    const truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum)
    return truncatedNum / multiplier
  }
}

