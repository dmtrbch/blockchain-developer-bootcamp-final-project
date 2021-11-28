const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraURL = 'https://kovan.infura.io/v3/8a0dace21eb24ff791487262cea3b2c3'

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // match any network
      websockets: true
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, infuraURL),
      network_id: 3,          // Ropsten's network id
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true  
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, infuraURL),
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
  }
};
