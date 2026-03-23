import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, ArrowLeft, Send, Link as LinkIcon, Code2, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddTeam = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [eventId, setEventId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [techStack, setTechStack] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [members, setMembers] = useState([
    { id: 1, name: '', role: 'Lead Developer' }
  ]);

  const addMember = () => {
    if (members.length >= 6) return toast.error("Maximum 6 members allowed");
    setMembers([...members, { id: Date.now(), name: '', role: 'Developer' }]);
  };

  const removeMember = (id) => {
    if (members.length === 1) return toast.error("A team must have at least one member");
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMember = (id, field, value) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!eventId.trim()) return toast.error("Event ID is required");
    if (!teamName.trim()) return toast.error("Team Name is required");
    if (members.some(m => !m.name.trim())) return toast.error("All members must have a name");

    setLoading(true);
    const toastId = toast.loading('Registering team...');

    try {
      const API_URL = 'https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/addTeam';

      await axios.post(API_URL, {
        EventID: eventId,
        TeamName: teamName,
        ProjectTitle: projectTitle,
        TechStack: techStack,
        RepoLink: repoLink,
        Members: members
      });

      toast.success(`${teamName} registered successfully!`, { id: toastId, icon: '🤝' });
      navigate('/admin');
    } catch (error) {
      console.error('Error adding team:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to register team: ${errorMessage}`, { id: toastId, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Register Hackathon Team</h1>
              <p className="text-xs text-slate-500 font-medium">Hacker Registration Portal</p>
            </div>
          </div>
          <button 
            onClick={handleCreate}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md shadow-emerald-500/30 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" /> {loading ? 'Registering...' : 'Finalize Registration'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Project Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event ID</label>
              <input type="text" value={eventId} onChange={(e) => setEventId(e.target.value)}
                placeholder="e.g., EVT-2026-X" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Team Identity</label>
              <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Quantum Coders" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title</label>
              <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g., AI Medical Assistant" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Code2 className="w-4 h-4 inline mr-1 text-slate-400"/> Tech Stack</label>
              <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)}
                placeholder="React, Node, AWS" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><LinkIcon className="w-4 h-4 inline mr-1 text-slate-400"/> Repository / Pitch Link</label>
              <input type="url" value={repoLink} onChange={(e) => setRepoLink(e.target.value)}
                placeholder="https://github.com/..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Hacker Roster ({members.length}/6)</h2>
            </div>
            <button onClick={addMember} className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {members.map((m, index) => (
                <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                  <div className="bg-white border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-400 text-sm shadow-sm">{index + 1}</div>
                  
                  <div className="flex-1">
                    <input type="text" placeholder="Hacker Name" value={m.name} onChange={(e) => updateMember(m.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  
                  <div className="w-48">
                    <select value={m.role} onChange={(e) => updateMember(m.id, 'role', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none hover:cursor-pointer text-slate-700">
                      <option value="Lead Developer">Lead Developer</option>
                      <option value="Developer">Developer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Data Scientist">Data Scientist</option>
                    </select>
                  </div>

                  <button onClick={() => removeMember(m.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default AddTeam;
