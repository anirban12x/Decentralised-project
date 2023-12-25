import React,{useState} from 'react'
import Navbar from '../../Components/Navbar/Navbar';
import "./Home.scss";
import img from './hero.png';
import Web3 from "web3";
import { contractABI,contractAddress } from '../../contractConfig.js';
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();
  const [profileName,setProfileName] = useState('')
  
  const registerUser = async () => {

    if(window.ethereum){
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI,contractAddress);

      try{
        await window.eth_requestAccounts;
        const accounts = await web3.eth.getAccounts();

        // console.log(accounts);
        const result = await contract.methods.registerUser(profileName).send({from:accounts[0]});
        console.log(result);

        if(result){
          navigate(`/${profileName}`)
        }

      }catch(error){
        console.log(error);
      }
    }
  }


  const handleSignIn = async (event) => {
    event.preventDefault();
    if(window.ethereum){
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI,contractAddress);

      try{
        await window.eth_requestAccounts;
        const accounts = await web3.eth.getAccounts();

        console.log(accounts);
        const result = await contract.methods.authenticateUser().call({from:accounts[0]});
        console.log(result);

        if(result){
          const profileName = await contract.methods.getProfileName(accounts[0]).call({from:accounts[0]});
          navigate(`/${profileName}`)
        }

      }catch(error){
        console.log(error);
      }
    }
    
  }
  return (
  <div>
    <Navbar />
    <div className="home-content">
      <div className="left-content">
        <h1 className='maintext'>Your code is in <span className="subtext">Blockchain</span></h1>
        <p className="description">Start your journey towards the <br />Decentralized World</p>
        <div className="btn-container">
          <input type="text" placeholder="Enter your Profile Name !!" className="input-field"
          value = {profileName}
          onChange = {(e) => setProfileName(e.target.value)}
          />
        </div>
        <button className="btn" onClick={registerUser}>Register</button>
        <div className="signin-text">Already Have an Account, {'\n'}
         <a href='#' className='sign-in' onClick={handleSignIn}>Sign In</a>
        </div>
      </div>
      <div className="right-content">
        <img className='img' src={img} alt="hero" />
      </div>
    </div>
  </div>
  );
};


export default Home;