import React from 'react';
import { Link } from 'react-router-dom';

function FileList({ files }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">Uploaded Files</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Upload Time</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">IPFS Hash</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Blockchain Hash</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="text-gray-600 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-500">{parseFloat(file.size).toFixed(2)} MB</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-500">{file.type}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-500">{file.uploadTime}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-mono text-gray-500" title={file.ipfsHash}>
                    {file.ipfsHash ? `${file.ipfsHash.substring(0, 6)}...${file.ipfsHash.substring(file.ipfsHash.length - 4)}` : '-'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-mono text-gray-500" title={file.blockchainHash}>
                    {file.blockchainHash ? `${file.blockchainHash.substring(0, 6)}...${file.blockchainHash.substring(file.blockchainHash.length - 4)}` : '-'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {file.verified ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/file/${file.id}`}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Total Files</h3>
          <p className="text-2xl font-bold mt-2">{files.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Storage Used</h3>
          <p className="text-2xl font-bold mt-2">
            {(files.reduce((acc, file) => acc + parseFloat(file.size), 0)).toFixed(2)} MB
          </p>
        </div>
      </div>
    </div>
  );
}

export default FileList;
