import sys

path = r'e:\Vcc\frontend\src\pages\Leaderboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re

old_block = '''      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch scores';
        toast.error(Error: \, { id: toastId });
        setLeaderboardData([]); // Clear previous data on error
      }'''

new_block = '''      } catch (error) {
        console.error('Error fetching leaderboard. Showing dummy data:', error);
        toast.success(API offline. Showing mock data for UI preview!, { id: toastId });
        setLeaderboardData([
            { TeamID: 'TM-104', TeamName: 'Neural Navigators', Innovation: 9, Technical: 8, Impact: 9, TotalScore: 26 },
            { TeamID: 'TM-311', TeamName: 'EcoTrack', Innovation: 8, Technical: 7, Impact: 9, TotalScore: 24 },
            { TeamID: 'TM-209', TeamName: 'Zero Knowledge Bros', Innovation: 7, Technical: 8, Impact: 6, TotalScore: 21 },
            { TeamID: 'TM-902', TeamName: 'BitBuilders', Innovation: 5, Technical: 5, Impact: 5, TotalScore: 15 },
        ]);
      }'''

text = text.replace(old_block, new_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
