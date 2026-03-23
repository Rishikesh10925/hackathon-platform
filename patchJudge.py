import sys
import re

path = r'e:\Vcc\frontend\src\pages\JudgeDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import_code = '''import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckCircle2, CircleDashed, Users, Presentation, Search, Star, Activity, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const JudgeDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [scoringTeam, setScoringTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Real-time synchronization
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setPageLoading(true);
        // Replace with your real getTeams/Assignments API URL
        const response = await axios.get('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/getTeams');
        if(response.data && response.data.teams) {
            setAssignedTeams(response.data.teams);
        } else {
            setAssignedTeams(response.data || []);
        }
      } catch (err) {
        console.error("No active assignments or API unreachable", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchAssignments();
  }, []);'''

text = re.sub(r'import React.*?\nconst JudgeDashboard = \(\) => \{\n.*?const \[loading, setLoading\] = useState\(false\);', import_code, text, flags=re.MULTILINE|re.DOTALL)

# Add graceful loading state in UI
grid_regex = r'<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\s*\{assignedTeams\.map\(\(team, idx\) => \([\s\S]*?\}\s*</div>'

new_grid = '''{pageLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Syncing allocations with AWS DynamoDB...</p>
          </div>
        ) : assignedTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">You're all caught up!</h3>
            <p className="mt-2 text-sm">No pending teams assigned to your evaluation queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedTeams.map((team, idx) => (
              <motion.div key={team.id || team.TeamID || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-shadow relative overflow-hidden group">
                <div className={bsolute top-0 left-0 w-full h-1 }></div>
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{team.id || team.TeamID || 'TM-UNK'}</span>
                  <span className={inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                    }>
                    {team.status === 'Scored' ? <CheckCircle2 className="w-3 h-3"/> : <CircleDashed className="w-3 h-3 animate-spin" />}
                    {team.status || 'Pending'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1">{team.name || team.TeamName || 'Unknown Team'}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-6">
                  <Presentation className="w-4 h-4 text-slate-400" /> {team.project || team.ProjectName || 'Real-time Project'}
                </p>
                
                <button 
                  onClick={() => team.status !== 'Scored' && setScoringTeam(team)}
                  disabled={team.status === 'Scored'}
                  className={w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2
                    }
                >
                  {team.status === 'Scored' ? 'Evaluation Submitted' : 'Evaluate Pipeline'}
                </button>
              </motion.div>
            ))}
          </div>
        )}'''

text = re.sub(grid_regex, new_grid, text)

# Just run the sub to replace
with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Judge patched")
