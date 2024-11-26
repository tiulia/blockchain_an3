// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract Auction {
    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) bidInfo;
    uint public bidEnd;

    constructor() public {
        bidEnd = block.number + 30;
    }

    function bid() external payable {
        require(bidInfo[msg.sender] == 0, "Already bid");
        require(bidEnd <= block.number, " Bid ended");
        bidInfo[msg.sender] = msg.value;
        if (msg.value > highestBid) {
            highestBidder = msg.sender;
            highestBid = msg.value;
        }
    }

    function getPrize() external {
        require(bidEnd <= block.number, " Bid ended");

        (bool success, ) = payable(highestBidder).call{value: highestBid}("");
        require(success, "highestBidder.call returned false");

        bidInfo[highestBidder] = 0;
    }

    function getMoneyBack() external {

        (bool success, ) = payable(msg.sender).call{value: bidInfo[msg.sender]}("");
        require(success, "highestBidder.call returned false");

        bidInfo[highestBidder] = 0;
    }

}
