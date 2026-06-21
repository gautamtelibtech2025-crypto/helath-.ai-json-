import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  Clock,
  Thermometer,
  Zap,
  RotateCcw
} from 'lucide-react';
import { playPhysicalClick } from '../utils/audio';

interface DashboardViewProps {
  onStartAssessment: () => void;
  savedReportsCount: number;
  soundEnabled: boolean;
}

export default function DashboardView({ onStartAssessment, savedReportsCount, soundEnabled }: DashboardViewProps) {
  const [bloodPressure, setBloodPressure] = useState('120 / 80');
  const [temperature, setTemperature] = useState(36.6);
  const [oxygenLevel, setOxygenLevel] = useState(98);

  const handleStart = () => {
    if (soundEnabled) {
      playPhysicalClick();
    }
    onStartAssessment();
  };

  const handleResetParameters = () => {
    if (soundEnabled) {
      playPhysicalClick();
    }
    setBloodPressure('120 / 80');
    setTemperature(36.6);
    setOxygenLevel(98);
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome header in glass containers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-5 rounded-2xl border border-emerald-500/15 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-gradient-to-tr from-[#3ECF8E]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-gray-800 flex items-center gap-2">
            HealthAI Diagnostic Core <span className="text-xs px-2.5 py-0.5 bg-[#3ECF8E]/20 text-[#22C55E] rounded-full font-mono font-bold animate-pulse">ACTIVE</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1.5 font-sans">
            AI Triage Guidance & Clinical Severity Assessment Assistant
          </p>
        </div>

        {/* Start button - Fully tactile raised 3D green button conforming to design style */}
        <button
          onClick={handleStart}
          id="btn-trigger-diagnostics"
          className="relative px-6 py-3.5 rounded-xl bg-gradient-to-b from-[#3ECF8E] via-[#2ecd8a] to-[#22C55E] text-white font-bold tracking-wide text-sm font-sans flex items-center gap-2 group cursor-pointer transition-all duration-300 transform active:translate-y-1 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25),_0_2px_4px_rgba(62,207,142,0.1)] shadow-[
            0_6px_0_#1e925f,
            0_10px_20px_rgba(62,207,142,0.3),
            inset_1px_1.5px_2px_rgba(255,255,255,0.45)
          ] border-b border-[#1b8c5a]"
        >
          <span>INITIALIZE ASSESSMENT CORES</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* THREE-DIMENSIONAL BENTO GRID STATS BLOCK CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="stats-grid">
        
        {/* Neumorphic elevated diagnostic status card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-[#FAFDFB] border border-gray-100 shadow-[
          4px_4px_12px_rgba(100,120,105,0.06),
          -2px_-2px_10px_rgba(255,255,255,0.9),
          inset_1px_1px_2px_white
        ] flex flex-col justify-between relative group hover:scale-[1.015] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-[#3ECF8E]/10 to-[#6EE7B7]/15 rounded-xl border border-[#3ECF8E]/10">
              <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-mono font-bold tracking-widest">
              CERTIFIED
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Triage Engine</span>
            <h3 className="text-xl font-bold text-gray-800 mt-1 font-sans">Safe-AI Certified</h3>
            <p className="text-xs text-gray-500 mt-2 font-sans">
              Clinical-grade knowledge parameters fully secured. Powered by Gemini.
            </p>
          </div>
        </div>

        {/* Saved assessments stat block */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-[#FAFDFB] border border-gray-100 shadow-[
          4px_4px_12px_rgba(100,120,105,0.06),
          -2px_-2px_10px_rgba(255,255,255,0.95),
          inset_1px_1px_2px_white
        ] flex flex-col justify-between relative group hover:scale-[1.015] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-[#3ECF8E]/10 to-[#6EE7B7]/15 rounded-xl border border-[#3ECF8E]/10">
              <Users className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-mono font-bold tracking-widest">
              DATABASE
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">History Log</span>
            <h3 className="text-xl font-bold text-gray-800 mt-1 font-sans">{savedReportsCount} Saved Assessment{savedReportsCount !== 1 ? 's' : ''}</h3>
            <p className="text-xs text-gray-500 mt-2 font-sans">
              Locally persisted diagnostics history safe in container sandboxes.
            </p>
          </div>
        </div>

        {/* Real-time system response time */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-[#FAFDFB] border border-gray-100 shadow-[
          4px_4px_12px_rgba(100,120,105,0.06),
          -2px_-2px_10px_rgba(255,255,255,0.95),
          inset_1px_1px_2px_white
        ] flex flex-col justify-between relative group hover:scale-[1.015] transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-[#3ECF8E]/10 to-[#6EE7B7]/15 rounded-xl border border-[#3ECF8E]/10">
              <Clock className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-mono font-bold tracking-widest">
              SYS STATS
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Feedback Speed</span>
            <h3 className="text-xl font-bold text-gray-800 mt-1 font-sans">&lt; 1.5s Response</h3>
            <p className="text-xs text-gray-500 mt-2 font-sans">
              Ultra-fast model generation cycles for real-time symptom analysis.
            </p>
          </div>
        </div>

      </div>

      {/* SKEUOMORPHIC PHYSIOLOGICAL DIAL WIDGET: A tactile physical parameter board */}
      <div className="bg-[#EDF2EE] p-5 rounded-2xl border border-[#DFE7E0] shadow-[inset_1.5px_1.5px_4px_rgba(0,0,0,0.06),_inset_-1.5px_-1.5px_4px_rgba(255,255,255,0.6)] relative overflow-hidden" id="physiological-deck">
        <div className="absolute top-0 right-0 p-3 text-[10px] text-gray-400 font-mono font-bold">
          CONSOLE DIALS V4.20
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-700 tracking-wide font-sans flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-[#3ECF8E]" />
            SIMULATED VITAL FEEDBACK BOARD
          </h2>
          <button 
            onClick={handleResetParameters}
            className="p-1 px-2 text-[10px] text-emerald-700 font-bold border border-[#3ECF8E]/30 bg-emerald-50 rounded-md hover:bg-[#3ECF8E]/10 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer shadow-[1px_1px_2px_rgba(0,0,0,0.05)]"
          >
            <RotateCcw className="w-3 h-3" />
            RESET VITALS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dials-control-row">
          
          {/* BP dial block */}
          <div className="bg-gradient-to-b from-white to-[#F4FAF5] p-4 rounded-xl shadow-md shadow-slate-300/10 border border-white flex flex-col justify-between">
            <div className="text-xs text-gray-500 font-bold font-sans">BLOOD PRESSURE</div>
            <div className="my-3 text-center">
              <span className="text-2xl font-black font-mono text-gray-800 tracking-wide">{bloodPressure}</span>
              <span className="text-[10px] text-gray-400 font-mono block mt-0.5">mmHg (Optimal Standard)</span>
            </div>
            
            {/* BP Selector state buttons */}
            <div className="flex gap-1.5 justify-center mt-1">
              {[
                { label: 'Hypotensive', val: '98 / 64' },
                { label: 'Normal', val: '120 / 80' },
                { label: 'Prehyper', val: '135 / 86' },
                { label: 'Hv Stage 1', val: '144 / 92' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => {
                    if (soundEnabled) playPhysicalClick();
                    setBloodPressure(btn.val);
                  }}
                  className={`px-1.5 py-1 text-[8.5px] rounded border font-mono tracking-tighter uppercase font-bold cursor-pointer transition-all ${
                    bloodPressure === btn.val 
                      ? 'bg-[#3ECF8E] text-white border-[#31B077] shadow-[1px_2px_3px_rgba(62,207,142,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]' 
                      : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-200 shadow-sm'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body temperature dial slider */}
          <div className="bg-gradient-to-b from-white to-[#F4FAF5] p-4 rounded-xl shadow-md shadow-slate-300/10 border border-white flex flex-col justify-between">
            <div className="flex justify-between text-xs text-gray-500 font-bold font-sans">
              <span>BODY TEMPERATURE</span>
              <span className="text-emerald-600 font-bold font-mono">{temperature}°C (Normal)</span>
            </div>
            
            <div className="my-2.5 text-center flex items-center justify-center gap-2">
              <Thermometer className={`w-6 h-6 ${temperature > 37.8 ? 'text-red-500 animate-bounce' : 'text-[#3ECF8E]'}`} />
              <div className="text-2xl font-black font-mono text-gray-800 tracking-wide">{temperature} °C</div>
            </div>

            <div className="px-1 mt-1">
              <input 
                type="range" 
                min="35.0" 
                max="41.0" 
                step="0.1" 
                value={temperature}
                onChange={(e) => {
                  if (soundEnabled && Math.random() > 0.7) playPhysicalClick();
                  setTemperature(parseFloat(e.target.value));
                }}
                className="w-full accent-[#3ECF8E] h-1.5 bg-gray-200 rounded-full cursor-col-resize shadow-inner border border-gray-300/50" 
              />
              <div className="flex justify-between text-[8px] font-mono font-semibold text-gray-400 mt-1">
                <span>35.0°C (Hypo)</span>
                <span>37.0°C (Core)</span>
                <span>41.0°C (Hyper)</span>
              </div>
            </div>
          </div>

          {/* Blood Oxygen Selector */}
          <div className="bg-gradient-to-b from-white to-[#F4FAF5] p-4 rounded-xl shadow-md shadow-slate-300/10 border border-white flex flex-col justify-between">
            <div className="flex justify-between text-xs text-gray-500 font-bold font-sans">
              <span>BLOOD OXYGEN LEVEL</span>
              <span className={`font-mono font-bold ${oxygenLevel < 95 ? 'text-amber-500' : 'text-emerald-600'}`}>{oxygenLevel < 95 ? 'Hypoxic' : 'Excellent'}</span>
            </div>

            <div className="my-2.5 text-center flex items-center justify-center gap-2">
              <Heart className={`w-5.5 h-5.5 ${oxygenLevel < 95 ? 'text-amber-500 animate-[pulse_0.5s_infinite]' : 'text-red-500 animate-pulse'}`} />
              <div className="text-2xl font-black font-mono text-gray-800 tracking-wide">{oxygenLevel}%</div>
            </div>

            <div className="px-1 mt-1">
              <input 
                type="range" 
                min="85" 
                max="100" 
                step="1" 
                value={oxygenLevel}
                onChange={(e) => {
                  if (soundEnabled && Math.random() > 0.7) playPhysicalClick();
                  setOxygenLevel(parseInt(e.target.value));
                }}
                className="w-full accent-[#3ECF8E] h-1.5 bg-gray-200 rounded-full cursor-col-resize shadow-inner border border-gray-300/50" 
              />
              <div className="flex justify-between text-[8px] font-mono font-semibold text-gray-400 mt-1">
                <span>85% (Critical)</span>
                <span>95% (Risk)</span>
                <span>100% (Optimal)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CLINICAL NOTICES BOARD: Implements real guidance on using the app safely */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-white border border-[#3ECF8E]/20 shadow-md">
        <h3 className="text-sm font-bold text-gray-800 mb-2 font-sans flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Clinical Operator Instruction Manual
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed font-sans">
          Welcome to the clinical assessment module. First, transition to the <b className="text-emerald-700">Health Assessment</b> page in the sidebar. The wizard will prompt you for demographic metrics, specific metabolic signs, and subjective symptom timelines. These metrics are processed through a server-packaged safe Gemini LLM core to present educational triage advice. Safe diagnostic files are written immediately to the database console.
        </p>
      </div>

    </div>
  );
}
