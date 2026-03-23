import sys

path = r'e:\Vcc\frontend\src\pages\JudgeDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find something resembling classname={bsolute...} 
# Note there is a \x07 hidden char probably according to the Oxc trace 'Invalid Character \x07'

# Since we know the exact line content from the trace:
text_to_find = r'className=\{bsolute top-0 left-0 w-full h-1 \}'
# Instead of guessing the string, I'll regex it loosely
text = re.sub(r'className=\{.bsolute top-0 left-0 w-full h-1 \}', r'className={bsolute top-0 left-0 w-full h-1 }', text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed!')
