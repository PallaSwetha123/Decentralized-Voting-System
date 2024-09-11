document.addEventListener("DOMContentLoaded", async () => {
  if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
      const contractABI = YOUR_CONTRACT_ABI; // Replace with your contract ABI

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      async function loadCandidates() {
          const candidatesCount = await contract.methods.candidatesCount().call();
          const candidates = [];
          for (let i = 1; i <= candidatesCount; i++) {
              const candidate = await contract.methods.getCandidate(i).call();
              candidates.push({ id: i, name: candidate[0], voteCount: candidate[1] });
          }
          updateCandidateList(candidates);
      }

      async function updateCandidateList(candidates) {
          const candidateList = document.getElementById('candidateList');
          const candidateSelect = document.getElementById('candidateSelect');
          candidateList.innerHTML = '';
          candidateSelect.innerHTML = '';
          
          candidates.forEach(candidate => {
              const li = document.createElement('li');
              li.textContent = `${candidate.name} - ${candidate.voteCount} votes`;
              candidateList.appendChild(li);

              const option = document.createElement('option');
              option.value = candidate.id;
              option.textContent = candidate.name;
              candidateSelect.appendChild(option);
          });

          const totalVotes = await contract.methods.totalVotes().call();
          document.getElementById('totalVotes').textContent = totalVotes;
      }

      window.vote = async () => {
          const accounts = await web3.eth.getAccounts();
          const selectedCandidate = document.getElementById('candidateSelect').value;

          await contract.methods.vote(selectedCandidate).send({ from: accounts[0] });
          loadCandidates(); // Reload candidates and vote counts after voting
      };

      loadCandidates();
  } else {
      alert("Please install MetaMask or another Ethereum wallet extension.");
  }
});
