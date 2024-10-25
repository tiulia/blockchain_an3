// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Orders {
    BonusPoints public bonusPointsContract;
    uint public nbCallsError;
    uint public nbCallsRevert;
    uint public nbCallsPanic;
    uint public nbCalls;

    constructor(address _bonusPointsAddress) {
        bonusPointsContract = 
           BonusPoints(_bonusPointsAddress);
    }

    function calculateRequiredPoints(address client, uint requiredValue) 
            public returns (uint) {
        nbCalls += 1;

        try bonusPointsContract.getRequiredPoints(client, requiredValue) 
         returns (uint requiredPoints) {
            return requiredPoints; 
        } 
        catch Error(string memory reason) {
            nbCallsError += 1;
        } 
        catch Panic(uint errorCode) {
            nbCallsPanic += 1;
        }
        catch (bytes memory r) {
            nbCallsRevert += 1;
        }
    }


    function calculateRequiredPointsT(address client, uint requiredValue) 
            public returns (uint) {
        nbCalls += 1;

        return bonusPointsContract.getRequiredPoints(client, requiredValue);
    }

    function calculateRequiredPointsR(address client, uint requiredValue) public returns (uint) {
        nbCalls += 1;

        try bonusPointsContract.getRequiredPoints(client, requiredValue) returns (uint requiredPoints) {
            return requiredPoints; 
        } 
        catch Error(string memory reason) {
            nbCallsError += 1;
            revert(reason);  
        } 
        catch Panic(uint errorCode) {
            nbCallsPanic += 1;
            if (errorCode == 0x12) {
                revert("Panic: Division by zero occurred!");
            } else {
                revert("Panic: An unexpected error occurred!");
            }
        }
        catch (bytes memory r) {
            nbCallsRevert += 1;
            revert(string(r));
        }
    }
}



contract BonusPoints{

    address public admin;
    uint public pointValue;
    uint public nbCalls;

    error NotFound();

    mapping(address => uint) public points;

    modifier onlyOwner(){
        require(msg.sender == admin, "Only admin!" );
        _;
    }

    modifier onlyOwnerCodeBofore(){
        _;
        require(msg.sender == admin, "Only admin!" );
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

    function setPointValueCodeBofore(uint _pointValue) public onlyOwnerCodeBofore{
        pointValue = _pointValue;
    }


    function getTotalValue(address client) 
    external returns (uint totalValue){
        nbCalls += 1;
        totalValue = points[client] * pointValue;
    }

    function getRequiredPoints(address client, uint requiredValue) external returns (uint requiredPoints){
        nbCalls += 1;
        requiredPoints = requiredValue / pointValue;
        
        if (points[client] == 0) 
            revert NotFound();

        require (this.getTotalValue(client) >= requiredValue, "Insufficient Funds!");

}
}