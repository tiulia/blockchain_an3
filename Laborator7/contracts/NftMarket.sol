// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is Ownable{
    event List(address indexed tokenAddress, uint256 indexed tokenId, uint256 indexed listingId, address seller, bytes32 description, uint256 price);
    event Buy(address indexed tokenAddress, uint256 indexed tokenId, uint256 indexed listingId, address recepient);
    event Deactivate(uint256 indexed listingId );

    modifier isActive(uint256 _listingId) {
        require (listings[_listingId].active, "Listing expired or not available!");
        _;
    }

    modifier authorized(uint256 _listingId){
        require (listings[_listingId].seller == msg.sender, "You are not allowed to modify this listing!");
        _;
    }

    modifier checkValue(uint256 _listingId){
        require (listings[_listingId].price + listings[_listingId].marketFee <= msg.value);
        _; 
    }

    struct Listing {
        address tokenAddress;
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 marketFee;
        bytes32 description;
        bool active;
    }

    uint256 defaultMarketFee;
    uint256 listingId;


    mapping (uint256 => Listing) public listings;

    constructor( uint256 _defaultMarketFee)  Ownable(msg.sender) {
        listingId = 0;
        defaultMarketFee = _defaultMarketFee;
    }

    function list(address _tokenAddress, uint256 _tokenId, uint256 _price, bytes32 _description) public {
        IERC721 tokenContract = IERC721(_tokenAddress);        
        require (tokenContract.ownerOf(_tokenId) == msg.sender, "You are not the owner of the NFT!" );

        require(
        tokenContract.getApproved(_tokenId) == address(this) || 
        tokenContract.isApprovedForAll(msg.sender, address(this)),
        "Marketplace not approved to handle this token."
        );

        listingId += 1;

        Listing storage listing = listings[listingId];

        listing.tokenAddress = _tokenAddress;
        listing.tokenId = _tokenId;
        listing.seller = msg.sender;
        listing.price = _price;
        listing.marketFee = defaultMarketFee;
        listing.description = _description;
        listing.active = true;

        emit List(_tokenAddress, _tokenId, listingId, msg.sender, _description, _price + defaultMarketFee);
    }

    function buy(uint256 _listingId) public isActive(_listingId) checkValue(_listingId) payable{
        Listing storage nft = listings[_listingId];
        IERC721 tokenContract = IERC721(nft.tokenAddress);
        require (tokenContract.ownerOf(nft.tokenId) == nft.seller, "Transfer not allowed!" );

        payable(nft.seller).transfer(nft.price);
        tokenContract.safeTransferFrom(nft.seller, msg.sender, nft.tokenId);

        emit Buy(nft.tokenAddress, nft.tokenId, _listingId, msg.sender );

        delete listings[_listingId];
    }

    function deactivateListing( uint256 _listingId ) public onlyOwner {
        listings[_listingId].active = false;
        emit Deactivate(_listingId);
    } 

    function getPrice(uint256 _listingId) public view isActive(_listingId) returns (uint256) {
        return listings[_listingId].price + listings[_listingId].marketFee;
    }

    function getMarketFee(uint256 _listingId) public view isActive(_listingId) returns (uint256) {
        return listings[_listingId].marketFee;
    }


    function getDescription(uint256 _listingId) public view isActive(_listingId) returns (bytes32) {
        return listings[_listingId].description;
    }

    function setPrice(uint256 _listingId, uint256 _price) public isActive(_listingId) authorized(_listingId) {
        listings[_listingId].price = _price;
    }

    function setMarketFee(uint256 _listingId, uint256 _marketFee) public isActive(_listingId) authorized(_listingId) {
        listings[_listingId].marketFee = _marketFee;
    }

    function setDescription(uint256 _listingId, bytes32 _description) public isActive(_listingId) authorized(_listingId) {
        listings[_listingId].description = _description;
    }

    function setDefaultMarketFee(uint256 _listingId, uint256 _marketFee) public onlyOwner {
        listings[_listingId].marketFee = _marketFee;
    }

    function withdraw() public onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }
}