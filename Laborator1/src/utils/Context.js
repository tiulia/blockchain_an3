import { createContext, useContext, useState  } from 'react';

const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);

  const initializeWallet = (walletData) => {
    setWallet(walletData);
  };

  return (
    <WalletContext.Provider value={{ wallet, initializeWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export { WalletProvider, useWallet };