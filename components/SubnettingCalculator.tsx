'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  Binary, 
  Network, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Award,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioFeedback } from '@/lib/audioFeedback';

interface SubnetDrillQuestion {
  id: number;
  question: string;
  ip: string;
  cidr: number;
  type: 'network' | 'broadcast' | 'hosts' | 'wildcard';
  correctAnswer: string;
  options: string[];
  explanation: string;
}

const DRILL_QUESTIONS: SubnetDrillQuestion[] = [
  {
    id: 1,
    question: 'מהי כתובת ה-Broadcast של הרשת עבור הכתובת 10.24.50.45/28 (מערך מצלמות רעננה)?',
    ip: '10.24.50.45',
    cidr: 28,
    type: 'broadcast',
    correctAnswer: '10.24.50.47',
    options: ['10.24.50.47', '10.24.50.63', '10.24.50.255', '10.24.50.31'],
    explanation: 'מסכת /28 מייצגת גודל בלוק (Magic Number) של 16 (256 - 240). כפולות של 16: 0, 16, 32, 48. הרשת היא 10.24.50.32, ולכן כתובת ה-Broadcast היא 10.24.50.47.',
  },
  {
    id: 2,
    question: 'כמה כתובות מחשב שמישות (Usable Hosts) ניתן להקצות ברשת עם מסכת /26 בבית ספר אלון?',
    ip: '10.24.40.0',
    cidr: 26,
    type: 'hosts',
    correctAnswer: '62',
    options: ['64', '62', '126', '30'],
    explanation: 'מסכת /26 מותירה 6 ביטים למארחים (32 - 26 = 6). לפי הנוסחה 2^6 - 2 = 64 - 2 = 62 כתובות שמישות.',
  },
  {
    id: 3,
    question: 'מהי ה-Wildcard Mask המדויקת של מסכת רשת 255.255.255.224 עבור Cisco ACL?',
    ip: '10.24.10.0',
    cidr: 27,
    type: 'wildcard',
    correctAnswer: '0.0.0.31',
    options: ['0.0.0.31', '0.0.0.15', '0.0.0.224', '255.255.255.31'],
    explanation: 'חישוב Wildcard נעשה ע״י החסרת מסכת הרשת מ-255.255.255.255: (255-255).(255-255).(255-255).(255-224) = 0.0.0.31.',
  },
  {
    id: 4,
    question: 'מהי כתובת הרשת (Network ID) של ה-IP הבא: 172.16.85.130/25?',
    ip: '172.16.85.130',
    cidr: 25,
    type: 'network',
    correctAnswer: '172.16.85.128',
    options: ['172.16.85.128', '172.16.85.0', '172.16.85.1', '172.16.85.255'],
    explanation: 'מסכת /25 מחלקת את האוקטט האחרון לשני בלוקים של 128: 0 עד 127, ו-128 עד 255. הכתובת 130 שייכת לבלוק השני המתחיל ב-172.16.85.128.',
  },
  {
    id: 5,
    question: 'עבור חיבור Point-to-Point אופטי בין עיריית רעננה למוקד 106, איזו מסכה היא החסכונית והמדויקת ביותר?',
    ip: '10.24.1.0',
    cidr: 30,
    type: 'hosts',
    correctAnswer: '/30 (2 כתובות שמישות)',
    options: ['/30 (2 כתובות שמישות)', '/29 (6 כתובות שמישות)', '/28 (14 כתובות שמישות)', '/31'],
    explanation: 'מסכת /30 מספקת בדיוק 2 כתובות שמישות (2^2 - 2 = 2), ואידיאלית לחיבורי P2P Routed Links בין שני מתגים.',
  },
];

// Helper calculations
function calculateSubnet(ipStr: string, cidr: number) {
  const parts = ipStr.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return null;
  }

  // Calculate mask
  const maskBits = (0xffffffff << (32 - cidr)) >>> 0;
  const maskParts = [
    (maskBits >>> 24) & 255,
    (maskBits >>> 16) & 255,
    (maskBits >>> 8) & 255,
    maskBits & 255,
  ];

  // Wildcard
  const wildcardParts = maskParts.map((m) => 255 - m);

  // IP integer
  const ipNum = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  
  // Network
  const netNum = (ipNum & maskBits) >>> 0;
  const netParts = [
    (netNum >>> 24) & 255,
    (netNum >>> 16) & 255,
    (netNum >>> 8) & 255,
    netNum & 255,
  ];

  // Broadcast
  const bcastNum = (netNum | ~maskBits) >>> 0;
  const bcastParts = [
    (bcastNum >>> 24) & 255,
    (bcastNum >>> 16) & 255,
    (bcastNum >>> 8) & 255,
    bcastNum & 255,
  ];

  // Usable range
  const firstNum = netNum + 1;
  const lastNum = bcastNum - 1;

  const firstParts = [
    (firstNum >>> 24) & 255,
    (firstNum >>> 16) & 255,
    (firstNum >>> 8) & 255,
    firstNum & 255,
  ];

  const lastParts = [
    (lastNum >>> 24) & 255,
    (lastNum >>> 16) & 255,
    (lastNum >>> 8) & 255,
    lastNum & 255,
  ];

  const totalUsableHosts = Math.max(0, Math.pow(2, 32 - cidr) - 2);

  return {
    subnetMask: maskParts.join('.'),
    wildcardMask: wildcardParts.join('.'),
    networkAddress: netParts.join('.'),
    broadcastAddress: bcastParts.join('.'),
    firstUsable: firstParts.join('.'),
    lastUsable: lastParts.join('.'),
    totalUsableHosts,
  };
}

export function SubnettingCalculator() {
  const [activeTab, setActiveTab] = useState<'calc' | 'drill' | 'muni_plan'>('calc');
  const [inputIp, setInputIp] = useState('10.24.50.75');
  const [inputCidr, setInputCidr] = useState(26);

  // Drill state
  const [drillAnswers, setDrillAnswers] = useState<{ [id: number]: string }>({});
  const [revealedExplanations, setRevealedExplanations] = useState<{ [id: number]: boolean }>({});

  const subnetResult = calculateSubnet(inputIp, inputCidr);

  const handleSelectDrillAnswer = (qId: number, answer: string, isCorrect: boolean) => {
    setDrillAnswers((prev) => ({ ...prev, [qId]: answer }));
    setRevealedExplanations((prev) => ({ ...prev, [qId]: true }));

    if (isCorrect) {
      audioFeedback.playSuccess();
    } else {
      audioFeedback.playAlert();
    }

    // Check if all correct
    const answeredCount = Object.keys({ ...drillAnswers, [qId]: answer }).length;
    if (answeredCount === DRILL_QUESTIONS.length) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetDrill = () => {
    audioFeedback.playChime();
    setDrillAnswers({});
    setRevealedExplanations({});
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1117] border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Calculator className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#E2E8F0]">
              מחשבון Subnetting, VLSM ואתגר כתובות עירוני
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            כלי עבודה מקיף לחישוב מסכות, טווחי כתובות, Wildcard ו-ACLs המבוקשים במבחני קבלה למשרה 7274
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('calc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'calc'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                : 'bg-[#1A1D24] text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            מחשבון CIDR חי
          </button>
          <button
            onClick={() => setActiveTab('drill')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'drill'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                : 'bg-[#1A1D24] text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            בוחן מהיר לקבלה
          </button>
          <button
            onClick={() => setActiveTab('muni_plan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'muni_plan'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                : 'bg-[#1A1D24] text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            מפת ה-IP של רעננה
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE CIDR CALCULATOR */}
      {activeTab === 'calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Input Controls (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0F1117] border border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-[#E2E8F0] flex items-center gap-2">
              <Binary className="w-4 h-4 text-blue-400" />
              הזן כתובת IP ומסכת CIDR
            </h4>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">כתובת IP (IPv4):</label>
              <input
                type="text"
                value={inputIp}
                onChange={(e) => setInputIp(e.target.value)}
                className="w-full bg-[#1A1D24] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                placeholder="10.24.50.1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>מסכת קידומת (CIDR):</span>
                <span className="font-mono font-bold text-blue-400 text-sm">/{inputCidr}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setInputCidr(Math.max(8, inputCidr - 1));
                  }}
                  className="min-w-[44px] min-h-[44px] rounded-lg bg-[#1A1D24] text-slate-200 hover:text-white border border-slate-700 flex items-center justify-center font-bold text-lg select-none active:scale-95 transition-transform"
                  title="הקטן קידומת"
                >
                  -
                </button>
                <input
                  type="range"
                  min="8"
                  max="30"
                  value={inputCidr}
                  onChange={(e) => setInputCidr(parseInt(e.target.value, 10))}
                  className="flex-1 accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setInputCidr(Math.min(30, inputCidr + 1));
                  }}
                  className="min-w-[44px] min-h-[44px] rounded-lg bg-[#1A1D24] text-slate-200 hover:text-white border border-slate-700 flex items-center justify-center font-bold text-lg select-none active:scale-95 transition-transform"
                  title="הגדל קידומת"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Municipal Presets */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 block font-semibold">
                תבניות נפוצות בעיריית רעננה (לחיצה מהירה):
              </span>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 flex-wrap">
                {[
                  { label: 'מצלמות LPR (/28)', ip: '10.24.50.1', cidr: 28 },
                  { label: 'מוקד 106 VoIP (/24)', ip: '10.24.30.1', cidr: 24 },
                  { label: 'קמפוס אלון (/22)', ip: '10.24.40.1', cidr: 22 },
                  { label: 'P2P Fiber (/30)', ip: '10.24.1.1', cidr: 30 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      audioFeedback.playKeyClick();
                      setInputIp(preset.ip);
                      setInputCidr(preset.cidr);
                    }}
                    className="min-h-[44px] text-xs px-3 py-2 rounded-lg bg-[#1A1D24] text-slate-300 hover:text-white border border-white/10 hover:border-blue-500 transition-colors flex items-center justify-center text-center font-medium"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Computed Results Matrix (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0F1117] border border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-[#E2E8F0] flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" />
              תוצאות חישוב טווח רשת ו-ACLs
            </h4>

            {subnetResult ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-0.5">מסכת רשת (Subnet Mask):</span>
                  <span className="font-mono font-bold text-slate-100 text-sm">{subnetResult.subnetMask}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-0.5">כתובת רשת (Network ID):</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">{subnetResult.networkAddress}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-0.5">כתובת שידור (Broadcast):</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{subnetResult.broadcastAddress}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Wildcard Mask (עבור ACL):</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{subnetResult.wildcardMask}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-0.5">טווח מחשבים שמיש (Usable):</span>
                  <span className="font-mono font-semibold text-slate-200 block text-xs">
                    {subnetResult.firstUsable} - {subnetResult.lastUsable}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[11px] text-slate-400 block mb-0.5">סה״כ מחשבים שמישים:</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">
                    {subnetResult.totalUsableHosts.toLocaleString()} כתובות
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                כתובת ה-IP שהוזנה אינה תקינה. אנא הזן פורמט IPv4 תקין (למשל 10.24.10.1).
              </div>
            )}

            {/* Cisco ACL Example snippet */}
            {subnetResult && (
              <div className="p-3 rounded-xl bg-black/80 border border-slate-800 font-mono text-xs space-y-1">
                <span className="text-[10px] text-slate-400">דוגמת פקודת Cisco Standard Access-List:</span>
                <code className="text-blue-400 block">
                  access-list 10 permit {subnetResult.networkAddress} {subnetResult.wildcardMask}
                </code>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: SPEED DRILL EXAM */}
      {activeTab === 'drill' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h4 className="font-bold text-sm text-[#E2E8F0] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              שאלות Subnetting ו-VLSM ממוקדות ראיונות עבודה
            </h4>

            <button
              onClick={handleResetDrill}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              איפוס תשובות
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRILL_QUESTIONS.map((q, idx) => {
              const selectedAnswer = drillAnswers[q.id];
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = selectedAnswer === q.correctAnswer;

              return (
                <div key={q.id} className="p-4 rounded-xl bg-[#0F1117] border border-white/10 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                      שאלה #{idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {q.ip}/{q.cidr}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-[#E2E8F0] leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedAnswer === opt;
                      let btnStyle = 'bg-[#1A1D24] text-slate-300 border-slate-800 hover:border-slate-700';

                      if (isAnswered) {
                        if (opt === q.correctAnswer) {
                          btnStyle = 'bg-blue-950/40 border-blue-500 text-blue-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-red-950/40 border-red-500 text-red-300';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={isAnswered}
                          onClick={() => handleSelectDrillAnswer(q.id, opt, opt === q.correctAnswer)}
                          className={`p-2 rounded-lg border text-xs font-mono text-center transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation drawer */}
                  {revealedExplanations[q.id] && (
                    <div className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                      isCorrect ? 'bg-blue-950/30 border border-blue-500/30 text-blue-200' : 'bg-red-950/30 border border-red-500/30 text-red-200'
                    }`}>
                      <div className="font-bold mb-0.5">
                        {isCorrect ? '✓ תשובה נכונה!' : '✗ לא מדויק:'}
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MUNICIPAL IP SCHEME MAP */}
      {activeTab === 'muni_plan' && (
        <div className="rounded-2xl bg-[#0F1117] border border-white/10 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h4 className="font-bold text-sm text-[#E2E8F0]">
              מפת ה-VLAN והקצאת הסאבנטים של עיריית רעננה (תקן משרה 7274)
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#1A1D24] text-slate-300 border-b border-white/10">
                <tr>
                  <th className="p-3">VLAN ID</th>
                  <th className="p-3">שם המערך</th>
                  <th className="p-3">סאבנט עירוני</th>
                  <th className="p-3">Default Gateway</th>
                  <th className="p-3">שימוש עירוני</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                <tr>
                  <td className="p-3 font-bold text-blue-400">10</td>
                  <td className="p-3 font-sans font-semibold">MUNICIPAL_MGMT</td>
                  <td className="p-3">10.24.10.0/24</td>
                  <td className="p-3">10.24.10.1</td>
                  <td className="p-3 font-sans text-slate-400">ניהול מתגים, נתבים ו-Firewalls בעירייה</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-400">20</td>
                  <td className="p-3 font-sans font-semibold">CITY_HALL_STAFF</td>
                  <td className="p-3">10.24.20.0/23</td>
                  <td className="p-3">10.24.20.1</td>
                  <td className="p-3 font-sans text-slate-400">עובדי עירייה ומחשבי מטה אחוזה 103</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-400">30</td>
                  <td className="p-3 font-sans font-semibold">VOIP_MOKED_106</td>
                  <td className="p-3">10.24.30.0/24</td>
                  <td className="p-3">10.24.30.1</td>
                  <td className="p-3 font-sans text-slate-400">טלפוניית IP Cisco/Ericsson ומוקדנים 106</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-400">40</td>
                  <td className="p-3 font-sans font-semibold">SCHOOLS_CAMPUS</td>
                  <td className="p-3">10.24.40.0/22</td>
                  <td className="p-3">10.24.40.1</td>
                  <td className="p-3 font-sans text-slate-400">רשת בתי ספר חטיבות ותיכונים (אלון, השרון)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-400">50</td>
                  <td className="p-3 font-sans font-semibold">LPR_CCTV_CAMERAS</td>
                  <td className="p-3">10.24.50.0/24</td>
                  <td className="p-3">10.24.50.1</td>
                  <td className="p-3 font-sans text-slate-400">מצלמות בקרת תנועה, כניסות עיר ופארק</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-blue-400">99</td>
                  <td className="p-3 font-sans font-semibold">WAN_EDGE_METRO</td>
                  <td className="p-3">194.90.150.0/29</td>
                  <td className="p-3">194.90.150.1</td>
                  <td className="p-3 font-sans text-slate-400">חיבור Dark Fiber בזק מול ספקית אינטרנט</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
