import sys
import re

def purge(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # AdminDashboard
    if 'AdminDashboard' in filepath:
        bad_block = '''        console.error("No events API found. Falling back to dummy data for UI preview.", err);
        setEvents([
          { id: 'EVT-001', name: 'Global AI Hackathon', teams: 124, judges: 15, status: 'Active' },
          { id: 'EVT-002', name: 'Web3 Innovators', teams: 89, judges: 8, status: 'Active' },
          { id: 'EVT-003', name: 'FinTech Revolution', teams: 45, judges: 5, status: 'Completed' }
        ]);'''
        good_block = '''        console.error("AWS API Error:", err);
        setEvents([]); // STRICT REALTIME MODE: Remove dummy data fallback'''
        text = text.replace(bad_block, good_block)

    # JudgeDashboard
    if 'JudgeDashboard' in filepath:
        bad_block = '''        console.error("No active assignments or API unreachable. Generating dummy data.", err);
        setAssignedTeams([
          { id: 'TM-104', name: 'Neural Navigators', category: 'AI/ML', status: 'Pending', time_allocated: '10:00 AM' },
          { id: 'TM-209', name: 'Zero Knowledge Bros', category: 'Web3', status: 'Pending', time_allocated: '11:30 AM' },
          { id: 'TM-311', name: 'EcoTrack', category: 'Sustainability', status: 'Scored', time_allocated: '02:00 PM' }
        ]);'''
        good_block = '''        console.error("AWS API Error:", err);
        setAssignedTeams([]); // STRICT REALTIME MODE: Remove dummy data fallback'''
        text = text.replace(bad_block, good_block)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

purge(r'e:\Vcc\frontend\src\pages\AdminDashboard.jsx')
purge(r'e:\Vcc\frontend\src\pages\JudgeDashboard.jsx')

