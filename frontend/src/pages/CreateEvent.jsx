import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Trash2, Save, ArrowLeft, Calendar, Users, Target, CheckCircle2, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Advanced State Management for highly customized events
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxTeamSize: 4,
    numberOfRounds: 1,
  });

  // Dynamic Array States
  const [criteria, setCriteria] = useState([
    { id: 1, name: 'Innovation', maxScore: 10 },
    { id: 2, name: 'Technical Implementation', maxScore: 10 },
    { id: 3, name: 'Business Impact', maxScore: 10 }
  ]);

  const [prizes, setPrizes] = useState([
    { id: 1, title: '1st Place', reward: '$1000' }
  ]);

  const addCriteria = () => {
    setCriteria([...criteria, { id: Date.now(), name: '', maxScore: 10 }]);
  };

  const removeCriteria = (id) => {
    if (criteria.length === 1) return toast.error("You must have at least one criteria");
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriteria = (id, field, value) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addPrize = () => {
    setPrizes([...prizes, { id: Date.now(), title: '', reward: '' }]);
  };

  const removePrize = (id) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const updatePrize = (id, field, value) => {
    setPrizes(prizes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!eventData.name) return toast.error("Event Name is required");
    if (criteria.some(c => !c.name)) return toast.error("All criteria must have a name");

    setLoading(true);
    const toastId = toast.loading('Creating event...');

    const payload = {
      EventName: eventData.name,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      maxTeamSize: eventData.maxTeamSize,
      numberOfRounds: eventData.numberOfRounds,
      evaluationCriteria: criteria,
      prizes: prizes
    };
    
    try {
      // API Endpoint for creating event
      const API_URL = 'https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/createEvent';

      const response = await axios.post(API_URL, payload);

      console.log('API Response:', response.data);
      toast.success('Event created successfully!', { id: toastId, icon: '🚀' });
      navigate('/admin');
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to create event: ${errorMessage}`, { id: toastId, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Configure Hackathon</h1>
              <p className="text-xs text-slate-500 font-medium">Advanced Event Setup Studio</p>
            </div>
          </div>
          <button 
            onClick={handleCreate}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md shadow-blue-500/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> {loading ? 'Creating...' : 'Save Event'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8 space-y-8">
        
        {/* General Info Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">General Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Event Name</label>
              <input type="text" value={eventData.name} onChange={(e) => setEventData({...eventData, name: e.target.value})}
                placeholder="e.g., Global FinTech Summit 2026" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description / Theme Focus</label>
              <textarea rows="3" value={eventData.description} onChange={(e) => setEventData({...eventData, description: e.target.value})}
                placeholder="Briefly describe the hackathon rules and objectives..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Calendar className="w-4 h-4 inline mr-1 text-slate-400"/> Start Date</label>
              <input type="date" value={eventData.startDate} onChange={(e) => setEventData({...eventData, startDate: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><Calendar className="w-4 h-4 inline mr-1 text-slate-400"/> End Date</label>
              <input type="date" value={eventData.endDate} onChange={(e) => setEventData({...eventData, endDate: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" />
            </div>
          </div>
        </motion.section>

        {/* Structural Rules Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Event Structure & Rules</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Max Team Size</label>
              <input type="number" min="1" max="20" value={eventData.maxTeamSize} onChange={(e) => setEventData({...eventData, maxTeamSize: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Number of Rounds / Phases</label>
              <select value={eventData.numberOfRounds} onChange={(e) => setEventData({...eventData, numberOfRounds: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <option value="1">1 Round (Direct Judging)</option>
                <option value="2">2 Rounds (Qualifier & Final)</option>
                <option value="3">3 Rounds (Ideation, Prototype, Final)</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* Evaluation Criteria Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-800">Custom Evaluation Criteria</h2>
            </div>
            <button onClick={addCriteria} className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> Add Parameter
            </button>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {criteria.map((c, index) => (
                <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                  <div className="bg-white border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-400 text-sm shadow-sm">{index + 1}</div>
                  
                  <div className="flex-1">
                    <input type="text" placeholder="Criteria Name (e.g. Design, Scalability)" value={c.name} onChange={(e) => updateCriteria(c.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-purple-500 outline-none" />
                  </div>
                  
                  <div className="w-32">
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 text-sm font-medium">Max:</span>
                      <input type="number" value={c.maxScore} onChange={(e) => updateCriteria(c.id, 'maxScore', e.target.value)}
                        className="w-full pl-12 pr-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                  </div>

                  <button onClick={() => removeCriteria(c.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="bg-purple-50 text-purple-700 p-4 rounded-xl flex items-start gap-3 mt-4 text-sm font-medium border border-purple-100">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>Judges will use these exact customized parameters to review teams. Total maximum baseline score across all parameters currently equals: {criteria.reduce((sum, c) => sum + Number(c.maxScore), 0)} points.</p>
            </div>
          </div>
        </motion.section>

        {/* Prizes Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-slate-800">Prize Configuration (Optional)</h2>
            </div>
            <button onClick={addPrize} className="text-sm font-semibold text-yellow-600 hover:text-yellow-800 bg-yellow-50 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> Add Prize
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {prizes.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex gap-4">
                  <input type="text" placeholder="Title (e.g. Grand Winner)" value={p.title} onChange={(e) => updatePrize(p.id, 'title', e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
                  <input type="text" placeholder="Reward (e.g. $5000 + Cloud Credits)" value={p.reward} onChange={(e) => updatePrize(p.id, 'reward', e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
                  <button onClick={() => removePrize(p.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-colors">
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

export default CreateEvent;
