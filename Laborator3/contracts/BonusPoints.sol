// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract BonusPoints{

    address public admin;
    uint public pointValue;

    mapping(address => uint) public points;

    modifier onlyOwner(){
        require(msg.sender == admin );
        _;
    }

    constructor(uint _pointValue){
        admin = msg.sender;
        pointValue = _pointValue;
    }

    function addPoints(address client, uint _points) public onlyOwner {
        points[client] += _points;
    }

    function setPointValue(uint _pointValue) public onlyOwner{
        pointValue = _pointValue;
    }

    function getTotalValue(address client) external view returns (uint totalValue){
        totalValue = points[client] * pointValue;
    }

}