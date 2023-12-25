// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract DRepo {
    mapping(address => bool) public isRegistered;
    mapping(string => address) public profileNameMap;
    mapping(address => string) public profileNameToAddr;

    struct Commit {
        string CommitMsg;
        string ipfsURI;
    }


    mapping(address => string[]) public userProjects;
    mapping(string => Commit[]) public projectCommits;

    function registerUser(string memory profileName) public {
        require(!isRegistered[msg.sender], "User already registered");

        require(
            bytes(profileName).length > 0,
            "Profile name must not be empty"
        );
        isRegistered[msg.sender] = true;

        profileNameMap[profileName] = msg.sender;
        profileNameToAddr[msg.sender] = profileName;
        
    }

    function authenticateUser() public view returns (bool) {
        return isRegistered[msg.sender];
        
    }

    function isOwner(string memory profileName) public view returns (bool) {
        address userAddress = profileNameMap[profileName];
        return userAddress == msg.sender;
    }


    function getProfileName() public view returns (string memory) {
        return profileNameToAddr[msg.sender];
    }

    function CreateProject(string memory project_name) public  {
        require(
            bytes(project_name).length > 0,
            "Project name must not be empty"
        );
        userProjects[msg.sender].push(project_name);
        
    }

    function getAllRepositories(string memory profilename)
        public
        view
        returns (string[] memory)
    {
        address userAddress = profileNameMap[profilename];
        require(userAddress != address(0), "User not found");
        // address(0) means not a etherium address,
        return userProjects[userAddress];
    }

    function commit(
        string memory project_name,
        string memory commitMsg,
        string memory ipfsURI
    ) public  {
        projectCommits[project_name].push(Commit(commitMsg, ipfsURI));
    }

    function getAllCommits(string memory project_name)
        public
        view
        returns (Commit[] memory)
    {
        return projectCommits[project_name];
    }
    
}