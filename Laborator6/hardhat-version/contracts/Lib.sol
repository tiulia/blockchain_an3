// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

library Lib{

    struct constants{
        uint defaultFee;
        address proxyAddress;
    }

    uint256 constant maxUInt8 = (2**8)-1;

    function safeAdd(uint8 a, uint8 b) public pure returns (uint256) {
        
        require(a <= maxUInt8 - b, "uint overflow!");
        return a + b;
    }

    //token to allow tranfer from proxy
    function createTokenNum(address sender, address receiver, uint nbTokens, address tokenAddress) public pure returns (bytes32 token) {
        token = keccak256(abi.encodePacked("\x19Ethereum Transfer Token:\n32",
                                            bytes32(uint256(uint160(sender))),
                                            bytes32(uint256(uint160(receiver))),
                                            bytes32(nbTokens), 
                                            bytes32(uint256(uint160(tokenAddress)))
                                            ));
    }



}