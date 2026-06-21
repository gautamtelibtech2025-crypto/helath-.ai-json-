import React from 'react';
import { TabType } from '../types';
import { 
  Activity, 
  ClipboardCheck, 
  BrainCircuit, 
  History, 
  Sliders, 
  Volume2, 
  VolumeX
} from 'lucide-react';
import { playTabActivation, playPhysicalClick, setAudioMuted } from '../utils/audio';

interface LayoutProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  children: React.ReactNode;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  highContrast: boolean;
}

export default function Layout({ 
  activeTab, 
  setActiveTab, 
  children, 
  soundEnabled, 
  setSoundEnabled,
  highContrast
}: LayoutProps) {

  const handleTabClick = (tab: TabType) => {
    if (soundEnabled) {
      playTabActivation();
    }
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    setAudioMuted(!nextState);
    if (nextState) {
      playPhysicalClick();
    }
  };

  const navigationItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Activity },
    { id: 'assessment' as TabType, label: 'Symptom Triage', icon: ClipboardCheck },
    { id: 'analysis' as TabType, label: 'AI Analysis', icon: BrainCircuit },
    { id: 'reports' as TabType, label: 'Saved Reports', icon: History },
    { id: 'settings' as TabType, label: 'Settings', icon: Sliders },
  ];

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans antialiased ${highContrast ? 'contrast-125' : ''}`}>
      
      {/* Top minimalistic navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-800 tracking-tight block">HealthAI</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Clinical Triage Assistant</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Simple Clean Audio Switcher */}
            <button 
              onClick={toggleSound}
              title={soundEnabled ? "Mute interface feedback" : "Unmute interface feedback"}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Container under the header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          
          {/* Side navigation rail */}
          <aside className="space-y-6">
            <nav className="space-y-1.5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0" id="sidebar-nav">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold cursor-pointer shrink-0 whitespace-nowrap ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#3ECF8E]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="hidden lg:block p-4 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 space-y-2">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">Triage Guidance</div>
              <p className="leading-relaxed">
                Enter demographic parameters & patient symptoms. The AI will provide educational clinical analysis & potential intervention paths.
              </p>
            </div>
          </aside>

          {/* Clean view panel */}
          <main className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-8 min-h-[500px]">
            {children}
          </main>

        </div>
      </div>
      
    </div>
  );
}
