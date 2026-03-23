import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    toast.success(`Successfully logged in as ${role.toUpperCase()}`, {
      icon: '🚀',
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
    login(role, email);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-center text-slate-800 mb-2">HackSystem</h1>
        <p className="text-center text-slate-500 mb-8">Secure Access Portal</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="bg-slate-50 p-2 rounded-lg flex border border-slate-200">
            <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer py-2 rounded-md transition-all ${role === 'admin' ? 'bg-white shadow-sm border border-slate-200 text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}>
              <input type="radio" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="hidden" />
              <Shield className="w-4 h-4" /> Admin
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer py-2 rounded-md transition-all ${role === 'judge' ? 'bg-white shadow-sm border border-slate-200 text-purple-600 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}>
              <input type="radio" value="judge" checked={role === 'judge'} onChange={() => setRole('judge')} className="hidden" />
              <User className="w-4 h-4" /> Judge
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email / UserId</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@institute.edu" required
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input type="password" placeholder="••••••••" required
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            Authenticate Access
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
