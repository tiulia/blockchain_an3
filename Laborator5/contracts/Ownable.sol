// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract Ownable{
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() virtual {
        require(msg.sender == owner, "Ownable: Only owner can initiate transaction!");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require( newOwner != address(0),
            "Ownable: New owner must have a valid address"
        );
        owner = newOwner;
    }
}