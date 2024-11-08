
const profile = process.env.NODE_ENV || "dev";
const envFile = profile === "test" ? ".env.test" : ".env.dev";
require('dotenv').config({ path: envFile });
const { ethers } = require("ethers");
const fs = require('fs');


// Load environment variables
const infuraUrl = process.env.INFURA_URL;
const contractPackageRegistryAddress = process.env.CONTRACT_PR_ADDRESS;
const contractScmAddress = process.env.CONTRACT_SCM_ADDRESS;

const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
const sellerPrivateKey = process.env.WALLET_PRIVATE_KEY;
const consumerPrivateKey = process.env.WALLET_PRIVATE_KEY;

const sellerAddress = process.env.SELLER_ADDRESS;
const consumerAddress = process.env.CONSUMER_ADDRESS;


// Initialize ethers.js provider and wallet
const provider = new ethers.JsonRpcProvider(infuraUrl);
const wallet = new ethers.Wallet(walletPrivateKey, provider);
const seller = new ethers.Wallet(sellerPrivateKey, provider);
const consumer = new ethers.Wallet(consumerPrivateKey, provider);

// Load contract ABIs
const packageRegistryAbi = JSON.parse(fs.readFileSync('artifacts/contracts/SCM.sol/PackageRegistry.json')).abi;
const scmAbi = JSON.parse(fs.readFileSync('artifacts/contracts/SCM.sol/SCM.json')).abi;

// Initialize contract instances
const contractPackageRegistry = new ethers.Contract(contractPackageRegistryAddress, packageRegistryAbi, wallet);
const contractScm = new ethers.Contract(contractScmAddress, scmAbi, wallet);


async function calculatePackageId(senderAddress, description) {
    const timestamp = Math.floor(Date.now() / 1000);
    const packageId = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
            ["address", "string", "uint256"],
            [senderAddress, description, timestamp]
        )
    );
    return packageId;
}

// contracts interaction
async function registerPackage(description, hashedSecretCode, userWallet) {
    try {
        const tx = await contractPackageRegistry.connect(userWallet).registerPackage(description, hashedSecretCode);
        const receipt = await tx.wait();
        console.log("REGISTER PACKAGE TX RECEIPT:", receipt);
        return { txHash: receipt.hash, err: null };
    } catch (error) {
        return { txHash: null, err: error.message };
    }
}


async function lockFee(packageId, packageValue, userWallet) {
    try {
        const tx = await contractScm.connect(userWallet).lockShippingFee(packageId, {
            value: ethers.parseEther(packageValue.toString())
        });
        const receipt = await tx.wait();
        console.log("LOCK FEE TX RECEIPT:", receipt);
        return { txHash: receipt.hash, err: null };
    } catch (error) {
        return { txHash: null, err: error.message };
    }
}



async function main() {
    console.log("PROFILE:", profile);

    /* Seller registers a new package  */
    const testDescription = "Sample Package";
    const testSecretCode = ethers.keccak256(ethers.toUtf8Bytes("secretCode123"));
    
    const testPackageId = calculatePackageId(sellerAddress, testDescription);
    const resultRegisterPackage = await registerPackage(testDescription, testSecretCode, seller );
    console.log("TX REGISTER PACKAGE:", resultRegisterPackage);
    

    /*Consumer lock the fee*/
    const testPackageValue = 30;

    const resultLockFee = await lockFee(testPackageId, testPackageValue, consumer );
    console.log("TX LOCK FEE:",resultLockFee);



}


module.exports = {
    registerPackage,
    lockFee,
};


main();