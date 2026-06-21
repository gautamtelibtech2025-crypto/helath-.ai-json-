import React, { useState } from 'react';
import { 
  PersonalInfo, 
  SYMPTOM_CATEGORIES, 
  DURATION_OPTIONS, 
  AnalysisResponse,
  HealthReport 
} from '../types';
import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  Sparkles,
  ChevronRight, 
  ChevronLeft, 
  User, 
  TrendingUp, 
  Check, 
  BrainCircuit, 
  Info,
  Clock,
  BriefcaseMedical
} from 'lucide-react';
import { playPhysicalClick, playDiagnosticAlert, playAssessmentComplete } from '../utils/audio';

interface AssessmentViewProps {
  soundEnabled: boolean;
  onAnalysisSuccess: (analysis: AnalysisResponse, discl: string, reportObj: HealthReport) => void;
  goToTab: (tab: 'analysis' | 'reports') => void;
}

export default function AssessmentView({ soundEnabled, onAnalysisSuccess, goToTab }: AssessmentViewProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states matching Types
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    age: '28',
    gender: 'male',
    weight: '72',
    height: '175',
    existingConditions: ''
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState(DURATION_OPTIONS[1]); // Default to "1 to 3 days"
  const [severity, setSeverity] = useState(5); // Default to moderate (5)
  const [additionalDetails, setAdditionalDetails] = useState('');

  const nextStep = () => {
    if (soundEnabled) playPhysicalClick();
    if (step < 5) {
      setStep(prev => prev + 1);
      setErrorMsg('');
    }
  };

  const prevStep = () => {
    if (soundEnabled) playPhysicalClick();
    if (step > 1) {
      setStep(prev => prev - 1);
      setErrorMsg('');
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (soundEnabled) playPhysicalClick();
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  // Run structured client-to-backend API analyze request
  const runDiagnosticAnalysis = async () => {
    if (selectedSymptoms.length === 0) {
      setErrorMsg("Please select at least one physiological symptom from the diagnostic dashboard to initiate AI Triage.");
      if (soundEnabled) playDiagnosticAlert();
      return;
    }

    setLoading(true);
    setErrorMsg('');
    if (soundEnabled) playPhysicalClick();

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo,
          symptoms: selectedSymptoms,
          duration,
          severity: severity.toString(),
          additionalDetails
        })
      });

      if (!response.ok) {
        throw new Error("Triage processing link temporary drop. Retrying automatically...");
      }

      const data = await response.json();
      
      // Save report immediately to backend
      const reportId = `rep_${Date.now()}`;
      const newReport: HealthReport = {
        id: reportId,
        createdAt: new Date().toISOString(),
        personalInfo,
        symptoms: selectedSymptoms,
        duration,
        severity,
        additionalDetails,
        analysis: data.analysis,
        disclaimer: data.disclaimer
      };

      const saveRes = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });
      console.log("Health Report auto-saved to database container status:", saveRes.ok);

      if (soundEnabled) {
         playAssessmentComplete();
      }

      onAnalysisSuccess(data.analysis, data.disclaimer || '', newReport);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Session error occurred. Retrying clinical telemetry process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="assessment-view-wizard">
      
      {/* Header glassmorphic step indicator with micro-animations */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#E8F5EB]/60 p-4 rounded-2xl border border-white/80 shadow-inner">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight font-sans">Health Diagnostic Wizard</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono font-semibold">
            STATUS: PIPELINE STEP {step} OF 5 — {
              step === 1 ? 'PERSONAL DEMOGRAPHICS' :
              step === 2 ? 'SYMPTOM LOGGING' :
              step === 3 ? 'INTENSITY & CHRONOLOGY' :
              step === 4 ? 'PRE-FLIGHT VERIFICATION' : 'AI CORE TRANSIT'
            }
          </p>
        </div>

        {/* Tactile LED indicators */}
        <div className="flex gap-2 bg-[#D1DBD3]/30 p-2 rounded-xl" id="bezel-led-indicators">
          {[1, 2, 3, 4, 5].map((index) => (
            <div 
              key={index} 
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 relative ${
                entry => index === step ? 'animate-pulse scale-110' : ''
              } ${
                index < step 
                  ? 'bg-[#3ECF8E] shadow-[0_0_8px_#3ECF8E,inset_1px_1px_1px_white]' 
                  : index === step 
                    ? 'bg-[#3ECF8E] shadow-[0_0_12px_#3ECF8E,inset_1px_1px_2px_white]' 
                    : 'bg-gray-300 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.15)]'
              }`}
            >
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Personal Demographic Metrics */}
      {step === 1 && (
        <div className="space-y-6" id="step-1-personal-info">
          <div className="bg-white/50 p-6 rounded-3xl border border-white/80 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.7)] space-y-4">
            <h3 className="text-sm font-bold text-gray-700 tracking-wide uppercase font-mono flex items-center gap-2">
              <User className="w-4 h-4 text-[#3ECF8E]" />
              Demographic parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Biological Sex Neumorphic container */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 block">Biological Sex</label>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playPhysicalClick();
                        setPersonalInfo({ ...personalInfo, gender: gender as any });
                      }}
                      className={`py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        personalInfo.gender === gender 
                          ? 'bg-gradient-to-r from-[#3ECF8E] to-[#2ecc8a] text-white shadow-[inset_-1px_-1px_3px_rgba(0,0,0,0.15),_2px_4px_8px_rgba(62,207,142,0.25)] border-b border-[#31B077]'
                          : 'bg-white text-gray-600 shadow-[3px_3px_6px_rgba(100,120,105,0.06),-2px_-2px_4px_white] hover:bg-[#F4FFF6] border border-gray-100'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age select field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 block">Age (Years)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                    className="w-full py-3 px-4 rounded-xl bg-white text-gray-800 text-sm font-semibold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),0_1px_1px_white] border border-gray-100 focus:outline-none focus:border-[#3ECF8E]"
                  />
                  <div className="absolute right-3.5 top-3.5 text-xs text-gray-400 font-bold font-mono">Yrs</div>
                </div>
              </div>

              {/* Weight Dial */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 block">Body Mass (kg)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="250"
                    value={personalInfo.weight}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, weight: e.target.value })}
                    className="w-full py-3 px-4 rounded-xl bg-white text-gray-800 text-sm font-semibold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),0_1px_1px_white] border border-gray-100 focus:outline-none focus:border-[#3ECF8E]"
                  />
                  <div className="absolute right-3.5 top-3.5 text-xs text-gray-400 font-bold font-mono">KG</div>
                </div>
              </div>

              {/* Height Dial */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 block">Height (cm)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="250"
                    value={personalInfo.height}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, height: e.target.value })}
                    className="w-full py-3 px-4 rounded-xl bg-white text-gray-800 text-sm font-semibold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),0_1px_1px_white] border border-gray-100 focus:outline-none focus:border-[#3ECF8E]"
                  />
                  <div className="absolute right-3.5 top-3.5 text-xs text-gray-400 font-bold font-mono">CM</div>
                </div>
              </div>

            </div>

            {/* Existing conditions input bar */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 block">Known Metabolic, Cardiac or Respiratory conditions (Optional)</label>
              <textarea
                value={personalInfo.existingConditions}
                onChange={(e) => setPersonalInfo({ ...personalInfo, existingConditions: e.target.value })}
                placeholder="Prescribed hypertension medication, allergies to penicillin, previous history of asthma..."
                rows={3}
                className="w-full p-4 rounded-xl bg-white text-gray-800 text-sm font-semibold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),0_1px_1px_white] border border-gray-100 focus:outline-none focus:border-[#3ECF8E] placeholder:text-gray-400 leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Multi-Category Symptoms Selection (Skeuomorphic tactile chips) */}
      {step === 2 && (
        <div className="space-y-6" id="step-2-symptoms">
          
          <div className="bg-white/40 p-5 rounded-3xl border border-white/80 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 tracking-wide uppercase font-mono mb-4 flex items-center gap-2">
              <BriefcaseMedical className="w-4 h-4 text-[#3ECF8E]" />
              Select active clinical indicators ({selectedSymptoms.length} selected)
            </h3>

            {/* Iterate over diagnostic symptom categories defined in types */}
            <div className="space-y-6" id="symptoms-list-deck">
              {SYMPTOM_CATEGORIES.map((cat) => (
                <div key={cat.id} className="bg-[#EAF3EB]/30 p-4 rounded-2xl border border-white/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7)]">
                  <span className="text-xs font-bold text-gray-600 block uppercase tracking-widest font-mono mb-2.5">{cat.name} System</span>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {cat.symptoms.map((sym) => {
                      const isSelected = selectedSymptoms.includes(sym);
                      return (
                        <div
                          key={sym}
                          onClick={() => toggleSymptom(sym)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all duration-300 transform select-none ${
                            isSelected 
                              ? 'bg-gradient-to-b from-white to-[#F0FFF4] text-[#22C55E] shadow-[4px_4px_8px_#c2d1c6,-2px_-2px_6px_#ffffff] border-2 border-[#3ECF8E]' 
                              : 'bg-white text-gray-500 shadow-[2px_2px_5px_rgba(100,120,105,0.06),-1px_-1px_3px_white] hover:text-gray-800 border border-gray-100'
                          }`}
                        >
                          <span>{sym}</span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#3ECF8E] flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: Intensity, Severity sliders and Chronology selection */}
      {step === 3 && (
        <div className="space-y-6" id="step-3-severity">
          <div className="bg-white/50 p-6 rounded-3xl border border-white/80 shadow-sm space-y-6">
            
            {/* Dynamic Severity Gauge Area */}
            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest font-mono">SUBJECTIVE SEVERITY GAUGE</label>
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  severity <= 3 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                  severity <= 7 ? 'bg-amber-50 text-amber-600 border border-amber-200 animate-pulse' :
                  'bg-red-50 text-red-600 border border-red-200 animate-[bounce_1.5s_infinite]'
                }`}>
                  {severity} / 10 - {severity <= 3 ? 'Mild Condition' : severity <= 7 ? 'Moderate Status' : 'Severe Alarm'}
                </span>
              </div>

              {/* Heavy Neumorphic Tactile Slider Channel */}
              <div className="p-4 bg-[#EDF3EE] rounded-2xl border border-gray-200 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),_inset_-2px_-2px_5px_white] relative">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={severity} 
                  onChange={(e) => {
                    if (soundEnabled && Math.random() > 0.6) playPhysicalClick();
                    setSeverity(parseInt(e.target.value));
                    setErrorMsg('');
                  }}
                  className="w-full h-3 accent-[#3ECF8E] rounded-full cursor-col-resize shadow-inner border border-gray-300" 
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono font-bold mt-2 px-1">
                  <span>1 (Inconsequential)</span>
                  <span>5 (Interfering)</span>
                  <span>10 (Debilitating)</span>
                </div>
              </div>
            </div>

            {/* Chronological representation block */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest font-mono block ml-1">DURATION OF MANIFESTATION</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2" id="duration-grid">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (soundEnabled) playPhysicalClick();
                      setDuration(opt);
                    }}
                    className={`py-3.5 px-2 rounded-xl text-xs font-bold text-center tracking-tighter cursor-pointer border transition-all duration-200 ${
                      duration === opt 
                        ? 'bg-[#3ECF8E]/10 text-emerald-700 border-2 border-[#3ECF8E] shadow-[inset_1px_1px_3px_white]' 
                        : 'bg-white hover:bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional details free form text-area */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-widest font-mono block ml-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                SENSORY TIMELINE DESCRIPTION (SUBJECTIVE PERSPECTIVE)
              </label>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="The cough feels worse during night hours. Stinging tension spreads around the shoulder bone. Rest and hydration slightly mitigate presentation..."
                rows={3}
                className="w-full p-4 rounded-xl bg-white text-gray-800 text-sm font-semibold shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),0_1px_1px_white] border border-gray-100 focus:outline-none focus:border-[#3ECF8E] placeholder:text-gray-400 font-sans"
              />
            </div>

          </div>
        </div>
      )}

      {/* STEP 4: Review and Verify entered details */}
      {step === 4 && (
        <div className="space-y-6" id="step-4-review">
          <div className="bg-white/50 p-6 rounded-3xl border border-white/80 shadow-sm space-y-6">
            
            <h3 className="text-md font-bold text-gray-800 tracking-wide font-sans border-b border-gray-200/60 pb-3">
              PRE-FLIGHT DIAGNOSTICS LOG REVIEW
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="review-metrics-panel">
              
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono block uppercase">Physiological Metrics</span>
                  <div className="space-y-1.5 mt-2.5">
                    <div className="text-xs text-gray-600">Age parameter: <b className="text-gray-800 font-extrabold">{personalInfo.age} Yrs</b></div>
                    <div className="text-xs text-gray-600">Biological Sex: <b className="text-gray-800 font-extrabold uppercase">{personalInfo.gender || 'N/A'}</b></div>
                    <div className="text-xs text-gray-600">Patient weight check: <b className="text-gray-800 font-extrabold">{personalInfo.weight} KG</b></div>
                    <div className="text-xs text-gray-600">Patient height index: <b className="text-gray-800 font-extrabold">{personalInfo.height} CM</b></div>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(1)} 
                  className="text-xs text-left text-emerald-600 hover:underline mt-4 font-bold"
                >
                  Edit demographic data &rarr;
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono block uppercase">Active Symptoms List</span>
                  {selectedSymptoms.length === 0 ? (
                    <span className="text-xs text-red-500 font-semibold block mt-4">NO SYMPTOMS SELECTED!</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {selectedSymptoms.map((sym) => (
                        <span key={sym} className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-[#3ECF8E] border border-emerald-100/60 rounded-md">
                          {sym}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setStep(2)} 
                  className="text-xs text-left text-emerald-600 hover:underline mt-4 font-bold"
                >
                  Modify symptoms &rarr;
                </button>
              </div>

            </div>

            <div className="p-4 bg-[#EDF3EE]/40 rounded-2xl border border-dashed border-gray-300">
              <span className="text-[10px] font-bold text-gray-500 font-mono block uppercase">CHRONOLOGICAL PROFILE</span>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="text-xs text-gray-600">Symptom Duration: <b className="text-gray-800 font-mono font-bold text-emerald-600">{duration}</b></div>
                <div className="text-xs text-gray-600">Grave Severity Intensity: <b className="text-gray-800 font-mono font-bold text-emerald-600">{severity} / 10</b></div>
              </div>
              {additionalDetails && (
                <div className="text-xs text-gray-500 mt-2.5 border-t border-gray-200/50 pt-2 bg-white/30 p-2 rounded">
                  {additionalDetails}
                </div>
              )}
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed font-sans mt-2.5">
              Attention operator: This triage simulation system connects with Google AI Studio backend pipelines. Click on "LAUNCH AI TRIAGE ENGINES" to proceed to parsing analysis.
            </p>

          </div>
        </div>
      )}

      {/* STEP 5: Launch AI Analysis progress and triggers */}
      {step === 5 && (
        <div className="space-y-6" id="step-5-assess">
          <div className="bg-white/50 p-6 rounded-3xl border border-white/80 shadow-sm text-center py-12 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-emerald-400 via-teal-400 to-[#3ECF8E] animate-pulse"></div>

            {!loading ? (
              <div className="max-w-md mx-auto space-y-6">
                
                {/* 3D Circular Pulse Sensor ring */}
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#3ECF8E] to-[#22C55E] flex items-center justify-center shadow-[
                  0_8px_20px_rgba(62,207,142,0.4),
                  inset_1px_2px_3px_rgba(255,255,255,0.4)
                ] border border-[#2b9163]/50 animate-bounce">
                  <BrainCircuit className="w-11 h-11 text-white animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-sans text-gray-800">Cores Primed & Ready</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                    Demographic indicators and symptom arrays have passed standard pre-flight sanitization check-lists. Telemetry transit lanes are stable.
                  </p>
                </div>

                {/* SKEUOMORPHIC SHINY LAUNCH BUTTON */}
                <button
                  type="button"
                  onClick={runDiagnosticAnalysis}
                  className="px-8 py-4.5 rounded-2xl bg-gradient-to-b from-[#3ECF8E] via-[#2ebd8a] to-[#22C55E] text-white text-base font-black tracking-widest uppercase hover:scale-[1.01] transition-all cursor-pointer shadow-[
                    0_8px_0_#1b925c,
                    0_15px_30px_rgba(62,207,142,0.35),
                    inset_1.5px_2px_3px_rgba(255,255,255,0.45)
                  ] active:translate-y-2 active:shadow-[0_2px_0_#1b925c,0_4px_10px_rgba(62,207,142,0.35)] active:scale-100 block w-full border border-[#1FA067]"
                >
                  ⚡ LAUNCH AI TRIAGE ENGINES ⚡
                </button>
                
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-6 py-6 animate-pulse">
                
                {/* Loading diagnostic signal loop */}
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#3ECF8E] border-r-transparent animate-spin"></div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-md font-bold text-gray-700 tracking-wide uppercase font-mono">DETERMINING PROBABILITY FIELDS</h4>
                  <div className="w-48 h-1 px-1 bg-gray-100 rounded-full mx-auto overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-4/5 bg-gradient-to-r from-[#3ECF8E] via-[#6EE7B7] to-emerald-500 animate-[pulse_1s_infinite]"></div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest animate-pulse mt-2 block">
                    Securing Gemini clinical model reasoning pathways...
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* FOOTER MULTI-STEP NAVIGATION BAR */}
      <div className="flex justify-between items-center bg-[#E8F5EB]/20 p-4 rounded-2xl border border-white/60">
        
        {/* Previous */}
        <button
          onClick={prevStep}
          disabled={step === 1 || loading}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all ${
            step === 1 || loading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-inner'
              : 'bg-white text-gray-600 hover:text-emerald-700 shadow-[2px_3px_6px_#c2d1c6,-2px_-2px_6px_white] hover:scale-101 border border-gray-100'
          }`}
        >
          <ChevronLeft className="w-4.5 h-4.5" />
          <span>Previous</span>
        </button>

        {/* Diagnostic info placeholder */}
        <span className="hidden sm:inline-block text-[11px] text-emerald-700 font-bold tracking-widest font-mono">
          SECURE STACK V4.2
        </span>

        {/* Next Step */}
        {step < 5 ? (
          <button
            onClick={nextStep}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold tracking-wide flex items-center gap-1 hover:scale-101 hover:text-[#3ECF8E] transition-all cursor-pointer shadow-[2px_3px_6px_#c2d1c6,-2px_-2px_6px_white] border border-[#3ECF8E]/20"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        ) : (
          <div className="w-2.5 h-2.5 bg-[#3ECF8E] rounded-full animate-ping"></div>
        )}

      </div>

    </div>
  );
}
