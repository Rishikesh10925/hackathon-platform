import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCheck, ArrowLeft, Send, Briefcase, Mail, Building, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const AddJudge = () => {
  const navigate = useNavigate();
  const [judgeData, setJudgeData] = useState({
    eventId: '',
    fullName: '',
    email: '',
    organization: '',
    expertise: 'Technical',
    linkedIn: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setJudgeData({...judgeData, [e.target.name]: e.target.value});

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!judgeData.eventId) return toast.error("Event ID is required");
    if (!judgeData.fullName) return toast.error("Full Name is required");
    if (!judgeData.email) return toast.error("Email is required");

    setLoading(true);

    try {
      const payload = {
        EventID: judgeData.eventId,
        JudgeName: judgeData.fullName,
        Email: judgeData.email,
        Organization: judgeData.organization,
        Expertise: judgeData.expertise,
        LinkedIn: judgeData.linkedIn
      };

      const response = await toast.promise(
        axios.post('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/addJudge', payload),
        {
          loading: 'Inviting Judge...',
          success: `${judgeData.fullName} invited as Judge! ⚖️`,
          error: 'Error inviting judge'
        }
      );

      console.log('Judge added:', response.data);
      
      // Reset form
      setJudgeData({
        eventId: '',
        fullName: '',
        email: '',
        organization: '',
        expertise: 'Technical',
        linkedIn: ''
      });
      // Optionally navigate
      // navigate('/admin');

    } catch (error) {
      console.error('Failed to add judge:', error);
      if (error.response) {
        // AWS might return the error in .error or .message depending on how the Lambda is coded
        const errorMsg = error.response.data.error || error.response.data.message || 'Failed to add judge';
        toast.error(`Error: ${errorMsg}`);
      } else if (error.request) {
        toast.error('Network Error - Please check your connection or CORS settings.');
      } else {
        toast.error('Failed to prepare request.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Invite Hackathon Judge</h1>
              <p className="text-xs text-slate-500 font-medium">Evaluation Panel Setup</p>
            </div>
          </div>
          <button 
            onClick={handleCreate}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95 ${
              loading 
                ? 'bg-slate-400 cursor-not-allowed text-white shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inviting...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Invite
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">Judge Profile & Assignment</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Key className="w-4 h-4 inline mr-1 text-slate-400"/> Event Assignment (ID)</label>
              <input type="text" name="eventId" value={judgeData.eventId} onChange={handleChange}
                placeholder="e.g., EVT-2026-X" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input type="text" name="fullName" value={judgeData.fullName} onChange={handleChange}
                placeholder="Dr. Jane Doe" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Mail className="w-4 h-4 inline mr-1 text-slate-400"/> Professional Email</label>
              <input type="email" name="email" value={judgeData.email} onChange={handleChange}
                placeholder="jane@company.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Building className="w-4 h-4 inline mr-1 text-slate-400"/> Organization / Company</label>
              <input type="text" name="organization" value={judgeData.organization} onChange={handleChange}
                placeholder="CloudCorp Inc." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Briefcase className="w-4 h-4 inline mr-1 text-slate-400"/> Primary Expertise Area</label>
              <select name="expertise" value={judgeData.expertise} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:cursor-pointer">
                <option value="Technical">Technical & Architecture</option>
                <option value="Design">UI/UX & Design</option>
                <option value="Business">Business & Product</option>
                <option value="Innovation">Innovation & Research</option>
                <option value="General">General / All-rounder</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">LinkedIn Profile (Optional)</label>
              <input type="url" name="linkedIn" value={judgeData.linkedIn} onChange={handleChange}
                placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 leading-relaxed">
              Once registered, the system will instantly dispatch a secure, one-time authentication link to the judge's email, granting them access to the Judge Dashboard mapped specifically to your configured event evaluation criteria.
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AddJudge;
