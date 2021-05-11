require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  
//  kovan: {
//    provider: function() {
//      return new HDWalletProvider(
//        process.env.MNEMONIC,
//        'https://kovan.infura.io/${process.env.INFURA_API_KEY}'
//        )
//    },
//    gas: 5000000,
//    gasPrice:2500000000,
//    network_id: 42
//  }
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
        version: "0.7.0",
        optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
  
}
