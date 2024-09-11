import Web3 from 'web3';
import VotingArtifact from './contracts/Voting.json';

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

const getVotingContract = async () => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = VotingArtifact.networks[networkId];
  return new web3.eth.Contract(
    VotingArtifact.abi,
    deployedNetwork && deployedNetwork.address
  );
};

export { web3, getVotingContract };
