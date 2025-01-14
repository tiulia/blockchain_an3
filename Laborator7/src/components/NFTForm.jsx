import React, { useEffect, useState } from "react";

import { mintNft, listNft, approveMarket } from '../utils/EthersUtils';
import { pinata } from '../utils/Pinata';
import { Info } from '../components/Info';
import { COMPONENTS } from '../utils/Constants'


export const NFTForm = ({ wallet }) => {

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [ipfsCID, setIpfsCID] = useState("");
  const [file, setFile] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [listingId, setListingId] = useState(null);
  const [component, setComponent] = useState(COMPONENTS.FORM);
  const [err, setErr] = useState(null);

  const handleImageUpload = async (event) => {
    const targetFile = event.target.files[0];
    if (targetFile) {
      setFile(targetFile);
    }

    const imageUrl = URL.createObjectURL(targetFile);
    setImage(imageUrl);
  };

  const handleOnClose = () => {
    setListingId(null);
    setImage(null);
    setDescription(null);
    setPrice(null);
    setIpfsCID(null);
    setComponent(COMPONENTS.FORM);
  }

  const handleOnErrClose = () => {
    setListingId(null);
    setIpfsCID(null);
    setComponent(COMPONENTS.FORM);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!description || !price) {
      alert("Please fill in all fields.");
      return;
    }

    setComponent(COMPONENTS.LOADING);

    try {
      const response = await pinata.upload.file(file);
      setIpfsCID(response.IpfsHash);

      const tokenId = await mintNft(response.IpfsHash, wallet);
      setTokenId(tokenId);

      await approveMarket(tokenId, wallet);

      const listingId = await listNft(tokenId, price, description, wallet);
      setListingId(listingId);

      setComponent(COMPONENTS.INFO_SUCCESS);

      alert("NFT created successfully!");

    }
    catch (error) {
      console.error("Error creating NFT:", error.message);
      setErr(error.message);
    }
  };

  useEffect(() => {
    if (err)
      setComponent(COMPONENTS.INFO_ERROR);
  }, [err]);


  return (

    <div>
      {component === COMPONENTS.FORM && (
        <div className="input-container" >
          {component === COMPONENTS.FORM && (<h2>Create NFT</h2>)}
          {component === COMPONENTS.FORM && (
            <form onSubmit={handleSubmit}>
              <div >
                <label>Image:</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {image && <img src={image}
                  style={{ maxWidth: '50%', borderRadius: '8px' }}
                  alt="Preview" />}
              </div>

              {/* <div >
          <label>ERC721 Contract Address:</label>
          <input
            type="text"
            value={erc721Address}
            onChange={(e) => setErc721Address(e.target.value)}
            placeholder="0x1234...abcd"
            required
          />
        </div> */}

              <div >
                <label>Description:</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter image description"
                  required
                />
              </div>
              <div >
                <label>Price (Wei):</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1"
                  step="1"
                  required
                />
              </div>
              <button type="submit" >Create NFT</button>
            </form>)}
        </div>)}

      {component === COMPONENTS.LOADING && (<div className="loading-spinner">
        <span className="spinner-dot"></span>
        <span className="spinner-dot"></span>
        <span className="spinner-dot"></span>
      </div>)}

      {component === COMPONENTS.INFO_ERROR && (<Info type={'error'} message={`Error: ${err}`} onClose={handleOnErrClose} />)}
      {component === COMPONENTS.INFO_SUCCESS && (<Info type={'confirm'} message={`NFT created with Listing ID: \n ${BigInt(listingId).toString()}, Token ID: ${BigInt(tokenId).toString()} `} onClose={handleOnClose} />)}
    </div>

  );
};
