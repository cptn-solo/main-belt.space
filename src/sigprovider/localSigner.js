import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'
import ecc from 'eosjs-ecc'
import {
  UserProfileImportKeyError,
  UserProfileNoKeyToExportError,
} from '../dialogs/userProfileErrors'

export default class LocalSignatureProvider {
  constructor(privKey) {
    const keys = privKey ? [privKey] : []
    this.signatureProvider = new JsSignatureProvider(keys)

    this.privateKeys = keys.reduce((map, key) => {
      return Object.assign(map, {
        [ecc.PrivateKey.fromString(key)
          .toPublic()
          .toString()]: key,
      })
    }, {})
    this.publicKeys = Object.keys(this.privateKeys)

    this.getAvailableKeys = async function() {
      const result = await this.signatureProvider.getAvailableKeys()
      return result
    }
    this.sign = async function(args) {
      const result = await this.signatureProvider.sign(args)
      return result
    }
  }

  /** AUX METHODS */
  async exportKey(pubKey) {
    const privKey = this.privateKeys[pubKey]
    if (!privKey) throw new UserProfileNoKeyToExportError()

    return privKey
  }

  static async createProvider(privKey = null) {
    const _privKey = privKey || (await ecc.randomKey())
    try {
      if (!ecc.isValidPrivate(_privKey))
        throw new UserProfileImportKeyError('Invalid key')

      return new LocalSignatureProvider(_privKey)
    } catch (ex) {
      throw new UserProfileImportKeyError(ex)
    }
  }
}
