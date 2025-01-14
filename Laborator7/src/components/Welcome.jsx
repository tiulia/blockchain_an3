import { useEffect, useState } from 'react';
import { useIndexedDB } from "react-indexed-db-hook";
import { useNavigate } from 'react-router-dom';


import logo from '../assets/logo.svg';

import { useWallet } from '../utils/WalletContext';
import { useUser } from '../utils/UserContext';
import { createWalletFromKey } from '../utils/EthersUtils'
import { encryptPrivateKey, decryptPrivateKey } from '../utils/WebCryptoApi';
import { createNewWallet } from '../utils/EthersUtils';

import Login from './Login'
import Signup from './Signup'



export const Welcome = () => {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const { user, initializeUser } = useUser();
  const { wallet, initializeWallet } = useWallet();

  const { getByID } = useIndexedDB("accounts");

  const login = (user, password) => {
    if (user) {
      getByID(user).then((userFromDB) => {
        decryptPrivateKey(userFromDB.encPrivatekey, password,
          userFromDB.iv, userFromDB.salt).then((privateKey) => {
            initializeUser(userFromDB);
            let walletUser = createWalletFromKey(privateKey);
            initializeWallet(walletUser);
          })
      });
    }
  }

  const { update } = useIndexedDB("accounts");

  const signup = (username, password) => {
    const wallet = createNewWallet();
    encryptPrivateKey(wallet.privateKey, password).then((result) => {
      update({
        id: username,
        encPrivatekey: result.encryptedKey,
        publicKey: wallet.publicKey,
        salt: result.salt,
        iv: result.iv
      }).then(
        (event) => {
          console.log(event);
        },
        (error) => {
          console.log(error);
        },
      );
    });
  }


  const closeSignup = () => {
    setShowSignup(false);
  }

  const handleCreateWalletButtonClick = () => {
    setShowSignup(true);
  };


  useEffect(() => {
    if (wallet) {
      navigate('/wallet');
    }
  }, [wallet]);


  return (
    <div className="pageContainer">
      <div className="leftContent">
        {!showSignup && (
          <img src={logo} className="App-logo" alt="logo" />
        )}
        {!showSignup && (
          <button onClick={handleCreateWalletButtonClick}>
            Signup for a new ETH wallet
          </button>
        )}
        {showSignup && (
          <h3>Safely store your private keys!</h3>
        )
        }
      </div>

      <div className="rightContent">

        {!showSignup && (
          <Login performLogin={login} />)
        }

        {showSignup && (
          <Signup onClose={closeSignup} signup={signup} />
        )}
      </div>
    </div>
  )
}
