import sys

path = r'e:\Vcc\frontend\src\pages\JudgeDashboard.jsx'
with open(path, 'rb') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if b'top-0 left-0 w-full h-1' in line:
        lines[i] = b'                <div className={bsolute top-0 left-0 w-full h-1 }></div>\n'

with open(path, 'wb') as f:
    f.writelines(lines)
