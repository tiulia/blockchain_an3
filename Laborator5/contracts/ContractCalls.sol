// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./IOC.sol";


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
    //    require(test);
    }

    function callFallback() public payable{
        (bool success,) = address(contractIOC).call(abi.encodeWithSignature("nonExistingFunction()"));
        require(success, "revert!");
    }

    function callReceive() public payable{
        (bool success,) = address(contractIOC).call{value: 10}("");
        require(success);       
    }
}