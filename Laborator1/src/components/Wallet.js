import '../styles/Wallet.css'

import React, { useState, useEffect} from 'react';
import { sendTransaction, getBalance} from '../utils/EthersUtils';
import { useWallet } from '../utils/Context';

import Info from '../components/Info'

export const Wallet = () => {
  const { wallet, initializeWalletm } = useWallet();

  const [transactionResponse, setTransactionResponse] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [showSendFields, setShowSendFields] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState('ether');

  const clearForm = (bShow) => {
    setShowSendFields(bShow);
    setShowPopup(false);
    setRecipientAddress('');
    setAmountToSend(0);
  }

  const handleSendButtonClick = () => {
    clearForm(true);
  };

  const handleCancelButtonClick = () => {
    clearForm(false);
  };
  
  const handleConfirmButtonClick = () => {
    const amountInWei = convertAmountToWei(amountToSend, selectedUnit);
    console.log("wei to send: " + amountInWei)
    sendTransaction(wallet, recipientAddress, amountInWei).then((transactionHash) => {
      setTransactionResponse('Transaction hash: ' + transactionHash);
      console.log(transactionResponse);
      setShowPopup(true);
    }).catch((reason) => {
      setTransactionResponse('Transaction failed: ' + reason);
      console.log(reason);
      setShowPopup(true);
    });
    clearForm(false);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTransactionResponse('');
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
    fetchBalance();
        const intervalId = setInterval(() => {
          fetchBalance();
        }, 3000); 
    
        return () => clearInterval(intervalId);
  },[wallet]);

  useEffect(() => {
    fetchAddress();
  },[wallet]);


  const convertAmountToWei = (amount, unit) => {
    const units = {
      ether: 1e18, 
      gwei: 1e9,
      finney: 1e15,
      wei: 1,
    };
  
    return amount * units[unit];
  };

  return (
    <div className="App">
      <div className="App-header">
        <h2>Ethereum Wallet</h2>
        <p>Address: {ethereumAddress}</p>
        <p>Balance: {balance}</p>
        {!showSendFields && !showPopup && (
        <button onClick={handleSendButtonClick}>Send</button>
        )
        }

        {showSendFields && (
          <div>
         <div className="input-container">
         <div >
           <label>Send to Address:</label>
           <input
             type="text"
             value={recipientAddress}
             onChange={(e) => setRecipientAddress(e.target.value)}
           />
         </div>
       
         <div >
           <label>Amount:</label>
           <input
             type="number"
             value={amountToSend}
             onChange={(e) => setAmountToSend(Number(e.target.value))}
           />
       
           <label>Unit:</label>
           <select
             onChange={(e) => setSelectedUnit(e.target.value)}
             value={selectedUnit}
           >
             <option value="wei">Wei</option>
             <option value="gwei">Gwei</option>
             <option value="finney">Finney</option>
             <option value="ether">Ether</option>
           </select>
         </div>
       
         <br />
         <div>
         <button onClick={handleConfirmButtonClick}>Confirm</button>
         <button onClick={handleCancelButtonClick}>Cancel</button>
         </div>
          </div>
         
       </div>
        
        )}
        {showPopup && (
          <Info message={transactionResponse} onClose={closePopup} />
        )}
      </div>
      </div>
  );
};

