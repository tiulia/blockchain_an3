// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract MyERC20{

    uint256 nbTokens;   

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) spendlimit;

    string public name ="Token optional BC";               
    uint8 public decimals = 0;                
    string public symbol = 'TOP';  

    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);


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

    function balanceOf(address tokenOwner) public view returns (uint) { 
        return balances[tokenOwner]; 
    }

    function transfer(address receiver, uint tokens) public checkBalance (msg.sender ,tokens) 
								returns (bool) {   
        balances[msg.sender] = balances[msg.sender] - tokens;
        balances[receiver] = balances[receiver] + tokens;
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
        
        balances[from] = balances[from] - tokens;
        spendlimit[from][msg.sender] = spendlimit[from][msg.sender]- tokens;
        balances[to] = balances[to] + tokens;
        emit Transfer(from, to, tokens);
        return true;
    }
}
