# Activity 4: ERC-20 Tokens.

## Solidity/Ethereum basics

### EIP- Ethereum Improvement Proposals and Ethereum Request for Comments

Ethereum Improvement Proposals (EIPs) describe standards for the Ethereum platform, including core protocol specifications, client APIs, and contract standards. It includes ERC (Ethereum Request for Comments) for Application-level standards and conventions, including contract standards such as token standards.

### ERC-20 token. 
The ERC-20 standard defines digital assets like currencies and loyalty points. These tokens can be easily exchanged using smart contracts and are simple to deploy. Widely supported by cryptocurrency wallets, ERC-20 is also compatible with most Ethereum-based contracts.

### ERC-20 Token specification.
Token creator must define fields: 

-   **Token name**: The name of the token is a unique identifier, providing a recognizable label for users and platforms. It helps distinguish the token in wallets, exchanges, and across applications. For example, “USD Coin” or “Chainlink.” 
-   **Token symbol**: The symbol is a shorthand identifier, usually consisting of three to five uppercase letters, similar to stock ticker symbols. It’s used for quick identification on exchanges and wallets. Examples include “USDC” for USD Coin or “LINK” for Chainlink., 
-   **Number of Tokens created**: This defines the total supply of tokens that exist or can ever exist. Some tokens have a fixed supply (like 1 billion tokens), while others might have mechanisms to mint or burn tokens over time. This initial supply affects scarcity and, potentially, the token's value., 
-   **Subdivisions**:  Most tokens are divisible, allowing users to transact in smaller amounts. Subdivisions set how many decimal places a token can be split into, similar to how a dollar can be divided into cents. In ERC-20 tokens, subdivisions are commonly set to 18 decimal places, enabling fine-grained transactions (e.g., 0.000000000000000001 of a token). 


### Methods.
ERC – 20 standard defines methods:

-   **balanceOf**: Used to check the token balance of a given address. Returns the number of tokens held by the specified account.

```js
function balanceOf(address _owner) public view returns (uint256 balance)
```

-   **totalSupply**: Returns the total supply of tokens that exist within the contract available across all accounts.

```js
function totalSupply() public view returns (uint256)
```

-   **transfer**: Transfers tokens from the caller’s account to another account. Returns a boolean indicating success (true if the transfer was successful).

```js
function transfer(address _to, uint256 _value) public returns (bool success)
```

-   **approve**: Allows a spender to withdraw a specific number of tokens from the caller’s account, i.e. sets an allowance for the spender to use transferFrom up to the approved amount.
Returns a boolean indicating success (true if the approval was successful).

```js
function approve(address _spender, uint256 _value) public returns (bool success)
```

-   **allowance**: Checks the remaining number of tokens that a spender is allowed to withdraw from the owner’s account. Returns the remaining approved token amount that the spender can withdraw from the owner's account.

```js
function allowance(address _owner, address _spender) public view returns (uint256 remaining)
```

-   **transferFrom**: Transfers tokens from one account to another on behalf of the owner. Returns A boolean indicating success (true if the transfer was successful) Requires prior approval from the from account to allow the caller to execute this transfer.

```js
function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
```



### Events.
ERC – 20 standard defines events:

-   **Transfer**: Triggered when tokens are transferred from one account to another.

```js
event Transfer(address indexed _from, address indexed _to, uint256 _value)
```

-   **Approval**: Triggered when an account approves a spender for a specific amount.

```js
event Approval(address indexed _owner, address indexed _spender, uint256 _value)
```

## Infura

Infura is a blockchain infrastructure platform that provides easy access to Ethereum and IPFS (InterPlanetary File System) networks through APIs. It’s particularly valuable for developers because it eliminates the need to run a full Ethereum node, making it much easier to interact with the blockchain in a scalable and reliable way. Here’s a quick breakdown of what Infura offers **Ethereum API Access**: Infura provides API endpoints to interact with the Ethereum blockchain, allowing developers to read data (like balances, transactions) and write data (such as sending transactions) without managing blockchain nodes. This makes it ideal for building DApps (decentralized applications) and DeFi (decentralized finance) services.


## Exercises

1.	**Working with Hardhat projects**: 

a.  Install Hardaht and create a default project. 

```
npm install --save-dev hardhat
npx hardhat init
```
b. Configure Infura API Key as in [3].

c. Configure networks in hardhat.config.js:

```
networks: {
    hardhat: {
      gas: "auto",
      mining: {
        auto: false,
        interval: 2000, //ms
      }
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/<ApiKey>",
      accounts: [private_key1,private_key2, ...]
    }
  },
  defaultNetwork: "hardhat",

```
d. Run a local hardhat node and deploy the contract Lock on the local network:

```
npx hardhat node

npx hardhat ignition deploy ./ignition/modules/Lock.js --network hardhat
```

e. Deploy the Lock contract on Sepolia network.

```
npx hardhat node

npx hardhat ignition deploy ./ignition/modules/Lock.js --network sepolia
```
f. Copy MyERC20.sol file in /contracts and create ignition module for MyERC20 contract

```js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TOKENS = 1000;

module.exports = buildModule("ERCModule", (m) => {
  const tokens = m.getParameter("tokens", TOKENS);
  
  const erc20 = m.contract("MyERC20", [tokens]);

  return { erc20 };
});
```

2.	**Test Hardhat projects**: 

a. Create file test/MyERC20.js 

```js
const { expect } = require("chai");
const hre = require("hardhat");

describe("Token contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const [owner, addr1] = await ethers.getSigners();
  
      const tokens = 1000
      const token = await ethers.deployContract("MyERC20", [tokens]);
  
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
        
    });


    it("Should transfer tokens between accounts", async function() {
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      const tokens = 1000
      const token = await ethers.deployContract("MyERC20", [tokens]);
  
      // Transfer 50 tokens from owner to addr1
      await token.transfer(addr1.address, 50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);
  
      // Transfer 50 tokens from addr1 to addr2
      await token.connect(addr1).transfer(addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });
  });

```



b. Run:

```
npx hardhat test test\\MyERC20.js
```

### Docs: 
[1] https://ethereum.org/en/developers/docs/standards/tokens/erc-20/

[2] https://hardhat.org/hardhat-runner/docs/guides/project-setup

[3] https://docs.infura.io/dashboard/create-api

[4] https://hardhat.org/tutorial/testing-contracts
