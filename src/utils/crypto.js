import CryptoJS from 'crypto-js';
import { Web3Storage } from 'web3.storage';
import { keccak256, toUtf8Bytes } from 'ethers';

const getClient = () => {
  if (!process.env.REACT_APP_WEB3STORAGE_TOKEN) {
    throw new Error('Web3.Storage token is not configured');
  }
  return new Web3Storage({ token: process.env.REACT_APP_WEB3STORAGE_TOKEN });
};
export const encryptData = (data, secretKey) => {
  try {
    const dataToEncrypt = typeof data === 'string' 
      ? CryptoJS.enc.Utf8.parse(data)
      : data;
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, secretKey, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    const combined = iv.concat(encrypted.ciphertext);
    return combined.toString(CryptoJS.enc.Base64);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};
export const decryptData = (encryptedData, secretKey) => {
  try {
    const combined = CryptoJS.enc.Base64.parse(encryptedData);
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
    const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      secretKey,
      {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};
export const uploadToIPFS = async (file, onProgress) => {
  try {
    const client = getClient();
    const secretKey = CryptoJS.lib.WordArray.random(256 / 8).toString();
    const fileContent = await file.text();
    const encryptedContent = encryptData(fileContent, secretKey);
    const encryptedFile = new File(
      [encryptedContent],
      `${file.name}.encrypted`,
      { type: 'text/plain' }
    );

    if (onProgress) onProgress(50);
    const cid = await client.put([encryptedFile]);
    if (onProgress) onProgress(100);
    
    return {
      cid,
      secretKey,
      originalName: file.name,
      mimeType: file.type
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};
export const createBlockchainHash = async (ipfsData, timestamp, metadata) => {
  try {
    const dataToHash = JSON.stringify({
      version: '1.0',
      ipfsHash: ipfsData.cid,
      timestamp,
      fileName: ipfsData.originalName,
      fileType: ipfsData.mimeType,
      chunkCount: ipfsData.chunkCount,
      ...metadata
    });
    
    return keccak256(toUtf8Bytes(dataToHash));
  } catch (error) {
    console.error('Error creating blockchain hash:', error);
    throw new Error('Failed to create blockchain hash');
  }
};
export const downloadFromIPFS = async (cid, secretKey, onProgress) => {
  try {
    const client = getClient();
    if (onProgress) onProgress(25);
    const response = await client.get(cid);
    if (!response) {
      throw new Error('File not found on IPFS');
    }

    if (onProgress) onProgress(50);
    const files = await response.files();
    if (files.length === 0) {
      throw new Error('No files found in the response');
    }

    const file = files[0];
    if (onProgress) onProgress(75);
    const content = await file.text();
    const decryptedContent = decryptData(content, secretKey);
    if (onProgress) onProgress(100);

    return decryptedContent;
  } catch (error) {
    console.error('Error downloading from IPFS:', error);
    throw new Error('Failed to download file from IPFS');
  }
};
