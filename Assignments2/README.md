# Assignment 2: Creating a Supply Chain Management platform.

### Activity Diagram

![img](https://bafybeiglbvhlmp4nnznazc7kdn7ccjth3flg7dh35bftt6w3wg7b7aitoi.ipfs.w3s.link/SCMInteraction.png)



## Project setup

### Configure Node and Hardhat projects
Install dependecies:

```
npm install
```

### Compile and deploy contracts

Compile SCM.sol. The compiled artifacts will be saved in the artifacts/ directory by default. The abi will be saved in artifacts/contracts.

```
npx hardhat compile
```

Deploy the contracts using ignition modules. Before deployment, make sure that networks are correctly configured in hardhat.config.js:

```
networks: {
    hardhat: {
      gas: "auto",
      mining: {
        auto: true,
        interval: 2000, //ms
      }
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/<ApiKey>",
      accounts: ["<PrivateKey1>", "PrivateKey2"]
    }
},
```

Run:
```
npx hardhat ignition deploy ./ignition/modules/SCM.js --network sepolia

npx hardhat ignition deploy ./ignition/modules/SCM.js --network hardhat
```

### Configure contract and wallet addresses

Fill the addresses in env files .env.dev for Sepolia and .env.test for Hardhat:

```
INFURA_URL=http://127.0.0.1:8545
CONTRACT_PR_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
CONTRACT_SCM_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

```
INFURA_URL=https://sepolia.infura.io/v3/<ApiKey>
CONTRACT_PR_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
CONTRACT_SCM_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```


Add in env file the details of the account: 

```
WALLET_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
WALLET_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

SELLER_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
SELLER_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

CONSUMER_ADDRESS=0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
CONSUMER_PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

### Contract interaction

Set the environment node_env to test or dev:

Windows:
```
$Env:node_env = "test"
```
or 

Linux:
```
export NODE_ENV=test
```

Run scmModule:

```
node scmModule.js
```




### Docs: 
[1] https://hardhat.org/hardhat-runner/docs/guides/compile-contracts