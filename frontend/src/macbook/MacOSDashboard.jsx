import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Globe,
  MessageSquare,
  BarChart3,
  Code2,
  Music,
  Settings,
  Trash2,
  Wifi,
  BatteryCharging,
  Search,
  SlidersHorizontal,
  Sun,
  Sparkles,
  CheckCircle2,
  Cpu,
  Activity,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

const DOCK_APPS = [
  { name: 'Finder', icon: Compass, bg: 'from-blue-500 to-cyan-400', active: true },
  { name: 'Safari', icon: Globe, bg: 'from-blue-600 to-sky-400', active: true },
  { name: 'Messages', icon: MessageSquare, bg: 'from-green-500 to-emerald-400', active: false },
  { name: 'Analytics', icon: BarChart3, bg: 'from-purple-500 to-indigo-500', active: true },
  { name: 'Xcode', icon: Code2, bg: 'from-sky-500 to-blue-600', active: true },
  { name: 'Music', icon: Music, bg: 'from-rose-500 to-pink-600', active: false },
  { name: 'Settings', icon: Settings, bg: 'from-slate-500 to-zinc-600', active: false },
  { name: 'Trash', icon: Trash2, bg: 'from-neutral-600 to-neutral-700', active: false },
];

const TIME_RANGES = ['1D', '1W', '1M', '1Y'];

export default function MacOSDashboard() {
  const [selectedRange, setSelectedRange] = useState('1W');
  const [activeApp, setActiveApp] = useState('Analytics');

  return (
    <div className="relative w-full h-full flex flex-col justify-between text-white font-sans select-none overflow-hidden">
      
      {/* 1. TOP MENU BAR */}
      <div className="w-full h-7 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between text-[11px] font-medium tracking-wide shrink-0 z-30">
        {/* Left App Menu */}
        <div className="flex items-center gap-4 text-white/90">
          <span className="text-sm font-semibold hover:text-white cursor-pointer"></span>
          <span className="font-bold text-white tracking-normal">{activeApp}</span>
          <span className="hover:text-white cursor-pointer hidden sm:inline">File</span>
          <span className="hover:text-white cursor-pointer hidden sm:inline">Edit</span>
          <span className="hover:text-white cursor-pointer hidden md:inline">View</span>
          <span className="hover:text-white cursor-pointer hidden md:inline">Go</span>
          <span className="hover:text-white cursor-pointer hidden lg:inline">Window</span>
          <span className="hover:text-white cursor-pointer">Help</span>
        </div>

        {/* Right Status Indicators */}
        <div className="flex items-center gap-3 text-white/80">
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-amber-200">M4 Max</span>
          </div>
          <Wifi className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <div className="flex items-center gap-1 hover:text-white cursor-pointer">
            <span className="text-[10px]">100%</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <Search className="w-3.5 h-3.5 hover:text-white cursor-pointer hidden sm:inline" />
          <SlidersHorizontal className="w-3.5 h-3.5 hover:text-white cursor-pointer hidden sm:inline" />
          <span className="font-semibold text-white/90">Tue Jul 8  10:14 AM</span>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD WORKSPACE GRID */}
      <div className="flex-1 w-full p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto z-20">
        
        {/* Card 1: Apple Intelligence & Analytics (2 Column Span) */}
        <div className="md:col-span-2 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col justify-between group hover:border-white/25 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-semibold text-white tracking-tight">
                  Apple Intelligence Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Active • 60 FPS
                </span>
              </div>
              <p className="text-xs text-white/60">Real-time neural rendering & hardware acceleration</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
              {TIME_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`relative px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedRange === range ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {selectedRange === range && (
                    <motion.div
                      layoutId="rangeBadge"
                      className="absolute inset-0 bg-white/20 rounded-lg shadow-sm border border-white/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{range}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Animated Spline / Area Chart Preview */}
          <div className="relative w-full h-32 md:h-36 bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col justify-end overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-rows-3 gap-8 p-3 pointer-events-none opacity-20">
              <div className="border-b border-dashed border-white/40 w-full" />
              <div className="border-b border-dashed border-white/40 w-full" />
              <div className="border-b border-dashed border-white/40 w-full" />
            </div>

            {/* Glowing SVG Chart Line */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M 0 100 Q 80 40, 160 70 T 320 30 T 500 15 L 500 120 L 0 120 Z"
                fill="url(#chartGradient)"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M 0 100 Q 80 40, 160 70 T 320 30 T 500 15"
                fill="none"
                stroke="#d8b4fe"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]"
              />
              {/* Glowing data points */}
              <circle cx="160" cy="70" r="4" className="fill-white drop-shadow-[0_0_6px_#fff]" />
              <circle cx="320" cy="30" r="4" className="fill-white drop-shadow-[0_0_6px_#fff]" />
              <circle cx="500" cy="15" r="5" className="fill-purple-300 animate-pulse drop-shadow-[0_0_10px_#c084fc]" />
            </svg>

            {/* Metric Labels */}
            <div className="absolute top-3 left-3 flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-white/50 block">Neural Cores</span>
                <span className="text-purple-300 font-bold text-sm">38.4 TFLOPS</span>
              </div>
              <div>
                <span className="text-white/50 block">Efficiency</span>
                <span className="text-emerald-300 font-bold text-sm">+94.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: System Performance (1 Column Span) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col justify-between group hover:border-white/25 transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-semibold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Unified Memory
            </h3>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
              36 GB
            </span>
          </div>

          {/* Circular / Progress Bars */}
          <div className="my-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1 font-mono">
                <span>GPU Workload</span>
                <span className="text-indigo-300 font-bold">42%</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '42%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1 font-mono">
                <span>Neural Engine</span>
                <span className="text-emerald-300 font-bold">88%</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1 font-mono">
                <span>Memory Bandwidth</span>
                <span className="text-sky-300 font-bold">546 GB/s</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.6)]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              System Normal
            </span>
            <span className="text-white font-mono text-[11px]">M4 Max 16-Core</span>
          </div>
        </div>

        {/* Card 3: Cupertino Weather & Environment (1 Column Span) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl flex items-center justify-between group hover:border-white/25 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
              <Sun className="w-7 h-7 text-white animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">Cupertino, CA</div>
              <div className="text-2xl font-bold text-white tracking-tight">72°F</div>
              <div className="text-xs text-amber-200">Sunny • AQI 24 Good</div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-white/50 block">High / Low</span>
            <span className="text-sm font-semibold text-white">78° / 58°</span>
          </div>
        </div>

        {/* Card 4: Recent Projects & Quick Controls (2 Column Span) */}
        <div className="md:col-span-2 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-white/25 transition-all">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">MacBook Pro 3D Scroll Choreography</h4>
              <p className="text-xs text-white/60">Built with React 19, Framer Motion & Tailwind CSS v4</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-medium text-white transition-all flex items-center gap-1.5 cursor-pointer">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              60 FPS Verified
            </span>
            <button className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-1">
              Explore Code
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM FLOATING MACOS DOCK */}
      <div className="w-full flex items-center justify-center pb-3 shrink-0 z-30">
        <div className="bg-white/15 backdrop-blur-2xl border border-white/25 rounded-2xl px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-2 sm:gap-3">
          {DOCK_APPS.map((app) => {
            const Icon = app.icon;
            const isSelected = activeApp === app.name;
            return (
              <div key={app.name} className="relative group/icon flex flex-col items-center">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[11px] font-medium text-white border border-white/20 opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                  {app.name}
                </div>

                {/* Animated Dock Icon with Bounce Hover Effect */}
                <motion.button
                  whileHover={{ scale: 1.35, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveApp(app.name)}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-9 sm:w-11 md:w-12 h-9 sm:h-11 md:h-12 rounded-xl bg-gradient-to-br ${app.bg} flex items-center justify-center shadow-lg shadow-black/40 border border-white/30 cursor-pointer relative`}
                >
                  <Icon className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-white drop-shadow" />
                </motion.button>

                {/* Active Running Indicator Dot */}
                {(app.active || isSelected) && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#fff]"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
