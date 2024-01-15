const { Web3 } = require("web3");
const alchemy_url =
  "https://eth-mainnet.g.alchemy.com/v2/NVcmrxK3oMw_SGNCO_0f8FsZK1ud9E7v";

/**
 * web3 service
 */
module.exports = class Web3Service {
  web3;
  constructor() {
    this.web3 = new Web3(alchemy_url);
  }
  createWallet() {
    return this.web3.eth.accounts.wallet.create(1)[0];
  }

  async sendTransaction(privateKey, to_address, amount) {
    const wallet = this.web3.eth.accounts.wallet.add(privateKey);
    return await this.web3.eth.sendTransaction({
      from: wallet[0].address,
      to: to_address,
      value: amount,
    });
  }
};
