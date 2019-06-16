import axios from 'axios'
import { ServerRequestError } from '../dialogs/serverRequestErrors'
import ApplicationError from '../dialogs/applicationError';

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
      upper_bound: accountname,
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
  fetchFromSysTable(table) {
    return getEOSTableRows(this.rpc, {
      json:true,
			code:'eosio',
      scope:'eosio',
      table
    })
  },
  fetchFromMainTable(table, id = null) {
    let data = {
      code: this.gameContract,
      scope: this.gameContract,
      table
    }
    if (id) Object.assign(data, {
      key_type: 'i64',
      index_position: 1,
      lower_bound: id,
      upper_bound: id,
    })
    return getEOSTableRows(this.rpc, data)
  },
  getBranchMetas(id = null) {
    return this.fetchFromMainTable('brnchmeta', id)
  },
  getBranches(id = null) {
    return this.fetchFromMainTable('branches', id)
  },
  getLevels(id = null) {
    return this.fetchFromMainTable('levels', id)
  },
  getChildLevels(id) {
    let data = {
      code: this.gameContract,
      scope: this.gameContract,
      table: 'levels',
      key_type: 'i64',
      index_position: 2,
      lower_bound: id,
      upper_bound: id,
    }
    return getEOSTableRows(this.rpc, data)
  },
  getPlayerStakes() {
    let data = {
      code: this.gameContract,
      scope: this.gameContract,
      table: 'stakes',
      key_type: 'name',
      index_position: 3,
      lower_bound: this.accountname,
      upper_bound: this.accountname,
    }
    return getEOSTableRows(this.rpc, data)
  },
  getPlayerStakeInBranch(idbranch) {//TODO
    const id = this.accountname+idbranch
    //(uint128_t{x} << 64) | y
    let data = {
      code: this.gameContract,
      scope: this.gameContract,
      table: 'stakes',
      key_type: 'i128',
      index_position: 4,
      lower_bound: id,
      upper_bound: id,
    }
    return getEOSTableRows(this.rpc, data)
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
  switchbrnch(account, idbranch) {
    const data = { account, idbranch }
    return transactEOS(this.api, this.accountname, this.gameContract, 'switchbrnch', data)
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
  depositAsset(asset) {
    const data = {
      from: this.accountname,
      to: this.gameContract,
      quantity: asset,
      memo: 'deposit',
    }    
    return transactEOS(this.api, this.accountname, 'eosio.token', 'transfer', data)
  },
  withdrawAsset(asset) {
    const data = {
      from: this.accountname,
      to: this.accountname,
      amount: asset,
      memo: 'withdraw',
    }
    return transactEOS(this.api, this.accountname, this.gameContract, 'withdraw', data)
  },
  playerAction(payload) {
    const data = payload.payload || { account: this.accountname }
    return transactEOS(this.api, this.accountname, this.gameContract, payload.actionname, data)
  },
  systemAction(actionname, payload) {
    const data = payload
    return transactEOS(this.api, this.accountname, 'eosio', actionname, data)
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
    const result = await transactEOS(this.api, this.accountname, 'eosio', 'voteproducer', data)
    return result
  },
  /** Contract */
  async cleanupContractTables() {
    try {
      await asyncForEach(await this.fetchFromMainTable('stakes'), async obj => {
        await this.playerAction({actionname: "rmstake", payload: { idstake: obj.id }})
      })
      await asyncForEach(await this.fetchFromMainTable('levels'), async obj => {
        await this.playerAction({actionname: "rmlevel", payload: { idlevel: obj.id }})
      })
      await asyncForEach(await this.fetchFromMainTable('branches'), async obj => {
        await this.playerAction({actionname: "rmbranch", payload: { idbranch: obj.id }})
      })
      await asyncForEach(await this.fetchFromMainTable('brnchmeta'), async obj => {
        await this.playerAction({actionname: "rmbrmeta", payload: { owner: this.accountname, idmeta: obj.id }})
      })
      await asyncForEach(await this.fetchFromMainTable('players'), async obj => {
        await this.playerAction({actionname: "rmplayer", payload: { account: obj.account }})
      })
      await asyncForEach(await this.fetchFromMainTable('channels'), async obj => {
        await this.playerAction({actionname: "rmpchannel", payload: { account: obj.owner }})
      })  
    } catch (ex) {
      throw new ApplicationError(ex)
    }
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
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