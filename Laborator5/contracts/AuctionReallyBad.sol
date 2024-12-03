// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract Auction {
    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bidInfo;
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
        require(bidEnd <= block.number, " Bid still going");
        bidInfo[highestBidder] = 0;

        (bool success, ) = payable(highestBidder).call{value: address(this).balance}("");
        require(success, "highestBidder.call returned false");
    }

    // Get 10%  back
    function getMoneyBack() external {
        require(bidEnd > block.number, " Bid ended");

        uint amount = bidInfo[msg.sender] / 10;
        (bool success, ) = payable(msg.sender).call{value:amount}("");
        require(success, "highestBidder.call returned false");

        bidInfo[highestBidder] = 0;
    }

}
