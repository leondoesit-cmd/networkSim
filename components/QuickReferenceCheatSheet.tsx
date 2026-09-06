'use client';

import React from 'react';
import { 
  BookOpen, 
  Printer, 
  Search, 
  ExternalLink, 
  FileText, 
  Hash, 
  Terminal, 
  ShieldCheck, 
  Check, 
  Copy
} from 'lucide-react';
import { audioFeedback } from '@/lib/audioFeedback';

export function QuickReferenceCheatSheet() {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handlePrint = () => {
    audioFeedback.playChime();
    window.print();
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    audioFeedback.playSuccess();
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--panel)] border border-[var(--line)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[var(--brass)]/10 text-[var(--brass)] border border-[var(--brass)]/30">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--ink)]">
              דף נוסחאות ותרשימי מפתח — משרה 7274 (עיריית רעננה)
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)]">
            סיכום פקודות Cisco מול Aruba, פורטים נפוצים, מפת VLAN עירונית ודגשים למבחן הקבלה ולוועדה
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--brass)] hover:bg-[var(--brass)]/90 text-[#1a160f] text-xs font-bold transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>הדפס / שמור כ-PDF</span>
        </button>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CLI COMMAND TRANSLATION TABLE (CISCO vs ARUBA) */}
        <div className="rounded-2xl bg-[var(--panel)] border border-[var(--line)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
            <Terminal className="w-4 h-4 text-[var(--brass)]" />
            <h4 className="font-serif font-bold text-sm text-[var(--ink)]">
              טבלת המרת פקודות: Cisco IOS-XE מול Aruba CX
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[var(--canvas)] text-[var(--muted)] border-b border-[var(--line)] font-mono">
                <tr>
                  <th className="p-2.5">פעולה</th>
                  <th className="p-2.5 text-[var(--brass)]">Cisco Catalyst</th>
                  <th className="p-2.5 text-amber-400">Aruba CX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-[var(--ink)] font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 font-sans text-[var(--muted)]">הצגת סטטוס ממשקים</td>
                  <td className="p-2.5 text-[var(--brass)] font-semibold">show ip int brief</td>
                  <td className="p-2.5 text-amber-300">show interface brief</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans text-[var(--muted)]">הצגת טבלת VLANs</td>
                  <td className="p-2.5 text-[var(--brass)] font-semibold">show vlan brief</td>
                  <td className="p-2.5 text-amber-300">show vlan</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans text-[var(--muted)]">הגדרת Access VLAN</td>
                  <td className="p-2.5 text-[var(--brass)] font-semibold">switchport access vlan 20</td>
                  <td className="p-2.5 text-amber-300">vlan access 20</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans text-[var(--muted)]">הגדרת Trunk Uplink</td>
                  <td className="p-2.5 text-[var(--brass)] font-semibold">switchport mode trunk</td>
                  <td className="p-2.5 text-amber-300">vlan trunk native 1 / tag 10,20</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans text-[var(--muted)]">בדיקת עומס מתח PoE</td>
                  <td className="p-2.5 text-[var(--brass)] font-semibold">show power inline</td>
                  <td className="p-2.5 text-amber-300">show power-over-ethernet</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans text-[var(--muted)]">גילוי שכנים (CDP/LLDP)</td>
                  <td className="p-2.5 text-[var(--brass)] font-semibold">show cdp neighbors</td>
                  <td className="p-2.5 text-amber-300">show lldp info remote-device</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans text-[var(--muted)]">שמירת תצורה ל-NVRAM</td>
                  <td className="p-2.5 text-[var(--brass)] font-semibold">write memory / wr</td>
                  <td className="p-2.5 text-amber-300">copy running-config startup-config</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* WELL KNOWN PORTS TABLE */}
        <div className="rounded-2xl bg-[var(--panel)] border border-[var(--line)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
            <Hash className="w-4 h-4 text-[var(--signal)]" />
            <h4 className="font-serif font-bold text-sm text-[var(--ink)]">
              פורטים ופרוטוקולים חיוניים למומחה תקשורת
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            {[
              { port: '5060 UDP/TCP', name: 'SIP Signaling', desc: 'מרכזיות IP ומוקד 106' },
              { port: '16384-32767 UDP', name: 'RTP Audio', desc: 'ערוצי קול בדיבור' },
              { port: '123 UDP', name: 'NTP', desc: 'סנכרון שעון עירייה' },
              { port: '161 / 162 UDP', name: 'SNMP', desc: 'ניטור PRTG / שו״ב' },
              { port: '514 UDP', name: 'Syslog', desc: 'לוגים מרכזיים' },
              { port: '1812 / 1813 UDP', name: 'RADIUS', desc: 'אימות 802.1X אלחוטי' },
              { port: '49 TCP', name: 'TACACS+', desc: 'אימות ניהול למתגים' },
              { port: '67 / 68 UDP', name: 'DHCP', desc: 'שרת ולקוח כתובות' },
              { port: '53 UDP/TCP', name: 'DNS', desc: 'תרגום שמות מתחם' },
              { port: '443 TCP', name: 'HTTPS / TLS', desc: 'ממשקי ניהול Web' },
              { port: '22 TCP', name: 'SSH', desc: 'גישה מאובטחת ל-CLI' },
              { port: '3389 TCP', name: 'RDP', desc: 'שליטה מרחוק בשרתים' },
            ].map((p, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[var(--canvas)] border border-[var(--line)] space-y-1">
                <div className="font-bold text-[var(--brass)] text-[11px]">{p.port}</div>
                <div className="text-[var(--ink)] font-semibold text-[10px]">{p.name}</div>
                <div className="text-[var(--muted)] text-[9px] font-sans">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SLA & ESCALATION PROCEDURES */}
      <div className="rounded-2xl bg-[var(--panel)] border border-[var(--line)] p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--brass)]" />
          <h4 className="font-serif font-bold text-sm text-[var(--ink)]">
            נוהל מענה לתקלות חירום והסלמה (משרה 7274 - עיריית רעננה)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--canvas)] border border-[var(--alert)]/40 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--alert)]">עדיפות P1 - קריטי</span>
            <div className="font-bold text-[var(--ink)]">נפילת מוקד 106 / שדרת ליבה</div>
            <p className="text-[var(--muted)] leading-relaxed">
              הגעה לשטח/חיבור תוך 15 דקות. בדיקת קישוריות סיב, הפעלת קו גיבוי 60GHz/VPN ודיווח מידי למנהל אגף מערכות מידע.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--canvas)] border border-[var(--brass)]/40 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--brass)]">עדיפות P2 - בינוני</span>
            <div className="font-bold text-[var(--ink)]">מצלמת LPR כניסה או Wi-Fi בי״ס</div>
            <p className="text-[var(--muted)] leading-relaxed">
              זמן טיפול: עד 2 שעות. בדיקת פורט במתג, PoE, אימות VLAN, ובמידת הצורך החלפת מזרק PoE או פאץ&apos;-קורד.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--canvas)] border border-[var(--line-strong)] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--signal)]">עדיפות P3 - שגרתי</span>
            <div className="font-bold text-[var(--ink)]">העברת עמדה / ניתוב VLAN</div>
            <p className="text-[var(--muted)] leading-relaxed">
              זמן טיפול: יום עסקים. חיווט בארון התקשורת, חיבור שקע קיסטון, רישום בתיעוד ה-NOC ועדכון מערכת הניטור.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
