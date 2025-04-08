import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/', { replace: true });
  };
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-white font-bold text-xl">ForensicChain</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/upload" className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  <FolderIcon className="h-5 w-5 mr-1.5" />
                  Evidence
                </Link>
                <Link to="/verify" className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  <ShieldCheckIcon className="h-5 w-5 mr-1.5" />
                  Verify
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <p className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Welcome!</p>
            </div>
            <div className="border-l border-gray-700 h-6 mx-2"></div>
            <Link to="/profile" className="flex items-center text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              <UserCircleIcon className="h-5 w-5 mr-1.5" />
              Raphan Ben
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
