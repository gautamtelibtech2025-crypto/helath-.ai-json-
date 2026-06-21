import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  Clock,
  Thermometer,
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
    <div className="space-y-8" id="dashboard-container">
      
      {/* Welcome Hero - Clean Slate Medical Design */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Symptom Assessment & Triage
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Analyze symptom patterns, evaluate warning logs, and access structured medical recommendations through instant clinical AI models.
          </p>
        </div>

        <button
          onClick={handleStart}
          id="btn-trigger-diagnostics"
          className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide text-xs uppercase flex items-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <span>Begin New Triage Assessment</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modern High-Contrast Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="stats-grid">
        
        {/* Safe-AI card */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-800 tracking-wider font-mono">SECURE CONSOLE</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Education & Triage Advice</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Equipped with knowledge safety guardrails. Translates metrics and symptom timelines to safe summaries.
            </p>
          </div>
        </div>

        {/* Database records count */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-800 tracking-wider font-mono">DATABASE STATS</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{savedReportsCount} Patient Assessment Records</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Persisted secure health report logs locally within current active memory containers.
            </p>
          </div>
        </div>

        {/* System parameters feedback */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 tracking-wider font-mono">RESPONSE METRIC</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Instant AI Assessment</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Advanced generative model reasoning to structure potential pathways and warning flags.
            </p>
          </div>
        </div>

      </div>

      {/* Clean Interactive Vital parameters (Simplified Dials) */}
      <div className="p-6 rounded-xl border border-slate-200" id="physiological-deck">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Dynamic Biometric Calibration Console
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate and calibrate standard patient physiological parameters.
            </p>
          </div>
          <button 
            onClick={handleResetParameters}
            className="self-start sm:self-auto px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 bg-white rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Parameters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dials-control-row">
          
          {/* BP dial block */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 block">BLOOD PRESSURE</span>
              <span className="text-lg font-bold text-slate-900 block mt-1">{bloodPressure} mmHg</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Hypotensive', val: '98 / 64' },
                { label: 'Normal', val: '120 / 80' },
                { label: 'Prehyper', val: '135 / 86' },
                { label: 'Hypertensive', val: '144 / 92' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => {
                    if (soundEnabled) playPhysicalClick();
                    setBloodPressure(btn.val);
                  }}
                  className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer transition-all ${
                    bloodPressure === btn.val 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body temperature dial slider */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 block">BODY TEMPERATURE</span>
                <span className="text-lg font-bold text-slate-900 block mt-1">{temperature} °C</span>
              </div>
              <Thermometer className={`w-5 h-5 ${temperature > 37.8 ? 'text-red-500' : 'text-emerald-600'}`} />
            </div>

            <div className="space-y-1.5">
              <input 
                type="range" 
                min="35.0" 
                max="41.0" 
                step="0.1" 
                value={temperature}
                onChange={(e) => {
                  if (soundEnabled && Math.random() > 0.8) playPhysicalClick();
                  setTemperature(parseFloat(e.target.value));
                }}
                className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg cursor-col-resize" 
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-400">
                <span>35.0 °C</span>
                <span>37.0 °C</span>
                <span>41.0 °C</span>
              </div>
            </div>
          </div>

          {/* Blood Oxygen Selector */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 block">BLOOD OXYGEN LEVEL</span>
                <span className="text-lg font-bold text-slate-900 block mt-1">{oxygenLevel} %</span>
              </div>
              <Heart className={`w-5 h-5 ${oxygenLevel < 95 ? 'text-amber-500' : 'text-red-500'}`} />
            </div>

            <div className="space-y-1.5">
              <input 
                type="range" 
                min="85" 
                max="100" 
                step="1" 
                value={oxygenLevel}
                onChange={(e) => {
                  if (soundEnabled && Math.random() > 0.8) playPhysicalClick();
                  setOxygenLevel(parseInt(e.target.value));
                }}
                className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg cursor-col-resize" 
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-400">
                <span>85 % (Critical)</span>
                <span>95 % (Risk)</span>
                <span>100 % (Optimal)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
