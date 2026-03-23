import sys

path = r'e:\Vcc\frontend\src\pages\JudgeDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'Evaluate Pipeline' in line:
        lines[i] = "                  {team.status === 'Scored' ? 'Evaluation Submitted' : 'Evaluate Pipeline'}\n"

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
