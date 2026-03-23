import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CalendarDays, Users, LogOut, Plus, Trophy, BrainCircuit, Search, ChevronRight, Gavel, Loader2, Copy, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const ManageEvents = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/getEvents');
        if (response.data && response.data.events) {
          setEvents(response.data.events);
        } else if (Array.isArray(response.data)) {
          setEvents(response.data);
        }
      } catch (err) {
        console.error("AWS API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Event ID copied to clipboard!');
  };

  const filteredEvents = events.filter(e => 
    (e.name || e.EventName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.id || e.EventID || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-10 shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">HackAdmin</h1>
            <p className="text-xs text-slate-400 font-medium">{user?.email || 'Institute Portal'}</p>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600/10 text-blue-400 font-semibold transition-colors border border-blue-500/20">
                <CalendarDays className="w-5 h-5" /> Manage Events
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/leaderboard')} className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <Trophy className="w-5 h-5" /> Global Leaderboard
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-lg transition-colors font-medium border border-red-500/20">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
        <header className="px-8 py-10 border-b border-slate-200 bg-white sticky top-0 z-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Event Management</h2>
              <p className="text-slate-500 mt-2">View, search, and configure your hackathon environments</p>
            </div>
            <button onClick={() => navigate('/create-event')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
              <Plus className="w-5 h-5" /> Create New Event
            </button>
          </motion.div>
        </header>

        <div className="p-8">
          {/* Search Bar */}
          <div className="mb-6 relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by event name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
              <p>Fetching events from AWS...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No events found</h3>
              <p className="text-slate-500 mt-1">Try a different search or create a new event.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredEvents.map((event, i) => {
                const eventId = event.id || event.EventID;
                const eventName = event.name || event.EventName;
                const createdAt = event.CreatedAt ? new Date(event.CreatedAt).toLocaleDateString() : 'Unknown';

                return (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={eventId || i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{eventName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">ID: {eventId}</span>
                          <button onClick={() => copyToClipboard(eventId)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Copy Event ID">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 font-medium mb-1">Created On</p>
                        <p className="text-sm font-semibold text-slate-800">{createdAt}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <p className="text-xs text-slate-500 font-medium mb-1">Quick Action</p>
                         <button onClick={() => navigate('/add-team')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                           + Register Teams
                         </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                       <button onClick={() => navigate('/leaderboard?eventId=' + eventId)} className="flex-1 flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                          View Leaderboard
                       </button>
                       <button className="p-2.5 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-lg transition-colors" title="Edit Event (Coming soon)">
                         <Edit className="w-4 h-4" />
                       </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageEvents;
