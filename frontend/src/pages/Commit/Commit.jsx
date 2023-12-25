import React, { useState, useEffect } from "react";
import "./Commit.scss";
import Navbar from "../../Components/Navbar/Navbar";
import Web3 from "web3";
import { useParams } from 'react-router-dom';
import { contractABI, contractAddress } from '../../contractConfig.js';

const CommitHistoryPage = () => {

  const [commits, setCommits] = useState([]);
  const { profileName, repoName } = useParams();

  const fetchCommits = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      try {
        await window.eth_requestAccounts;
        const accounts = await web3.eth.getAccounts();
        const Commits = await contract.methods.getAllCommits(repoName).call({ from: accounts[0] });

        
        const reversedCommits = Commits.reverse();

        setCommits(reversedCommits);

      } catch (error) {
        console.error('Error fetching commits from smart contract:', error);
      }
    }
  }

  useEffect(() => {
    fetchCommits();
  }, []);

  return (
    <div className="commit-history">
      <Navbar />
      <div className="commit-history-page">
        <h1>Commits</h1>
        <hr />
        <ul className="commit-list">
          {commits.map((commit) => (
            <li key={commit.id} className="commit-item">
              <div className="commit-info">
                <div className="commit-message">{commit.CommitMsg}</div>
                <div className="profile-name"> {profileName} committed few time ago</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CommitHistoryPage;