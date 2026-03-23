import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, CheckCircle2, CircleDashed, Users, Presentation, Search, Star, Activity, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

const unwrapApiPayload = (data) => {
  if (!data) return {};
  if (typeof data.body === 'string') {
    try {
      return JSON.parse(data.body);
    } catch {
      return data;
    }
  }
  return data;
};

const getRecordValue = (record, keys = []) => {
  for (const key of keys) {
    if (record?.[key] !== undefined && record?.[key] !== null) {
      return record[key];
    }
  }
  return undefined;
};

const normalize = (value) => String(value || '').toLowerCase().trim();
const looksLikeEmail = (value) => /.+@.+\..+/.test(String(value || '').trim());

const JudgeDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [judgeEventId, setJudgeEventId] = useState(null); // The specific event given to this judge
  const [scoringTeam, setScoringTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [resolvedJudgeEmail, setResolvedJudgeEmail] = useState('');
  
  // Real-time synchronization
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setPageLoading(true);
        setApiError(null);
        
        let targetEventId = null;
        let judgeEmail = normalize(user?.attributes?.email || user?.email);

        // If local auth context doesn't carry email, fetch canonical Cognito attributes.
        if (!looksLikeEmail(judgeEmail)) {
          try {
            const attrs = await fetchUserAttributes();
            judgeEmail = normalize(attrs?.email);
          } catch (attrErr) {
            console.warn('Could not resolve Cognito user attributes:', attrErr?.message || attrErr);
          }
        }

        // Final fallback to ID token email only (never fallback to UUID-style username).
        if (!looksLikeEmail(judgeEmail)) {
          try {
            const session = await fetchAuthSession();
            judgeEmail = normalize(session?.tokens?.idToken?.payload?.email);
          } catch (sessionErr) {
            console.warn('Could not resolve Cognito session email:', sessionErr?.message || sessionErr);
          }
        }

        setResolvedJudgeEmail(judgeEmail || 'unknown-email');

        if (!looksLikeEmail(judgeEmail)) {
          setAssignedTeams([]);
          setApiError('Could not resolve a valid email from this Cognito login. Please sign in with a user that has a verified email attribute.');
          setPageLoading(false);
          return;
        }

        // 1. Fetch Judges to find out which EventID this judge is assigned to
        try {
          const judgeRes = await axios.get('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/getJudges');
          const judgePayload = unwrapApiPayload(judgeRes.data);
          const judgeList = Array.isArray(judgePayload?.judges)
            ? judgePayload.judges
            : Array.isArray(judgePayload)
              ? judgePayload
              : [];

          if (judgeList.length > 0) {
            // Find the judge that matches the logged in user's email
            // Use case-insensitive matching just in case
            const myJudgeRecord = judgeList.find(j => {
              const dbEmail = normalize(getRecordValue(j, ['Email', 'email', 'EMAIL']));
              return dbEmail === judgeEmail;
            }
            );
            if (myJudgeRecord) {
              targetEventId = normalize(getRecordValue(myJudgeRecord, ['EventID', 'eventId', 'eventID'])) || null;
            }
            if (targetEventId) {
               setJudgeEventId(targetEventId);
            }
          }
        } catch (judgeErr) {
          console.warn("Could not fetch judges to filter by active event:", judgeErr.message);
          // If the judge api throws 404, we'll gracefully continue and just show all teams (or none).
        }

        // 2. Fetch Teams and Filter them
        const response = await axios.get('https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/getTeams');
        const teamsPayload = unwrapApiPayload(response.data);
        let allTeams = [];
        if(teamsPayload && teamsPayload.teams) {
          allTeams = teamsPayload.teams;
        } else if (Array.isArray(teamsPayload)) {
          allTeams = teamsPayload;
        }

        // 3. Separate Judges for Separate Events Logic:
        // Only show teams that match this judge's EventID.
        if (targetEventId) {
          const myEventTeams = allTeams.filter(
            t => normalize(getRecordValue(t, ['EventID', 'eventId', 'eventID'])) === targetEventId
          );
          setAssignedTeams(myEventTeams);
        } else {
          setAssignedTeams([]);
          setApiError(`Your judge login is not linked to any event. Ask the admin to register this email in the Judges table. Logged in as: ${judgeEmail || 'unknown-email'}`);
        }

      } catch (err) {
        console.error("AWS API Error:", err);
        if (err.response && err.response.status === 404) {
          setApiError("404: The '/getTeams' API does not exist on your AWS API Gateway. Please create it in AWS.");
          toast.error("API /getTeams returns 404 Not Found", { duration: 6000 });
        } else if (err.message) {
          setApiError(err.message);
        }
        setAssignedTeams([]); // STRICT REALTIME MODE: Remove dummy data fallback
      } finally {
        setPageLoading(false);
      }
    };
    fetchAssignments();
  }, [user]);
  
  // Dynamic Score State matching Custom Evaluation Config
  const [scores, setScores] = useState({
    innovation: 0,
    technical: 0,
    impact: 0
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const openScoringModal = (team) => setScoringTeam(team);

  const submitScore = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert scores to numbers
    const innovationScore = Number(scores.innovation);
    const technicalScore = Number(scores.technical);
    const impactScore = Number(scores.impact);
    const total = innovationScore + technicalScore + impactScore;
    
    try {
      // In a real app, grab eventId from the team object or context. We use a placeholder matching the blueprint.
      const API_URL = 'https://xe6yu454x0.execute-api.us-east-1.amazonaws.com/submitScore'; 
      const judgeId = user?.email || "JUDGE_123";

      // You can wrap this in toast.promise if preferred
      await axios.post(API_URL, {
        EventID: scoringTeam.EventID || 'EVT-2026-X', // Dynamic EventID!
        TeamID: scoringTeam.TeamID || scoringTeam.id,
        JudgeID: judgeId,
        Innovation: innovationScore,
        Technical: technicalScore,
        Impact: impactScore,
      });

      // Update local state and show modern toast
      setAssignedTeams(assignedTeams.map(t => (t.TeamID === scoringTeam.TeamID || t.id === scoringTeam.id) ? { ...t, status: 'Scored' } : t));
      
      toast.success(`Evaluated ${scoringTeam.TeamName || scoringTeam.name}! Score: ${total}/30pts`, { 
        icon: '✅',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });

      setScoringTeam(null);
      setScores({ innovation: 0, technical: 0, impact: 0 });
    } catch (error) {
      console.error('Error submitting score:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to submit score. Check CORS or network.';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = assignedTeams.filter(t => t.status === 'Pending').length;
  const isJudgeMappingError = (apiError || '').toLowerCase().includes('not linked to any event');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Judge Portal</h1>
              <p className="text-xs text-slate-500 font-medium">
                {user?.email || 'Expert Evaluator'} 
                {judgeEventId ? ` • Assessing Event: ${judgeEventId}` : ' • All Events'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors font-medium text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Users className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Assignments</p>
              <h3 className="text-2xl font-bold text-slate-800">{assignedTeams.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Evaluated</p>
              <h3 className="text-2xl font-bold text-slate-800">{assignedTeams.length - pendingCount}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Activity className="w-6 h-6"/></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Review</p>
              <h3 className="text-2xl font-bold text-slate-800">{pendingCount}</h3>
            </div>
          </div>
        </div>

        {/* Action Bar & Queue */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Your Evaluation Queue</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search team or ID..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64" />
          </div>
        </div>

        {pageLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Syncing allocations with AWS DynamoDB...</p>
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center justify-center py-20 text-rose-500 bg-white rounded-2xl border border-rose-200 shadow-sm">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
              <LogOut className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{isJudgeMappingError ? 'Judge Access Not Configured' : 'API Connection Error'}</h3>
            <p className="mt-2 text-sm text-center max-w-md font-medium">{apiError}</p>
            {!!resolvedJudgeEmail && (
              <p className="mt-2 text-xs text-slate-500 max-w-sm text-center break-all">Resolved login email: {resolvedJudgeEmail}</p>
            )}
            <p className="mt-4 text-xs text-slate-500 max-w-sm text-center">
              {isJudgeMappingError
                ? 'This login is valid, but no matching Email + EventID assignment was found for this judge in DynamoDB.'
                : 'Your frontend is requesting data from AWS, but the backend endpoint is missing or throwing an error.'}
            </p>
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
                <div className={`absolute top-0 left-0 w-full h-1 ${team.status === 'Scored' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{team.id || team.TeamID || 'TM-UNK'}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${team.status === 'Scored' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {team.status === 'Scored' ? <CheckCircle2 className="w-3 h-3"/> : <CircleDashed className="w-3 h-3 animate-spin" />}
                    {team.status || 'Pending'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1">{team.name || team.TeamName || 'Unknown Team'}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-6">
                  <Presentation className="w-4 h-4 text-slate-400" /> {team.project || team.ProjectName || team.ProjectTitle || 'Real-time Project'}
                </p>
                
                <button 
                  onClick={() => team.status !== 'Scored' && setScoringTeam(team)}
                  disabled={team.status === 'Scored'}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${team.status === 'Scored' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/30 active:scale-[0.98]'}`}
                >
                  {team.status === 'Scored' ? 'Evaluation Submitted' : 'Evaluate Pipeline'}
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Beautiful Scoring Modal */}
        <AnimatePresence>
          {scoringTeam && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
                
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">Evaluation Mode</span>
                  <h2 className="text-2xl font-bold">{scoringTeam.TeamName || scoringTeam.name}</h2>
                  <p className="text-indigo-100 text-sm">{scoringTeam.ProjectTitle || scoringTeam.ProjectName || scoringTeam.project}</p>
                </div>

                <form onSubmit={submitScore} className="p-6 space-y-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-2">
                    Score parameters based on event admin constraints. Max 10 points per category.
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-semibold text-slate-700">Innovation & Uniqueness</label>
                      <span className="text-xs text-indigo-600 font-bold">{scores.innovation}/10</span>
                    </div>
                    <input type="range" min="0" max="10" value={scores.innovation} onChange={(e) => setScores({ ...scores, innovation: e.target.value })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-semibold text-slate-700">Technical Implementation</label>
                      <span className="text-xs text-indigo-600 font-bold">{scores.technical}/10</span>
                    </div>
                    <input type="range" min="0" max="10" value={scores.technical} onChange={(e) => setScores({ ...scores, technical: e.target.value })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-semibold text-slate-700">Business / Real World Impact</label>
                      <span className="text-xs text-indigo-600 font-bold">{scores.impact}/10</span>
                    </div>
                    <input type="range" min="0" max="10" value={scores.impact} onChange={(e) => setScores({ ...scores, impact: e.target.value })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-slate-100">
                    <button type="button" onClick={() => setScoringTeam(null)} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                      Discard
                    </button>
                    <button type="submit" disabled={loading} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-semibold shadow-md transition-all active:scale-95 ${
                      loading 
                        ? 'bg-slate-400 cursor-not-allowed text-white shadow-none'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                    }`}>
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Assessment'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default JudgeDashboard;











