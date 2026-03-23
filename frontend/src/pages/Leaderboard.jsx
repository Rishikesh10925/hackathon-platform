import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Download, Medal, ChevronDown, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [eventId, setEventId] = useState(searchParams.get('eventId') || '');
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const fetchLeaderboard = async () => {
    if (!eventId.trim()) return toast.error("Please enter an Event ID");
    
    setLoading(true);
    const toastId = toast.loading('Loading leaderboard...');

    try {
      const API_URL = `https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/leaderboard?eventId=${eventId}`;
      const response = await axios.get(API_URL);
      
      // AWS returns the array of scores sorted by rank assuming Lambda handles sorting
      // or we can sort it here just in case! (Assuming higher score is better)
      const sortedData = response.data.sort((a, b) => b.TotalScore - a.TotalScore);
      setLeaderboardData(sortedData);

      toast.success('Leaderboard refreshed!', { id: toastId });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      toast.error(`AWS API Error: ${errorMsg}`, { id: toastId });
      setLeaderboardData([]); // strictly realtime, no mock data
    } finally {
      setLoading(false);
    }
  };

  // Optional: Auto-fetch on mount if eventId is pre-filled
  useEffect(() => {
    if (eventId) {
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Hackathon Leaderboard</h1>
              <p className="text-xs text-slate-500 font-medium">Live Event Standings & Rankings</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-semibold shadow-sm transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Top Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="font-semibold text-slate-700 whitespace-nowrap">Event ID:</span>
            <div className="relative flex-1 sm:w-64">
              <input 
                type="text"
                placeholder="Enter Event ID..."
                value={eventId} 
                onChange={(e) => setEventId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLeaderboard()}
                className="w-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
            <button 
              onClick={fetchLeaderboard} 
              disabled={loading || !eventId}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-md shadow-sm transition-all"
            >
              {loading ? '...' : 'Load'}
            </button>
          </div>
        </div>

        {/* Global Podium (Top 3) */}
        {leaderboardData.length >= 3 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
            {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((team, idx) => {
              if (!team) return null;
              const isWinner = idx === 1;
              const rank = isWinner ? 1 : idx === 0 ? 2 : 3;
              const cardStyles = isWinner ? 'bg-gradient-to-t from-yellow-50 border-yellow-200 h-48' 
                : rank === 2 ? 'bg-gradient-to-t from-slate-100 border-slate-200 h-40' 
                : 'bg-gradient-to-t from-orange-50 border-orange-200 h-36';
              const iconColor = isWinner ? 'text-yellow-500' : rank === 2 ? 'text-slate-400' : 'text-orange-500';

              return (
                <motion.div key={rank} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: rank * 0.1 }}
                  className={`relative rounded-t-2xl border-x border-t p-6 flex flex-col items-center justify-end text-center shadow-sm ${cardStyles}`}>
                  <div className="absolute -top-6 bg-white rounded-full p-2 shadow-sm border border-slate-100">
                    <Medal className={`w-8 h-8 ${iconColor}`} />
                  </div>
                  {isWinner && <div className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-2">Grand Winner</div>}
                  <h3 className="font-bold text-slate-800 text-lg">{team.TeamID || team.team || team.teamId || team.team_id || team.ID}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">Scores Count: {team.ScoreCount || '-'}</p>
                  <div className="mt-3 bg-white/60 px-4 py-1.5 rounded-full text-sm font-bold text-slate-700 shadow-sm border border-slate-100/50">
                    {team.TotalScore || team.total || team.totalScore || team.score} pts
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Full Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {leaderboardData.length === 0 && !loading ? (
             <div className="p-12 text-center text-slate-500">
               <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <p className="font-semibold text-slate-600">No scores found</p>
               <p className="text-sm">Enter a valid Event ID to load the leaderboard.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="px-6 py-4 text-center w-16">Rank</th>
                    <th className="px-6 py-4">Team Details</th>
                    <th className="px-6 py-4 text-center">Score Count</th>
                    <th className="px-6 py-4 text-center">Average Score</th>
                    <th className="px-6 py-4 text-right">Aggregate Score</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {leaderboardData.map((row, idx) => {
                    const rank = idx + 1;
                    return (
                    <tr key={row.TeamID || row.rank} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
                          ${rank === 1 ? 'bg-yellow-100 text-yellow-700' : rank === 2 ? 'bg-slate-200 text-slate-700' : rank === 3 ? 'bg-orange-100 text-orange-700' : 'text-slate-400'}`}>
                          {rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800 font-bold mb-0.5">{row.TeamID || row.team || row.teamId || row.team_id || row.ID}</div>
                        <div className="text-slate-500 text-xs text-indigo-600/70">{row.TeamName || row.teamName || row.name || 'Unknown Team'}</div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.ScoreCount || '-'}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{row.AverageScore ? Number(row.AverageScore).toFixed(1) : '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                          {row.TotalScore || row.total}
                        </span>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Leaderboard;
