import sys

path = r'e:\Vcc\frontend\src\pages\AdminDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Swap dummy state out for a useEffect
import_code = '''import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CalendarDays, Users, LogOut, Plus, Trophy, BrainCircuit, Activity, ChevronRight, Gavel, BarChart3, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';'''

text = re.sub(r'import React.*?\nimport \{ useNavigate.*?\nimport \{ useAuth.*?\nimport \{ LayoutDashboard.*?\nimport \{ motion \} from \'framer-motion\';', import_code, text, flags=re.MULTILINE|re.DOTALL)

# Add real time fetch
component_top = '''const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Real-time AWS Backend Fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/getEvents');
        if (response.data && response.data.events) {
          setEvents(response.data.events);
        }
      } catch (err) {
        console.error("No events API found or failed fetch. Defaulting to empty.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const metricCards = [
    { title: "Total Events", value: events.length || 0, icon: <CalendarDays className="w-6 h-6 text-blue-500" />, bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Active Teams", value: events.reduce((acc, ev) => acc + (ev.teams || 0), 0), icon: <Users className="w-6 h-6 text-emerald-500" />, bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Registered Judges", value: events.reduce((acc, ev) => acc + (ev.judges || 0), 0), icon: <Gavel className="w-6 h-6 text-purple-500" />, bg: "bg-purple-500/10", border: "border-purple-500/20" }
  ];'''

text = re.sub(r'const AdminDashboard = \(\) => \{[\s\S]*?\]\);', component_top, text)

# Rewrite the main return block to use new metrics and advanced UI
main_ui_regex = r'<main className="flex-1 overflow-y-auto">\s*<header[\s\S]*</main>'

main_ui_new = '''<main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent -z-10 pointer-events-none" />
        
        <header className="px-8 py-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Overview</h2>
              <p className="text-slate-500 mt-2 text-lg">Real-time metrics and system controls</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => navigate('/add-judge')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 shadow-sm transition-all">
                <Users className="w-5 h-5" /> Add Judge
              </button>
              <button onClick={() => navigate('/add-team')} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-100 shadow-sm transition-all">
                <Users className="w-5 h-5" /> Add Team
              </button>
              <button onClick={() => navigate('/create-event')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                <Plus className="w-5 h-5" /> Create Event
              </button>
            </div>
          </motion.div>
        </header>

        <div className="px-8 pb-12 space-y-8">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metricCards.map((m, i) => (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-slate-500 font-medium">{m.title}</p>
                  <h3 className="text-4xl font-bold text-slate-900 mt-2">{m.value}</h3>
                </div>
                <div className={p-4 rounded-xl   border relative z-10}>
                  {m.icon}
                </div>
                <div className={bsolute -right-6 -bottom-6 w-24 h-24  rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500} />
              </motion.div>
            ))}
          </div>

          {/* Real-time Data Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-bold text-slate-900">Active Events Network</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> LIVE
              </span>
            </div>
            
            <div className="p-0">
              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                  <p>Syncing with AWS DynamoDB...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4">
                    <CalendarDays className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700">No active events found.</h4>
                  <p className="text-slate-500 mt-1 max-w-sm mx-auto">Click "Create Event" to push a new hackathon tracking table to AWS DynamoDB.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                      <th className="py-4 px-6 font-semibold">Event ID</th>
                      <th className="py-4 px-6 font-semibold">Event Name</th>
                      <th className="py-4 px-6 font-semibold">Teams Registered</th>
                      <th className="py-4 px-6 font-semibold">Assigned Judges</th>
                      <th className="py-4 px-6 font-semibold">Database Status</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map((event, i) => (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} key={event.id || i} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-4 px-6 font-mono text-sm font-medium text-slate-600">{event.id}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900">{event.name}</td>
                        <td className="py-4 px-6 text-slate-600 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> {event.teams || 0}</td>
                        <td className="py-4 px-6 text-slate-600">{event.judges || 0} Judges</td>
                        <td className="py-4 px-6">
                           <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Synced
                           </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => navigate('/leaderboard')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>'''

text = re.sub(main_ui_regex, main_ui_new, text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Admin patched")
