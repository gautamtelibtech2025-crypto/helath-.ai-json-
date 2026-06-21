import React, { useState } from 'react';
import { HealthReport } from '../types';
import { 
  History, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  ShieldAlert, 
  Calendar,
  Activity,
  Heart,
  PlusCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import { playPhysicalClick, playDiagnosticAlert } from '../utils/audio';

interface ReportsViewProps {
  reports: HealthReport[];
  soundEnabled: boolean;
  onDeleteReport: (id: string) => void;
  onSelectReportForAnalysis: (report: HealthReport) => void;
  onNavigateToWizard: () => void;
}

export default function ReportsView({ 
  reports, 
  soundEnabled, 
  onDeleteReport,
  onSelectReportForAnalysis,
  onNavigateToWizard
}: ReportsViewProps) {
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  const toggleExpandReport = (id: string) => {
    if (soundEnabled) playPhysicalClick();
    setExpandedReportId(prev => prev === id ? null : id);
  };

  const handleSelect = (report: HealthReport) => {
    if (soundEnabled) playPhysicalClick();
    onSelectReportForAnalysis(report);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (soundEnabled) playDiagnosticAlert();
    onDeleteReport(id);
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-16 space-y-4" id="empty-reports">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-md">
          <History className="w-7 h-7 text-[#3ECF8E]" />
        </div>
        <h3 className="text-lg font-bold text-gray-700">No Assessment Records Found</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          The database console is currently unpopulated. Complete a multi-step symptom wizard to log biometric results.
        </p>
        <button
          onClick={() => {
            if (soundEnabled) playPhysicalClick();
            onNavigateToWizard();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3ECF8E] to-[#2ecc8a] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] transition-transform cursor-pointer flex items-center gap-1.5 mx-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>BEGIN INITIAL RUN</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="reports-view-board">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-[#E8F5EB]/50 rounded-3xl border border-white/80 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">Archive Database</span>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight mt-1">Stored Triage Dossiers</h2>
        </div>
        <div className="text-xs font-mono font-bold text-gray-600 px-3 py-1 bg-white rounded-lg border shadow-sm mt-2 sm:mt-0">
          HEALTH RECORDS COUNT: {reports.length}
        </div>
      </div>

      <div className="space-y-4" id="reports-deck-list">
        {reports.map((report) => {
          const isExpanded = expandedReportId === report.id;
          const dateStr = new Date(report.createdAt).toLocaleString();

          return (
            <div 
              key={report.id}
              className={`bg-white/85 rounded-2xl border transition-all duration-300 relative ${
                isExpanded 
                  ? 'border-emerald-500/40 shadow-lg ring-1 ring-emerald-500/10' 
                  : 'border-gray-150/50 shadow-[3px_3px_10px_rgba(100,120,105,0.05)] hover:shadow-md'
              }`}
            >
              
              {/* Report summary card trigger bar */}
              <div 
                onClick={() => toggleExpandReport(report.id)}
                className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isExpanded ? 'bg-[#3ECF8E]/20 text-[#22C55E]' : 'bg-gray-100 text-gray-500'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 font-mono block uppercase">ID: {report.id}</span>
                    <div className="text-sm font-bold text-gray-800 tracking-tight mt-0.5">
                      Patient Report &bull; {report.personalInfo?.age} Yrs &bull; {report.personalInfo?.gender || 'N/A'}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{dateStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Gauge Level Pill */}
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    report.severity <= 3 ? 'bg-emerald-50 text-[#3ECF8E] border-emerald-200' :
                    report.severity <= 7 ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    Grave: {report.severity} / 10
                  </span>

                  {/* Accordion toggle and Delete tactile actions */}
                  <div className="flex items-center gap-1.5 pt-1 sm:pt-0">
                    <button
                      onClick={(e) => handleDelete(e, report.id)}
                      className="p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 border border-gray-100/50 hover:border-red-100 rounded-xl transition-all cursor-pointer shadow-sm"
                      title="Erase assessment log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="p-2 bg-gray-50 text-gray-500 rounded-xl border border-gray-100">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPANDED DETAILED REPORT DOSSIER DISPLAY */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-gray-100 space-y-4 bg-gradient-to-b from-white to-[#F4FAF5]/30 rounded-b-2xl animate-[fadeIn_0.2s_ease-out]">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-gray-600" id="report-metadata-columns">
                    <div className="space-y-1 bg-white p-3.5 rounded-xl border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 font-mono block uppercase mb-1">PHYSIOLOGICAL DATA FIELDS</span>
                      <div>Age checklist: <b>{report.personalInfo?.age} Yrs</b></div>
                      <div>Biological sex: <b className="uppercase">{report.personalInfo?.gender || 'N/A'}</b></div>
                      <div>Assessed weight parameter: <b>{report.personalInfo?.weight} kg</b></div>
                      <div>Assessed height parameter: <b>{report.personalInfo?.height} cm</b></div>
                      {report.personalInfo?.existingConditions && (
                        <div className="mt-2 text-gray-500 border-t border-dashed pt-1 text-[11px]">
                          Notes: <i>{report.personalInfo?.existingConditions}</i>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 bg-white p-3.5 rounded-xl border border-gray-100">
                      <span className="text-[9px] font-bold text-gray-400 font-mono block uppercase mb-1">SYMPTOM TIMELINE LOG</span>
                      <div>Reported Symptoms:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.symptoms?.map((sym) => (
                          <span key={sym} className="text-[9.5px] font-bold px-2 py-0.5 bg-emerald-50 text-[#3ECF8E] border border-emerald-100/40 rounded-md">
                            {sym}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-[11px]">
                        Subjective Duration: <b className="text-emerald-700 font-bold">{report.duration}</b>
                      </div>
                      {report.additionalDetails && (
                        <div className="mt-1 text-gray-500 text-[11px] leading-relaxed italic border-t border-dashed pt-1">
                          "{report.additionalDetails}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Diagnostic possible matches list shortcuts inside report */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                    <span className="text-[9px] font-bold text-gray-400 font-mono block uppercase">GENERATED DIAGNOSTIC RECOMMENDATIONS SUMMARY</span>
                    
                    <div className="space-y-2">
                      {report.analysis?.conditions?.map((con, cIdx) => (
                        <div key={cIdx} className="text-xs border-b last:border-b-0 pb-2 last:pb-0">
                          <div className="flex justify-between items-center font-bold text-gray-800">
                            <span>{con.name}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-[#3ECF8E] rounded border font-mono">
                              {con.likelihood} LIKELIHOOD
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">{con.description?.substring(0, 180)}...</p>
                        </div>
                      ))}
                    </div>

                    {/* View full clinical recommendation button */}
                    <div className="pt-2 border-t border-dashed border-gray-100 flex justify-end">
                      <button
                        onClick={() => handleSelect(report)}
                        className="px-4 py-2 bg-gradient-to-r from-[#3ECF8E] to-[#2ecc8a] text-white text-[11px] font-bold tracking-wide rounded-lg shadow-sm border-b border-[#2aa06a] hover:scale-101 cursor-pointer flex items-center gap-1 transition-all"
                      >
                        <span>VIEW ENTIRE TRIAGE LOG REPORT</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
