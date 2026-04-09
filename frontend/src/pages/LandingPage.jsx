import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Trophy, Users, Gauge, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff9f1] text-slate-900 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-[#ffbe0b]/30 blur-3xl" />
        <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-[#fb5607]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#3a86ff]/20 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="grid items-center gap-10 lg:grid-cols-2"
        >
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f4d9bf] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b45309]">
              <Sparkles className="h-3.5 w-3.5" />
              Hackathon Command Platform
            </div>

            <h1 className="mt-6 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight md:text-6xl">
              Launch, manage, and judge events in one beautiful control center.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Built for organizers who want fast operations and crystal-clear judging workflows.
              Real-time data, event-scoped access, and a modern execution dashboard powered by AWS.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="group inline-flex items-center gap-2 rounded-xl bg-[#fb5607] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#fb5607]/25 transition hover:-translate-y-0.5 hover:bg-[#e14b00]"
              >
                Enter Admin Dashboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate('/judge')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open Judge Workspace
              </button>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'Events Managed', value: 'Real-time' },
                { label: 'Role Security', value: 'Cognito + JWT' },
                { label: 'Scale Model', value: 'Serverless AWS' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="rounded-xl border border-[#ecd8c5] bg-white/80 p-3"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl border border-[#f1d8bf] bg-white p-6 shadow-2xl shadow-[#f5d1a8]/30"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FeatureCard
                  icon={<Gauge className="h-5 w-5 text-[#fb5607]" />}
                  title="Operational Velocity"
                  body="Track events, registrations, and progress from one unified dashboard."
                />
                <FeatureCard
                  icon={<ShieldCheck className="h-5 w-5 text-[#3a86ff]" />}
                  title="Scoped Access"
                  body="Judges only view teams mapped to their assigned EventID."
                />
                <FeatureCard
                  icon={<Users className="h-5 w-5 text-[#0f766e]" />}
                  title="Team Pipeline"
                  body="Smooth team review queue for judges with scoring workflow."
                />
                <FeatureCard
                  icon={<Trophy className="h-5 w-5 text-[#b45309]" />}
                  title="Leaderboard Ready"
                  body="Event-specific leaderboard routing with live score updates."
                />
              </div>

              <div className="mt-5 rounded-2xl bg-[#0f172a] p-4 text-slate-100">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Architecture</p>
                <p className="mt-1 text-sm font-semibold">React + Amplify -&gt; API Gateway -&gt; Lambda -&gt; DynamoDB</p>
              </div>
            </motion.div>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, body }) => {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="mb-2 inline-flex rounded-lg bg-slate-100 p-2">{icon}</div>
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{body}</p>
    </div>
  );
};

export default LandingPage;
