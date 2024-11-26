// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./MyERC20.sol";
import "./Pausable.sol";
import "./Ownable.sol";
import "hardhat/console.sol";

contract IOC is Ownable, Pausable{

    MyERC20 public erc20Contract;

    uint256 public unitPrice;

    event Buy(address indexed buyer, uint256 tokens, uint256 price);
    event Receive(address indexed sender, uint amount, uint callType);

    constructor(uint256 tokens, uint256 price) payable{
        erc20Contract = new MyERC20(tokens);
        unitPrice = price;
    }

    function withdraw() public  whenPaused {
        payable(owner).transfer(address(this).balance);
    }

    function buy(uint256 tokens) public payable whenNotPaused {
        require(msg.value == tokens * unitPrice, "Invalid amount!");
        require(erc20Contract.balanceOf(address(this)) >= tokens, "Insufficinet tokens");
        require(erc20Contract.transfer(msg.sender, tokens), "Transfer failed!");
        console.log("In buy");
        emit Buy(msg.sender, tokens, unitPrice);
    }

    receive() external payable {
        console.logString("in receive()");
        console.logAddress(msg.sender);
        console.logUint(msg.value);
        emit Receive(msg.sender, msg.value, 1);
    }

    fallback() external payable {
        console.logString("in fallback()");
        console.logAddress(msg.sender);
        console.logUint(msg.value);
        emit Receive(msg.sender, msg.value, 2);
    }

    function pause() public override whenNotPaused onlyOwner {
        paused = true;
        emit Paused();
    }

    function unpause() public override whenPaused onlyOwner {
        paused = false;
        emit Unpaused();
    }

    function getBalance() public view returns(uint){
        return address(this).balance;
    }

}
