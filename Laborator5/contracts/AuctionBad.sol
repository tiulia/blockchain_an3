// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract Auction {
    address public highestBidder;
    uint public highestBid;

    function bid() external payable {
        console.logString("In Auction bid()");
        require(msg.value >= highestBid);

        console.logUint(msg.value);
        if (highestBidder != address(0)) {
            (bool success, ) = highestBidder.call{value: highestBid}("");
            require(success, "highestBidder.call returned false");
        }

       highestBidder = msg.sender;
       highestBid = msg.value;
        console.logString("Bidder");
        console.logAddress(highestBidder);
        console.logUint(highestBid);
    }
}
