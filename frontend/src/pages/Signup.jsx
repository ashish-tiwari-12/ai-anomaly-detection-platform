import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="glass p-8 rounded-2xl w-full max-w-md shadow-2xl transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-primary/20 rounded-full">
            <Activity className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Create Account</h2>
        <p className="text-center text-gray-400 mb-8">Join the AI Anomaly Detection Platform</p>
        
        {error && <div className="bg-danger/20 border border-danger/50 text-danger-300 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-slate-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary hover:bg-primaryHover text-white font-semibold rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:text-white transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
