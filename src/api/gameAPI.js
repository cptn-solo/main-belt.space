import axios from 'axios'
import { ServerRequestError } from '../dialogs/serverRequestErrors'

export default {
  api: null,
  rpc: null,
  accountname: null,
  gameContract: process.env.VUE_APP_CODE,
  setAPI(api, rpc) {
    this.api = api
    this.rpc = rpc
  },  
  getIngameProfileForAccount(accountname) {
    return getEOSTableRows(this.rpc, {
      code: this.gameContract,
      scope: this.gameContract,
      table: 'players',
      key_type: 'name',
      index_position: 1,
      lower_bound: accountname,
      limit: 1,
    })
  },
  getAccountBalances(accountname = this.accountname) {
    return getEOSTableRows(this.rpc, {
      code: 'eosio.token',
      scope: accountname,
      table: 'accounts',
    })
    // return getTokenBalance('ASTRO') // запрос контракта не взлетел, переделал на запрос таблицы
  },
  getBranches() {
    return getEOSTableRows(this.rpc, {
      code: this.gameContract,
      scope: this.gameContract,
      table: 'branches',
    })
  },
  /** Actions */
  signup(referrer) {
    const data = {
      account: this.accountname, 
      referrer: referrer || this.gameContract
    }
    return transactEOS(this.api, this.accountname, this.gameContract, 'signup', data)
  },
  forget() {
    const data = {
      account: this.accountname
    }
    return transactEOS(this.api, this.accountname, this.gameContract, 'forget', data)
  },
  async getAccount(accountname) {
    try {
      const fullData = {
        json: true,
        limit: 1,
        account_name: accountname
      }
      const requestOptions = {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    
      const result = (await axios.post(
        this.rpc.endpoint + '/v1/chain/get_account',
        fullData,
        requestOptions
      )).data
      return result
    } catch (ex) {
      throw new ServerRequestError(ex)
    }
  },
  /** Voting */
  async getProducers() {
    return getEOSTableRows(this.rpc, {
      code: 'eosio',
      scope: 'eosio',
      table: 'producers',
    })
  },
  async getVotedProducers(voterAccount) {
    return getEOSTableRows(this.rpc, {
      code: 'eosio',
      scope: 'eosio',
      table: 'voters',
      key_type: 'name',
      index_position: 1,
      lower_bound: voterAccount,
      upper_bound: voterAccount,
    })
  },
  async vote(data) {
    // {voter:this.accountname, proxy:null, producers:[<owner>]}
    const result = await transactEOS(
      this.api,
      this.accountname,
      'eosio',
      'voteproducer',
      data
    )
    return result
  }
}

async function getEOSTableRows(rpc, data, accumulated = null) {
  const fullData = {
    json: true,
    limit: 150,
    ...data,
  }
  // reason for replacement eosjs@beta2 : it can't fetch correctly by secondary indexes, but @beta3 is not compatible with Scatter 10.0.3 yet
  // api.rpc
  //   .get_table_rows(fullData)
  //   .then(res => resolve(res.rows))
  //   .catch(ex => reject(ex))
  const requestOptions = {
    headers: { 'Content-Type': 'multipart/form-data' },
  }
  try {
    if (accumulated) {
      fullData.lower_bound = accumulated[accumulated.length - 1].id + 1
      fullData.upper_bound = null
    }
    const result = (await axios.post(
      rpc.endpoint + '/v1/chain/get_table_rows',
      fullData,
      requestOptions
    )).data

    const rows = accumulated ? accumulated.concat(result.rows) : result.rows

    if (fullData.limit > 1 && result.more)
      return await getEOSTableRows(rpc, data, rows)
    else return rows
  } catch (ex) {
    throw new ServerRequestError(ex)    
  }
}

async function transactEOS(api, account, contract, action, data) {
  const authorization = [{ actor: account, permission: 'active' }]
  try {
    return api.transact(
      { actions: [{ account: contract, name: action, authorization, data }] },
      { blocksBehind: 3, expireSeconds: 30 }
    )
  } catch (ex) {
    throw new ServerRequestError(ex)    
  }
}