'use client';

import React, { useState } from 'react';
import { INCIDENT_SIMULATIONS, IncidentSimulation } from '@/data/simulationsData';
import confetti from 'canvas-confetti';
import { 
  AlertTriangle, 
  Terminal, 
  CheckCircle2, 
  MapPin, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Flame, 
  Cpu, 
  ArrowLeft,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';

interface IncidentSimulatorProps {
  onEarnBadge?: (badgeName: string) => void;
}

export const IncidentSimulator: React.FC<IncidentSimulatorProps> = ({ onEarnBadge }) => {
  const [activeIncidentIndex, setActiveIncidentIndex] = useState(0);
  const [executedSteps, setExecutedSteps] = useState<Record<string, boolean>>({});
  const [selectedRootCause, setSelectedRootCause] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState(false);

  const incident = INCIDENT_SIMULATIONS[activeIncidentIndex];

  const handleExecuteStep = (stepId: string) => {
    setExecutedSteps((prev) => ({ ...prev, [stepId]: true }));
  };

  const handleSelectRootCause = (optionId: string, isCorrect: boolean) => {
    setSelectedRootCause(optionId);
    if (isCorrect) {
      setIsResolved(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onEarnBadge) {
        onEarnBadge(incident.badge);
      }
    }
  };

  const handleReset = () => {
    setExecutedSteps({});
    setSelectedRootCause(null);
    setIsResolved(false);
  };

  const handleSwitchIncident = (idx: number) => {
    setActiveIncidentIndex(idx);
    handleReset();
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner / Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F1117] border border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg font-bold text-[#E2E8F0]">
              סימולטור תקלות שטח עירוניות - עיריית רעננה
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            אימון מעשי בתרחישי אמת מורכבים בדרג ב&apos; (מצלמות LPR, שו״ב, VoIP ולולאות רשת)
          </p>
        </div>

        {/* Incident selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {INCIDENT_SIMULATIONS.map((inc, idx) => (
            <button
              key={inc.id}
              onClick={() => handleSwitchIncident(idx)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeIncidentIndex === idx
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)] border border-blue-400'
                  : 'bg-[#1A1D24] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>קריאה #{idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Incident Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0F1117] p-5 sm:p-7 backdrop-blur-sm space-y-6 shadow-md">
        
        {/* Ticket Header Details */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                {incident.urgencyLabel}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#1A1D24] text-slate-300 border border-slate-700">
                {incident.system}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {incident.siteName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#E2E8F0]">
              {incident.title}
            </h2>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-[#1A1D24] border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>איפוס חקירה</span>
          </button>
        </div>

        {/* Dispatch Report Box */}
        <div className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>דיווח ראשוני ממוקד העירייה:</span>
          </div>
          <p className="text-sm text-[#E2E8F0] leading-relaxed font-sans">
            &quot;{incident.initialReport}&quot;
          </p>
          <div className="text-xs text-slate-400 pt-1 border-t border-slate-800">
            ℹ️ <strong>רקע טכני של האתר:</strong> {incident.backgroundInfo}
          </div>
        </div>

        {/* Step 1: Investigation & Terminal Diagnostics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#E2E8F0] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              שלב 1: הרצת בדיקות דיאגנוסטיקה בטרמינל (CLI)
            </h4>
            <span className="text-xs text-slate-400">
              לחץ על כל בדיקה כדי להריץ אותה ולראות פלט
            </span>
          </div>

          <div className="space-y-3">
            {incident.investigationSteps.map((step, sIdx) => {
              const isExecuted = executedSteps[step.id];

              return (
                <div
                  key={step.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExecuted 
                      ? 'bg-[#0A0C10] border-blue-500/40' 
                      : 'bg-[#0A0C10]/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1A1D24] text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {sIdx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#E2E8F0]">
                        {step.label}
                      </span>
                    </div>

                    {!isExecuted ? (
                      <button
                        onClick={() => handleExecuteStep(step.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>הרץ פקודה</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-blue-400 shrink-0 font-medium">
                        <Check className="w-4 h-4" />
                        בוצע
                      </span>
                    )}
                  </div>

                  {/* Terminal output window if executed */}
                  {isExecuted && (
                    <div className="p-4 bg-black/90 border-t border-slate-800 font-mono text-xs space-y-3">
                      <div className="text-slate-400 flex items-center gap-2">
                        <span className="text-blue-400">$</span>
                        <code className="text-blue-300 font-bold">{step.command}</code>
                      </div>

                      <pre className="p-3 rounded-lg bg-[#0A0C10] text-slate-300 overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
                        {step.output}
                      </pre>

                      <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/30 text-blue-300 text-xs font-sans">
                        💡 <strong>ניתוח איש רשתות רמה ב&apos;:</strong> {step.analysis}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Root Cause Diagnosis Selection */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <h4 className="text-sm font-bold text-[#E2E8F0] flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400" />
            שלב 2: מהו גורם השורש (Root Cause) של התקלה?
          </h4>
          <p className="text-xs text-slate-400">
            בהתבסס על פלטי ה-CLI שחקרת, בחר את האבחנה המדויקת ביותר:
          </p>

          <div className="space-y-2.5">
            {incident.rootCauseOptions.map((opt) => {
              const isSelected = selectedRootCause === opt.id;
              let btnClass = 'bg-[#0A0C10] border-slate-800 text-slate-300 hover:border-slate-700';

              if (isSelected) {
                if (opt.isCorrect) {
                  btnClass = 'bg-blue-950/40 border-blue-500 text-blue-200 font-bold';
                } else {
                  btnClass = 'bg-red-950/40 border-red-500 text-red-200';
                }
              }

              return (
                <div key={opt.id} className="space-y-2">
                  <button
                    onClick={() => handleSelectRootCause(opt.id, opt.isCorrect)}
                    className={`w-full p-4 rounded-xl border text-right text-xs sm:text-sm transition-all flex items-center justify-between ${btnClass}`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    )}
                    {isSelected && !opt.isCorrect && (
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>

                  {/* Feedback on selection */}
                  {isSelected && (
                    <div className={`p-3 rounded-lg text-xs font-sans ${
                      opt.isCorrect ? 'bg-blue-950/30 text-blue-300 border border-blue-500/40' : 'bg-red-950/30 text-red-300 border border-red-500/40'
                    }`}>
                      {opt.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Success & Resolution Banner */}
        {isResolved && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#1A1D24] border border-blue-500/50 space-y-3 animate-in fade-in zoom-in-95 duration-200 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-base">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              <span>התקלה נפתרה בהצלחה ע&quot;י איש תקשורת רמה ב&apos;!</span>
            </div>
            <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
              🛠️ <strong>צעד הפתרון המיושם בעירייה:</strong> {incident.correctResolutionDescription}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-blue-300 font-mono">
              <span>🏆 תג הצטיינות שהושג:</span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/40 font-bold text-blue-200">
                {incident.badge}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
