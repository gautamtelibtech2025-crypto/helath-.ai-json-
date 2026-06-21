import React from 'react';
import { AnalysisResponse } from '../types';
import { 
  ShieldAlert, 
  Stethoscope, 
  CheckCircle, 
  HelpCircle, 
  Info,
  Calendar,
  Layers,
  AlertTriangle,
  Flame,
  UserCheck,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { playPhysicalClick, playDiagnosticAlert } from '../utils/audio';

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

  const handlePrintMock = () => {
    if (soundEnabled) playPhysicalClick();
    window.print();
  };

  if (!analysis) {
    return (
      <div className="text-center py-16 space-y-4" id="empty-analysis">
        <div className="w-16 h-16 bg-[#E8F5EB] rounded-full flex items-center justify-center mx-auto shadow-md">
          <Stethoscope className="w-8 h-8 text-[#3ECF8E]" />
        </div>
        <h3 className="text-lg font-bold text-gray-700">No Assessment Record Loaded</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Please complete the initial Multi-Step Diagnostic Assessment step first to pipe biometric data into live Gemini AI models.
        </p>
        <button
          onClick={handleRestartClick}
          className="px-6 py-2.5 rounded-xl bg-[#3ECF8E] text-white text-xs font-bold uppercase tracking-wider shadow-[3px_3px_10px_rgba(62,207,142,0.3)] hover:scale-101 transition-all cursor-pointer"
        >
          Begin New Session
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="analysis-view-board">
      
      {/* Dynamic Session Heading inside frosted glass banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 rounded-3xl border border-[#3ECF8E]/25 shadow-sm relative overflow-hidden">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            ACTIVE TRIAGE LOG REPORT
          </span>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight font-sans mt-1">Generated Clinical Advice</h2>
        </div>

        <div className="flex gap-2 mt-3 sm:mt-0" id="analysis-action-bar">
          <button
            onClick={handlePrintMock}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold rounded-xl shadow-sm border border-gray-100 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
          >
            <ClipboardList className="w-4 h-4" />
            <span>PRINT PROTOCOL</span>
          </button>
          
          <button
            onClick={handleRestartClick}
            className="px-4 py-2 bg-gradient-to-r from-[#3ECF8E] to-[#2ecc8a] text-white text-xs font-bold rounded-xl shadow-md border-b border-[#2aa06a] hover:scale-101 flex items-center gap-1 cursor-pointer transition-all duration-200"
          >
            <span>NEW DIAGNOSTIC RUN</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {metadata && (
        <div className="bg-[#EDF4EE]/40 p-3.5 rounded-xl border border-white/80 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-gray-600 font-sans shadow-inner">
          <div>Report Duration: <b className="text-gray-800 font-mono font-bold">{metadata.duration}</b></div>
          <div>Report Severity: <b className="text-gray-800 font-mono font-bold">{metadata.severity} / 10</b></div>
          <div>Biometrics age: <b className="text-gray-800 font-mono font-bold">{metadata.personalInfo?.age} Yrs</b></div>
          <div>Assessed Symptoms count: <b className="text-gray-800 font-mono font-bold">{metadata.symptoms?.length}</b></div>
        </div>
      )}

      {/* Conditions layout list */}
      <div className="space-y-6" id="conditions-list-deck">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono ml-1">POSSIBLE PHYSIOLOGICAL CONDITIONS</h3>
        
        {analysis.conditions?.map((con, idx) => (
          <div 
            key={`${con.name}_${idx}`}
            className="group relative bg-white/80 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/60 shadow-[
              5px_5px_15px_rgba(100,120,105,0.06),
              -2px_-2px_10px_white,
              inset_1px_1px_3px_white
            ] hover:scale-[1.015] transition-all duration-300"
          >
            {/* Glossy overlay reflection lines */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-gray-150/50">
              <div>
                <span className="text-xs font-mono font-bold text-[#3ECF8E] tracking-wider block">PROBABILITY MATCH {idx + 1}</span>
                <h4 className="text-lg font-black text-gray-800 tracking-tight mt-0.5">{con.name}</h4>
              </div>

              {/* Likelihood & Severity Badge pills */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  con.likelihood === 'High' ? 'bg-orange-50 text-orange-600 border-orange-200 animate-pulse' :
                  con.likelihood === 'Medium' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  LIKELIHOOD: {con.likelihood}
                </span>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  con.severity === 'Severe' ? 'bg-red-50 text-red-600 border-red-200' :
                  con.severity === 'Moderate' ? 'bg-amber-50 text-amber-600 border-amber-250 animate-pulse' :
                  'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  SEVERITY: {con.severity}
                </span>
              </div>
            </div>

            {/* Condition physiological narrative */}
            <div className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed font-sans">{con.description}</p>

              {/* Treatments Matrix columns with tactile dividers */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-gray-400 font-mono block uppercase mb-3">Triage Intervention Channels</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="interventions-grid">
                  {con.treatments?.map((t, tIdx) => (
                    <div key={tIdx} className="bg-[#EDF3EE]/40 p-4 rounded-2xl border border-[#DCE5DE]/60 shadow-[inset_1px_1px_2px_white]">
                      <div className="text-xs font-mono font-extrabold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <CheckCircle className="w-3.5 h-3.5 text-[#3ECF8E] shrink-0" />
                        {t.name}
                      </div>

                      {/* Therapeutic evaluations */}
                      <div className="grid grid-cols-2 gap-3 mt-3 text-[10.5px]">
                        <div>
                          <span className="text-[#3ECF8E] font-bold block uppercase tracking-wider font-mono text-[9px] mb-1">PROS</span>
                          <ul className="space-y-1 text-gray-600 list-disc list-inside">
                            {t.pros?.map((pro, pIdx) => (
                              <li key={pIdx} className="leading-snug">{pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-amber-600 font-bold block uppercase tracking-wider font-mono text-[9px] mb-1">CONS</span>
                          <ul className="space-y-1 text-gray-600 list-disc list-inside">
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

              {/* Red flags warning signs for the condition */}
              {con.warningSigns && con.warningSigns.length > 0 && (
                <div className="p-3.5 bg-red-50/70 border border-red-200/60 rounded-xl mt-3">
                  <span className="text-[10px] font-extrabold text-red-600 font-mono uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                    Condition Warning Signs (Red Flags)
                  </span>
                  <ul className="space-y-1 text-red-700 text-xs font-semibold list-disc list-inside pl-1">
                    {con.warningSigns.map((w, wIdx) => (
                      <li key={wIdx} className="leading-relaxed">{w}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* Overview general clinician recommendation */}
      <div className="p-5 rounded-3xl bg-neutral-900 text-[#F4FFF6] shadow-xl border border-neutral-800 space-y-4 relative overflow-hidden" id="card-clinician-recommendation">
        
        {/* Glowing cyber clinical grids overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(62,207,142,0.15),transparent)]"></div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#4EE6A0]/10 rounded-xl border border-[#4EE6A0]/20">
            <UserCheck className="w-5.5 h-5.5 text-[#3ECF8E]" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight uppercase font-mono">Expert Advisor Evaluation</h4>
            <p className="text-[10px] text-gray-400 font-sans">CLINICAL TRIAGE RECOMMENDATIONS</p>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed pt-1.5 font-sans">
          {analysis.generalAdvice}
        </p>

        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
          <span className="text-[10px] font-bold text-[#3ECF8E] font-mono tracking-wider block mb-1 uppercase">DIAGNOSTIC CONSULTATION ADVICE</span>
          <p className="text-xs text-[#E1EAE1] leading-relaxed font-sans">{analysis.doctorAdvice}</p>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer box */}
      {disclaimer && (
        <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 text-[10.5px] text-gray-650 leading-relaxed font-semibold italic">
          <span className="inline-block px-1.5 py-0.5 bg-orange-500 text-white rounded text-[8px] font-mono font-bold tracking-wider not-italic mr-2">
            NOTICE
          </span>
          {disclaimer}
        </div>
      )}

    </div>
  );
}
