import React, { useEffect, useState } from "react";
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import Navbar from "../../Components/Navbar/Navbar";
import "./ProfilePage.scss";
import RepoCreation from "../../Components/RepoCreation/RepoCreation";
import RepoCard from "../../Components/Repocard/RepoCard";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import { contractABI,contractAddress } from "../../contractConfig";




const ProfilePage = () => {

  const { profileName } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isProfileOwner, setProfileOwner] = useState(false);
  const [repositories, setRepositories] = useState([]);

  const fetchRepositories = async () => {
    if(window.ethereum){
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI,contractAddress);

      try{
        await window.eth_requestAccounts;
        const accounts = await web3.eth.getAccounts();

        const isOwner = await contract.methods.isOwner(profileName).call({from: accounts[0]});
        console.log(isOwner);
        setProfileOwner(isOwner);

        const result = await contract.methods.getAllRepositories(profileName).call({from:accounts[0]});
        console.log(result);

        setRepositories(result);

      }catch(error){
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchRepositories();
  },[profileName])



  return (
    <div>
      <Navbar />
      <div className="box">
      <ProfileCard profilename={profileName}/>
        <div className="user-content">
          <div className="repo-area">
            <div className="search-and-button-container">
              <div className="reposearch-container">
                <input
                  type="text"
                  placeholder="Find a Repository"
                  className="reposearch-bar"
                />
              </div>
              {isProfileOwner && (
              <div>
                <button className="button" onClick={() => setModalOpen(true)}>New</button>
              </div>
              )}

            </div>
            <div className="repo-card-container">
            {
                repositories.map((repoName,index) =>
                ( <RepoCard 
                  key = {index}
                  repoName = {repoName}
                  profileName = {profileName}
                   />
                   ))
              }
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
      <RepoCreation
      profilename = {profileName}
      onClose = {() => setModalOpen(false)}
      setRepositories = {setRepositories}
       />
      )}
    </div>
  );
};

export default ProfilePage;