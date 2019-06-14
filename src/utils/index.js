
import * as constants from '../state/constants'

export default {

  asset(amount) {
    return amount.toFixed(constants.CURR_DECIMALS)+' '+constants.CURR_CODE
  },
  parseAmount(text) {
    return this.truncateDecimals(parseFloat(text), constants.CURR_DECIMALS)
  },
  truncateDecimals(number, digits) {
    const multiplier = Math.pow(10, digits)
    const adjustedNum = number * multiplier
    const truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum)
    return truncatedNum / multiplier
  },
  assetAmount(asset) {
    const parts = asset ? asset.split(' ') : []
    
    if (parts.length != 2) return 0

    if (parts[1] != constants.CURR_CODE) return 0
    
    const amount = parseFloat(parts[0])

    if (isNaN(amount)) return 0

    return amount
  },
  vestingDate(timestamp) {
    const date = new Date()
    date.setTime(timestamp)
    return (date.getHours()+":"+date.getMinutes()+":"+date.getSeconds())
  }
}

