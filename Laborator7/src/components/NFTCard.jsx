import React, { useEffect, useState } from "react";

import { buyNft, contractMarket, contractNft } from '../utils/EthersUtils';
import { COMPONENTS } from '../utils/Constants'

export const NFTCard = ({ wallet, nft }) => {

  const [component, setComponent] = useState(COMPONENTS.FORM);
  const [isPurchased, setIsPurchased] = useState(false);

  const handlePurchaseEvent = (tokenAddress, tokenId, listingId, recepient) => {
    if (listingId.toString() === nft.listingId) {
      setIsPurchased(true); // Update state if the event matches this NFT
    }
  };

  useEffect(() => {
    if (!contractMarket) return;
    contractMarket.on("Buy", handlePurchaseEvent);
  }, [contractMarket]);


  const handleBuy = async (listingId, price) => {

    setComponent(COMPONENTS.LOADING);
    try {
      await buyNft(listingId, price, wallet);
      setComponent(COMPONENTS.INFO_SUCCESS);

    } catch (error) {
      setComponent(COMPONENTS.INFO_ERROR);
    }
  }

  return (

    <div
      key={nft.listingId}
      className="nft-card"

    >
      {/* NFT Image */}
      <div style={{ textAlign: 'center' }}>
        <img
          src={nft.image}
          alt={`Token ${nft.tokenId}`}
          style={{ maxWidth: '100%', borderRadius: '8px' }}
        />
      </div>

      {/* NFT Details */}
      <div style={{ marginTop: '10px' }}>
        <h3 style={{ margin: '5px 0' }}>Description:</h3>
        <p>{nft.description}</p>
        <h4 style={{ margin: '5px 0' }}>Price: {nft.price.toString()} ETH</h4>
        <h6 style={{ margin: '5px 0', color: '#555' }}>Seller: {nft.seller}</h6>
      </div>

      {/* Buy Button */}
      {component === COMPONENTS.FORM && (<button
        disabled={isPurchased}
        onClick={() => handleBuy(nft.listingId, nft.price)}
      >
        Buy
      </button>)}

      {component === COMPONENTS.INFO_SUCCESS && (<button
        disabled={true}

      >
        Added to your collection!
      </button>)}

      {/* Buy Button */}
      {component === COMPONENTS.INFO_ERROR && (<button
        disabled={isPurchased}
        onClick={() => handleBuy(nft.listingId, nft.price)}
      >
        Error! Try Again
      </button>)}


      {component === COMPONENTS.LOADING && (<div className="loading-spinner">
        <span className="spinner-dot"></span>
        <span className="spinner-dot"></span>
        <span className="spinner-dot"></span>
      </div>)}
    </div>

  );
};
