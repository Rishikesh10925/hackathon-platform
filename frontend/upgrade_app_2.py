import sys

path = r'e:\Vcc\frontend\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Add Framer Motion and Lucide icons to App.jsx imports
if 'motion' not in text:
    text = text.replace('import { Toaster } from "react-hot-toast";', 
                        'import { Toaster } from "react-hot-toast";\nimport { motion } from "framer-motion";\nimport { BrainCircuit, ShieldCheck, Zap } from "lucide-react";')

# Inject custom layout into components
custom_components = '''const components = {
    Header() {
      // Split screen UI wrapper specifically for the unauthenticated state
      return (
        <div className="flex w-full absolute top-0 left-0 min-h-screen z-[-1] pointer-events-none bg-slate-50">
           {/* Left Branding Panel */}
           <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-center relative overflow-hidden pointer-events-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent z-0" />
              
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] z-0" />
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500 rounded-full blur-[100px] z-0" />

              <div className="relative z-10 p-16">
                <div className="flex items-center gap-4 mb-24">
                  <div className="bg-indigo-500 p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
                    <BrainCircuit className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-4xl font-extrabold text-white tracking-tight">HackOS</h1>
                </div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-6xl font-black text-white leading-[1.1] mb-8">
                    The ultimate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">hackathon engine.</span>
                  </h2>
                  <p className="text-xl text-slate-400 max-w-lg mb-12">
                    Manage tech events, evaluate code dynamically, and sync real-time global leaderboards. Built for scale.
                  </p>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-8 border-t border-slate-800 pt-12">
                   <div>
                     <ShieldCheck className="w-8 h-8 text-indigo-400 mb-3" />
                     <h4 className="text-white font-bold text-lg">AWS Secured</h4>
                     <p className="text-slate-500">Enterprise auth.</p>
                   </div>
                   <div>
                     <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                     <h4 className="text-white font-bold text-lg">Real-time</h4>
                     <p className="text-slate-500">DynamoDB sync.</p>
                   </div>
                </div>
              </div>
           </div>
           
           {/* Right Modal background for centering the Authenticator */}
           <div className="w-full lg:w-1/2 flex items-center justify-center bg-transparent pointer-events-auto h-screen relative">
              <div className="absolute top-12 lg:hidden flex items-center gap-3">
                 <div className="bg-indigo-600 p-2 rounded-lg">
                    <BrainCircuit className="w-6 h-6 text-white" />
                 </div>
                 <h1 className="text-2xl font-bold text-slate-900">HackOS</h1>
              </div>
           </div>
        </div>
      );
    },
    SignUp: {'''

import re
text = re.sub(r'const components = \{\n\s*SignUp: \{', custom_components, text)

# Center the Authenticator modal on the right half
auth_block = '''<div className="relative w-full h-full lg:w-1/2 lg:ml-auto flex items-center justify-center pointer-events-auto z-10 px-4">
      <Authenticator'''

text = text.replace('<Authenticator', auth_block)
text = text.replace('</Authenticator>', '''</Authenticator>\n    </div>''')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
