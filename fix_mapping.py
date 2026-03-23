import sys

path = r'e:\Vcc\frontend\src\pages\AdminDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re

text = text.replace('key={event.id || i}', 'key={event.id || event.EventID || i}')
text = text.replace('>{event.id}</td>', '>{event.id || event.EventID}</td>')
text = text.replace('>{event.name}</td>', '>{event.name || event.EventName}</td>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
