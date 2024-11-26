// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./IOC.sol";
import "hardhat/console.sol";

contract ContractCalls{
    IOC public contractIOC;

    constructor (address payable  contractAddress){
        contractIOC = IOC(contractAddress);
    }

    function callTransfer() public payable{
        address payable payableAdr = payable(address(contractIOC));
        payableAdr.transfer(msg.value);
    }

    function callSend() public payable{
        address payable payableAdr = payable(address(contractIOC));
        bool test = payableAdr.send(msg.value);
        console.logString("test value");
        console.logBool(test);
//        require(test);
    }

    function callFallback() public payable{
        (bool success,) = address(contractIOC).call(abi.encodeWithSignature("nonExistingFunction()"));
        require(success, "revert!");
    }

    function callReceive() public payable{
        console.logString("CC callReceive");
        console.logString("msg.sender");
        console.logAddress(msg.sender);
        console.logString("msg.value");
        console.logUint(msg.value);
        (bool success,) = address(contractIOC).call{value: 10}("");
        require(success);
        console.logString("msg.value");
        console.logUint(msg.value);
    }
}