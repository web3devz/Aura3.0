require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.WALLET_PRIVATE_KEY_SONIC_BLAZE_TESTNET;

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
      chainId: 4202,
    },

    sonic_blaze_testnet: {
      url: "https://rpc.blaze.soniclabs.com",
      accounts: [privateKey],
    },
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  allowUnlimitedContractSize: true,
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
  loggingEnabled: true,
};

// npx hardhat ignition deploy ./ignition/modules/TherapyConsent.js --network sonic_blaze_testnet
