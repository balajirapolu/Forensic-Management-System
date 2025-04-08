// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ForensicEvidence {
    struct Evidence {
        string fileName;
        uint256 fileSize;
        string fileType;
        uint256 uploadTime;
        string ipfsHash;
        string blockchainHash;
        bool isVerified;
        address uploader;
        bytes32 integrityHash;
    }

    address public owner;
    mapping(uint256 => Evidence) public evidenceRecords;
    uint256 public totalEvidence;
    mapping(address => bool) public authorizedUsers;
    
    event EvidenceAdded(uint256 indexed evidenceId, string fileName, address uploader);
    event EvidenceVerified(uint256 indexed evidenceId, bool verified);
    event UserAuthorized(address indexed user);
    event UserRevoked(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedUsers[msg.sender] = true;
    }

    function authorizeUser(address user) public onlyOwner {
        authorizedUsers[user] = true;
        emit UserAuthorized(user);
    }

    function revokeUser(address user) public onlyOwner {
        require(user != owner, "Cannot revoke owner");
        authorizedUsers[user] = false;
        emit UserRevoked(user);
    }

    function addEvidence(
        string memory _fileName,
        uint256 _fileSize,
        string memory _fileType,
        string memory _ipfsHash,
        string memory _blockchainHash
    ) public onlyAuthorized returns (uint256) {
        require(bytes(_fileName).length > 0, "Filename cannot be empty");
        require(_fileSize > 0, "File size must be greater than 0");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        totalEvidence++;
        uint256 evidenceId = totalEvidence;

        bytes32 integrityHash = keccak256(abi.encodePacked(
            _fileName,
            _fileSize,
            _fileType,
            _ipfsHash,
            _blockchainHash,
            block.timestamp,
            msg.sender
        ));

        evidenceRecords[evidenceId] = Evidence({
            fileName: _fileName,
            fileSize: _fileSize,
            fileType: _fileType,
            uploadTime: block.timestamp,
            ipfsHash: _ipfsHash,
            blockchainHash: _blockchainHash,
            isVerified: true,
            uploader: msg.sender,
            integrityHash: integrityHash
        });

        emit EvidenceAdded(evidenceId, _fileName, msg.sender);
        return evidenceId;
    }

    function verifyEvidence(
        uint256 _evidenceId,
        string memory _ipfsHash,
        string memory _blockchainHash
    ) public onlyAuthorized returns (bool) {
        require(_evidenceId > 0 && _evidenceId <= totalEvidence, "Invalid evidence ID");
        
        Evidence storage evidence = evidenceRecords[_evidenceId];
        bytes32 currentHash = keccak256(abi.encodePacked(
            evidence.fileName,
            evidence.fileSize,
            evidence.fileType,
            _ipfsHash,
            _blockchainHash,
            evidence.uploadTime,
            evidence.uploader
        ));

        bool isValid = (currentHash == evidence.integrityHash);
        evidence.isVerified = isValid;
        
        emit EvidenceVerified(_evidenceId, isValid);
        return isValid;
    }

    function getEvidenceDetails(uint256 _evidenceId) public view returns (
        string memory fileName,
        uint256 fileSize,
        string memory fileType,
        uint256 uploadTime,
        string memory ipfsHash,
        string memory blockchainHash,
        bool isVerified,
        address uploader,
        bytes32 integrityHash
    ) {
        require(_evidenceId > 0 && _evidenceId <= totalEvidence, "Invalid evidence ID");
        Evidence storage evidence = evidenceRecords[_evidenceId];
        
        return (
            evidence.fileName,
            evidence.fileSize,
            evidence.fileType,
            evidence.uploadTime,
            evidence.ipfsHash,
            evidence.blockchainHash,
            evidence.isVerified,
            evidence.uploader,
            evidence.integrityHash
        );
    }
}
