'use client';

import React, { useState, useEffect } from 'react';
import { LearningNode } from '@/data/curriculumData';
import Markdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  BookOpen, 
  MapPin, 
  Terminal, 
  HelpCircle, 
  Lightbulb, 
  Copy, 
  Check, 
  Sparkles, 
  Clock,
  Compass
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedNode } from '@/lib/curriculumTranslations';

interface NodeDetailModalProps {
  node: LearningNode | null;
  onClose: () => void;
  isCompleted: boolean;
  onToggleComplete: (nodeId: string) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
  initialTab?: 'lesson' | 'raanana' | 'cli' | 'interview' | 'quiz';
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  isCompleted,
  onToggleComplete,
  onOpenAiWithPrompt,
  initialTab = 'lesson',
}) => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'lesson' | 'raanana' | 'cli' | 'interview' | 'quiz'>(initialTab);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedQuizAnswers({});
    setQuizSubmitted({});
    setCopiedIndex(null);
  }, [node?.id, initialTab]);

  if (!node) return null;

  const current = getLocalizedNode(node, lang);

  const handleCopyCli = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted[questionId]) return;
    setSelectedQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCheckQuiz = (questionId: string, correctIndex: number) => {
    setQuizSubmitted((prev) => ({ ...prev, [questionId]: true }));
    if (selectedQuizAnswers[questionId] === correctIndex) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleMarkComplete = () => {
    onToggleComplete(current.id);
    if (!isCompleted) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/85 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div 
        className="relative flex h-[100dvh] w-full max-w-4xl max-h-[100dvh] flex-col overflow-hidden rounded-none border-0 border-white/10 bg-[#0F1117] shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:h-auto sm:max-h-[92vh] sm:rounded-2xl sm:border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#0F1117] p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-md font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {current.elevationLabel}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#1A1D24] text-slate-300 border border-slate-700">
                {current.categoryLabel}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {current.estimatedMinutes} {lang === 'en' ? 'min study' : 'דקות לימוד'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#E2E8F0]">{current.title}</h2>
            <p className="text-sm text-slate-300 mt-1">{current.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mark completed button */}
            <button
              onClick={handleMarkComplete}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                isCompleted
                  ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                  : 'bg-[#1A1D24] text-slate-300 border-slate-700 hover:border-blue-500 hover:text-blue-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCompleted 
                  ? (lang === 'en' ? 'Completed' : 'מודול זה הושלם') 
                  : (lang === 'en' ? 'Mark Completed' : 'סמן כנלמד')}
              </span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-[#1A1D24] hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 bg-[#0A0C10] px-3 pt-2 scrollbar-none sm:px-6">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 text-xs font-medium transition-all cursor-pointer sm:text-sm ${
              activeTab === 'lesson'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'en' ? 'Curriculum Lesson' : 'תוכנית לימוד מ-0'}</span>
          </button>

          <button
            onClick={() => setActiveTab('raanana')}
            className={`flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 text-xs font-medium transition-all cursor-pointer sm:text-sm ${
              activeTab === 'raanana'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{lang === 'en' ? 'Ra\'anana Field Case' : 'מקרה אמת בעיריית רעננה'}</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 text-xs font-medium transition-all cursor-pointer sm:text-sm ${
              activeTab === 'cli'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{lang === 'en' ? 'CLI & Practical' : 'פקודות CLI ומעשי'}</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 text-xs font-medium transition-all cursor-pointer sm:text-sm ${
              activeTab === 'interview'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{lang === 'en' ? 'Interview Pro Tip' : 'טיפ זהב לראיון משרה 7274'}</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 text-xs font-medium transition-all cursor-pointer sm:text-sm ${
              activeTab === 'quiz'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{lang === 'en' ? 'Self-Check Quiz' : 'בוחן ידע עצמי'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#E2E8F0] leading-relaxed bg-[#0A0C10]/40">
          
          {/* TAB 1: Core Lesson */}
          {activeTab === 'lesson' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                <Compass className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-300 text-sm">
                    {lang === 'en' ? 'Module Summary' : 'תקציר המודול'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">{current.summary}</p>
                </div>
              </div>

              <div className="markdown-body prose prose-invert max-w-none prose-headings:text-[#E2E8F0] prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-blue-300">
                <Markdown>{current.descriptionMarkdown}</Markdown>
              </div>
            </div>
          )}

          {/* TAB 2: Ra'anana Municipal Case Study */}
          {activeTab === 'raanana' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#1A1D24] border border-white/10 relative overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {lang === 'en' ? `Field Location: ${current.raananaUseCase.location}` : `מיקום בשטח: ${current.raananaUseCase.location}`}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#E2E8F0] mb-3">
                  {current.raananaUseCase.title}
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl bg-[#0A0C10] border border-slate-800">
                    <h4 className="font-semibold text-amber-300 text-xs mb-1">
                      {lang === 'en' ? '⚠️ The Field Outage / Scenario:' : '⚠️ התרחיש / התקלה שקרתה בשטח:'}
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {current.raananaUseCase.scenario}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                    <h4 className="font-semibold text-blue-300 text-xs mb-1">
                      {lang === 'en' ? '🛠️ The Senior Level II Engineering Resolution:' : '🛠️ הפתרון המקצועי של איש תקשורת רמה ב\': '}
                    </h4>
                    <p className="text-blue-100 leading-relaxed">
                      {current.raananaUseCase.solution}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 text-xs text-slate-400">
                <p>
                  💡 <strong>{lang === 'en' ? 'Municipal Focus:' : 'דגש עירייה:'}</strong> {lang === 'en'
                    ? 'Job 7274 at Ra\'anana Municipality requires proactive SLA response across 80+ distributed institutions. Mastering these scenarios ensures confident performance in interview boards!'
                    : 'משרת 7274 בעיריית רעננה מחייבת מענה שוטף לסביבה רחבת אתרים (מעל 80 מוסדות). הבנת מקרים אלו תעזור לך לעבור את ועדת הקבלה בהצלחה יתרה!'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CLI Commands */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#E2E8F0] text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  {lang === 'en' 
                    ? 'Essential CLI Verification Commands (Cisco / Aruba / Linux)' 
                    : 'פקודות CLI חיוניות למודול זה (Cisco / Aruba / Linux)'}
                </h3>
                <span className="text-xs text-slate-400">
                  {lang === 'en' ? 'Click to copy' : 'לחץ להעתקה מהירה'}
                </span>
              </div>

              <div className="space-y-3">
                {current.cliCommands.map((cmd, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-[#0A0C10] border border-slate-800 hover:border-blue-500/50 transition-colors font-mono"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 overflow-x-auto text-blue-400 text-sm font-semibold">
                        <span>$</span>
                        <code>{cmd.command}</code>
                      </div>
                      <button
                        onClick={() => handleCopyCli(cmd.command, idx)}
                        className="p-1.5 rounded-lg bg-[#1A1D24] text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
                        title={lang === 'en' ? 'Copy command' : 'העתק פקודה'}
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 font-sans mt-2">
                      {cmd.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Interview Pro Tip */}
          {activeTab === 'interview' && (
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-[#1A1D24] border border-white/10 shadow-sm">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>
                    {lang === 'en' 
                      ? 'How Ra\'anana Interviewers Evaluate This Topic' 
                      : 'איך מראייני עיריית רעננה בוחנים את הנושא הזה?'}
                  </span>
                </div>
                <blockquote className="text-[#E2E8F0] text-sm leading-relaxed border-r-4 border-blue-500 pr-4 italic">
                  &quot;{current.interviewTip}&quot;
                </blockquote>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-slate-300">
                  🎯 {lang === 'en' ? 'Key Elements to Emphasize in the Interview Board:' : 'מה להדגיש בתשובה שלך בוועדת הקבלה:'}
                </h4>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  {lang === 'en' ? (
                    <>
                      <li>Demonstrate calm confidence and field autonomy</li>
                      <li>Use precise terminology (e.g. &quot;Uplink interface is down with CRC errors&quot; rather than &quot;the internet crashed&quot;)</li>
                      <li>Understand municipal impacts on resident services and 106 emergency dispatch</li>
                    </>
                  ) : (
                    <>
                      <li>הפגנת ביטחון ויכולת עבודה עצמאית בשטח</li>
                      <li>שימוש בטרמינולוגיה מקצועית מדויקת (לא &quot;האינטרנט נפל&quot;, אלא &quot;ממשק ה-Uplink ב-Down&quot;)</li>
                      <li>הבנה מלאה של ההשלכות על שירותי התושבים ומוקד 106</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: Interactive Quiz */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {current.quiz.map((q) => {
                const selectedOption = selectedQuizAnswers[q.id];
                const isAnswerChecked = quizSubmitted[q.id];
                const isCorrect = selectedOption === q.correctIndex;

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-[#1A1D24] border border-white/10 space-y-4 shadow-sm">
                    <h4 className="font-bold text-[#E2E8F0] text-sm sm:text-base">
                      {q.question}
                    </h4>

                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOption === optIdx;
                        let optionStyle = 'bg-[#0A0C10] border-slate-800 text-slate-300 hover:border-slate-700';

                        if (isAnswerChecked) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'bg-blue-950/40 border-blue-500 text-blue-200 font-semibold';
                          } else if (isSelected) {
                            optionStyle = 'bg-red-950/40 border-red-500 text-red-200';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-blue-600/20 border-blue-500 text-blue-200 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswerChecked && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit / Check Answer Button */}
                    {!isAnswerChecked ? (
                      <button
                        onClick={() => handleCheckQuiz(q.id, q.correctIndex)}
                        disabled={selectedOption === undefined}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)] cursor-pointer"
                      >
                        {lang === 'en' ? 'Check Answer' : 'בדוק תשובה'}
                      </button>
                    ) : (
                      <div className={`p-4 rounded-xl border text-xs sm:text-sm ${
                        isCorrect ? 'bg-blue-950/30 border-blue-500/40 text-blue-200' : 'bg-red-950/30 border-red-500/40 text-red-200'
                      }`}>
                        <div className="font-bold mb-1">
                          {isCorrect 
                            ? (lang === 'en' ? '🎉 Excellent! Correct Answer!' : '🎉 תשובה נכונה מאוד!') 
                            : (lang === 'en' ? '❌ Not quite, review the explanation:' : '❌ לא מדויק, נסה ללמוד מההסבר:')}
                        </div>
                        <p className="text-slate-300">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0F1117] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
          <button
            onClick={() => {
              onClose();
              const prompt = lang === 'en'
                ? `Explain in-depth from fundamentals and practical perspective for the Ra'anana Senior Network Engineer role the topic: "${current.title}" (${current.subtitle}). Provide municipal case studies from Ra'anana and recommended CLI commands.`
                : `הסבר לי בהרחבה מ-0 ובצורה מעשית עבור משרת תקשורת עיריית רעננה את הנושא: "${current.title}" (${current.subtitle}). תן לי דוגמאות ממוקדות מעיריית רעננה ופקודות CLI מומלצות.`;
              onOpenAiWithPrompt(prompt);
            }}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-all hover:bg-blue-500 cursor-pointer sm:text-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{lang === 'en' ? 'Ask AI Mentor on This Topic' : 'שאל את יועץ ה-AI על נושא זה'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkComplete}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold transition-all cursor-pointer sm:text-sm ${
                isCompleted
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-blue-600 text-white border-blue-400 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.35)]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCompleted 
                  ? (lang === 'en' ? 'Completed' : 'מודול זה מסומן כהושלם') 
                  : (lang === 'en' ? 'Got It & Completed!' : 'הבנתי וסיימתי ללמוד!')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
