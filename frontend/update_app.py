import sys

with open(r'e:\Vcc\frontend\src\App.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add import
code = code.replace(
    'import Leaderboard from "./pages/Leaderboard";', 
    'import Leaderboard from "./pages/Leaderboard";\nimport ManageEvents from "./pages/ManageEvents";'
)

# Add route
code = code.replace(
    '<Route path="/leaderboard"',
    '<Route path="/manage-events" element={<ProtectedRoute allowedRole="admin"><ManageEvents /></ProtectedRoute>} />\n      <Route path="/leaderboard"'
)

with open(r'e:\Vcc\frontend\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated App.jsx successfully.")
