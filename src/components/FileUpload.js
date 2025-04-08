import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Web3Storage } from 'web3.storage';
import ForensicEvidence from '../contracts/ForensicEvidence.json';
import FileList from './FileList';

// Initialize Web3.Storage client
const getWeb3Storage = () => {
  if (!process.env.REACT_APP_WEB3STORAGE_TOKEN) {
    throw new Error('Web3.Storage token not found in environment variables');
  }
  return new Web3Storage({ token: process.env.REACT_APP_WEB3STORAGE_TOKEN });
};

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  // Initialize Web3 and contract
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = ForensicEvidence.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            ForensicEvidence.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error('Error initializing Web3:', error);
          setError('Failed to connect to blockchain. Please make sure MetaMask is installed and connected.');
        }
      } else {
        setError('Please install MetaMask to use this application.');
      }
    };
    initWeb3();
  }, []);

  // Load uploaded files from blockchain
  useEffect(() => {
    const loadFiles = async () => {
      if (!contract || !account) return;

      try {
        const totalEvidence = await contract.methods.totalEvidence().call();
        const files = [];
        
        for (let i = 1; i <= totalEvidence; i++) {
          const evidence = await contract.methods.getEvidenceDetails(i).call();
          if (evidence.uploader.toLowerCase() === account.toLowerCase()) {
            files.push({
              id: i,
              name: evidence.fileName,
              size: web3.utils.fromWei(evidence.fileSize, 'ether'),
              type: evidence.fileType,
              uploadTime: new Date(parseInt(evidence.uploadTime) * 1000).toLocaleString(),
              ipfsHash: evidence.ipfsHash,
              blockchainHash: evidence.blockchainHash,
              verified: evidence.isVerified
            });
          }
        }
        setUploadedFiles(files);
      } catch (error) {
        console.error('Error loading files:', error);
        setError('Failed to load uploaded files');
      }
    };

    loadFiles();
  }, [contract, account, web3]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setError(null);
      setSelectedFile(file);
    }
  };

  const generateUniqueHash = async (file, timestamp) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return web3.utils.keccak256(
      web3.utils.encodePacked(
        hashHex,
        timestamp.toString(),
        account
      )
    );
  };

  const handleUpload = async () => {
    if (!selectedFile || !contract || !account) return;

    setIsLoading(true);
    setError(null);

    try {
      // Upload to IPFS
      let ipfsHash;
      try {
        // Get Web3.Storage client
        const client = getWeb3Storage();
        
        // Create File object with proper name
        const file = new File([selectedFile], selectedFile.name, { type: selectedFile.type });
        
        // Upload file to Web3.Storage
        const cid = await client.put([file], {
          name: selectedFile.name,
          maxRetries: 3
        });
        
        ipfsHash = cid;
        console.log('File uploaded to IPFS:', ipfsHash);
      } catch (ipfsError) {
        console.error('IPFS upload failed:', ipfsError);
        throw new Error('Failed to upload to IPFS. Please try again later.');
      }

      // Generate unique blockchain hash
      const timestamp = Math.floor(Date.now() / 1000);
      const blockchainHash = await generateUniqueHash(selectedFile, timestamp);

      // Add to blockchain
      await contract.methods.addEvidence(
        selectedFile.name,
        web3.utils.toWei(String(selectedFile.size / (1024 * 1024)), 'ether'),
        selectedFile.type,
        ipfsHash,
        blockchainHash
      ).send({ from: account });

      // Update UI
      const totalEvidence = await contract.methods.totalEvidence().call();
      const evidence = await contract.methods.getEvidenceDetails(totalEvidence).call();
      
      setUploadedFiles(prev => [...prev, {
        id: totalEvidence,
        name: evidence.fileName,
        size: web3.utils.fromWei(evidence.fileSize, 'ether'),
        type: evidence.fileType,
        uploadTime: new Date(parseInt(evidence.uploadTime) * 1000).toLocaleString(),
        ipfsHash: evidence.ipfsHash,
        blockchainHash: evidence.blockchainHash,
        verified: evidence.isVerified
      }]);

      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-2">Upload Forensic Data</h2>
          <p className="text-gray-500 mb-6">Only text files will be encrypted and stored securely</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center space-y-4">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isLoading}
                accept=".txt,.log,.md,.csv,.json,.xml"
              />
              <span className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block">
                Select Text File
              </span>
            </label>

            {selectedFile && (
              <div className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </div>
            )}

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={`bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Uploading...' : 'Upload File'}
              </button>
            )}
          </div>
        </div>
      </div>

      <FileList files={uploadedFiles} />
    </div>
  );
}

export default FileUpload;