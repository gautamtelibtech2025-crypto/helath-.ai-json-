import React from 'react';
import { 
  Sliders, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  RefreshCw,
  Gauge,
  BriefcaseMedical,
  CheckCircle2
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
    <div className="space-y-6" id="settings-view-board">
      
      {/* Settings diagnostic header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-[#E8F5EB]/50 rounded-3xl border border-white/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">System Console</span>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight mt-1">Console Settings & Calibration</h2>
        </div>
        <div className="text-xs font-mono font-bold text-gray-400">
          HARDWARE REVISION: v4.2.0-MED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="settings-deck-grid">
        
        {/* AUDIO & AMBIENCE CHASSIS SETTINGS */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-700 tracking-widest uppercase font-mono flex items-center gap-2">
            <Volume2 className="w-4.5 h-4.5 text-[#3ECF8E]" />
            Acoustics & Sensory Feedback
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed font-sans">
            The machine comes packaged with a programmable low-level synthesizer chip that produces real frequency tones mimicking biological status monitors.
          </p>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100/60 mt-2">
            <div>
              <span className="text-xs font-bold text-gray-800 block">Tactile Mechanical Clicks</span>
              <span className="text-[10px] text-gray-400 block font-sans">Toggle synthesizer audio tone feedback.</span>
            </div>

            <button
              id="switch-settings-sound"
              onClick={handleToggleSound}
              className={`w-12 h-6.5 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${
                soundEnabled ? 'bg-[#3ECF8E] justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md border"></div>
            </button>
          </div>
        </div>

        {/* ACCESSIBILITY & CONTRAST CALIBRATION */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-700 tracking-widest uppercase font-mono flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-[#3ECF8E]" />
            Visual Calibration
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed font-sans">
            Calibrate display rendering parameters to adjust rendering levels for physical screen readability in intense operational clinics.
          </p>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100/60 mt-2">
            <div>
              <span className="text-xs font-bold text-gray-800 block">High Contrast Mode</span>
              <span className="text-[10px] text-gray-400 block font-sans">Heighten UI light levels by 1.25x.</span>
            </div>

            <button
              id="switch-settings-contrast"
              onClick={handleToggleContrast}
              className={`w-12 h-6.5 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${
                highContrast ? 'bg-[#3ECF8E] justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md border"></div>
            </button>
          </div>
        </div>

        {/* DATA MANAGEMENT WORKFLOWS (SEED & SEEDING & FLUSH) */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-sm space-y-4 md:col-span-2">
          
          <h3 className="text-xs font-bold text-gray-700 tracking-widest uppercase font-mono flex items-center gap-2">
            <BriefcaseMedical className="w-4.5 h-4.5 text-[#3ECF8E]" />
            Machine Dataset Logs & Calibration
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed font-sans">
            Calibrate, seed, or flush all diagnostic outputs. Demonstrates complete operational features instantly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1" id="calibration-actions">
            
            <div className="p-4 bg-[#EDF4EE]/50 border border-[#3ECF8E]/20 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block font-mono">Demo Seeding Engine</span>
                <span className="text-[11px] text-gray-500 block leading-relaxed mt-1 font-sans">
                  Inject 3 predefined clinical reports with diverse biological sexes, age clusters, symptoms list (cough, fatigue, systemic), and simulated Gemini triage outputs.
                </span>
              </div>
              <button
                onClick={handleSeed}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#3ECF8E] to-[#2ecc8a] text-white text-xs font-black tracking-widest rounded-xl hover:scale-101 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                INTEGRATE CLINICAL RECORDS
              </button>
            </div>

            <div className="p-4 bg-red-50/50 border border-red-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold text-red-800 uppercase tracking-wider block font-mono">Erase Database Records</span>
                <span className="text-[11px] text-gray-500 block leading-relaxed mt-1 font-sans">
                  Flush all active diagnostic triage logs from memory. Useful when handing over terminal systems to other operators.
                </span>
              </div>
              <button
                onClick={handleFlush}
                className="w-full mt-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-700 text-xs font-black tracking-widest rounded-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                ERASE DOSSIER ARCHIVES
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
