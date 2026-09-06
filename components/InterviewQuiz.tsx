'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { INTERVIEW_QUESTIONS, InterviewQuestion, QuestionCategory } from '@/data/interviewQuestions';
import { useLanguage } from '@/context/LanguageContext';
import { audioFeedback } from '@/lib/audioFeedback';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Eye,
  EyeOff,
  Flame,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Timer,
  X,
  Zap,
} from 'lucide-react';

interface InterviewQuizProps {
  onAskAiQuestion: (question: string) => void;
}

const CATEGORY_COLORS: Record<QuestionCategory, { bg: string; text: string; border: string }> = {
  Cisco: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  PRTG: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  VoIP: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Smart City': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
  L1: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

const EXAM_DURATION_SECONDS = 1800; // 30:00 minutes
const EXAM_QUESTION_COUNT = 20;

export const InterviewQuiz: React.FC<InterviewQuizProps> = ({ onAskAiQuestion }) => {
  const { lang, isRtl } = useLanguage();
  const isEn = lang === 'en';

  // Mode: 'study' (בנק שאלות ועיון) vs 'exam' (סימולציית מבחן מתוזמן)
  const [quizMode, setQuizMode] = useState<'study' | 'exam'>('study');

  // Study Mode State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    [INTERVIEW_QUESTIONS[0]?.id ?? 'iq-1']: true,
  });
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Timed Exam Mode State
  const [examQuestions, setExamQuestions] = useState<InterviewQuestion[]>([]);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examConfidence, setExamConfidence] = useState<Record<string, 'high' | 'medium' | 'low'>>({});
  const [timeLeft, setTimeLeft] = useState<number>(EXAM_DURATION_SECONDS);
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);

  // Initialize or Reset Exam
  const initExam = () => {
    audioFeedback.playChime();
    // Randomly pick EXAM_QUESTION_COUNT questions
    const shuffled = [...INTERVIEW_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, EXAM_QUESTION_COUNT);
    setExamQuestions(selected);
    setCurrentExamIndex(0);
    setExamAnswers({});
    setExamConfidence({});
    setTimeLeft(EXAM_DURATION_SECONDS);
    setIsExamSubmitted(false);
  };

  // Initialize exam on first switch to exam mode
  const handleSwitchMode = (mode: 'study' | 'exam') => {
    audioFeedback.playKeyClick();
    setQuizMode(mode);
    if (mode === 'exam' && (examQuestions.length === 0 || isExamSubmitted)) {
      initExam();
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (quizMode !== 'exam' || isExamSubmitted) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          audioFeedback.playWarning();
          setIsExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizMode, isExamSubmitted]);

  // Submit Exam handler
  const handleSubmitExam = () => {
    audioFeedback.playSuccess();
    setIsExamSubmitted(true);
  };

  // Study mode toggle expand
  const toggleExpand = (id: string) => {
    audioFeedback.playKeyClick();
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Study mode toggle reveal
  const toggleReveal = (id: string) => {
    audioFeedback.playKeyClick();
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter questions for study mode
  const filteredStudyQuestions = useMemo(() => {
    if (selectedCategory === 'all') return INTERVIEW_QUESTIONS;
    return INTERVIEW_QUESTIONS.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  // Exam Scoring Calculation
  const examResults = useMemo(() => {
    if (!isExamSubmitted || examQuestions.length === 0) return null;

    let correctCount = 0;
    const categoryStats: Record<QuestionCategory, { total: number; correct: number }> = {
      Cisco: { total: 0, correct: 0 },
      PRTG: { total: 0, correct: 0 },
      VoIP: { total: 0, correct: 0 },
      'Smart City': { total: 0, correct: 0 },
      L1: { total: 0, correct: 0 },
    };

    const missedQuestions: Array<{ question: InterviewQuestion; selectedOptionId?: string }> = [];

    examQuestions.forEach((q) => {
      const selectedId = examAnswers[q.id];
      const correctOption = q.options?.find((o) => o.isCorrect);
      const isCorrect = selectedId && correctOption && selectedId === correctOption.id;

      if (categoryStats[q.category]) {
        categoryStats[q.category].total += 1;
        if (isCorrect) {
          categoryStats[q.category].correct += 1;
        }
      }

      if (isCorrect) {
        correctCount += 1;
      } else {
        missedQuestions.push({ question: q, selectedOptionId: selectedId });
      }
    });

    const score = Math.round((correctCount / examQuestions.length) * 100);
    const isPassed = score >= 80;

    return {
      score,
      correctCount,
      totalCount: examQuestions.length,
      isPassed,
      categoryStats,
      missedQuestions,
    };
  }, [isExamSubmitted, examQuestions, examAnswers]);

  // Format MM:SS timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 300; // less than 5 minutes

  const currentQ = examQuestions[currentExamIndex];

  return (
    <div className="w-full space-y-6" suppressHydrationWarning>
      {/* Header Card with Mode Switcher */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/30">
              <Building2 className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-[var(--ink)]">
              {isEn
                ? 'Job 7274 Examination & Interview Prep · Ra\'anana Municipality'
                : 'הכנה למבחן וראיון קבלה · משרה 7274 עיריית רעננה'}
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)]">
            {isEn
              ? 'Comprehensive technical evaluation for Municipal Network Engineer Level II (Cisco, PRTG, VoIP, Smart City, L1).'
              : 'מאגר שאלות וסימולציית מבחן מתוזמן לוועדת קבלה לתפקיד איש/ת תקשורת ורשתות דרג ב׳.'}
          </p>
        </div>

        {/* Mode Toggle Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-1 text-xs">
            <button
              type="button"
              onClick={() => handleSwitchMode('study')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all',
                quizMode === 'study'
                  ? 'bg-[var(--panel)] text-[var(--ink)] shadow-sm border border-[var(--line)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEn ? 'Question Bank (Study)' : 'בנק שאלות ועיון'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('exam')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all',
                quizMode === 'exam'
                  ? 'bg-[var(--brass)] text-[#1a160f] font-semibold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              )}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{isEn ? 'Timed Exam (30m)' : 'סימולציית מבחן מתוזמן'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TIMED EXAM MODE */}
      {/* ========================================================= */}
      {quizMode === 'exam' && (
        <div className="space-y-6">
          {!isExamSubmitted ? (
            /* ACTIVE EXAM INTERFACE */
            <div className="space-y-4">
              {/* Exam Status Bar */}
              <div className="p-3 sm:p-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-sm">
                <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 w-full sm:w-auto">
                  {/* Countdown Timer Display */}
                  <div
                    className={cn(
                      'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border font-mono text-xs sm:text-sm font-bold transition-all',
                      isLowTime
                        ? 'border-[var(--alert)] bg-[var(--alert)]/15 text-[var(--alert)] animate-pulse'
                        : 'border-[var(--brass)]/40 bg-[var(--brass)]/10 text-[var(--brass)]'
                    )}
                  >
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>{formatTime(timeLeft)}</span>
                    {isLowTime && (
                      <span className="text-[10px] uppercase tracking-wider font-sans max-sm:hidden">
                        ({isEn ? '< 5m Warning' : 'פחות מ-5 דקות!'})
                      </span>
                    )}
                  </div>

                  {/* Answer Progress */}
                  <div className="text-xs text-[var(--muted)] font-mono shrink-0">
                    <span className="text-[var(--ink)] font-bold">{Object.keys(examAnswers).length}</span> / {examQuestions.length}{' '}
                    {isEn ? 'answered' : 'נענו'}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSubmitExam}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--brass)] px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-[#1a160f] hover:opacity-90 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{isEn ? 'Submit Exam' : 'סיים והגש מבחן'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={initExam}
                    title={isEn ? 'Restart Exam' : 'התחל מבחן מחדש'}
                    className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg border border-[var(--line)] bg-[var(--canvas)] text-[var(--muted)] hover:text-[var(--ink)] shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Navigation Matrix */}
              <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--line)] bg-[var(--panel)]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)] mb-2">
                  <span>{isEn ? 'Question Grid' : 'מפת שאלות המבחן:'}</span>
                  <span className="hidden xs:inline">
                    {isEn ? 'Click any number to jump' : 'לחץ על מספר כדי לדלג ישירות'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {examQuestions.map((q, idx) => {
                    const isAnswered = !!examAnswers[q.id];
                    const isCurrent = idx === currentExamIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          audioFeedback.playKeyClick();
                          setCurrentExamIndex(idx);
                        }}
                        className={cn(
                          'h-7 w-7 rounded-md font-mono text-xs font-bold transition-all flex items-center justify-center',
                          isCurrent
                            ? 'bg-[var(--brass)] text-[#1a160f] ring-2 ring-[var(--brass)]/50'
                            : isAnswered
                              ? 'bg-[var(--signal)]/20 text-[var(--signal)] border border-[var(--signal)]/40'
                              : 'bg-[var(--canvas)] text-[var(--muted)] border border-[var(--line)] hover:border-[var(--line-strong)]'
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question Card */}
              {currentQ && (
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-sm">
                  {/* Question Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-3 sm:pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/30">
                        {isEn ? `Question ${currentExamIndex + 1} of ${examQuestions.length}` : `שאלה ${currentExamIndex + 1} מתוך ${examQuestions.length}`}
                      </span>
                      {currentQ.category && (
                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono font-bold border', CATEGORY_COLORS[currentQ.category]?.bg, CATEGORY_COLORS[currentQ.category]?.text, CATEGORY_COLORS[currentQ.category]?.border)}>
                          {currentQ.category}
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--line)] text-[var(--muted)]">
                        {currentQ.difficulty}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--muted)] font-mono">
                      {currentQ.topic}
                    </div>
                  </div>

                  {/* Question Text */}
                  <h4 className="text-base sm:text-lg font-bold text-[var(--ink)] leading-relaxed">
                    {currentQ.question}
                  </h4>

                  {/* Municipal Relevance Note */}
                  <div className="p-3 rounded-xl bg-[var(--canvas)] border border-[var(--line)] text-xs text-[var(--muted)] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[var(--brass)] shrink-0" />
                    <span>
                      <strong className="text-[var(--ink)]">
                        {isEn ? 'Municipal Context (Ra\'anana): ' : 'הקשר מוניציפלי (עיריית רעננה): '}
                      </strong>
                      {currentQ.raananaRelevance}
                    </span>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-2.5 pt-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">
                      {isEn ? 'Select your answer:' : 'בחר את התשובה המדויקת ביותר:'}
                    </div>
                    <div className="space-y-2">
                      {currentQ.options?.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isSelected = examAnswers[currentQ.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              audioFeedback.playKeyClick();
                              setExamAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }));
                            }}
                            className={cn(
                              'w-full flex items-start gap-3 rounded-xl border p-3 sm:p-3.5 text-start transition-all',
                              isSelected
                                ? 'border-[var(--brass)] bg-[var(--brass)]/15 shadow-[0_0_15px_rgba(196,163,90,0.15)] ring-1 ring-[var(--brass)]/50'
                                : 'border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--line-strong)] hover:bg-[var(--canvas)]/80'
                            )}
                          >
                            <span
                              className={cn(
                                'grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-xs font-bold transition-colors mt-0.5',
                                isSelected
                                    ? 'bg-[var(--brass)] text-[#1a160f]'
                                    : 'border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)]'
                              )}
                            >
                              {letter}
                            </span>
                            <span className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed font-sans">
                              {opt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Confidence Rating */}
                  <div className="p-2.5 sm:p-3 rounded-xl border border-[var(--line)] bg-[var(--canvas)]/60 flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[var(--brass)] shrink-0" />
                      <span>{isEn ? 'Self-rated confidence:' : 'רמת ביטחון בתשובה:'}</span>
                    </span>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs">
                      {(['high', 'medium', 'low'] as const).map((lvl) => {
                        const label = lvl === 'high'
                          ? (isEn ? 'High' : 'בטוח לחלוטין')
                          : lvl === 'medium'
                            ? (isEn ? 'Medium' : 'מתלבט')
                            : (isEn ? 'Educated Guess' : 'ניחוש מושכל');
                        const isChosen = examConfidence[currentQ.id] === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              audioFeedback.playKeyClick();
                              setExamConfidence((prev) => ({ ...prev, [currentQ.id]: lvl }));
                            }}
                            className={cn(
                              'px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition-all',
                              isChosen
                                ? 'border border-[var(--brass)] bg-[var(--brass)]/20 text-[var(--brass)] font-bold'
                                : 'border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]'
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question Bottom Navigation */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 border-t border-[var(--line)]">
                    <button
                      type="button"
                      disabled={currentExamIndex === 0}
                      onClick={() => {
                        audioFeedback.playKeyClick();
                        setCurrentExamIndex((i) => Math.max(0, i - 1));
                      }}
                      className="inline-flex min-h-10 sm:min-h-11 items-center gap-1 sm:gap-1.5 rounded-lg border border-[var(--line)] px-2.5 sm:px-4 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {isRtl ? <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      <span>{isEn ? 'Previous' : 'שאלה קודמת'}</span>
                    </button>

                    {currentExamIndex < examQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          audioFeedback.playKeyClick();
                          setCurrentExamIndex((i) => Math.min(examQuestions.length - 1, i + 1));
                        }}
                        className="inline-flex min-h-10 sm:min-h-11 items-center gap-1 sm:gap-1.5 rounded-lg bg-[var(--brass)] px-3 sm:px-4 text-xs font-bold text-[#1a160f] shadow-sm hover:opacity-90"
                      >
                        <span>{isEn ? 'Next' : 'שאלה הבאה'}</span>
                        {isRtl ? <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitExam}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[var(--signal)] px-5 text-xs font-bold text-[#0F1117] shadow-sm hover:opacity-90"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isEn ? 'Submit Final Exam' : 'הגש מבחן סופי'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* FINAL EXAM REPORT */
            examResults && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Scorecard Hero Banner */}
                <div className={cn(
                  'rounded-2xl border p-6 sm:p-8 text-center space-y-4 shadow-sm',
                  examResults.isPassed
                    ? 'border-[var(--signal)]/50 bg-[var(--signal)]/10 shadow-[0_0_30px_rgba(74,222,128,0.15)]'
                    : 'border-[var(--alert)]/50 bg-[var(--alert)]/10 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
                )}>
                  <div className={cn(
                    'mx-auto grid h-16 w-16 place-items-center rounded-full border',
                    examResults.isPassed
                      ? 'border-[var(--signal)] bg-[var(--signal)]/20 text-[var(--signal)]'
                      : 'border-[var(--alert)] bg-[var(--alert)]/20 text-[var(--alert)]'
                  )}>
                    {examResults.isPassed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-[var(--ink)]">
                      {examResults.isPassed
                        ? (isEn ? 'Exam Passed Successfully!' : 'עבר בהצלחה · עמדת ברף מכרז 7274!')
                        : (isEn ? 'Exam Not Passed · Below Threshold' : 'לא עבר · ציון מתחת לרף 80%')}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--muted)] mt-1 max-w-xl mx-auto leading-relaxed">
                      {examResults.isPassed
                        ? (isEn
                          ? 'Congratulations! You met the 80% qualification threshold required by the Ra\'anana municipal acceptance committee for Level II Network Engineer.'
                          : 'מזל טוב! השגת ציון מעל רף ה-80% הנדרש בוועדת הקבלה של עיריית רעננה לתפקיד איש רשתות ותקשורת דרג ב׳.')
                        : (isEn
                          ? 'The minimum pass score for Tender 7274 is 80%. Review the weak topics below, ask the AI consultant for detailed drill-downs, and retake the exam.'
                          : 'סף המעבר למכרז 7274 הינו 80%. עיין בתחומים שסומנו כדורשי שיפור, היעזר ביועץ ה-AI להעמקה ובצע מבחן חוזר.')}
                    </p>
                  </div>

                  {/* Score Number Display */}
                  <div className="flex items-center justify-center gap-6 py-2">
                    <div className="text-center">
                      <div className="font-mono text-4xl sm:text-5xl font-extrabold text-[var(--brass)]">
                        {examResults.score}
                        <span className="text-lg font-normal text-[var(--muted)]"> / 100</span>
                      </div>
                      <div className="text-[11px] font-mono text-[var(--muted)] mt-1">
                        {examResults.correctCount} / {examResults.totalCount} {isEn ? 'correct questions' : 'תשובות נכונות'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={initExam}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--brass)] px-5 text-xs font-bold text-[#1a160f] shadow-sm hover:opacity-90"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isEn ? 'Retake Exam (New Questions)' : 'בצע מבחן חוזר (שאלות בערבוב חדש)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuizMode('study')}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-4 text-xs font-semibold text-[var(--ink)] hover:border-[var(--line-strong)]"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{isEn ? 'Return to Question Bank' : 'חזור למאגר שאלות מלא'}</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Category Breakdown */}
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6 space-y-4 shadow-sm">
                  <h4 className="text-sm sm:text-base font-bold text-[var(--ink)] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[var(--brass)]" />
                    <span>{isEn ? 'Performance Breakdown by Technical Domain' : 'ניתוח ביצועים מפורט לפי תחומי ידע (מכרז 7274)'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(Object.keys(examResults.categoryStats) as QuestionCategory[]).map((cat) => {
                      const stat = examResults.categoryStats[cat];
                      if (stat.total === 0) return null;
                      const percent = Math.round((stat.correct / stat.total) * 100);
                      const isStrong = percent >= 80;

                      return (
                        <div
                          key={cat}
                          className={cn(
                            'rounded-xl border p-4 space-y-2',
                            isStrong
                              ? 'border-[var(--signal)]/30 bg-[var(--signal)]/5'
                              : 'border-[var(--alert)]/30 bg-[var(--alert)]/5'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[var(--ink)]">{cat}</span>
                            <span
                              className={cn(
                                'text-[11px] font-mono font-bold px-2 py-0.5 rounded',
                                isStrong
                                  ? 'bg-[var(--signal)]/20 text-[var(--signal)]'
                                  : 'bg-[var(--alert)]/20 text-[var(--alert)]'
                              )}
                            >
                              {percent}%
                            </span>
                          </div>

                          <div className="w-full bg-[var(--canvas)] rounded-full h-1.5 overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all', isStrong ? 'bg-[var(--signal)]' : 'bg-[var(--alert)]')}
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-mono pt-1">
                            <span>
                              {stat.correct} / {stat.total} {isEn ? 'correct' : 'נכונות'}
                            </span>
                            <span className={cn('font-sans font-medium', isStrong ? 'text-[var(--signal)]' : 'text-[var(--alert)]')}>
                              {isStrong ? (isEn ? 'Strong' : 'תחום חזק') : (isEn ? 'Needs Review' : 'דורש שיפור')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Missed Questions with AI Consultant */}
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-bold text-[var(--ink)] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[var(--alert)]" />
                      <span>
                        {isEn
                          ? `Missed Questions Review (${examResults.missedQuestions.length})`
                          : `תחקיר שאלות שלא נענו נכונה (${examResults.missedQuestions.length})`}
                      </span>
                    </h4>
                    <span className="text-xs text-[var(--muted)]">
                      {isEn ? 'Send to AI for detailed coaching' : 'לחץ לשליחה מיידית ליועץ ה-AI'}
                    </span>
                  </div>

                  {examResults.missedQuestions.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[var(--signal)]/10 border border-[var(--signal)]/30 text-xs text-[var(--signal)] flex items-center gap-2 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEn ? 'Flawless performance! You answered every question correctly.' : 'ביצוע מושלם! ענית נכונה על כל שאלות המבחן.'}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {examResults.missedQuestions.map(({ question: q, selectedOptionId }, idx) => {
                        const correctOpt = q.options?.find((o) => o.isCorrect);
                        const userOpt = q.options?.find((o) => o.id === selectedOptionId);

                        return (
                          <div
                            key={q.id}
                            className="rounded-xl border border-[var(--line)] bg-[var(--canvas)] p-4 space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-mono text-xs text-[var(--brass)] font-bold">
                                #{idx + 1} · {q.category} · {q.topic}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  onAskAiQuestion(
                                    `בסימולציית מבחן משרה 7274 של עיריית רעננה טעיתי בשאלה הבאה:\n"${q.question}"\nהתשובה שבחרתי: ${userOpt ? userOpt.text : 'לא נענה'}.\nהסבר לי בפירוט מדוע התשובה האידיאלית היא: "${q.idealAnswer}" וכיצד מועמד דרג ב' צריך להרחיב על כך מול ועדת הקבלה.`
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--brass)]/50 bg-[var(--brass)]/15 px-3 py-1.5 text-xs font-bold text-[var(--brass)] hover:bg-[var(--brass)]/25 transition-all shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>{isEn ? 'Send to AI Advisor' : 'שלח שאלה ליועץ ה-AI'}</span>
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm font-semibold text-[var(--ink)] leading-snug">
                              {q.question}
                            </p>

                            {/* User selection vs Correct Answer */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-[var(--alert)]/10 border border-[var(--alert)]/30 text-[var(--alert)] space-y-1">
                                <div className="font-mono font-bold flex items-center gap-1">
                                  <X className="w-3.5 h-3.5" />
                                  <span>{isEn ? 'Your Answer:' : 'התשובה שסימנת:'}</span>
                                </div>
                                <p className="text-[11px] text-[var(--ink)]">
                                  {userOpt ? userOpt.text : (isEn ? 'Unanswered' : 'לא סומנה תשובה')}
                                </p>
                              </div>

                              <div className="p-2.5 rounded-lg bg-[var(--signal)]/10 border border-[var(--signal)]/30 text-[var(--signal)] space-y-1">
                                <div className="font-mono font-bold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{isEn ? 'Correct Golden Answer:' : 'התשובה הנכונה:'}</span>
                                </div>
                                <p className="text-[11px] text-[var(--ink)]">
                                  {correctOpt ? correctOpt.text : q.idealAnswer}
                                </p>
                              </div>
                            </div>

                            {/* Ideal Answer Explanation */}
                            <div className="p-3 rounded-lg bg-[var(--panel)] border border-[var(--line)] text-xs text-[var(--muted)] space-y-1">
                              <strong className="text-[var(--brass)] font-mono block">
                                {isEn ? 'Level II Answer Synthesis:' : 'דגש הנדסי לתשובה בוועדה:'}
                              </strong>
                              <p className="text-[11px] leading-relaxed text-[var(--ink)]">
                                {q.idealAnswer}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* STUDY MODE (QUESTION BANK & DRILL-DOWN) */}
      {/* ========================================================= */}
      {quizMode === 'study' && (
        <div className="space-y-4">
          {/* Category Filter Rail */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all',
                selectedCategory === 'all'
                  ? 'bg-[var(--brass)] text-[#1a160f] shadow-sm'
                  : 'border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)]'
              )}
            >
              {isEn ? 'All Categories' : 'כל הנושאים'} ({INTERVIEW_QUESTIONS.length})
            </button>
            {(['Cisco', 'PRTG', 'VoIP', 'Smart City', 'L1'] as QuestionCategory[]).map((cat) => {
              const count = INTERVIEW_QUESTIONS.filter((q) => q.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all border',
                    isSelected
                      ? 'bg-[var(--brass)] text-[#1a160f] border-[var(--brass)] shadow-sm'
                      : cn('bg-[var(--panel)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--ink)]')
                  )}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredStudyQuestions.map((q, idx) => {
              const isExpanded = !!expandedQuestions[q.id];
              const isRevealed = !!revealedAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] transition-all overflow-hidden shadow-sm hover:border-[var(--brass)]/40"
                >
                  {/* Question Header Accordion */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(q.id)}
                    className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-start hover:bg-[var(--canvas)]/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-7 h-7 rounded-lg bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/30 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs text-[var(--muted)] font-medium">
                            {q.topic}
                          </span>
                          <span className="text-[var(--line)]">•</span>
                          {q.category && (
                            <span className={cn('text-[10px] px-2 py-0.2 rounded font-mono border', CATEGORY_COLORS[q.category]?.bg, CATEGORY_COLORS[q.category]?.text, CATEGORY_COLORS[q.category]?.border)}>
                              {q.category}
                            </span>
                          )}
                          <span
                            className={cn(
                              'text-[10px] px-2 py-0.2 rounded font-mono',
                              q.difficulty === 'מתקדם'
                                ? 'bg-[var(--alert)]/10 text-[var(--alert)] border border-[var(--alert)]/20'
                                : 'bg-[var(--brass)]/10 text-[var(--brass)] border border-[var(--brass)]/20'
                            )}
                          >
                            {isEn ? `Level: ${q.difficulty}` : `רמת קושי: ${q.difficulty}`}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-[var(--ink)]">
                          {q.question}
                        </h4>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-[var(--muted)] shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t border-[var(--line)] bg-[var(--canvas)]/60 space-y-4">
                      {/* Municipal Relevance */}
                      <div className="p-3 rounded-xl bg-[var(--panel)] border border-[var(--line)] text-xs text-[var(--muted)] flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[var(--brass)] shrink-0" />
                        <span>
                          <strong className="text-[var(--ink)]">
                            {isEn ? 'Why this is asked in Ra\'anana: ' : 'למה זה נשאל בעיריית רעננה: '}
                          </strong>
                          {q.raananaRelevance}
                        </span>
                      </div>

                      {/* Multiple choice options preview in study mode */}
                      {q.options && q.options.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[11px] font-mono text-[var(--muted)] uppercase">
                            {isEn ? 'Exam Questions Options:' : 'חלופות מבחן אמריקאי:'}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={opt.id}
                                className={cn(
                                  'p-2.5 rounded-lg border text-xs leading-relaxed transition-all',
                                  isRevealed && opt.isCorrect
                                    ? 'border-[var(--signal)] bg-[var(--signal)]/10 text-[var(--ink)] font-medium'
                                    : 'border-[var(--line)] bg-[var(--panel)] text-[var(--muted)]'
                                )}
                              >
                                <span className="font-mono font-bold me-1.5 text-[var(--brass)]">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <span>{opt.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Toggle reveal answer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => toggleReveal(q.id)}
                          className="flex items-center gap-2 text-xs sm:text-sm px-4 py-2 rounded-lg bg-[var(--brass)] hover:opacity-90 text-[#1a160f] font-semibold transition-all shadow-sm"
                        >
                          {isRevealed ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              <span>{isEn ? 'Hide Golden Answer' : 'הסתר תשובת זהב אידיאלית'}</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              <span>{isEn ? 'Reveal Level II Golden Answer' : 'חשוף תשובת זהב אידיאלית של איש דרג ב׳'}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onAskAiQuestion(
                              `איך לענות בראיון עבודה של עיריית רעננה למשרה 7274 על השאלה: "${q.question}"? תן לי הסבר מפורט, טכני ומנצח.`
                            )
                          }
                          className="flex items-center gap-1.5 text-xs text-[var(--brass)] hover:underline transition-colors font-mono"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{isEn ? 'Ask AI Consultant for Drill-down' : 'שאל את יועץ ה-AI להרחבה'}</span>
                        </button>
                      </div>

                      {/* The Revealed Answer */}
                      {isRevealed && (
                        <div className="space-y-4 pt-2 animate-in fade-in zoom-in-95 duration-150">
                          <div className="p-5 rounded-2xl bg-[var(--panel)] border border-[var(--brass)]/40 space-y-2 shadow-sm">
                            <div className="flex items-center gap-2 text-xs font-bold text-[var(--brass)] font-mono">
                              <CheckCircle2 className="w-4 h-4 text-[var(--signal)]" />
                              <span>{isEn ? 'Golden Answer for Admission Committee:' : 'התשובה האידיאלית להצגה בוועדת הקבלה:'}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed font-sans">
                              {q.idealAnswer}
                            </p>
                          </div>

                          {/* Key Points Checklist */}
                          <div className="p-4 rounded-xl bg-[var(--canvas)] border border-[var(--line)] space-y-2">
                            <h5 className="text-xs font-bold text-[var(--brass)] flex items-center gap-1.5 font-mono">
                              <Award className="w-3.5 h-3.5 text-[var(--brass)]" />
                              <span>{isEn ? 'Key Evaluation Points Tested:' : 'דגשי מפתח שהמראיין בודק בתשובתך:'}</span>
                            </h5>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--muted)]">
                              {q.keyPoints.map((point, pIdx) => (
                                <li key={pIdx} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brass)] shrink-0" />
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
      )}
    </div>
  );
};

