import Web3 from 'web3';
import ForensicEvidence from '../contracts/ForensicEvidence.json';

class BlockchainService {
    constructor() {
        this.web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
        this.contract = null;
        this.initialize();
    }

    async initialize() {
        try {
            const networkId = await this.web3.eth.net.getId();
            const deployedNetwork = ForensicEvidence.networks[networkId];
            
            this.contract = new this.web3.eth.Contract(
                ForensicEvidence.abi,
                deployedNetwork && deployedNetwork.address
            );
        } catch (error) {
            console.error('Failed to initialize blockchain service:', error);
        }
    }

    async addEvidence(fileName, fileSize, fileType, ipfsHash, blockchainHash) {
        try {
            const accounts = await this.web3.eth.getAccounts();
            
            const result = await this.contract.methods.addEvidence(
                fileName,
                fileSize,
                fileType,
                ipfsHash,
                blockchainHash
            ).send({ from: accounts[0] });

            return result;
        } catch (error) {
            console.error('Failed to add evidence:', error);
            throw error;
        }
    }

    async verifyEvidence(evidenceId, currentIpfsHash, currentBlockchainHash) {
        try {
            const isVerified = await this.contract.methods.verifyEvidence(
                evidenceId,
                currentIpfsHash,
                currentBlockchainHash
            ).call();

            return isVerified;
        } catch (error) {
            console.error('Failed to verify evidence:', error);
            throw error;
        }
    }

    async getEvidence(evidenceId) {
        try {
            const evidence = await this.contract.methods.getEvidence(evidenceId).call();
            return {
                fileName: evidence.fileName,
                fileSize: evidence.fileSize,
                fileType: evidence.fileType,
                uploadTime: new Date(evidence.uploadTime * 1000).toLocaleString(),
                ipfsHash: evidence.ipfsHash,
                blockchainHash: evidence.blockchainHash,
                isVerified: evidence.isVerified,
                uploader: evidence.uploader
            };
        } catch (error) {
            console.error('Failed to get evidence:', error);
            throw error;
        }
    }
}

export default new BlockchainService();
