// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Auction {
    address public highestBidder;
    uint public highestBid;

    function bid() external payable {
        require(msg.value >= highestBid);

        if (highestBidder != address(0)) {
            (bool success, ) = highestBidder.call{value: highestBid}("");
            require(success); 
        }

       highestBidder = msg.sender;
       highestBid = msg.value;
    }
}