import React, { useState } from 'react';
import { 
  PersonalInfo, 
  SYMPTOM_CATEGORIES, 
  DURATION_OPTIONS, 
  AnalysisResponse,
  HealthReport 
} from '../types';
import { 
  Activity, 
  ShieldAlert, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  BrainCircuit, 
  Info,
  Plus,
  X
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
  const [customSymptomText, setCustomSymptomText] = useState('');
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
      setErrorMsg("Please select at least one symptom or type inside the custom symptom box to proceed.");
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
        throw new Error("Triage API service did not respond. Please try again.");
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
      console.log("Health Report auto-saved status:", saveRes.ok);

      if (soundEnabled) {
         playAssessmentComplete();
      }

      onAnalysisSuccess(data.analysis, data.disclaimer || '', newReport);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during symptom analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allPrescribedSymptoms = SYMPTOM_CATEGORIES.flatMap(cat => cat.symptoms);
  const customSymptoms = selectedSymptoms.filter(sym => !allPrescribedSymptoms.includes(sym));

  const handleAddCustomSymptom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSymptomText.trim();
    if (!trimmed) return;
    
    if (soundEnabled) playPhysicalClick();
    
    // Avoid duplicates
    if (!selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms(prev => [...prev, trimmed]);
    }
    setCustomSymptomText('');
    setErrorMsg('');
  };

  const stepsHeaderLabel = (index: number) => {
    switch(index) {
      case 1: return "Demographics";
      case 2: return "Symptoms List";
      case 3: return "Chronology & Severity";
      case 4: return "Verification Check";
      case 5: return "AI Analysis Transit";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]" id="assessment-view-wizard">
      
      {/* Modern High-Contrast Step Flow Navigator */}
      <div className="bg-slate-55 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Step {step} of 5</span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">{stepsHeaderLabel(step)}</h2>
        </div>

        {/* Flat clean step indicators */}
        <div className="flex items-center gap-1.5" id="clean-step-dots">
          {[1,2,3,4,5].map((index) => (
            <div 
              key={index}
              className={`h-2.5 rounded-full transition-all ${
                index === step 
                  ? 'w-8 bg-emerald-600' 
                  : index < step 
                    ? 'w-4 bg-emerald-700/60' 
                    : 'w-2.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Demographic parameters */}
      {step === 1 && (
        <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]" id="step-1-personal-info">
          
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-6">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-emerald-600" />
              Patient Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Biological Sex Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Biological Sex</label>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playPhysicalClick();
                        setPersonalInfo({ ...personalInfo, gender: gender as any });
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                        personalInfo.gender === gender 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age select field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Age (Years)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={personalInfo.age}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                    className="w-full py-2.5 px-4 rounded-lg bg-white text-slate-800 text-xs font-bold border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <div className="absolute right-3 top-3 text-[10px] text-slate-400 font-bold font-mono">YRS</div>
                </div>
              </div>

              {/* Weight Dial */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Body Mass (kg)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="250"
                    value={personalInfo.weight}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, weight: e.target.value })}
                    className="w-full py-2.5 px-4 rounded-lg bg-white text-slate-800 text-xs font-bold border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <div className="absolute right-3 top-3 text-[10px] text-slate-400 font-bold font-mono">KG</div>
                </div>
              </div>

              {/* Height Dial */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Height (cm)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="250"
                    value={personalInfo.height}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, height: e.target.value })}
                    className="w-full py-2.5 px-4 rounded-lg bg-white text-slate-800 text-xs font-bold border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <div className="absolute right-3 top-3 text-[10px] text-slate-400 font-bold font-mono">CM</div>
                </div>
              </div>

            </div>

            {/* Existing conditions input bar */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Known Medical/Chronic Conditions (Optional)</label>
              <textarea
                value={personalInfo.existingConditions}
                onChange={(e) => setPersonalInfo({ ...personalInfo, existingConditions: e.target.value })}
                placeholder="List pre-existing conditions (e.g., Asthma, Hypertension, Drug allergies)..."
                rows={3}
                className="w-full p-3.5 rounded-lg bg-white text-slate-800 text-xs font-semibold border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 placeholder:text-slate-400 leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Multi-Category Symptoms Selection */}
      {step === 2 && (
        <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]" id="step-2-symptoms">
          
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono">
                Select Active Symptoms ({selectedSymptoms.length} selected)
              </h3>
            </div>

            {/* Symptom grids */}
            <div className="space-y-6" id="symptoms-list-deck">
              {SYMPTOM_CATEGORIES.map((cat) => (
                <div key={cat.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider font-mono mb-3">{cat.name} Symptoms</span>
                  
                  <div className="flex flex-wrap gap-2">
                    {cat.symptoms.map((sym) => {
                      const isSelected = selectedSymptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => toggleSymptom(sym)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all select-none border cursor-pointer flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-white text-slate-700 hover:text-slate-950 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{sym}</span>
                          {isSelected && <span className="text-[9px]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom / Hindi Symptom Input Box (आपके लिखे हुए लक्षण) */}
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-4" id="custom-symptom-input-block">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    लिखकर लक्षण बताएं / type custom symptom
                  </label>
                  <p className="text-[11px] text-slate-500">
                    यदि आपके लक्षण ऊपर दी सूची में नहीं हैं, तो उन्हें यहाँ हिंदी (जैसे: 'sir dard') या English में लिखकर जोड़ें।
                  </p>
                </div>
                <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                  Hindi & English Support
                </span>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSymptomText}
                  onChange={(e) => setCustomSymptomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSymptom();
                    }
                  }}
                  placeholder="यहाँ लक्षण लिखें (उदा: 'khansi', 'bukhar', 'stomach infection', 'वजन घटना')"
                  className="flex-1 py-2.5 px-3.5 rounded-lg bg-white text-slate-800 text-xs font-semibold border border-slate-200 focus:outline-none focus:border-emerald-600 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomSymptom()}
                  className="px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add (जोड़ें)</span>
                </button>
              </div>

              {/* Render Custom Symptoms list */}
              {customSymptoms.length > 0 && (
                <div className="pt-2.5 border-t border-dashed border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 font-mono block uppercase mb-2">
                    आपके जोड़े हुए लक्षण / Custom Symptoms ({customSymptoms.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {customSymptoms.map((sym) => (
                      <div
                        key={sym}
                        className="px-2.5 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-250 text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>{sym}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (soundEnabled) playDiagnosticAlert();
                            setSelectedSymptoms(prev => prev.filter(s => s !== sym));
                          }}
                          className="text-emerald-700 hover:text-red-500 cursor-pointer shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: Intensity & Chronology */}
      {step === 3 && (
        <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]" id="step-3-severity">
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-6">
            
            {/* Severity Gauge */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Subjective Severity Index</label>
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  severity <= 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  severity <= 7 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {severity} / 10 &bull; {severity <= 3 ? 'Mild Presentation' : severity <= 7 ? 'Moderate presentation' : 'Severe Alarm'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
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
                  className="w-full h-1.5 accent-emerald-600 cursor-col-resize fill-emerald-600 rounded-lg" 
                />
                <div className="flex justify-between text-[9px] text-slate-450 font-mono mt-2">
                  <span>1 (Inconsequential)</span>
                  <span>5 (Interfering)</span>
                  <span>10 (Severe distress)</span>
                </div>
              </div>
            </div>

            {/* Duration select */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono block">Symptoms Duration</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="duration-grid">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (soundEnabled) playPhysicalClick();
                      setDuration(opt);
                    }}
                    className={`py-2.5 px-2 rounded-lg text-xs font-bold text-center capitalize cursor-pointer border transition-all ${
                      duration === opt 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional narrative */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono block flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                Additional Presentation Details (Context)
              </label>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Give more context about your condition (e.g., 'Cough gets worse at night', 'sir dard subah zyada lagta hai')..."
                rows={3}
                className="w-full p-3.5 rounded-lg bg-white text-xs font-semibold border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 placeholder:text-slate-400 leading-relaxed font-sans"
              />
            </div>

          </div>
        </div>
      )}

      {/* STEP 4: Review */}
      {step === 4 && (
        <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]" id="step-4-review">
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-6">
            
            <h3 className="text-sm font-bold text-slate-800 tracking-wider font-mono border-b border-slate-100 pb-3 uppercase">
              Assessment Summary Verification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="review-metrics-panel">
              
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-450 font-mono block uppercase">Patient Biometrics</span>
                  <div className="space-y-1.5 mt-3">
                    <div className="text-xs text-slate-600">Age parameter: <b className="text-slate-800">{personalInfo.age} Yrs</b></div>
                    <div className="text-xs text-slate-600">Biological Sex: <b className="text-slate-800 uppercase">{personalInfo.gender || 'N/A'}</b></div>
                    <div className="text-xs text-slate-600">Patient weight check: <b className="text-slate-800">{personalInfo.weight} KG</b></div>
                    <div className="text-xs text-slate-600">Patient height index: <b className="text-slate-800">{personalInfo.height} CM</b></div>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(1)} 
                  className="text-xs text-left text-emerald-600 hover:text-emerald-700 mt-4 font-bold"
                >
                  Edit demographic data &rarr;
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-450 font-mono block uppercase">Active Symptoms</span>
                  {selectedSymptoms.length === 0 ? (
                    <span className="text-xs text-red-500 font-semibold block mt-4">NO SYMPTOMS SELECTED!</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedSymptoms.map((sym) => (
                        <span key={sym} className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                          {sym}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setStep(2)} 
                  className="text-xs text-left text-emerald-600 hover:text-emerald-700 mt-4 font-bold"
                >
                  Modify symptoms &rarr;
                </button>
              </div>

            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-450 font-mono block uppercase">CHRONOLOGICAL PROFILE</span>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="text-xs text-slate-600">Symptom Duration: <b className="text-slate-805 text-emerald-600 font-bold">{duration}</b></div>
                <div className="text-xs text-slate-600">Systemic Severity Impact: <b className="text-slate-805 text-emerald-600 font-bold">{severity} / 10</b></div>
              </div>
              {additionalDetails && (
                <div className="text-xs text-slate-500 mt-3 border-t border-slate-150 pt-3 italic">
                  "{additionalDetails}"
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-2">
              All entered parameters have been populated cleanly. Proceed below to execute the AI evaluation model.
            </p>

          </div>
        </div>
      )}

      {/* STEP 5: Run AI Analysis */}
      {step === 5 && (
        <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]" id="step-5-assess">
          <div className="p-8 rounded-xl border border-slate-200 bg-white text-center py-12 relative overflow-hidden">
            
            {!loading ? (
              <div className="max-w-md mx-auto space-y-6">
                
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <BrainCircuit className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Demographic & Symptoms Primed</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Your parameters are formatted correctly. Send this information to the secure clinical generative engine to find probable evaluations and clinical warning signs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={runDiagnosticAnalysis}
                  className="w-full px-6 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase font-extrabold tracking-widest cursor-pointer shadow-sm transition-all"
                >
                  Launch AI Triage Analysis
                </button>
                
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-6 py-6 animate-pulse">
                
                <div className="relative w-12 h-12 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-t-emerald-600 border-r-transparent animate-spin"></div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest font-mono">Analyzing Symptoms...</h4>
                  <p className="text-[11px] text-slate-450">
                    Sifting medical considerations. Checking red flags. Preparing educational report...
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* FOOTER WIZARD NAV BAR */}
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
        
        {/* Previous */}
        <button
          onClick={prevStep}
          disabled={step === 1 || loading}
          className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
            step === 1 || loading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        {/* Info */}
        <span className="hidden sm:inline-block text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">
          Secure AI Assessment
        </span>

        {/* Next Step */}
        {step < 5 ? (
          <button
            onClick={nextStep}
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-xs font-bold tracking-wide flex items-center gap-1 transition-all cursor-pointer shadow-sm"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-2 h-2 bg-emerald-650 rounded-full animate-ping"></div>
        )}

      </div>

    </div>
  );
}
