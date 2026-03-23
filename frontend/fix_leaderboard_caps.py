import sys

path = r'e:\Vcc\frontend\src\pages\Leaderboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('{team.TeamID || team.team}', '{team.TeamID || team.team || team.teamId || team.team_id || team.ID}')
text = text.replace('{team.TotalScore || team.total}', '{team.TotalScore || team.total || team.totalScore || team.score}')
text = text.replace('{row.TeamID || row.team}', '{row.TeamID || row.team || row.teamId || row.team_id || row.ID}')
text = text.replace('{row.TeamName || \'Unknown Team\'}', '{row.TeamName || row.teamName || row.name || \'Unknown Team\'}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
