import sys

path = r'e:\Vcc\frontend\src\App.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the generic eturn <Authenticator ...> with a heavily styled Framer Motion + Tailwind wrapper.
import re

new_imports = '''import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { BrainCircuit, ShieldCheck, Zap, GlobeLock } from "lucide-react";'''

text = re.sub(r'import React, \{ useEffect \} from "react";\nimport \{ BrowserRouter, Routes, Route, Navigate \} from "react-router-dom";\nimport \{ Toaster \} from "react-hot-toast";', new_imports, text)

authenticator_regex = r'(<Authenticator\s*components=\{components\}\s*signUpAttributes=\{.*?\}.*?>)([\s\S]*?)(</Authenticator>)'

new_auth_wrapper = '''<div className="min-h-screen flex w-full bg-slate-50 font-sans">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent z-0" />
        
        {/* Animated background elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity }} 
          className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] z-0" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, delay: 2 }} 
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500 rounded-full blur-[100px] z-0" 
        />

        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">HackOS</h1>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              The ultimate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">hackathon engine.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-md">
              Manage events, evaluate code dynamically, and sync real-time global leaderboards. Built for the future of competitive scaling.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 p-12 list-none grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
             <ShieldCheck className="w-6 h-6 text-indigo-400" />
             <h4 className="text-white font-bold">AWS Secured</h4>
             <p className="text-slate-500 text-sm">Enterprise-grade Cognito auth.</p>
          </div>
          <div className="flex flex-col gap-2">
             <Zap className="w-6 h-6 text-yellow-400" />
             <h4 className="text-white font-bold">Real-time DB</h4>
             <p className="text-slate-500 text-sm">DynamoDB instantaneous sync.</p>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
              <div className="bg-indigo-600 p-2 rounded-lg">
                 <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">HackOS</h1>
            </div>

            \\1
            \\2
            \\3
          </motion.div>
        </div>
      </div>
    </div>'''

text = re.sub(authenticator_regex, new_auth_wrapper, text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
