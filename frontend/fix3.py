import sys

path = r'e:\Vcc\frontend\src\pages\JudgeDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    orig = f.read()

import re
# The problem is className={w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 }
new_text = re.sub(r'className=\{w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 \}', r'className={w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 }', orig)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_text)

