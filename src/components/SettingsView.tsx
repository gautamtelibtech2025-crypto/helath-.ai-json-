import React from 'react';
import { 
  Sliders, 
  Volume2, 
  Trash2, 
  Sparkles, 
  BriefcaseMedical
} from 'lucide-react';
import { playPhysicalClick, playDiagnosticAlert } from '../utils/audio';

interface SettingsViewProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  onFlushData: () => void;
  onSeedDemoData: () => void;
}

export default function SettingsView({
  soundEnabled,
  setSoundEnabled,
  highContrast,
  setHighContrast,
  onFlushData,
  onSeedDemoData
}: SettingsViewProps) {

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      setTimeout(() => playPhysicalClick(), 50);
    }
  };

  const handleToggleContrast = () => {
    if (soundEnabled) playPhysicalClick();
    setHighContrast(!highContrast);
  };

  const handleSeed = () => {
    if (soundEnabled) playPhysicalClick();
    onSeedDemoData();
  };

  const handleFlush = () => {
    if (soundEnabled) playDiagnosticAlert();
    if (window.confirm("CRITICAL WARNING: Are you sure you want to completely flush the active clinical database log? This action is irreversible.")) {
      onFlushData();
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]" id="settings-view-board">
      
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 rounded-xl border border-slate-200 gap-2">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">Operations Console</span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">Application Customization & Controls</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="settings-deck-grid">
        
        {/* Audio Sensory feedback settings */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono flex items-center gap-2">
            <Volume2 className="w-4.5 h-4.5 text-emerald-600" />
            Audio tone feedback
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Toggle low-frequency micro feedback sounds when interactive elements are activated.
          </p>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Tactile Clicks Sound</span>
              <span className="text-[10px] text-slate-400 block">Audible interface indicators</span>
            </div>

            <button
              id="switch-settings-sound"
              onClick={handleToggleSound}
              className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors flex items-center ${
                soundEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
            </button>
          </div>
        </div>

        {/* ACCESSIBILITY & CONTRAST */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-emerald-600" />
            Contrast calibration
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Adjust visual contrast ratios to enhance legibility in extreme lighting conditions.
          </p>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2">
            <div>
              <span className="text-xs font-bold text-slate-900 block">High Contrast Mode</span>
              <span className="text-[10px] text-slate-400 block">Heighten UI gray level weights</span>
            </div>

            <button
              id="switch-settings-contrast"
              onClick={handleToggleContrast}
              className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors flex items-center ${
                highContrast ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
            </button>
          </div>
        </div>

        {/* DATA SETS */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4 md:col-span-2">
          
          <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono flex items-center gap-2">
            <BriefcaseMedical className="w-4.5 h-4.5 text-emerald-600" />
            Database Seeding & Clean Calibration
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Pre-populate historical assessment logs to evaluate UI features, or permanently flush all generated triage logs from application memory.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1" id="calibration-actions">
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block font-mono">Demo Seeding Engine</span>
                <span className="text-xs text-slate-500 block leading-relaxed mt-2 p-0.5">
                  Inject 2 predefined clinical report logs representing different symptom profiles and Gemini AI clinical outputs.
                </span>
              </div>
              <button
                onClick={handleSeed}
                className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Seed Demo Reports
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider block font-mono">Flush Database Logs</span>
                <span className="text-xs text-slate-500 block leading-relaxed mt-2 p-0.5">
                  Erase and completely flush all active clinical assessment reports from current workspace memory pools.
                </span>
              </div>
              <button
                onClick={handleFlush}
                className="w-full mt-4 py-2 border border-red-200 hover:border-red-300 bg-red-50 text-red-700 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Flush Records Storage
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
