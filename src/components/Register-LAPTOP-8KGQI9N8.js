import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    userType: 'forensic_expert',
    username: '',
    password: '',
    address: '',
    mobile: '',
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-accent">Register Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">User Type</label>
            <select
              className="w-full p-2 rounded bg-primary border border-gray-600 focus:border-accent focus:ring-1 focus:ring-accent"
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
            >
              <option value="forensic_expert">Forensic Expert</option>
              <option value="investigator">Investigator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-primary border border-gray-600 focus:border-accent focus:ring-1 focus:ring-accent"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-primary border border-gray-600 focus:border-accent focus:ring-1 focus:ring-accent"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              className="w-full p-2 rounded bg-primary border border-gray-600 focus:border-accent focus:ring-1 focus:ring-accent"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile</label>
            <input
              type="tel"
              className="w-full p-2 rounded bg-primary border border-gray-600 focus:border-accent focus:ring-1 focus:ring-accent"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
          <div className="text-center mt-4">
            <Link to="/login" className="text-accent hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
