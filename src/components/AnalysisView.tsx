import React from 'react';
import { AnalysisResponse } from '../types';
import { 
  Stethoscope, 
  CheckCircle, 
  AlertTriangle,
  ChevronRight,
  Printer
} from 'lucide-react';
import { playPhysicalClick } from '../utils/audio';

interface AnalysisViewProps {
  analysis: AnalysisResponse | null;
  disclaimer?: string;
  soundEnabled: boolean;
  onRestart: () => void;
  metadata?: any;
}

export default function AnalysisView({ 
  analysis, 
  disclaimer, 
  soundEnabled, 
  onRestart,
  metadata 
}: AnalysisViewProps) {

  const handleRestartClick = () => {
    if (soundEnabled) playPhysicalClick();
    onRestart();
  };

  const handlePrint = () => {
    if (soundEnabled) playPhysicalClick();
    window.print();
  };

  if (!analysis) {
    return (
      <div className="text-center py-16 space-y-4" id="empty-analysis">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <Stethoscope className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-850">No Assessment Record Loaded</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Please complete a Symptom Triage Assessment session first to generate dynamic clinical model evaluations.
        </p>
        <button
          onClick={handleRestartClick}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          Begin Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]" id="analysis-view-board">
      
      {/* Dynamic Session Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">
            Clinical AI Triage Output
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">Symptom Evaluations</h2>
        </div>

        <div className="flex gap-2" id="analysis-action-bar">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          
          <button
            onClick={handleRestartClick}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-sm"
          >
            <span>New Session</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {metadata && (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-650 font-sans">
          <div>Report Duration: <b className="text-slate-900 font-bold">{metadata.duration}</b></div>
          <div>Report Severity: <b className="text-slate-900 font-bold">{metadata.severity} / 10</b></div>
          <div>Biometrics Age: <b className="text-slate-900 font-bold">{metadata.personalInfo?.age} Yrs</b></div>
          <div>Symptom Array Count: <b className="text-slate-900 font-bold">{metadata.symptoms?.length}</b></div>
        </div>
      )}

      {/* Conditions list */}
      <div className="space-y-6" id="conditions-list-deck">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Possible Conditions List</h3>
        
        {analysis.conditions?.map((con, idx) => (
          <div 
            key={`${con.name}_${idx}`}
            className="bg-white rounded-xl p-6 border border-slate-200 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 tracking-wider block">CONSIDERATION {idx + 1}</span>
                <h4 className="text-base font-bold text-slate-950 tracking-tight mt-0.5">{con.name}</h4>
              </div>

              {/* Likelihood & Severity badge */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  con.likelihood === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  con.likelihood === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-slate-100 text-slate-750 border-slate-200'
                }`}>
                  LIKELIHOOD: {con.likelihood}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  con.severity === 'Severe' ? 'bg-red-50 text-red-700 border-red-200' :
                  con.severity === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-250' :
                  'bg-emerald-55 bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  SEVERITY: {con.severity}
                </span>
              </div>
            </div>

            {/* Narrative text */}
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">{con.description}</p>

              {/* Interventions matrix */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 font-mono block uppercase">Triage Intervention Channels</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="interventions-grid">
                  {con.treatments?.map((t, tIdx) => (
                    <div key={tIdx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {t.name}
                      </div>

                      {/* Pros and cons list */}
                      <div className="grid grid-cols-2 gap-3 pt-1 text-[10px]">
                        <div>
                          <span className="text-emerald-700 font-bold block uppercase font-mono tracking-wider text-[8px] mb-1">PROS</span>
                          <ul className="space-y-1 text-slate-600 list-disc list-inside">
                            {t.pros?.map((pro, pIdx) => (
                              <li key={pIdx} className="leading-snug">{pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-amber-700 font-bold block uppercase font-mono tracking-wider text-[8px] mb-1">CONS</span>
                          <ul className="space-y-1 text-slate-600 list-disc list-inside">
                            {t.cons?.map((conStr, cIdx) => (
                              <li key={cIdx} className="leading-snug">{conStr}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red flags warning signs */}
              {con.warningSigns && con.warningSigns.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-[10px] font-bold text-red-700 font-mono uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Warning Signs (Red Flags)
                  </span>
                  <ul className="space-y-0.5 text-red-900 text-xs font-semibold list-disc list-inside">
                    {con.warningSigns.map((w, wIdx) => (
                      <li key={wIdx} className="leading-normal">{w}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* General clinical evaluator advice */}
      <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4" id="card-clinician-recommendation">
        
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-emerald-400" />
          <h4 className="text-xs font-bold tracking-wider uppercase font-mono">Clinician Advisor Evaluation</h4>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {analysis.generalAdvice}
        </p>

        <div className="p-4 bg-white/5 border border-white/10 rounded">
          <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider block mb-1 uppercase">DIAGNOSTIC CONSULTATION ADVICE</span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{analysis.doctorAdvice}</p>
        </div>
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className="p-4 rounded-lg bg-amber-50/55 border border-amber-200 text-[10px] text-slate-600 leading-relaxed font-medium italic">
          <span className="inline-block px-1.5 py-0.5 bg-amber-600 text-white rounded text-[8px] font-mono font-bold tracking-wider not-italic mr-1.5 uppercase">
            Educational Disclaimer
          </span>
          {disclaimer}
        </div>
      )}

    </div>
  );
}
