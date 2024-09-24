import { Link } from 'react-router-dom';

import logo from './logo.svg';
import '../styles/App.css';

import { useWallet } from '../utils/Context';
import { connectWalletMetamask} from '../utils/EthersUtils'


export const Welcome = () => {
  const { wallet, initializeWallet } = useWallet();

  const accountChangedHandler = async (signer) => {
    initializeWallet(signer);
  };


  // The accountChangedHandler function is passed as a callback to be executed when the account changes  
  const handleConnectMetaMaskButtonClick = () => {
    connectWalletMetamask(accountChangedHandler);
  };

  return (
     <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Decentralized transfers of ETH and tokens. 
          </p>
          <Link 
            className="App-link"
            to = "/Wallet"
          >
            Ethereum wallet
          </Link>
          <button onClick={handleConnectMetaMaskButtonClick}>
            Connect With Metamask
            </button>  
        </header>
      </div>
  )
  }
