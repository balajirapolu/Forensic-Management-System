import { uploadToIPFS, createBlockchainHash, downloadFromIPFS } from '../utils/crypto';
const STORAGE_KEY = 'forensic_files';

const getStoredFiles = () => {
  try {
    const files = localStorage.getItem(STORAGE_KEY);
    return files ? JSON.parse(files) : [];
  } catch (error) {
    console.error('Error reading from storage:', error);
    return [];
  }
};

const saveFileMetadata = (fileData) => {
  try {
    const files = getStoredFiles();
    files.push(fileData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw new Error('Failed to save file metadata');
  }
};
const createProgressTracker = (onProgress) => {
  return (progress) => {
    if (onProgress && typeof onProgress === 'function') {
      onProgress(Math.min(100, Math.round(progress)));
    }
  };
};

export const uploadFile = async (file, userId, onProgress) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }

    const progressTracker = createProgressTracker(onProgress);
    const ipfsData = await uploadToIPFS(file, progressTracker);
    const timestamp = Date.now();
    const blockchainHash = await createBlockchainHash(ipfsData, timestamp, {
      userId,
      fileSize: file.size,
      lastModified: file.lastModified
    });
    const fileMetadata = {
      id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      fileName: file.name,
      ipfsHash: ipfsData.cid,
      blockchainHash,
      timestamp,
      fileSize: file.size,
      fileType: file.type,
      encryptionKey: ipfsData.secretKey,
      lastModified: file.lastModified,
      chunkCount: ipfsData.chunkCount,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    saveFileMetadata(fileMetadata);

    progressTracker(100);
    return {
      ipfsHash: ipfsData.cid,
      blockchainHash,
      fileId: fileMetadata.id,
      error: null
    };
  } catch (error) {
    console.error('File upload error:', error);
    return { 
      error: error.message || 'Failed to upload file',
      ipfsHash: null,
      blockchainHash: null
    };
  }
};

export const getFiles = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const files = getStoredFiles()
      .filter(file => file.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);

    return { 
      files, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching files:', error);
    return { 
      files: null, 
      error: error.message || 'Failed to fetch files'
    };
  }
};

export const downloadFile = async (fileId, userId, onProgress) => {
  try {
    if (!fileId || !userId) {
      throw new Error('File ID and User ID are required');
    }

    const progressTracker = createProgressTracker(onProgress);
    progressTracker(0);
    const files = getStoredFiles();
    const fileData = files.find(f => f.id === fileId && f.userId === userId);

    if (!fileData) {
      throw new Error('File not found');
    }

    if (fileData.status !== 'completed') {
      throw new Error(`File upload status: ${fileData.status}`);
    }

    progressTracker(20);
    const decryptedContent = await downloadFromIPFS(fileData.ipfsHash, fileData.encryptionKey, progressTracker);

    progressTracker(80);
    const blob = new Blob([decryptedContent], { type: fileData.fileType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileData.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    progressTracker(100);
    return { error: null };
  } catch (error) {
    console.error('File download error:', error);
    return {
      error: error.message || 'Failed to download file'
    };
  }
};

export const verifyFileIntegrity = async (fileId, userId) => {
  try {
    if (!fileId || !userId) {
      throw new Error('File ID and User ID are required');
    }
    const files = getStoredFiles();
    const fileData = files.find(f => f.id === fileId && f.userId === userId);

    if (!fileData) {
      throw new Error('File not found');
    }

    if (fileData.status !== 'completed') {
      throw new Error(`File upload status: ${fileData.status}`);
    }
    const currentHash = await createBlockchainHash(
      {
        cid: fileData.ipfsHash,
        originalName: fileData.fileName,
        mimeType: fileData.fileType,
        chunkCount: fileData.chunkCount
      },
      fileData.timestamp,
      {
        userId: fileData.userId,
        fileSize: fileData.fileSize,
        lastModified: fileData.lastModified
      }
    );
    const isIntegrityValid = currentHash === fileData.blockchainHash;
    const updatedFiles = files.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          lastVerified: new Date().toISOString(),
          integrityStatus: isIntegrityValid ? 'valid' : 'tampered'
        };
      }
      return f;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles));

    return {
      isValid: isIntegrityValid,
      error: null,
      details: {
        originalHash: fileData.blockchainHash,
        currentHash,
        timestamp: fileData.timestamp,
        lastVerified: new Date().toISOString(),
        fileSize: fileData.fileSize,
        chunkCount: fileData.chunkCount
      }
    };
  } catch (error) {
    console.error('Integrity verification error:', error);
    return {
      isValid: false,
      error: error.message || 'Failed to verify file integrity',
      details: null
    };
  }
};
