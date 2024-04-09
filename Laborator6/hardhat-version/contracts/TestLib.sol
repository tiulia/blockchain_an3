// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.6;

import "./Lib.sol";
import "hardhat/console.sol";

contract TestLib {
    using Lib for uint8;

    Lib.constants constants; 

    function testAdd(uint8 a, uint8 b) public pure returns(uint result){
        result  = a.safeAdd(b);
        console.logString("testAdd Ok");
    }

    function testAddUnsafe(uint8 a, uint8 b) public pure returns(uint8 result){
        result  = a + b;
        console.logString("testAddUnsafe ok");
    }

    function testInitConstants(uint fee, address proxy) public  {
        constants = Lib.constants(fee, proxy);
        console.logString("testInitConstants ok");
    }

    function testCreateToken(address sender, address receiver, uint nbTokens, address tokenAddress) public pure returns (bytes32 token){
        token = Lib.createTokenNum(sender, receiver, nbTokens, tokenAddress);
        console.logString("testCreateToken ok");
    }

}

