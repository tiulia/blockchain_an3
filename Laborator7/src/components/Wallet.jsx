import { useState, useEffect } from 'react';
import { useWallet } from '../utils/WalletContext';
import { useNavigate } from 'react-router-dom';

import { getBalance, contractMarket, contractNft } from '../utils/EthersUtils';
import { NFTForm } from './NFTForm'
import { NftListings } from './NftListing'



export const Wallet = () => {
  const navigate = useNavigate();
  const { wallet, initializeWallet } = useWallet();
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [component, setComponent] = useState(0);

  const [balance, setBalance] = useState('');

  const handleCreateNftButtonClick = () => {
    setComponent(1);
  };

  const handleListingsClick = () => {
    setComponent(2);
  };

  const fetchAddress = async () => {
    setEthereumAddress(wallet.address);
  };

  const fetchBalance = async () => {
    getBalance(wallet.address).then((result) => {
      setBalance(result.toString());
    });
  };

  useEffect(() => {
    if (wallet) {

      fetchAddress();
      fetchBalance();
      const intervalId = setInterval(() => {
        fetchBalance();
      }, 3000);

      return () => clearInterval(intervalId);
    }
    else { navigate('/'); }
  }, [wallet]);


  return (
    <div >
      <div className="pageContainer">
        <div className="leftContent">
          <h2>Ethereum Wallet</h2>
          <p>Address: {ethereumAddress}</p>
          <p>Balance: {balance}</p>

          <button onClick={handleCreateNftButtonClick}>Create NFT</button>
          <button onClick={handleListingsClick}>View tokens</button>

        </div>
        <div className="rightContent">
          {component === 1 && (
            <NFTForm wallet={wallet} />
          )}
          {component === 2 && (
            <NftListings contractMarket={contractMarket} contractNft={contractNft} wallet={wallet} />
          )}
        </div>
      </div>
    </div>

  )

}
