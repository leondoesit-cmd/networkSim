'use client';

import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  Loader2, 
  Terminal, 
  Building2, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface AiMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  'הסבר לי מ-0 איך עובד Trunking ו-802.1Q במתג סיסקו',
  'בחן אותי בראיון עבודה מדומה לתפקיד איש תקשורת רמה ב\' ברעננה',
  'איך מתמודדים עם נפילת סיב אופטי מרכזי בעירייה ועובדים מול בזק?',
  'מה ההבדל בין PoE+ ל-PoE++ במצלמות עיר חכמה חיצוניות?',
  'איך להגדיר סנסורים ב-PRTG לזיהוי עומס ותקלות לפני שהמשתמש מתלונן?'
];

export const AiMentorModal: React.FC<AiMentorModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'שלום לך! אני **היועץ הבכיר לתקשורת ורשתות של עיריית רעננה**. 🏙️\n\nתפקידי להכשיר אותך **מ-0** לרמה המקצועית הנדרשת למשרת **איש/ת תקשורת ורשתות רמה ב\' (משרה 7274)**.\n\nתוכל לשאול אותי כל שאלה: הסבר מושגים מורכבים במילים פשוטות, פקודות CLI של Cisco/Aruba, תרחישי שטח וארונות תקשורת, מערכות שו״ב (PRTG), פרויקטי עיר חכמה (מצלמות LPR), מרכזיות IP (VoIP), או לבצע איתי **סימולציית ראיון קבלה מלאה** לעיריית רעננה.\n\nבמה נתחיל היום?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = React.useCallback(async (textToSend?: string) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: messageContent };
    const chatHistory = [...messages];

    // Append user message + empty placeholder model message for streaming
    setMessages((prev) => [...prev, userMessage, { role: 'model', content: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageContent,
          history: chatHistory,
        }),
      });

      if (!response.ok || !response.body) {
        let errText = 'שגיאה בקבלת תשובה משרת ה-AI.';
        try {
          const errJson = await response.json();
          if (errJson.details || errJson.error) {
            errText = errJson.details || errJson.error;
          }
        } catch {}
        setMessages((prev) => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1] = { role: 'model', content: errText };
          }
          return next;
        });
        return;
      }

      // Stream reader with TextDecoder
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setMessages((prev) => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1] = { role: 'model', content: accumulated };
          }
          return next;
        });
      }
    } catch (err) {
      console.error('Streaming error:', err);
      setMessages((prev) => {
        const next = [...prev];
        if (next.length > 0 && next[next.length - 1].role === 'model') {
          next[next.length - 1] = {
            role: 'model',
            content: next[next.length - 1].content || 'מצטערים, ארעה שגיאת רשת. אנא נסה שנית בעוד רגע.',
          };
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      const timer = setTimeout(() => {
        handleSendMessage(initialPrompt);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, isOpen, handleSendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleClearChat = () => {
    setMessages([
      {
        role: 'model',
        content: 'השיחה אופסה. אני מוכן להמשיך להכין אותך למשרת איש תקשורת רמה ב\' ברעננה!'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-3xl bg-[#0F1117] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 sm:p-5 bg-[#0F1117] border-b border-white/10 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-bold text-[#E2E8F0] text-sm sm:text-lg truncate">
                  יועץ רשתות - עיריית רעננה
                </h3>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="hidden xs:inline">מחובר (Live Stream)</span>
                  <span className="xs:hidden">Live</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden xs:block">
                הדרכה אישית מ-0 למשרה 7274, הכנה לראיונות וסימולציית תקלות שטח
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={handleClearChat}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1A1D24] transition-colors text-xs flex items-center gap-1"
              title="נקה שיחה"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1A1D24] transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-[#0A0C10] border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            שאלות מהירות:
          </span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#1A1D24] hover:bg-slate-700 text-slate-300 hover:text-white transition-all whitespace-nowrap border border-white/10"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#0A0C10]/40">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const isLastModel = !isUser && idx === messages.length - 1;
            const isStreamingThis = isLastModel && isLoading;

            // Empty placeholder while waiting for first chunk
            if (isStreamingThis && !msg.content) {
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#1A1D24] border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                    <span>היועץ הבכיר מנסח תשובה מותאמת אישית לרשת עיריית רעננה...</span>
                    <span className="inline-block w-1.5 h-3.5 bg-blue-400 animate-pulse rounded-sm" />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                      : 'bg-[#1A1D24] border border-white/10 text-[#E2E8F0] shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="markdown-body prose prose-invert max-w-none text-xs sm:text-sm prose-p:leading-relaxed prose-pre:bg-[#0A0C10] prose-pre:border prose-pre:border-slate-800 prose-headings:text-[#E2E8F0]">
                      <Markdown>{msg.content}</Markdown>
                      {/* Visual Typing Cursor while streaming */}
                      {isStreamingThis && (
                        <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ms-1 align-middle rounded-sm shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0F1117] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="שאל שאלה על רשתות, מתגים, סיבים, שו״ב או ראיון העבודה ברעננה..."
              className="flex-1 bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#E2E8F0] placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)] flex items-center gap-1.5 shrink-0"
            >
              <span>שלח</span>
              <Send className="w-4 h-4 rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
