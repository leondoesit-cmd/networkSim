'use client';

import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS, InterviewQuestion } from '@/data/interviewQuestions';
import { 
  Briefcase, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface InterviewQuizProps {
  onAskAiQuestion: (question: string) => void;
}

export const InterviewQuiz: React.FC<InterviewQuizProps> = ({ onAskAiQuestion }) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    [INTERVIEW_QUESTIONS[0].id]: true
  });
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1117] border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Building2 className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-[#E2E8F0]">
              הכנה למבחן וראיון קבלה - משרה 7274 עיריית רעננה
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            מאגר שאלות טכניות ממוקדות שהוצגו למועמדים לוועדות קבלה לתפקיד איש/ת תקשורת ורשתות רמה ב&apos;
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold">
            {INTERVIEW_QUESTIONS.length} שאלות מבחן
          </span>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {INTERVIEW_QUESTIONS.map((q, idx) => {
          const isExpanded = !!expandedQuestions[q.id];
          const isRevealed = !!revealedAnswers[q.id];

          return (
            <div
              key={q.id}
              className="rounded-2xl border border-white/10 bg-[#0F1117] transition-all overflow-hidden backdrop-blur-sm hover:border-blue-500/30 shadow-sm"
            >
              {/* Question Header Accordion */}
              <button
                onClick={() => toggleExpand(q.id)}
                className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-right hover:bg-[#1A1D24]/40 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-slate-400 font-medium">
                        {q.topic}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded font-mono ${
                        q.difficulty === 'מתקדם' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}>
                        רמת קושי: {q.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#E2E8F0]">
                      {q.question}
                    </h4>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0A0C10]/60 space-y-4">
                  
                  {/* Municipal Relevance */}
                  <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>למה זה נשאל בעיריית רעננה:</strong> {q.raananaRelevance}</span>
                  </div>

                  {/* Toggle reveal answer */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="flex items-center gap-2 text-xs sm:text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)]"
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>הסתר תשובת זהב אידיאלית</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>חשוף תשובת זהב אידיאלית של איש דרג ב&apos;</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onAskAiQuestion(`איך לענות בראיון עבודה של עיריית רעננה למשרה 7274 על השאלה: "${q.question}"? תן לי הסבר מפורט, טכני ומנצח.`)}
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>שאל את יועץ ה-AI להרחבה</span>
                    </button>
                  </div>

                  {/* The Revealed Answer */}
                  {isRevealed && (
                    <div className="space-y-4 pt-2 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-5 rounded-2xl bg-[#1A1D24] border border-blue-500/40 space-y-2 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>התשובה האידיאלית להצגה בוועדת הקבלה:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed font-sans">
                          {q.idealAnswer}
                        </p>
                      </div>

                      {/* Key Points Checklist */}
                      <div className="p-4 rounded-xl bg-[#0A0C10] border border-slate-800 space-y-2">
                        <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          דגשי מפתח שהמראיין בודק בתשובתך:
                        </h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                          {q.keyPoints.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
