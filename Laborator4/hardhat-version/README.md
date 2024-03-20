# Requirements

## Node 18.17.0

Install node version manager (nvm)

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`

`nvm install 18.17.0`

`nvm use 18.17.0`

`cd Laborator4/hardhat-version`

`npm install`

## Hardhat

A framework used to compile, deploy, interact, test smart contracts. It can import private keys or mnemonics. It can fork network or create a local network

`https://hardhat.org/hardhat-runner/docs/getting-started`

Our goal is to deploy an ERC-20 smart contract on Sepolia public testnet or on a local network and interact with it.
All hardhat syntax starts with `npx hardhat`. We will need to compile the contracts by using `npx hardhat compile`.

The first thing we need to do is to import an account that has balance. If you still have the account you created in the first lab on Metamask then you should
export the private key and write it in hardhat.config.js into `"sepolia"` -> `"accounts"`. Also create account 2 in Metamask and to the same for it.

### If you have imported private keys with balance

We will run the scripts `deploySepolia.js` and `interactSepolia.js` .

`npx hardhat run scripts/deploySepolia.js --network sepolia` - this will deploy the contract on Sepolia network
The contract address will be printed. Use it on `https://sepolia.etherscan.io/` to see details about the deploy transaction.

In `interactSepolia.js`, replace the address in `deployedTokenAddress` with the printed address so you can interact with your own ERC-20.

`npx hardhat run scripts/interactSepolia.js --network sepolia` - this will print the `totalSupply`

### If you don't have any private keys with balance

We will need to start a local network. `npx hardhat node`

Open another terminal and run `npx hardhat run scripts/deploy.js --network localhost`

`npx hardhat run scripts/interact.js --network localhost` - this will print the `totalSupply` and `owner balance`


### TODO

1. Send an amount of tokens from the owner to user1 address by using the method transfer.

```
let amount = ethers.utils.parseUnits("3", 8) // 3 * 10^8
let transferTx = await token.connect(owner).transfer(user1.address, amount)
await transferTx.wait()
```

`amount` BigNum type, can store very high values, up to 2^256 
`connect(owner)` - sets the sender and signer of the transaction
`await transferTx.wait()` - wait for the transaction to be integrated in a block

2. Check user 1 balance

3. Approve user 1 to spend from owner

4. Call transferFrom with user1 to actually spend owner's balance

5. Check if you have enough fees to send a transaction

