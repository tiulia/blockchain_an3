import '../styles/Main.css'

import React, { useState, useEffect} from 'react';
import { useWallet } from '../utils/Context';
import { useNavigate } from 'react-router-dom';


export const Main = () => {
  const navigate = useNavigate();

  const { wallet, initializeWallet } = useWallet();
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [showContractFields, setShowContractFields] = useState(false);

  const clearForm = (bShow) => {
    setShowContractFields(bShow);
  }

  const handleVotingContractButtonClick = () => {
    clearForm(true);
  };

  const handleCancelButtonClick = () => {
    clearForm(false);
  };

  const handleContractButtonClick = () => {
    clearForm(false);
  };
  
  const fetchAddress = async () => {
    setEthereumAddress(wallet.address);
  };


  useEffect(() => {
    fetchAddress();
  },[wallet]);


  return (
    <div className="App">
      <div className="App-header">
        <h2>Connected to ...</h2>
        <p>My Address: {ethereumAddress}</p>
        <p>Voting Contract: {contractAddress}</p>

        {!showContractFields && (
        <button onClick={handleVotingContractButtonClick}>VoteContract</button>
        )
        }

        {!showContractFields  && (
        <button onClick={()=>navigate('/transactions')}>Transactions</button>
        )
        }

        {!showContractFields  && (
        <button onClick={()=>navigate('/proposals', { state: {contractAddress} }  )}>All Proposals</button>
        )
        }

        {showContractFields && (
          <div>
         <div className="line-container">
         <div >
           <label>Contract Address:</label>
           <input
             type="text"
             value={contractAddress}
             onChange={(e) => setContractAddress(e.target.value)}
           />
         </div>
       
      
         <br />
         <div>
         <button onClick={handleContractButtonClick}>Confirm</button>
         <button onClick={handleCancelButtonClick}>Cancel</button>
         </div>
          </div>
         
       </div>
        
        )}
        
      </div>
      </div>
  );
};

