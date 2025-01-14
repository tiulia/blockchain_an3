import React, { useEffect, useState } from 'react';

import { pinataJwt, pinataGateway, } from '../config';
import { PinataSDK } from "pinata-web3";

import { ethers } from 'ethers';
import { NFTCard } from './NFTCard'

export const NftListings = ({ contractMarket, contractNft, wallet }) => {
  const [nftListings, setNftListings] = useState([]);

  const pinata = new PinataSDK({
    pinataJwt,
    pinataGateway,
  });


  useEffect(() => {

    const fetchListingsFromEvents = async () => {
      if (!contractMarket) return;

      try {

        const purchaseEvents = await contractMarket.queryFilter(
          contractMarket.filters.Buy()
        );

        const purchasedIds = new Set(
          purchaseEvents.map((event) => event.args.listingId.toString())
        );

        const listEvents = await contractMarket.queryFilter(contractMarket.filters.List());

        const listings = await Promise.all(
          
          listEvents
            .filter((event) => !purchasedIds.has(event.args.listingId.toString()))
            .map(async (event) => {

              const { args } = event;
              const listingId = args.listingId.toString();
              const tokenId = args.tokenId.toString();
              const seller = args.seller;

              const price = args.price;
              const description = ethers.decodeBytes32String(args.description);
              const imageCID = await contractNft.tokenURI(tokenId);

              return {
                listingId,
                tokenId,
                seller,
                price, 
                description,
                image: `https://gateway.pinata.cloud/ipfs/${imageCID}`, 
              };
            })
        );

        setNftListings(listings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListingsFromEvents();

  }, [contractMarket]);


  return (
    <div>
      <div className="nft-listing-container">
        {nftListings.length === 0 && <p>No NFTs listed yet.</p>}
        {nftListings.map((nft) => (<div>  <NFTCard nft={nft} wallet={wallet} />   </div>)
        )}
      </div>

    </div>
  );
};
