import '../styles/Main.css'
import { fetchProposals , initializeContract} from '../utils/EthersUtils';
import { useWallet } from '../utils/Context';
import React, { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import VotingContract from '../contracts/Voting.json';

const Proposals = () => {
  // Dummy list of transactions
  const dtransactions = [
    { hash: '0x1', receiver: '0xReceiver1', amount: '1 ETH', gas: '21000', blockNumber: '123456', blockTimestamp: '2024-09-24 10:00:00' },
    { hash: '0x2', receiver: '0xReceiver2', amount: '0.5 ETH', gas: '21000', blockNumber: '123457', blockTimestamp: '2024-09-24 10:01:00' },
    { hash: '0x2', receiver: '0xReceiver2', amount: '0.5 ETH', gas: '21000', blockNumber: '123457', blockTimestamp: '2024-09-24 10:01:00' },
    { hash: '0x2', receiver: '0xReceiver2', amount: '0.5 ETH', gas: '21000', blockNumber: '123457', blockTimestamp: '2024-09-24 10:01:00' },
    { hash: '0x2', receiver: '0xReceiver2', amount: '0.5 ETH', gas: '21000', blockNumber: '123457', blockTimestamp: '2024-09-24 10:01:00' },
  ];

  const location = useLocation();
  const { contractAddress } = useState(location.state.contractAddress);

  const { wallet, initializeWallet } = useWallet();
  const [proposals, setProposals] = useState([]);
  const contractABI = VotingContract.abi;
  const [votingContract, setVotingContract] = useState();


  useEffect(() => {
    console.log(location.state.contractAddress);
    console.log(contractABI);
    const contract = initializeContract(location.state.contractAddress, contractABI );
    console.log("votingContract .... ");
    console.log(contract);
    setVotingContract(contract);
  }, [wallet]);

  useEffect(() => {
    if (votingContract) {
        const getProposals = async () => {
            const proposals = await fetchProposals(votingContract);
            console.log(proposals);
            setProposals(proposals);
          };
        getProposals();
        } 
        
    }
, [votingContract]);

  return (
    <div className="App">
      <div className="App-header">
        <div class="line-container">
          <h2>Proposals</h2>
          <div className="table-container"> 
            <table>
              <thead>
                <tr>
                  <th width="450px">Proposer</th>
                  <th  width="135px">Team Member</th>
                  <th  width="135px">Team Member</th>
                  <th  width="100px">Team</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p, index) => (
                  <tr key={index}>
                    <td width="450px">{p.proposer}</td>
                    <td  width="135px">{p.participant1}</td>
                    <td  width="135px">{p.participant2}</td>
                    <td  width="100px">{p.teamName}</td>
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

export default Proposals;
