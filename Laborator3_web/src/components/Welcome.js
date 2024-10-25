import '../styles/App.css';

import { useWallet } from '../utils/Context';
import { connectWalletMetamask} from '../utils/EthersUtils'
import { useNavigate } from 'react-router-dom';


export const Welcome = () => {
  const { wallet, initializeWallet } = useWallet();
  const navigate = useNavigate();

  const accountChangedHandler = async (signer) => {
    initializeWallet(signer);
  };


  // The accountChangedHandler function is passed as a callback to be executed when the account changes  
  const handleConnectMetaMaskButtonClick = () => {
    connectWalletMetamask(accountChangedHandler).then(() => {;
    
      navigate('/Main'); }).catch((reason) => {
      
      console.log("not connected");
     
    });
  };

  return (
     <div className="App">
        <header className="App-header">
          <img src="logo.png" className="App-logo" alt="logo" />
          <p>
            Voting Blockchain Projects dApp 
          </p>
          <button onClick={handleConnectMetaMaskButtonClick}>
            Connect With Metamask
            </button>  
        </header>
      </div>
  )
  }
