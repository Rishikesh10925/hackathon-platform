import sys

with open(r'e:\Vcc\frontend\src\App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('import ManageEvents from "./pages/ManageEvents";\nimport ManageEvents from "./pages/ManageEvents";\n', 'import ManageEvents from "./pages/ManageEvents";\n')

with open(r'e:\Vcc\frontend\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
