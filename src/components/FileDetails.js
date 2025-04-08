import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Web3 from 'web3';
import ForensicEvidence from '../contracts/ForensicEvidence.json';

function FileDetails() {
  const { id } = useParams();
  const [fileDetails, setFileDetails] = React.useState(null);
  const [verifying, setVerifying] = React.useState(false);
  const [contract, setContract] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);

  React.useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
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
        }
      }
    };
    initWeb3();
  }, []);

  React.useEffect(() => {
    const fetchFileDetails = async () => {
      if (!contract || !web3) return;

      try {
        const evidence = await contract.methods.getEvidenceDetails(id).call();
        const timestamp = new Date(parseInt(evidence.uploadTime) * 1000);
        
        setFileDetails({
          name: evidence.fileName,
          size: web3.utils.fromWei(evidence.fileSize, 'ether') + ' MB',
          type: evidence.fileType,
          uploadTime: timestamp.toLocaleString(),
          ipfsHash: evidence.ipfsHash,
          blockchainHash: evidence.blockchainHash,
          verified: evidence.isVerified,
          integrityHash: evidence.integrityHash
        });
      } catch (error) {
        console.error('Error fetching file details:', error);
      }
    };

    if (id) {
      fetchFileDetails();
    }
  }, [contract, web3, id]);

  const handleVerifyIntegrity = async () => {
    if (!contract || !web3) return;

    setVerifying(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods
        .verifyEvidence(id, fileDetails.ipfsHash, fileDetails.blockchainHash)
        .send({ from: accounts[0] });
      
      // Refresh file details after verification
      const evidence = await contract.methods.getEvidenceDetails(id).call();
      setFileDetails(prev => ({ ...prev, verified: evidence.isVerified }));
    } catch (error) {
      console.error('Error verifying integrity:', error);
    } finally {
      setVerifying(false);
    }
  };

  if (!fileDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-blue-500 hover:text-blue-600 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          File Details
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="text-gray-600">File name</div>
            <div className="col-span-2 font-medium">{fileDetails.name}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="text-gray-600">File size</div>
            <div className="col-span-2 font-medium">{fileDetails.size}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="text-gray-600">File type</div>
            <div className="col-span-2 font-medium">{fileDetails.type}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="text-gray-600">Upload time</div>
            <div className="col-span-2 font-medium">{fileDetails.uploadTime}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="text-gray-600">IPFS Hash</div>
            <div className="col-span-2 font-mono text-sm">{fileDetails.ipfsHash}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-3 border-b">
            <div className="text-gray-600">Blockchain Hash</div>
            <div className="col-span-2 font-mono text-sm">{fileDetails.blockchainHash}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-3">
            <div className="text-gray-600">Integrity Status</div>
            <div className="col-span-2 flex items-center">
              {fileDetails.verified ? (
                <span className="text-green-500 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="text-gray-500 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Not verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleVerifyIntegrity}
            disabled={verifying || fileDetails.verified}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg ${
              verifying || fileDetails.verified
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
          >
            {verifying ? 'Verifying...' : 'Verify Integrity'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileDetails;
