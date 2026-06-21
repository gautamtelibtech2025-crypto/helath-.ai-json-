import React, { useState } from 'react';
import { HealthReport } from '../types';
import { 
  History, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
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
      <div className="text-center py-16 space-y-4 animate-[fadeIn_0.2s_ease-out]" id="empty-reports">
        <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Assessment Records Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          The local triaged patient history is unpopulated. Complete a symptom assessment wizard to record results.
        </p>
        <button
          onClick={() => {
            if (soundEnabled) playPhysicalClick();
            onNavigateToWizard();
          }}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Begin Symptom Assessment</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]" id="reports-view-board">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 rounded-xl border border-slate-200 gap-2">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">Archive Database</span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">Stored Assessment Dossiers</h2>
        </div>
        <div className="text-xs font-mono font-bold text-slate-600 px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm mt-1 sm:mt-0">
          TOTAL DATABASE LOGS: {reports.length}
        </div>
      </div>

      <div className="space-y-4 animate-[fadeIn_0.15s_ease-out]" id="reports-deck-list">
        {reports.map((report) => {
          const isExpanded = expandedReportId === report.id;
          const dateStr = new Date(report.createdAt).toLocaleString();

          return (
            <div 
              key={report.id}
              className={`bg-white rounded-lg border transition-all ${
                isExpanded 
                  ? 'border-emerald-600 shadow-sm' 
                  : 'border-slate-200 hover:border-slate-350 hover:shadow-xs'
              }`}
            >
              
              {/* Report trigger bar */}
              <div 
                onClick={() => toggleExpandReport(report.id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isExpanded ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block uppercase">ID: {report.id}</span>
                    <div className="text-xs font-bold text-slate-800 tracking-tight mt-0.5">
                      Patient Report &bull; {report.personalInfo?.age} Yrs &bull; {report.personalInfo?.gender || 'N/A'}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{dateStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    report.severity <= 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    report.severity <= 7 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    Grave: {report.severity} / 10
                  </span>

                  <div className="flex items-center gap-1.5 pt-1 sm:pt-0">
                    <button
                      onClick={(e) => handleDelete(e, report.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 bg-white hover:bg-red-50 border border-slate-200 rounded transition-all cursor-pointer shadow-sm"
                      title="Erase log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="p-1.5 bg-slate-55 text-slate-500 rounded border border-slate-200">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-200 bg-slate-50 rounded-b-lg space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-600" id="report-metadata-columns">
                    <div className="space-y-1 bg-white p-3.5 rounded-lg border border-slate-200">
                      <span className="text-[9px] font-bold text-slate-400 font-mono block uppercase mb-1">PHYSIOLOGICAL DATA FIELDS</span>
                      <div>Age checklist: <b>{report.personalInfo?.age} Yrs</b></div>
                      <div>Biological sex: <b className="uppercase">{report.personalInfo?.gender || 'N/A'}</b></div>
                      <div>Assessed weight parameter: <b>{report.personalInfo?.weight} kg</b></div>
                      <div>Assessed height parameter: <b>{report.personalInfo?.height} cm</b></div>
                      {report.personalInfo?.existingConditions && (
                        <div className="mt-2 text-slate-500 border-t border-dashed border-slate-200 pt-2 text-[10.5px]">
                          Notes: <i>{report.personalInfo?.existingConditions}</i>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 bg-white p-3.5 rounded-lg border border-slate-200">
                      <span className="text-[9px] font-bold text-slate-400 font-mono block uppercase mb-1">SYMPTOM TIMELINE LOG</span>
                      <div>Reported Symptoms:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {report.symptoms?.map((sym) => (
                          <span key={sym} className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded">
                            {sym}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-[11px]">
                        Subjective Duration: <b className="text-[#059669] font-bold">{report.duration}</b>
                      </div>
                      {report.additionalDetails && (
                        <div className="mt-1 text-slate-500 text-[10.5px] leading-relaxed italic border-t border-dashed border-slate-200 pt-2">
                          "{report.additionalDetails}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Conditions shortcuts */}
                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                    <span className="text-[9px] font-bold text-slate-400 font-mono block uppercase">GENERATED DIAGNOSTIC RECOMMENDATIONS SUMMARY</span>
                    
                    <div className="space-y-2">
                      {report.analysis?.conditions?.map((con, cIdx) => (
                        <div key={cIdx} className="text-xs border-b border-slate-100 last:border-b-0 pb-2 last:pb-0">
                          <div className="flex justify-between items-center font-bold text-slate-800">
                            <span>{con.name}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 font-mono">
                              {con.likelihood} LIKELIHOOD
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{con.description?.substring(0, 180)}...</p>
                        </div>
                      ))}
                    </div>

                    {/* View full clinical recommendation button */}
                    <div className="pt-2 border-t border-dashed border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleSelect(report)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-950 text-white text-[11px] font-bold tracking-wide rounded hover:scale-101 cursor-pointer flex items-center gap-1 transition-all"
                      >
                        <span>View Entire Triage Log Report</span>
                        <ChevronRight className="w-3 h-3" />
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
