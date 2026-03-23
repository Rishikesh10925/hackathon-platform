import sys
import re

path = r'e:\Vcc\frontend\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

new_imports = '''import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { BrainCircuit, ShieldCheck, Zap } from "lucide-react";'''

text = re.sub(r'import React, \{ useEffect \} from "react";\nimport \{ BrowserRouter, Routes, Route, Navigate \} from "react-router-dom";\nimport \{ Toaster \} from "react-hot-toast";', new_imports, text)

custom_components = '''const components = {
    Header() {
      return (
        <div className="custom-auth-bg flex w-full absolute top-0 left-0 min-h-screen z-[-1] bg-slate-50 overflow-hidden">
           {/* Left Branding Panel */}
           <div className="hidden lg:flex w-[55%] bg-slate-900 flex-col justify-center relative shadow-[20px_0_50px_rgba(0,0,0,0.2)] z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent z-0" />
              
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] z-0" />
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] z-0" />

              <div className="relative z-10 p-20">
                <div className="flex items-center gap-4 mb-24">
                  <div className="bg-indigo-500 p-3.5 rounded-2xl shadow-lg shadow-indigo-500/40">
                    <BrainCircuit className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-4xl font-extrabold text-white tracking-tight">HackOS</h1>
                </div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-6xl font-black text-white leading-[1.1] mb-8">
                    The ultimate <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-purple-400">hackathon engine.</span>
                  </h2>
                  <p className="text-xl text-slate-400 max-w-lg mb-12 leading-relaxed">
                    Manage tech events, evaluate code dynamically, and sync real-time global leaderboards. Built for elite hackathons.
                  </p>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-8 border-t border-slate-800/80 pt-12">
                   <div>
                     <ShieldCheck className="w-8 h-8 text-indigo-400 mb-4" />
                     <h4 className="text-white font-bold text-lg">AWS Secured</h4>
                     <p className="text-slate-500">Enterprise grade.</p>
                   </div>
                   <div>
                     <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                     <h4 className="text-white font-bold text-lg">Real-time</h4>
                     <p className="text-slate-500">DynamoDB sync.</p>
                   </div>
                </div>
              </div>
           </div>
           {/* Right Modal background for mobile */}
           <div className="w-full lg:w-[45%] flex items-start pt-16 justify-center bg-transparent h-screen relative">
              <div className="lg:hidden flex items-center justify-center gap-3 w-full mb-8">
                 <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md">
                    <BrainCircuit className="w-8 h-8 text-white" />
                 </div>
                 <h1 className="text-3xl font-extrabold text-slate-900">HackOS</h1>
              </div>
           </div>
        </div>
      );
    },
    SignUp: {'''

text = re.sub(r'const components = \{\n\s*SignUp: \{', custom_components, text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
