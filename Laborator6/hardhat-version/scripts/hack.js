require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function hack() {
    [owner, user1] = await ethers.getSigners();

    // 1. Deploy Game

    // 2. Deploy attacker contract

    // 3. Start game

    // 4. Join game with 2 user

    // 5. Join game with the attacker contract

    // 6. Call round()

    // 7. Start another game

    // 8. Join with 3 normal players

    // 9. Call end game which should call round for game number 2
}

hack()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });