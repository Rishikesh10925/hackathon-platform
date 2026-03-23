import re, sys

path = r'e:\Vcc\frontend\src\pages\Leaderboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Enhance leaderboard card UI
card_regex = r'<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">\s*<div className="overflow-x-auto">[\s\S]*?</div>\s*</div>'

new_card = '''<div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
          {/* Subtle gradient accent overlay */}
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="overflow-x-auto">
            {leaderboardData.length === 0 && !loading ? (
               <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Trophy className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-lg font-semibold text-slate-600">No teams ranked yet</p>
                  <p className="text-sm mt-1">Enter an active Event ID and sync with DynamoDB.</p>
               </div>
            ) : (
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                    <th className="py-5 px-6 font-bold uppercase tracking-wider text-center w-24">Rank</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Competitor</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider">Breakdown</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider text-right">Master Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {leaderboardData.map((team, idx) => (
                    <motion.tr 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: idx * 0.05 }} 
                        key={team.TeamID || idx} 
                        className={group transition-colors }
                    >
                        <td className="py-5 px-6 text-center">
                        {idx === 0 ? <Medal className="w-8 h-8 text-amber-500 mx-auto drop-shadow-md" /> :
                        idx === 1 ? <Medal className="w-8 h-8 text-slate-400 mx-auto drop-shadow-md" /> :
                        idx === 2 ? <Medal className="w-8 h-8 text-orange-500 mx-auto drop-shadow-md" /> :
                        <span className="text-lg font-bold text-slate-400">#{idx + 1}</span>}
                        </td>
                        <td className="py-5 px-6">
                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                              {team.TeamID}
                              {idx === 0 && <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Champion</span>}
                            </h3>
                            <p className="text-xs text-slate-400 font-mono mt-0.5 w-full truncate max-w-xs">{team.ProjectName || 'Project Deployment'}</p>
                        </td>
                        <td className="py-5 px-6">
                            <div className="flex gap-4 text-xs font-semibold">
                                <div className="flex flex-col"><span className="text-slate-400">Innovation</span><span className="text-indigo-600">{team.Innovation || 0}</span></div>
                                <div className="flex flex-col"><span className="text-slate-400">Technical</span><span className="text-blue-600">{team.Technical || 0}</span></div>
                                <div className="flex flex-col"><span className="text-slate-400">Impact</span><span className="text-emerald-600">{team.Impact || 0}</span></div>
                            </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                           <div className="inline-flex items-center justify-center bg-slate-900 text-white font-black text-xl px-4 py-1.5 rounded-xl shadow-inner">
                             {team.TotalScore || 0}
                           </div>
                        </td>
                    </motion.tr>
                    ))}
                </tbody>
                </table>
            )}
          </div>
        </div>'''

text = re.sub(card_regex, new_card, text)

# Just run the sub to replace
with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Leaderboard patched")
