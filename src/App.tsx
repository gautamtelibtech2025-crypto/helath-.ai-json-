import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import AssessmentView from './components/AssessmentView';
import AnalysisView from './components/AnalysisView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import { TabType, HealthReport, AnalysisResponse } from './types';
import { playPhysicalClick } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Buffer holding currently generated report from active session to pass directly to Analysis panel
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);
  const [currentDisclaimer, setCurrentDisclaimer] = useState<string>('');
  const [currentReportMetadata, setCurrentReportMetadata] = useState<any>(null);

  // Fetch reports from database container on startup
  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {
      console.warn("Could not retrieve reports database records:", e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAnalysisSuccess = (analysis: AnalysisResponse, discl: string, reportObj: HealthReport) => {
    setCurrentAnalysis(analysis);
    setCurrentDisclaimer(discl);
    setCurrentReportMetadata(reportObj);
    
    // Refresh records immediately
    fetchReports();

    // Route active operator straight to AI analysis view screen
    setActiveTab('analysis');
  };

  const handleDeleteReport = async (id: string) => {
    try {
      // For local and database cleanup: we can maintain local removal
      // We will perform local cleanup & update state
      setReports(prev => prev.filter(r => r.id !== id));
      
      // If deleted active report being read, clear active pane
      if (currentReportMetadata?.id === id) {
        setCurrentAnalysis(null);
        setCurrentDisclaimer('');
        setCurrentReportMetadata(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectReportForAnalysis = (report: HealthReport) => {
    setCurrentAnalysis(report.analysis);
    setCurrentDisclaimer(report.disclaimer || '');
    setCurrentReportMetadata(report);
    setActiveTab('analysis');
  };

  // Preset medical reports seed to make the app feel fully populated
  const handleSeedDemoData = async () => {
    const demos: HealthReport[] = [
      {
        id: `rep_demo_1`,
        createdAt: new Date(Date.now() - 36*3600*1000).toISOString(), // 36h ago
        personalInfo: {
          age: '34',
          gender: 'female',
          weight: '62',
          height: '168',
          existingConditions: 'Allergic to sulfonamides'
        },
        symptoms: ['Dry Cough', 'Shortness of Breath', 'Wheezing'],
        duration: '4 to 7 days',
        severity: 7,
        additionalDetails: 'Cough worsens in sleep, moderate rib tightening breathing.',
        analysis: {
          conditions: [
            {
              name: 'Bronchial Spasm / Reactive Airway response',
              likelihood: 'High',
              severity: 'Moderate',
              description: 'Inflammatory hyper-responsiveness of the bronchial tract, potentially triggered by seasonal particles or pre-existing sensitivity.',
              treatments: [
                {
                  name: 'Targeted Hydration & Steam Inhalation',
                  pros: ['Loosens vocal congestions', 'Zero synthetic intake risk'],
                  cons: ['Transient benefit', 'Slow onset']
                },
                {
                  name: 'Bronchodilator (as directed by physician)',
                  pros: ['Immediate airway expansion', 'Reduces asthma wheeze response'],
                  cons: ['May raise heart pulse rate slightly', 'Requires formal prescription']
                }
              ],
              warningSigns: ['Severe struggle catching breath', 'Cyanosis lip indicators']
            }
          ],
          generalAdvice: 'Highly advise avoiding immediate cold climates, dust, and dry ventilation environments while respiratory track rest is monitored.',
          doctorAdvice: 'Inquire with a general physician or pulmonologist about spirometry readings.'
        },
        disclaimer: 'AI TRIAGE DISCLAIMER: Generated medical simulation report. Consult a general practitioner.'
      },
      {
        id: `rep_demo_2`,
        createdAt: new Date(Date.now() - 4*3600*1000).toISOString(), // 4h ago
        personalInfo: {
          age: '45',
          gender: 'male',
          weight: '88',
          height: '182',
          existingConditions: 'History of high blood pressure'
        },
        symptoms: ['Fever / Chills', 'Chronic Fatigue', 'Generalized Body Aches'],
        duration: '1 to 3 days',
        severity: 6,
        additionalDetails: 'Felt fever spike around 38.3°C, body feeling totally bone-dry tired.',
        analysis: {
          conditions: [
            {
              name: 'Acute Viral Syndrome (Infectious flu presentation)',
              likelihood: 'High',
              severity: 'Moderate',
              description: 'A systemic immune replication response consistent with standard seasonal viral agents.',
              treatments: [
                {
                  name: 'Fever Management & Controlled Warm Compresses',
                  pros: ['Encourages safe heat dissipation', 'Reduces muscle aches'],
                  cons: ['Requires continuous tracking']
                },
                {
                  name: 'Strict Mineral Electrolyte Rest',
                  pros: ['Preempts severe hydration exhaustion', 'Sustains optimal recovery levels'],
                  cons: ['Requires frequent safe bathroom access']
                }
              ],
              warningSigns: ['Persistent fever above 39.5°C unresponsive to standard anti-pyretics']
            }
          ],
          generalAdvice: 'Isolate, hydrate abundantly, and log thermal variables three times daily.',
          doctorAdvice: 'Telehealth clinical assessment or pharmacotherapy consulting is highly recommended if fever persists past 72 hrs.'
        },
        disclaimer: 'AI TRIAGE DISCLAIMER: Generated medical simulation report. Consult a general practitioner.'
      }
    ];

    // Post both to the backend to populate reportsDb
    for (const demo of demos) {
      try {
        await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(demo)
        });
      } catch(err) {
        console.warn("Seeding error:", err);
      }
    }

    fetchReports();
  };

  const handleFlushData = async () => {
    // Clear state
    setReports([]);
    setCurrentAnalysis(null);
    setCurrentDisclaimer('');
    setCurrentReportMetadata(null);
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      soundEnabled={soundEnabled}
      setSoundEnabled={setSoundEnabled}
      highContrast={highContrast}
    >
      {activeTab === 'dashboard' && (
        <DashboardView 
          onStartAssessment={() => setActiveTab('assessment')}
          savedReportsCount={reports.length}
          soundEnabled={soundEnabled}
        />
      )}

      {activeTab === 'assessment' && (
        <AssessmentView 
          soundEnabled={soundEnabled}
          onAnalysisSuccess={handleAnalysisSuccess}
          goToTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'analysis' && (
        <AnalysisView 
          analysis={currentAnalysis}
          disclaimer={currentDisclaimer}
          soundEnabled={soundEnabled}
          onRestart={() => setActiveTab('assessment')}
          metadata={currentReportMetadata}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsView 
          reports={reports}
          soundEnabled={soundEnabled}
          onDeleteReport={handleDeleteReport}
          onSelectReportForAnalysis={handleSelectReportForAnalysis}
          onNavigateToWizard={() => setActiveTab('assessment')}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView 
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          onFlushData={handleFlushData}
          onSeedDemoData={handleSeedDemoData}
        />
      )}
    </Layout>
  );
}
