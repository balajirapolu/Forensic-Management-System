
import React, { useState, useEffect } from 'react';
import {
  CloudArrowUpIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import blockchainService from '../services/blockchainService';

export default function Dashboard() {
    const [evidenceList, setEvidenceList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvidenceData();
    }, []);

    const loadEvidenceData = async () => {
        try {
            setLoading(true);
            const totalEvidence = await blockchainService.contract.methods.totalEvidence().call();
            const evidencePromises = [];
            for (let i = 1; i <= totalEvidence; i++) {
                evidencePromises.push(blockchainService.getEvidence(i));
            }
            
            const evidence = await Promise.all(evidencePromises);
            setEvidenceList(evidence);
        } catch (error) {
            console.error('Error loading evidence:', error);
        } finally {
            setLoading(false);
        }
    };
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Forensic Data Management</h1>
          <p className="text-gray-600 mb-4">Secure blockchain-based evidence system</p>
          <div className="max-w-2xl mx-auto mb-8">
            <img
              src="/forensic-data.png"
              alt="Forensic Data Management Illustration"
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link to="/upload" className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-all hover:bg-blue-50 hover:border-blue-500 border-2 border-transparent">
            <div className="flex items-center">
              <CloudArrowUpIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Evidence</h3>
              </div>
            </div>
          </Link>

          <Link to="/verify" className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-all hover:bg-green-50 hover:border-green-500 border-2 border-transparent">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Verify Integrity</h3>
              </div>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evidence Files</p>
                <h3 className="text-lg font-semibold text-gray-900">{evidenceList.length}</h3>
              </div>
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blockchain Entries</p>
                <h3 className="text-lg font-semibold text-gray-900">{evidenceList.length}</h3>
              </div>
              <LockClosedIcon className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
