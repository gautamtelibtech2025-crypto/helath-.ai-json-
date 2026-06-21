import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { 
  Activity, 
  HeartPulse, 
  ClipboardCheck, 
  BrainCircuit, 
  History, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { playTabActivation, playPhysicalClick, setAudioMuted, getAudioMuted } from '../utils/audio';

interface LayoutProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  children: React.ReactNode;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  highContrast: boolean;
}

export default function Layout({ 
  activeTab, 
  setActiveTab, 
  children, 
  soundEnabled, 
  setSoundEnabled,
  highContrast
}: LayoutProps) {
  const [pulse, setPulse] = useState(72);
  const [ecgPath, setEcgPath] = useState('');

  // Auto-pulse variation for sensory hospital terminal feedback
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulse(p => {
        const variation = Math.round((Math.random() - 0.5) * 4);
        const next = p + variation;
        return next < 60 ? 60 : next > 95 ? 95 : next;
      });
    }, 3000);

    return () => clearInterval(pulseInterval);
  }, []);

  // Generate real-time ECG simulation path
  useEffect(() => {
    const segments = [
      'M 0,15 L 20,15',     // baseline
      'L 25,12 L 28,15',    // P wave
      'L 38,15',            // PR segment
      'L 41,25 L 45,2 L 49,28 L 52,15', // QRS complex
      'L 60,15',            // ST segment
      'L 67,10 L 74,15',    // T wave
      'L 100,15'            // baseline finish
    ];
    setEcgPath(segments.join(' '));
  }, []);

  const handleTabClick = (tab: TabType) => {
    if (soundEnabled) {
      playTabActivation();
    }
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    setAudioMuted(!nextState);
    if (nextState) {
      // Immediate sound feedback on activation
      playPhysicalClick();
    }
  };

  const navigationItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: HeartPulse },
    { id: 'assessment' as TabType, label: 'Health Assessment', icon: ClipboardCheck },
    { id: 'analysis' as TabType, label: 'AI Analysis', icon: BrainCircuit },
    { id: 'reports' as TabType, label: 'Saved Reports', icon: History },
    { id: 'settings' as TabType, label: 'Console Settings', icon: Sliders },
  ];

  return (
    <div className={`min-h-screen bg-[#F4FFF6] font-sans antialiased flex items-center justify-center p-4 md:p-8 selection:bg-[#3ECF8E]/30 select-none overflow-x-hidden ${highContrast ? 'contrast-125' : ''}`}>
      
      {/* Heavy physical machine backplate bevel */}
      <div className="w-full max-w-7xl rounded-[2.5rem] bg-gradient-to-br from-[#E2EBE5] via-[#EAEFEA] to-[#DBE4DD] p-4 md:p-6 shadow-[
        10px_10px_30px_rgba(100,120,105,0.25),
        -10px_-10px_30px_rgba(255,255,255,0.9),
        inset_2px_2px_5px_rgba(255,255,255,0.8),
        inset_-2px_-2px_5px_rgba(100,120,105,0.15)
      ] border border-[#D5DDD7] relative">
        
        {/* Metal machine screws in four corners */}
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-200 border border-gray-400/50 shadow-sm flex items-center justify-center">
          <div className="w-[10px] h-[1px] bg-gray-500 rotate-45"></div>
        </div>
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-200 border border-gray-400/50 shadow-sm flex items-center justify-center">
          <div className="w-[10px] h-[1px] bg-gray-500 -rotate-45"></div>
        </div>
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-200 border border-gray-400/50 shadow-sm flex items-center justify-center">
          <div className="w-[10px] h-[1px] bg-gray-500 -rotate-45"></div>
        </div>
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-200 border border-gray-400/50 shadow-sm flex items-center justify-center">
          <div className="w-[10px] h-[1px] bg-gray-500 rotate-45"></div>
        </div>

        {/* Outer ventilation grilles and audio port accents at top */}
        <div className="flex justify-between items-center px-8 pb-3 pt-1 text-xs text-gray-500 gap-4">
          <div className="flex gap-1.5 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          </div>
          <div className="px-3 py-0.5 rounded-full bg-[#E3EAE4] border border-white/40 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)] text-[10px] text-gray-600 font-mono flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse"></span>
            HAISTUDIO CORE ENGINE v4.1
          </div>
          <div className="flex gap-1.5 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          </div>
        </div>

        {/* Main interactive chassis containing sidebar & main terminal screen */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 bg-[#EDF3EE] rounded-[1.8rem] p-4 shadow-[inset_2px_2px_6px_rgba(100,110,100,0.1),_inset_-2px_-2px_6px_rgba(255,255,255,0.7)] border border-[#E1EAE1]" id="app-chassis">
          
          {/* SIDEBAR MODULE: Neumorphic controller column */}
          <aside className="flex flex-col justify-between p-4 bg-gradient-to-b from-[#EFF5F0] to-[#E5ECE7] rounded-2xl shadow-[5px_5px_15px_rgba(100,120,105,0.1),_-5px_-5px_15px_rgba(255,255,255,0.8)] border border-[#DFE7E0] relative overflow-hidden" id="hospital-sidebar">
            
            {/* Subtle gloss element */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

            <div>
              {/* Premium 3D jewel-like glowing clinical logo */}
              <div className="mb-8 mt-2 flex items-center justify-center p-4 bg-[#EDF4EE] rounded-xl shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.73),_inset_2px_2px_5px_rgba(100,115,100,0.15)] relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#3ECF8E]/20 to-[#6EE7B7]/20 blur-sm"></div>
                <div className="relative flex items-center gap-3">
                  {/* Glowing 3D Button Cross */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3ECF8E] to-[#22C55E] flex items-center justify-center shadow-[
                    2px_3px_6px_rgba(62,207,142,0.4),
                    -1px_-1.5px_4px_rgba(255,255,255,0.5),
                    inset_1px_1.5px_2px_rgba(255,255,255,0.6)
                  ] select-none border border-[#39C486]">
                    <Activity className="w-5.5 h-5.5 text-white animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xl font-bold tracking-tight text-gray-800 font-sans block leading-none">HealthAI</span>
                    <span className="text-[10px] font-semibold text-[#3ECF8E] tracking-widest uppercase font-mono block mt-1">TRIAGE CORE</span>
                  </div>
                </div>
              </div>

              {/* Navigation list */}
              <nav className="space-y-3.5" id="sidebar-nav">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 text-left cursor-pointer group relative ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#3ECF8E] to-[#2ecc8a] text-white font-medium shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.15),_inset_2px_2px_3px_rgba(255,255,255,0.45),_2px_4px_10px_rgba(62,207,142,0.3)]'
                          : 'bg-gradient-to-b from-white to-[#F6FAF7] text-gray-600 hover:text-[#3ECF8E] shadow-[2px_3px_6px_rgba(100,120,105,0.08),_-1px_-1.5px_3px_rgba(255,255,255,0.9)] hover:scale-[1.02] border border-[#EAEEEC]'
                      }`}
                    >
                      {/* Interactive raised indicator */}
                      {isActive && (
                        <div className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white shadow-md shadow-[#3ECF8E]"></div>
                      )}

                      <div className={`p-1.5 rounded-lg ${
                        isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[#3ECF8E]/10 group-hover:text-[#3ECF8E]'
                      }`}>
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>

                      <span className="text-sm tracking-wide font-sans">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Simulated diagnostic panel widget */}
            <div className="mt-8 pt-4 border-t border-gray-200/50">
              <div className="bg-[#E4ECE5] p-3 rounded-xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.06),_inset_-1px_-1px_3px_rgba(255,255,255,0.6)] border border-[#D9E3DA]">
                
                {/* Simulated Oscilloscope Screen */}
                <div className="bg-gradient-to-b from-[#13281E] to-[#0A1711] p-2 rounded-lg border border-[#234333] shadow-md relative overflow-hidden" id="heart-scope">
                  
                  {/* Subtle Grid Lines overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b3d2b_1px,transparent_1px),linear-gradient(to_bottom,#1b3d2b_1px,transparent_1px)] bg-[size:10px_10px] opacity-25"></div>
                  
                  <div className="flex justify-between items-center mb-1 text-[9px] font-mono font-semibold text-[#3ECF8E]/80 tracking-wide z-10 relative">
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                      CRITICAL PULSE
                    </span>
                    <span>{pulse} BPM</span>
                  </div>

                  {/* SVG animated heart pulse line */}
                  <div className="h-10 relative flex items-center justify-center z-10">
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      {/* Static Glow Back line */}
                      <path
                        d={ecgPath}
                        fill="none"
                        stroke="#3ECF8E"
                        strokeWidth="1"
                        className="opacity-20"
                      />
                      {/* Animated Active Sparkle Line */}
                      <path
                        d={ecgPath}
                        fill="none"
                        stroke="#6EE7B7"
                        strokeWidth="1.75"
                        strokeDasharray="100"
                        strokeDashoffset="100"
                        className="animate-[dash_2.5s_linear_infinite]"
                        style={{
                          animation: 'dash 1.8s linear infinite'
                        }}
                      />
                    </svg>
                  </div>
                </div>

                {/* Tactile Hardware controls inside the controller rail */}
                <div className="flex items-center justify-between gap-2.5 mt-3.5 px-1.5 text-xs">
                  <span className="text-gray-500 font-semibold tracking-wide font-sans">SOUND CHIPS</span>
                  <button 
                    onClick={toggleSound}
                    id="tactile-sound-switch"
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 cursor-pointer flex border ${
                      soundEnabled 
                        ? 'bg-[#3ECF8E] border-[#37BA7E] justify-end shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1),_inset_1.5px_1.5px_2.5px_rgba(255,255,255,0.4),_1px_2px_4px_rgba(62,207,142,0.35)]' 
                        : 'bg-gray-300 border-gray-400 justify-start shadow-[inset_1px_1.5px_2px_rgba(0,0,0,0.15),_inset_-1px_-1px_1.5px_rgba(255,255,255,0.5)]'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border border-gray-100 transition-all"></div>
                  </button>
                </div>
              </div>
            </div>

          </aside>

          {/* MAIN GLASS TERMINAL PORT: Implements modern glassmorphism overlay inside a slate 3D bezel */}
          <main className="min-h-[580px] bg-gradient-to-b from-[#F0F5F1] to-[#EBF0EB] rounded-2xl relative p-4 md:p-6 shadow-[
            5px_5px_15px_rgba(100,120,105,0.08),
            -5px_-5px_15px_rgba(255,255,255,0.8),
            inset_2px_2px_6px_rgba(255,255,255,0.6),
            inset_-2px_-2px_6px_rgba(100,115,100,0.08)
          ] border border-[#E5EBE6]/80 flex flex-col justify-between" id="terminal-screen-bracket">
            
            {/* The Glass Overlay Card itself nested in the bezel */}
            <div className="w-full h-full flex flex-col flex-1 bg-white/70 backdrop-blur-md rounded-xl border border-white/60 p-4 md:p-6 shadow-[
              inset_1px_1px_3px_rgba(255,255,255,0.9),
              0_8px_32px_rgba(62,207,142,0.04)
            ] overflow-y-auto relative" id="terminal-glass-pane">
              
              {/* Subtle top glare reflection line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"></div>

              {/* Dynamic slot of the children views */}
              {children}
            </div>

            {/* Screen Bezel lower status footer */}
            <div className="mt-4 pt-1 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-mono gap-2 opacity-80 border-t border-gray-200/40">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse"></span>
                <span>SYSTEM STATUS: DIAGNOSTIC SECURE LINK INTTACT</span>
              </div>
              <div className="flex items-center gap-4">
                <span>SECURITY: AES-256 ENCRYPTED</span>
                <span>UTC: {new Date().toISOString().substring(0, 16).replace('T', ' ')}</span>
              </div>
            </div>

          </main>

        </div>
      </div>
      
      {/* CSS Styles for the ECG Pulse Animation */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>

    </div>
  );
}
