import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg border border-white/10">
        <h2 className="text-3xl font-display font-bold text-center mb-8">MEMBER ACCESS</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-chuma-gold focus:outline-none"
              placeholder="Enter email (use 'admin@chuma.com' for admin)"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              * Login simulates Firebase Auth. Type <span className="text-white">admin@chuma.com</span> for Admin Dashboard access.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-chuma-orange hover:bg-red-600 text-white font-bold py-3 rounded transition-colors"
          >
            ENTER EXPERIENCE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;