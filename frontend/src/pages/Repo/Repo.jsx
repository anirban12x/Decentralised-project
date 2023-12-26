import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar.jsx";
import "./Repo.scss";
import { useStorage } from "@thirdweb-dev/react";
import { useParams } from "react-router-dom";
import JSZip, { file } from "jszip";
import { Link } from 'react-router-dom';
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contractConfig";
import img from '../home/hero.png';

const Repo = () => {

  const [isProfileOwner, setProfileOwner] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [commit, setLastCommit] = useState([]);
  const {profileName, repoName} = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [ipfspath, setipfsPath] = useState([]);
  const [path, setPath] = useState([]);
  const [url, setDownloadUrl] = useState("");


  const fetchCommits = async () => {
    console.log(repoName);
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      try {
        await window.eth_requestAccounts;
        const accounts = await web3.eth.getAccounts();
        const commits = await contract.methods.getAllCommits(repoName).call({ from: accounts[0] });

        
        const isOwner = await contract.methods.isOwner(profileName).call({ from: accounts[0] });
        setProfileOwner(isOwner);

        const latestCommit = commits.length > 0 ? commits[commits.length - 1] : null;
        setLastCommit(latestCommit.CommitMsg);
        console.log(latestCommit.id)

        if (latestCommit) {
          const response = await fetch(latestCommit.ipfsURI)
          console.log(response)
          const { data, fs } = await response.json();
          console.log(data);

          const formattedUrl = data.replace('ipfs://', 'https://ipfs.io/ipfs/');
          console.log(formattedUrl);

          setDownloadUrl(formattedUrl)

          const commitPaths = fs.map((file) => {
            const pathComponents = file.path.split('/');
            return pathComponents.length > 2 ? pathComponents[1] : file.path;
          });
          const uniquePaths = [...new Set(commitPaths)];
          console.log(Array.isArray(uniquePaths));

          setPath(uniquePaths);
        }


      } catch (error) {
        console.error('Error fetching commits from smart contract:', error);
      }
    }
  }

  const storage = useStorage();
  const fileInputRef = useRef(null);



  const handleFileChange = (event) => {
    const fileList = event.target.files;
    const files = [];
    const webkitdirectory = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      files.push((file));
      webkitdirectory.push((file.webkitRelativePath));

    }

    console.log(files);

    setipfsPath(webkitdirectory)
    setSelectedFiles(files);
  };

  useEffect(() => {
    fetchCommits();
    
  }, []);



  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSubmit = async () => {

    const zip = new JSZip();
    for (const file of selectedFiles) {
      const path = file.webkitRelativePath;
      const content = await readFileAsync(file);
      const pathComponents = path.split('/');
      let currentFolder = zip;
      for (let i = 0; i < pathComponents.length - 1; i++) {
        const folderName = pathComponents[i];
        currentFolder = currentFolder.folder(folderName);
      }
      currentFolder.file(pathComponents[pathComponents.length - 1], content);

    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipFile = new File([zipBlob], 'files.zip');
    const uri = await storage.upload({
      data: zipFile,
      fs: ipfspath.map((filePath, index) => ({
        name: `file${index + 1}`,
        path: filePath,
      })),
    });
    console.log(uri)
    const data = await storage.download(uri);

    console.log(data.url);

    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      try {
        await window.eth_requestAccounts;
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.commit(repoName, inputValue, data.url).send({ from: accounts[0] });

        if (result){
        window.location.reload();
        }


      }
      catch (error) {
        alert('Error adding commit', error);
      }
    }

  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);

    })
  };

  return (
    <div>
      <Navbar />
      <div className="repo-container">
        <div className="repo-main">
          <div className="repo-header">
            <h2>{repoName}</h2>
            {/* <h2>Python Project</h2> */}
            <div className="public-badge">Public</div>
          </div>
          <div className="branch-dropdown">
            <div className="branch">
              <select className="dropdown">
                <option value="main">Main</option>
                <option value="master">Master</option>
              </select>
            </div>
            <div className="Code">
              <button className="code-btn" onClick={handleDropdownToggle}>

                Code
              </button>
              {isDropdownOpen && (
                <div className="download">
                  <a href={url} className="zip">
                    Download ZIP -
                  </a>
                  {/* Add more dropdown items if needed */}
                </div>
              )}
            </div>
          </div>
          <div className="files-list">
            <table>
              <thead>
                <tr>
                  <th>{profileName}</th>
                  {/* <th>anirban12</th> */}
                  <th>0x2cb4</th>
                  <th>
                    <Link
                      to={{
                        pathname:`/${profileName}/${repoName}/commit`}}
                    >Commits</Link></th>
                </tr>
              </thead>
              {/* <tbody>
                {/* {path.map((path, index) => ( */}
                  {/* <tr key={index}> */}
                    {/* <td>{path}</td> */}
                    {/* <td>{profileName}</td> */}
                    {/* <td>{commit}</td> */}
                    {/* <td>{repoName}</td>
                    <td>2 days ago</td> */}
                  {/* </tr> */}
                {/* ))} */}
              {/* </tbody> */} */
            </table>
          </div>
          <div className="readme-container">
            <div className="readme-header">
              <h3>README.md</h3>
            </div>
            <div className="readme-body">
              <p>
                This project is an implementation of a Basic blockchain in
                JavaScript.
              </p>
            </div>
          </div>
          {isProfileOwner && (
            <div className="add-commit">
              <h2>Add New Commit</h2>
              <div className="file-upload-container">
                <div className="file-upload">
                  <div className="drag-drop-area" id="dropzone">
                    <span>Drag & Drop Files Here</span>
                    <input
                      type="file"
                      id="filepicker"
                      name="fileList"
                      webkitdirectory=""
                      directory=""
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      ref={fileInputRef}

                    />
                    <div>
                      <button className='select-files' onClick={() => fileInputRef.current.click()}>Select Directory</button>
                    </div>
                  </div>
                  <div className="file-list" id="fileList">
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>
                          <span>{file.webkitRelativePath}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="commit-section">
                  <input type="text" value={inputValue}       
                    onChange={handleInputChange} id="commitMessage" placeholder="Type your commit message" />
                  <button onClick={handleSubmit} id="submitBtn" 
                    disabled={selectedFiles.length===0 ||!inputValue.trim()} >Submit</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="repo-sidebar">
          <div className="about">
            <h3>About</h3>
            <p>
              This project is an implementation of a basic blockchain in
              JavaScript.
            </p>
            <img className='img' src={img} alt="hero" />
          </div>

        </div>
      </div>
    </div >
  );
};

export default Repo;