// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



contract PhotoNft is ERC721URIStorage {
    uint256 private _tokenIdCounter;

    constructor(string memory description, string memory symbol) ERC721(description, symbol) {}

    function generateNft(string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newPhotoNftId = _tokenIdCounter;
        _mint(msg.sender, newPhotoNftId);
        _setTokenURI(newPhotoNftId, tokenURI);

        _tokenIdCounter += 1;
        return newPhotoNftId;
            
    }
}