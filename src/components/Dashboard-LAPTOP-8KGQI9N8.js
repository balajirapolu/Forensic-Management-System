import { useState } from 'react';
import { CloudArrowUpIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function Dashboard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsProcessing(true);
    setTimeout(() => {
      setUploadedFiles(prev => [...prev, ...files.map(f => ({
        name: f.name,
        status: 'processed',
        timestamp: new Date().toISOString()
      }))]);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-primary">
      <nav className="bg-secondary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Forensic Blockchain Analysis</h1>
            </div>
            <div className="flex items-center">
              <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-700 rounded-lg p-8">
            <div className="space-y-8">
              {/* Upload Section */}
              <div className="text-center">
                <label className="relative cursor-pointer bg-accent hover:bg-blue-600 text-white py-2 px-4 rounded-lg inline-flex items-center transition-colors">
                  <CloudArrowUpIcon className="h-6 w-6 mr-2" />
                  <span>Upload Forensic Data</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {isProcessing && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  <span className="text-gray-300">Processing data...</span>
                </div>
              )}
              <div className="bg-secondary rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-white mb-4">
                    Uploaded Files
                  </h3>
                  <div className="space-y-4">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
                      >
                        <div className="flex items-center">
                          <DocumentMagnifyingGlassIcon className="h-6 w-6 text-accent mr-3" />
                          <div>
                            <p className="text-sm font-medium text-white">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              Processed on: {new Date(file.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {file.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
