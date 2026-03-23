import sys

path = r'e:\Vcc\frontend\src\pages\JudgeDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Nuke that button entirely and write it cleanly so we know it's fine.
button_regex = r'<button\s*onClick=\{\(\) => team\.status !== \'Scored\' && setScoringTeam\(team\)\}\s*disabled=\{team\.status === \'Scored\'\}\s*className.*?\}'
clean_button = """<button 
                  onClick={() => team.status !== 'Scored' && setScoringTeam(team)}
                  disabled={team.status === 'Scored'}
                  className={w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 }
                >
                  {team.status === 'Scored' ? 'Evaluation Submitted' : 'Evaluate Pipeline'}"""

text = re.sub(button_regex, clean_button, text, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

