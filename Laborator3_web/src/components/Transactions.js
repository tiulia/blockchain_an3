import '../styles/Main.css'
import { fetchTransactions } from '../utils/EthersUtils';
import { useWallet } from '../utils/Context';
import React, { useState, useEffect} from 'react';


const Transactions = () => {
  // Dummy list of transactions
  const dtransactions = [
    { hash: '0x1', receiver: '0xReceiver1', amount: '1 ETH', gas: '21000', blockNumber: '123456', blockTimestamp: '2024-09-24 10:00:00' },
    { hash: '0x2', receiver: '0xReceiver2', amount: '0.5 ETH', gas: '21000', blockNumber: '123457', blockTimestamp: '2024-09-24 10:01:00' },
    { hash: '0x2', receiver: '0xReceiver2', amount: '0.5 ETH', gas: '21000', blockNumber: '123457', blockTimestamp: '2024-09-24 10:01:00' },
    { hash: '0x2', receiver: '0xReceiver2', amount: '0.5 ETH', gas: '21000', blockNumber: '123457', blockTimestamp: '2024-09-24 10:01:00' },
    { hash: '0x2', receiver: '0xReceiver2', amount: '0.5 ETH', gas: '21000', blockNumber: '123457', blockTimestamp: '2024-09-24 10:01:00' },
  ];


  const { wallet, initializeWallet } = useWallet();
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    const getTransactions = async () => {
      const txs = await fetchTransactions(wallet.address);
      console.log(txs);
      setTransactions(txs);
    };

    if (wallet) {
      getTransactions();
    } 
  }, [wallet]);

  return (
    <div className="App">
      <div className="App-header">
        <div class="line-container">
          <h2>Transactions</h2>
          <div className="table-container"> 
            <table>
              <thead>
                <tr>
                  <th width="450px">Receiver</th>
                  <th  width="135px">Amount</th>
                  <th  width="100px">Gas</th>
                  <th  width="100px">Block Number</th>
                  <th  width="100px">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td width="450px">{tx.receiver}</td>
                    <td  width="100px">{tx.value}</td>
                    <td  width="100px">{tx.gas}</td>
                    <td  width="100px">{tx.block}</td>
                    <td  width="100px">{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
