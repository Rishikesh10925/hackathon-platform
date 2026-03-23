import sys

path = r'e:\Vcc\frontend\src\pages\JudgeDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'className={w-full py-3' in line:
        lines[i] = "                  className={w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 }\n"
    if 'className={inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold' in line:
        lines[i] = "                  <span className={inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold }>\n"

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
