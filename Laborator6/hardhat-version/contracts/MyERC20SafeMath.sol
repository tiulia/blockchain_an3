// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyERC20{
    using SafeMath for uint;

    uint256 nbTokens;   

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) spendlimit;

    string public name ="Token optional BC";               
    uint8 public decimals = 0;                
    string public symbol = 'TOP';  

    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);
    event NuInteleg(address indexed from, uint balance);

    modifier checkBalance (address owner, uint tokens) {
        require(tokens <= balances[owner], 'Insufficient funds!');
        _;
    }

    modifier checkApproval (address owner, address delegate, uint tokens) {
        require(tokens <= spendlimit[owner][delegate], 'Insufficient allowance!');
        _;
    }

    constructor(uint256 tokens) {
        nbTokens = tokens;
        balances[msg.sender] = tokens;
    }

    function totalSupply() public view returns (uint256) { 
        return nbTokens;
    }

    function balanceOf(address tokenOwner) public returns (uint) { 
        emit NuInteleg(tokenOwner, balances[tokenOwner]);
        return balances[tokenOwner]; 
    }

    function transfer(address receiver, uint tokens) public checkBalance (msg.sender ,tokens) 
								returns (bool) {   
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[receiver] = balances[receiver].add(tokens);
        emit Transfer(msg.sender, receiver, tokens);
        return true;    
    }

    function approve(address spender, uint tokens)  public returns (bool) {
        spendlimit[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view 
								returns(uint) { 
        return spendlimit[tokenOwner][spender];
    }

    function transferFrom(address from, address to, uint tokens) 
            public  checkBalance (from, tokens) 
                    checkApproval(from, msg.sender, tokens) returns (bool) {
        
        balances[from] = balances[from].sub(tokens);
        spendlimit[from][msg.sender] = spendlimit[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }

    function who(address sender ) external view returns(address){
        return msg.sender;
    }
}
