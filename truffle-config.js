const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKey = '42c6b83df37cc2971ef41cb93e7b1416aab3765fa9112169509ffe4dd30f5a34';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl: `https://eth-sepolia.g.alchemy.com/v2/h_Tyy_SYXA-4saQ_9kc-DqW2PCpJ9yby`,
      }),
      network_id: 11155111,
      gas: 4000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './src/contracts/',
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
