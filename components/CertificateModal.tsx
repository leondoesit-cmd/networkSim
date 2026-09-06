'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Award, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioFeedback } from '@/lib/audioFeedback';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
}

const CERTIFIED_DOMAINS = [
  'תשתיות כבילה וסיבים L1',
  'מיתוג ו-VLANs L2',
  'ניתוב ו-NAT L3',
  'שו״ב PRTG',
  'עיר חכמה LPR',
  'מרכזיות IP ומוקד 106',
  'הקשחת אבטחה',
  'ו-CLI שטח',
];

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  defaultName = '',
}) => {
  const [recipientName, setRecipientName] = useState(defaultName || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const certContainerRef = useRef<HTMLDivElement>(null);

  // Generate a consistent verification code
  useEffect(() => {
    if (!verificationCode) {
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      setVerificationCode(`RAA-7274-${randomSuffix}`);
    }
  }, [verificationCode]);

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const todayHebrew = new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const displayName = recipientName.trim() || 'איש/ת תקשורת ורשתות';

  const handleDownloadPng = async () => {
    setIsGenerating(true);
    audioFeedback.playKeyClick();

    try {
      // 1920x1080 High-DPI Canvas Rendering
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Background Gradient
      const bgGrad = ctx.createRadialGradient(960, 540, 100, 960, 540, 1000);
      bgGrad.addColorStop(0, '#1c1914');
      bgGrad.addColorStop(1, '#0e0d0b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1920, 1080);

      // Subtle Background Grid Dots
      ctx.fillStyle = 'rgba(196, 163, 90, 0.15)';
      for (let x = 60; x < 1860; x += 40) {
        for (let y = 60; y < 1020; y += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Outer Brass Gold Borders
      ctx.strokeStyle = '#c4a35a';
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, 1820, 980);

      ctx.strokeStyle = 'rgba(196, 163, 90, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(65, 65, 1790, 950);

      // Inner Border
      ctx.strokeStyle = 'rgba(228, 216, 180, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(75, 75, 1770, 930);

      // Corner Ornaments
      const corners = [
        [50, 50],
        [1870, 50],
        [50, 1030],
        [1870, 1030],
      ];
      ctx.fillStyle = '#c4a35a';
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e2c98a';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Municipal Emblem Shield Top
      ctx.save();
      ctx.translate(960, 120);
      ctx.fillStyle = '#1c1914';
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c4a35a';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Tree / Shield icon inside seal
      ctx.fillStyle = '#c4a35a';
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(16, -4);
      ctx.lineTo(10, -4);
      ctx.lineTo(20, 14);
      ctx.lineTo(6, 14);
      ctx.lineTo(6, 24);
      ctx.lineTo(-6, 24);
      ctx.lineTo(-6, 14);
      ctx.lineTo(-20, 14);
      ctx.lineTo(-10, -4);
      ctx.lineTo(-16, -4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Title: עיריית רעננה · אגף מערכות מידע ותקשורת
      ctx.textAlign = 'center';
      ctx.direction = 'rtl';
      ctx.fillStyle = '#c4a35a';
      ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('עיריית רעננה · אגף מערכות מידע ותקשורת', 960, 205);

      // Decorative divider
      ctx.strokeStyle = 'rgba(196, 163, 90, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(700, 225);
      ctx.lineTo(1220, 225);
      ctx.stroke();

      // Diploma Title
      ctx.fillStyle = '#efe8d6';
      ctx.font = 'bold 44px "Frank Ruhl Libre", Georgia, serif';
      ctx.fillText("תעודת הסמכה — איש/ת תקשורת ורשתות רמה ב' (משרה 7274)", 960, 290);

      // Recipient Prefix
      ctx.fillStyle = '#9a917c';
      ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('תעודה זו מוענקת בזאת בהצטיינות ובהערכה רבה ל-', 960, 350);

      // Recipient Name prominently displayed
      ctx.fillStyle = '#e2c98a';
      ctx.font = 'bold 54px "Frank Ruhl Libre", Georgia, serif';
      ctx.fillText(displayName, 960, 420);

      // Underline recipient name
      ctx.strokeStyle = '#c4a35a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(600, 445);
      ctx.lineTo(1320, 445);
      ctx.stroke();

      // Paragraph explanation
      ctx.fillStyle = '#efe8d6';
      ctx.font = '21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('על עמידה מקיפה בדרישות התפקיד, שליטה מלאה במעבדות שטח, איתור תקלות ומוכנות מבצעית בתחומים:', 960, 495);

      // Certified Domains 2-Column Grid (4 rows x 2 columns)
      const domainStartX = 960;
      const domainStartY = 550;
      const rowHeight = 48;
      const colSpacing = 360;

      CERTIFIED_DOMAINS.forEach((domain, idx) => {
        const col = idx % 2 === 0 ? 1 : -1;
        const row = Math.floor(idx / 2);
        const x = domainStartX + (col * (colSpacing / 2));
        const y = domainStartY + (row * rowHeight);

        // Domain background pill
        ctx.fillStyle = 'rgba(22, 20, 16, 0.85)';
        ctx.strokeStyle = 'rgba(196, 163, 90, 0.35)';
        ctx.lineWidth = 1;
        const pillWidth = 320;
        const pillHeight = 36;
        
        ctx.beginPath();
        ctx.roundRect(x - (pillWidth / 2), y - 24, pillWidth, pillHeight, 8);
        ctx.fill();
        ctx.stroke();

        // Checkmark badge
        ctx.fillStyle = '#c4a35a';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`✓  ${domain}`, x, y);
      });

      // Bottom Area: Date, Hash, Signatures & Seal
      const footerY = 820;

      // Issue Date & Verification
      ctx.textAlign = 'right';
      ctx.fillStyle = '#9a917c';
      ctx.font = '19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`תאריך הנפקה: ${todayHebrew}`, 1650, footerY);
      ctx.fillText(`קוד אימות דיגיטלי:`, 1650, footerY + 32);
      ctx.fillStyle = '#c4a35a';
      ctx.font = 'bold 20px "IBM Plex Mono", monospace';
      ctx.fillText(verificationCode, 1650, footerY + 62);

      // Gold Official Seal
      ctx.save();
      ctx.translate(960, footerY + 30);
      ctx.strokeStyle = '#c4a35a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(196, 163, 90, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 45, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#c4a35a';
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('עיריית רעננה', 0, -18);
      ctx.fillText('אגף מערכות מידע', 0, 0);
      ctx.fillText('★ מוסמך רמה ב\' ★', 0, 18);
      ctx.restore();

      // Signatures Line
      ctx.textAlign = 'left';
      
      // Signature 1: מנהל אגף מערכות מידע ותקשורת
      ctx.strokeStyle = 'rgba(196, 163, 90, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(270, footerY + 20);
      ctx.lineTo(550, footerY + 20);
      ctx.stroke();

      // Simulated cursive gold signature flourish
      ctx.strokeStyle = '#c4a35a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(310, footerY + 10);
      ctx.bezierCurveTo(340, footerY - 25, 380, footerY + 15, 420, footerY - 10);
      ctx.bezierCurveTo(460, footerY - 20, 500, footerY + 5, 520, footerY);
      ctx.stroke();

      ctx.fillStyle = '#efe8d6';
      ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('מנהל אגף מערכות מידע ותקשורת', 270, footerY + 45);
      ctx.fillStyle = '#9a917c';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('עיריית רעננה', 270, footerY + 68);

      // Signature 2: מנהל צוות תשתיות
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(196, 163, 90, 0.5)';
      ctx.moveTo(600, footerY + 20);
      ctx.lineTo(840, footerY + 20);
      ctx.stroke();

      // Simulated second signature
      ctx.strokeStyle = '#c4a35a';
      ctx.beginPath();
      ctx.moveTo(630, footerY + 5);
      ctx.bezierCurveTo(660, footerY - 20, 710, footerY + 10, 750, footerY - 15);
      ctx.bezierCurveTo(780, footerY - 5, 800, footerY + 8, 820, footerY);
      ctx.stroke();

      ctx.fillStyle = '#efe8d6';
      ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('מנהל צוות תשתיות', 600, footerY + 45);
      ctx.fillStyle = '#9a917c';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('רשתות וטלקום', 600, footerY + 68);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'certificate_raanana_7274.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      audioFeedback.playSuccess();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Failed to export certificate:', err);
      alert('שגיאה ביצירת קובץ התעודה.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    audioFeedback.playKeyClick();
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#12100d] border border-[#c4a35a]/30 rounded-2xl shadow-2xl flex flex-col my-auto max-h-[96vh] sm:max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Action Bar */}
        <div className="p-3 sm:p-4 bg-[#161410] border-b border-[#c4a35a]/20 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#c4a35a]/15 text-[#c4a35a] border border-[#c4a35a]/30 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-xs sm:text-base text-[#efe8d6] truncate">
                מחולל תעודות הסמכה — עיריית רעננה
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#9a917c] truncate hidden xs:block">
                הפקת תעודת איש/ת תקשורת ורשתות רמה ב' (משרה 7274)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1c1914] text-[#efe8d6] hover:bg-[#25211b] border border-[#c4a35a]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="הדפס תעודה"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c4a35a]" />
              <span className="hidden sm:inline">הדפס</span>
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={isGenerating}
              className="px-2.5 sm:px-4 py-1.5 rounded-lg bg-[#c4a35a] hover:bg-[#d4b46c] text-[#1a160f] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(196,163,90,0.3)] transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{isGenerating ? 'מייצר...' : 'הורד תעודה (PNG)'}</span>
              <span className="xs:hidden">{isGenerating ? '...' : 'PNG'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 rounded-lg text-[#9a917c] hover:text-[#efe8d6] hover:bg-[#1c1914] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input Bar for Recipient Name */}
        <div className="p-2.5 sm:p-4 bg-[#0e0d0b] border-b border-[#c4a35a]/20 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <label className="text-xs font-medium text-[#c4a35a] shrink-0">
              שם מקבל/ת התעודה:
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="שמך המלא שיופיע על התעודה..."
              className="flex-1 min-w-0 bg-[#161410] border border-[#c4a35a]/30 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-[#efe8d6] placeholder:text-[#9a917c]/60 focus:outline-none focus:border-[#c4a35a]"
            />
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-1.5 text-[11px] text-[#9a917c] font-mono shrink-0">
            <span>קוד אימות:</span>
            <button
              onClick={handleCopyHash}
              className="text-[#c4a35a] hover:underline flex items-center gap-1 bg-[#161410] px-2 py-0.5 sm:py-1 rounded border border-[#c4a35a]/20"
              title="העתק קוד אימות"
            >
              <span className="text-[10px] sm:text-xs">{verificationCode}</span>
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 p-2 sm:p-6 overflow-y-auto bg-[#0a0907] flex items-center justify-center">
          
          {/* THE OFFICIAL DIPLOMA CONTAINER */}
          <div 
            ref={certContainerRef}
            className="certificate-print-root relative w-full max-w-3xl min-h-[500px] sm:min-h-0 sm:aspect-[16/9.5] bg-[#0e0d0b] rounded-xl border-2 sm:border-4 border-[#c4a35a] p-3 sm:p-8 flex flex-col justify-between shadow-[0_0_35px_rgba(196,163,90,0.15)] select-none text-center"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #1c1914 0%, #0e0d0b 100%)',
            }}
          >
            {/* Inner Ornate Border */}
            <div className="absolute inset-2 sm:inset-3 border border-[#c4a35a]/40 rounded-lg pointer-events-none" />
            <div className="absolute inset-3 sm:inset-4 border border-[#e4d8b4]/15 rounded-md pointer-events-none" />

            {/* Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-[#c4a35a] rounded-full border border-[#e2c98a]" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-[#c4a35a] rounded-full border border-[#e2c98a]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-[#c4a35a] rounded-full border border-[#e2c98a]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#c4a35a] rounded-full border border-[#e2c98a]" />

            {/* Header Section */}
            <div className="relative z-10 space-y-1 sm:space-y-1.5 pt-1 sm:pt-2">
              <div className="mx-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1c1914] border-2 border-[#c4a35a] flex items-center justify-center text-[#c4a35a] shadow-[0_0_10px_rgba(196,163,90,0.3)]">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="text-[11px] sm:text-xs font-semibold text-[#c4a35a] tracking-wider">
                עיריית רעננה · אגף מערכות מידע ותקשורת
              </div>
              <div className="w-24 sm:w-36 h-px bg-[#c4a35a]/40 mx-auto" />

              <h2 className="font-serif text-base sm:text-2xl font-bold text-[#efe8d6] leading-tight pt-1">
                תעודת הסמכה — איש/ת תקשורת ורשתות רמה ב' (משרה 7274)
              </h2>

              <p className="text-[10px] sm:text-xs text-[#9a917c]">
                תעודה זו מוענקת בזאת בהצטיינות ובהערכה רבה ל-
              </p>
            </div>

            {/* Recipient Name in Frank Ruhl Libre Serif Font */}
            <div className="relative z-10 py-1 sm:py-2">
              <div className="font-serif text-2xl sm:text-4xl font-bold text-[#e2c98a] tracking-wide">
                {displayName}
              </div>
              <div className="w-40 sm:w-72 h-0.5 bg-[#c4a35a] mx-auto mt-1" />
              <p className="text-[9px] sm:text-xs text-[#efe8d6]/80 mt-1 sm:mt-2 max-w-xl mx-auto leading-relaxed">
                על עמידה מקיפה בכל דרישות ההכשרה, תפעול מתגי ליבה, ניהול שטח של רשת העירייה ועמידה ביעדי המעבדות:
              </p>
            </div>

            {/* Certified Domains Grid */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 max-w-2xl mx-auto w-full px-1 sm:px-2 py-2">
              {CERTIFIED_DOMAINS.map((domain, idx) => (
                <div 
                  key={idx}
                  className="px-1.5 sm:px-2 py-1 rounded-md bg-[#161410]/80 border border-[#c4a35a]/30 text-[9px] sm:text-[11px] text-[#efe8d6] flex items-center justify-center gap-1 font-medium shadow-sm"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#c4a35a] shrink-0" />
                  <span className="truncate">{domain}</span>
                </div>
              ))}
            </div>

            {/* Signatures & Seal Section */}
            <div className="relative z-10 pt-2 sm:pt-3 border-t border-[#c4a35a]/20 grid grid-cols-3 items-end text-xs gap-1 sm:gap-2">
              {/* Left Signatures */}
              <div className="text-right space-y-0.5">
                <div className="font-serif text-[9px] sm:text-xs italic text-[#c4a35a] font-bold">
                  ~ א. כהן ~
                </div>
                <div className="w-16 sm:w-28 h-px bg-[#c4a35a]/40" />
                <div className="text-[8px] sm:text-[11px] font-bold text-[#efe8d6] leading-tight">
                  מנהל אגף מערכות מידע ותקשורת
                </div>
                <div className="text-[7px] sm:text-[10px] text-[#9a917c]">
                  עיריית רעננה
                </div>
              </div>

              {/* Center Official Gold Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border sm:border-2 border-[#c4a35a] bg-[#161410] flex flex-col items-center justify-center text-[#c4a35a] shadow-[0_0_12px_rgba(196,163,90,0.2)]">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
                  <span className="text-[5px] sm:text-[8px] font-bold mt-0.5">מאושר 7274</span>
                </div>
              </div>

              {/* Right Signatures & Verification */}
              <div className="text-left space-y-0.5">
                <div className="font-serif text-[9px] sm:text-xs italic text-[#c4a35a] font-bold">
                  ~ ד. לוי ~
                </div>
                <div className="w-16 sm:w-28 h-px bg-[#c4a35a]/40 ml-auto" />
                <div className="text-[8px] sm:text-[11px] font-bold text-[#efe8d6] leading-tight">
                  מנהל צוות תשתיות
                </div>
                <div className="text-[7px] sm:text-[10px] font-mono text-[#c4a35a] truncate">
                  {verificationCode}
                </div>
              </div>
            </div>

            {/* Watermark Date */}
            <div className="relative z-10 text-[8px] sm:text-[9px] text-[#9a917c]/70 text-center pt-1">
              הונפק בתאריך {todayHebrew} · אומת במערכת ההכשרה הממוחשבת של מנהל התקשורת
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
