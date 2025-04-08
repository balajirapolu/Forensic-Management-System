import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function AuditLog() {
  const [verifiedFiles, setVerifiedFiles] = useState([]);

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem('forensic_files') || '[]');
    const verified = files
      .filter(file => file.integrityStatus === 'valid')
      .sort((a, b) => new Date(b.lastVerified) - new Date(a.lastVerified));
    
    setVerifiedFiles(verified);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Audit Log</h1>
          <p className="text-gray-400">History of verified forensic evidence files</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Verified Files</h2>
          </div>
          
          <div className="divide-y divide-gray-700">
            {verifiedFiles.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-500" />
                <p className="mt-2 text-gray-400">No verified files found</p>
              </div>
            ) : (
              verifiedFiles.map((file, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <DocumentTextIcon className="h-8 w-8 text-blue-400" />
                      <div>
                        <h3 className="text-lg font-medium text-white">{file.fileName}</h3>
                        <div className="mt-1 flex items-center space-x-4">
                          <span className="flex items-center text-sm text-gray-400">
                            <CheckCircleIcon className="h-4 w-4 text-green-400 mr-1" />
                            Verified
                          </span>
                          <span className="flex items-center text-sm text-gray-400">
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                            {new Date(file.lastVerified).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/file/${file.id}`}
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Size: {(file.fileSize / 1024).toFixed(2)} KB</span>
                      <span>Type: {file.fileType}</span>
                      <span>IPFS Hash: {file.ipfsHash.substring(0, 8)}...</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
