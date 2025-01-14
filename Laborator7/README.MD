# Activity 7: NFT Market.

## Project setup

Install the necessary Node modules:
 
```
npm install
```

Fill in the env.dev, which is used in [hardhat.config.jsx](./hardhat.config.cjs),  with the Infura project ID and the account information (private key) for the account used to deploy the contracts:

```
VITE_RPC_URL="https://sepolia.infura.io/v3/<INFURA_API_KEY>"

VITE_DEV_PRIVATE_KEY=<dev_private_key>

```

Deploy contracts on the preferred network (e.g., Sepolia test network, Hardhat local network). You can configure the NFT symbol or the default market fee in [PhotoNft.cjs](./ignition/modules/PhotoNft.cjs) and [NftMarket.cjs](./ignition/modules/NftMarket.cjs)

```
npx hardhat ignition deploy ./ignition/modules/PhotoNft.cjs --network sepolia 

npx hardhat ignition deploy ./ignition/modules/NftMarket.cjs --network sepolia 
```

Fill in the file .env the addresses of the deployed contracts and Pinata configuration:

```
VITE_RPC_URL="https://sepolia.infura.io/v3/<INFURA_API_KEY>"

VITE_PINATA_JWT=<pinata token>
VITE_PINATA_GATEWAY=<pinata gatway>

VITE_NFTCONTRACT_ADDRESS="0x..."
VITE_MARKETCONTRACT_ADDRESS="0x..."
```

Run the app:
 
```
npm run dev
```


## DApp overview
The welcome screen allows the registration of a new user, i.e. a new wallet. The encrypted private key will be saved in the database. 
![Welcome screen](/public/manual/home1.png)

The registered user and password will be used for login. The encrypted private key will be decrypted with the provided password and used to connect to an ethereum network using an rpc provider that is configured in the env file.

![Welcome screen](/public/manual/home2.png)

After logging in, the user is presented with two options: Create NFT and View Tokens.

![Wallet screen](/public/manual/wallet1.png)

In the 'Create NFT' form, the user selects a file to upload to IPFS, provides a description, and sets the price of the token.

Success or error messages are displayed after pressing the 'Create NFT' button. The success message shows the token ID, used by the ERC-721 contract, and the market ID, used by the market contract.

![Wallet screen](/public/manual/wallet2.png)

After pressing 'View Tokens,' the user can see all available tokens and purchase a token by paying the NFT price plus the market fee. Once an NFT is bought, the 'Buy' button becomes unavailable for other users.


![Wallet screen](/public/manual/wallet4.png)

After user '0x...8368' buys 'Degas Races,' the list shown to user '0x...52db' will dynamically update to mark the NFT as unavailable.

![Wallet screen](/public/manual/wallet5.png)

![Wallet screen](/public/manual/wallet6.png)



## Components overview

[NFTForm.jsx](/src/components/NFTForm.jsx) demonstrates a tipical workflow for handling an NFT lifecycle:

- File Upload to IPFS:
The chosen file is uploaded to IPFS via Pinata. The returned IpfsHash serves as a unique identifier for the file and acts as metadata for the NFT.

```java script
const response = await pinata.upload.file(file);
```

All functions used below are defined in [EthersUtils](/src/utils/EthersUtils.tsx) and interact with smart contracts via transactions performed using the ethers.js library.

- Minting the NFT:
Using the IpfsHash, an NFT is minted and associated with the user's wallet address. This step returns a unique tokenId that represents the NFT on the blockchain.

```java script
const tokenId = await mintNft(response.IpfsHash, wallet);
```

- Approval for Marketplace Interaction:
The newly minted NFT is approved for use in the marketplace, allowing it to be listed for sale.

```java script
await approveMarket(tokenId, wallet);
```
      
Listing the NFT on the Marketplace:
The NFT is listed on the marketplace with a specified price and description. A listingId is generated, which can be used for future actions like updating or canceling the listing.

```java script
const listingId = await listNft(tokenId, price, description, wallet);
```

[NFTListings.jsx](/src/components/NftListing.jsx) filters the 'List' events emitted by the Market Contract to display a list of cards for NFTs available for sale."

```java script
event List(address indexed tokenAddress, uint256 indexed tokenId, uint256 indexed listingId, address seller, bytes32 description, uint256 price);


const listEvents = await contractMarket.queryFilter(contractMarket.filters.List());
```

Each NFT has a seller, a description and a price.

Each [NFTCard.jsx](/src/components/NFTCard.jsx) subscribes to the 'Buy' event so that the 'Buy' button will be disabled if the NFT is bought by another user.

```java script
const handlePurchaseEvent = (tokenAddress, tokenId, listingId, recepient) => {
  if (listingId.toString() === nft.listingId) {
    setIsPurchased(true); 
      // Update state if the event matches this NFT/
      // If 'isPurchased' is true, the 'Buy' button will be disabled.
  }
};

useEffect(() => {
  // Subscribe to the 'Buy' event. 
  // when Buy will be emitted handlePurchaseEvent will be called with the event data as arguments.
  if (!contractMarket) return;
    contractMarket.on("Buy", handlePurchaseEvent);
}, [contractMarket]);
```


## IndexDb

IndexedDB is a large-scale, NoSQL storage system that allows storage of just about anything in the user's browser. It is a JavaScript-based object-oriented database. Supports transactions, key range queries, indexes. Can store much bigger volumes of data than localStorage. It is designed for offline applications and can handle complex data structures, including files and blobs. IndexedDB also provides asynchronous API calls, which helps in maintaining a responsive user interface. [1]

[IndexDBConfig](./src/utils/IndexDBConfig.tsx) includes an example of a database configuration for an IndexedDB database named "KeysDB" with a single object store called "accounts." The object store uses "id" as the key path and auto-increments the key. The schema defines several indexes, including "publicKey" (which must be unique), "encryptedPrivateKey," "encryptedPassword," "salt," and "iv".

```javascript
export const IndexDBConfig = {
  name: "KeysDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "accounts",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "publicKey", keypath: "publicKey", options: { unique: true } },
        { name: "encryptedPrivateKey", keypath: "encryptedPrivateKey", options: { unique: false } },
        { name: "encryptedPassword", keypath: "encryptedPassword", options: { unique: false } },
        { name: "salt", keypath: "salt", options: { unique: false } },
        { name: "iv", keypath: "iv", options: { unique: false } },
      ],
    },
  ],
};
```

[App.jsx](./src/App.jsx) uses the library [react-indexed-db-hook](https://www.npmjs.com/package/react-indexed-db) to wrap the app in a provider that allows components within the tree to access and manipulate IndexedDB.

To instantiate the IndexedDB instance with the configuration defined in IndexDBConfig use:

```javascript
initDB(IndexDBConfig);
```

Props passed to \<IndexedDB> (name, version, objectStoresMeta) are defined in [IndexDBConfig](./src/utils/IndexDBConfig.tsx).

In [Welcome.jsx](./src/components/Welcome.jsx) the user is loaded from the IndexDb database using a username and a password.
The encrypted private key is decrypted using the password provided by the user. 

```javascript
const { getByID } = useIndexedDB("accounts");

const login = (user, password) => {
    if (user) {
      getByID(user).then((userFromDB) => {
        decryptPrivateKey(userFromDB.encPrivatekey, password,
          userFromDB.iv, userFromDB.salt).then((privateKey) => {
            initializeUser(userFromDB);
            let walletUser = createWalletFromKey(privateKey);
            initializeWallet(walletUser);
          })
      });
    }
  }
```

When a new user creates a new wallet the private key is encrypted with the provided password and stored in the database, along with the userid and the public key. 

```javascript
const { update } = useIndexedDB("accounts");

const signup = (username, password) => {
    const wallet = createNewWallet();
    encryptPrivateKey(wallet.privateKey, password).then((result) => {
      update({
        id: username,
        encPrivatekey: result.encryptedKey,
        publicKey: wallet.publicKey,
        salt: result.salt,
        iv: result.iv
      }).then(
        (event) => {
          //...
        },
        (error) => {
          //...
        },
      );
    });
  }
```

The encryption and decryption primitives are implemented in the file [WebCryptoApi.jsx](/src/utils/WebCryptoApi.tsx). The crypto module provides cryptographic functionality to ensure data security. It is part of the Web Crypto API in modern browsers and offers a secure way to handle cryptographic operations like encryption, decryption, key generation, and hashing.

### Pinata SDK




### Events
























## References: 

[1] IndexDb https://web.dev/articles/indexeddb

[2] Pinata SDK https://docs.pinata.cloud/sdk/getting-started
