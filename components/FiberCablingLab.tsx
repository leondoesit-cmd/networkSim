'use client';

import React, { useState } from 'react';
import { 
  Cable, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  Cpu, 
  Sparkles,
  Info
} from 'lucide-react';
import { audioFeedback } from '@/lib/audioFeedback';

export function FiberCablingLab() {
  const [activeTab, setActiveTab] = useState<'poe' | 'fiber' | 'pinout'>('poe');

  // PoE Calculator state
  const [phoneCount, setPhoneCount] = useState(12);
  const [cameraCount, setCameraCount] = useState(6);
  const [apCount, setApCount] = useState(8);
  const [powerSupplyModel, setPowerSupplyModel] = useState<370 | 740 | 1100>(740);

  // Optical loss state
  const [fiberDistanceKm, setFiberDistanceKm] = useState(4.2);
  const [fiberType, setFiberType] = useState<'os2' | 'om4'>('os2');
  const [connectorCount, setConnectorCount] = useState(4);
  const [spliceCount, setSpliceCount] = useState(2);

  // PoE calculations
  const phoneWatts = phoneCount * 7.2; // 802.3af Class 2
  const cameraWatts = cameraCount * 25.5; // 802.3at PoE+ Class 4
  const apWatts = apCount * 22.0; // 802.3at PoE+ Class 4
  const totalPoeWatts = phoneWatts + cameraWatts + apWatts;
  const isOverloaded = totalPoeWatts > powerSupplyModel;
  const utilizationPercent = Math.min(100, Math.round((totalPoeWatts / powerSupplyModel) * 100));

  // Optical attenuation calculation
  // OS2 1310nm = ~0.35 dB/km, OM4 850nm = ~3.0 dB/km
  const lossPerKm = fiberType === 'os2' ? 0.35 : 3.0;
  const cableLoss = fiberDistanceKm * lossPerKm;
  const connectorLoss = connectorCount * 0.4; // 0.4 dB per mated pair
  const spliceLoss = spliceCount * 0.1; // 0.1 dB per fusion splice
  const totalOpticalLoss = cableLoss + connectorLoss + spliceLoss;
  const rxPowerDbm = -3.0 - totalOpticalLoss; // assuming -3.0 dBm SFP Tx

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1117] border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cable className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#E2E8F0]">
              מעבדת תשתיות, סיבים אופטיים ו-PoE (רמה ב&apos;)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            סימולציה מעשית של חישובי תקציב הספק PoE, ניחות סיבים אופטיים (Single/Multi Mode) ותקני כבילה Cat6A/T568B
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('poe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'poe'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                : 'bg-[#1A1D24] text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            חישוב עומס PoE למתג
          </button>
          <button
            onClick={() => setActiveTab('fiber')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'fiber'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                : 'bg-[#1A1D24] text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            ניחות סיב (Optical Loss)
          </button>
          <button
            onClick={() => setActiveTab('pinout')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pinout'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                : 'bg-[#1A1D24] text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            תקן כבילה T568B
          </button>
        </div>
      </div>

      {/* TAB 1: POE BUDGET CALCULATOR */}
      {activeTab === 'poe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls (6 Cols) */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0F1117] border border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-[#E2E8F0] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              הגדר מכשירי קצה מחוברים למתג העירוני
            </h4>

            {/* Device 1: IP Phones */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>טלפוני IP עירייה (Cisco 8845 - 802.3af Class 2):</span>
                <span className="font-mono font-bold text-blue-400">{phoneCount} מכשירים ({phoneWatts.toFixed(1)}W)</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                value={phoneCount}
                onChange={(e) => setPhoneCount(parseInt(e.target.value, 10))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Device 2: 4K PTZ Cameras */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>מצלמות אבטחה ו-LPR (Axis PTZ - 802.3at PoE+ Class 4):</span>
                <span className="font-mono font-bold text-amber-400">{cameraCount} מצלמות ({cameraWatts.toFixed(1)}W)</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={cameraCount}
                onChange={(e) => setCameraCount(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Device 3: Wi-Fi 6 APs */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>נקודות גישה Wi-Fi 6 (Aruba AP-575 Outdoor):</span>
                <span className="font-mono font-bold text-emerald-400">{apCount} APs ({apWatts.toFixed(1)}W)</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={apCount}
                onChange={(e) => setApCount(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Power supply selection */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <label className="text-xs text-slate-400 block">בחר ספק כוח למתג (Cisco / Aruba):</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { watts: 370, label: '370W (סטנדרטי)' },
                  { watts: 740, label: '740W (מומלץ PoE+)' },
                  { watts: 1100, label: '1100W (UPOE++ כבד)' },
                ].map((ps) => (
                  <button
                    key={ps.watts}
                    onClick={() => {
                      audioFeedback.playKeyClick();
                      setPowerSupplyModel(ps.watts as 370 | 740 | 1100);
                    }}
                    className={`min-h-[44px] p-2 rounded-lg border text-xs font-mono text-center transition-all flex items-center justify-center ${
                      powerSupplyModel === ps.watts
                        ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                        : 'bg-[#1A1D24] text-slate-300 border-white/10 hover:border-slate-600'
                    }`}
                  >
                    {ps.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Visualizer (6 Cols) */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0F1117] border border-white/10 p-5 space-y-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">סטטוס עומס חשמלי במתג:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isOverloaded
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isOverloaded ? '⚠️ עומס יתר! פורטים יכבו' : '✓ מתח יציב ומאוזן'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-xs text-slate-300">
                  <span>צריכה פעילה: <strong>{totalPoeWatts.toFixed(1)}W</strong></span>
                  <span>הספק מרבי: <strong>{powerSupplyModel}W</strong> ({utilizationPercent}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOverloaded
                        ? 'bg-red-500'
                        : utilizationPercent > 80
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${utilizationPercent}%` }}
                  />
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 rounded-lg bg-[#1A1D24] border border-white/10">
                  <span className="text-[10px] text-slate-400 block">יתרת וואט פנויה:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {Math.max(0, powerSupplyModel - totalPoeWatts).toFixed(1)}W
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#1A1D24] border border-white/10">
                  <span className="text-[10px] text-slate-400 block">פורטים פעילים ב-PoE:</span>
                  <span className="font-mono font-bold text-blue-400">
                    {phoneCount + cameraCount + apCount} פורטים
                  </span>
                </div>
              </div>
            </div>

            {/* Municipal Field Note */}
            <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>שאלת ראיון נפוצה ברעננה:</strong> אם מתג מספק 370W ומחוברות אליו 14 מצלמות PTZ (הצורכות 25.5W כל אחת = 357W), ומחברים מצלמה נוספת, מתג ה-Cisco ישתמש ב-PoE Priority כדי לכבות את הפורט עם העדיפות הנמוכה ביותר למניעת קריסה!
              </span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: OPTICAL LOSS & FIBER SELECTION */}
      {activeTab === 'fiber' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6 rounded-2xl bg-[#0F1117] border border-white/10 p-5 space-y-4 shadow-sm">
            <h4 className="font-bold text-sm text-[#E2E8F0] flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              חישוב ניחות קו סיב אופטי (Optical Power Budget)
            </h4>

            {/* Fiber Type Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block">סוג סיב אופטי:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setFiberType('os2');
                  }}
                  className={`min-h-[52px] p-2.5 rounded-lg border text-xs text-right transition-all flex flex-col justify-center ${
                    fiberType === 'os2'
                      ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                      : 'bg-[#1A1D24] text-slate-300 border-white/10 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">Single-Mode (OS2, 9/125)</div>
                  <div className="text-[10px] opacity-80">מחבר LC כחול, טווח עד 10-40km (עירוני)</div>
                </button>

                <button
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setFiberType('om4');
                  }}
                  className={`min-h-[52px] p-2.5 rounded-lg border text-xs text-right transition-all flex flex-col justify-center ${
                    fiberType === 'om4'
                      ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                      : 'bg-[#1A1D24] text-slate-300 border-white/10 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">Multi-Mode (OM4, 50/125)</div>
                  <div className="text-[10px] opacity-80">מחבר טורקיז Aqua, טווח עד 400m (חדר שרתים)</div>
                </button>
              </div>
            </div>

            {/* Distance Slider with Steppers */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>מרחק הקו האופטי:</span>
                <span className="font-mono font-bold text-blue-400">{fiberDistanceKm.toFixed(1)} ק״מ</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setFiberDistanceKm(Math.max(0.2, parseFloat((fiberDistanceKm - 0.5).toFixed(1))));
                  }}
                  className="min-w-[44px] min-h-[44px] rounded-lg bg-[#1A1D24] border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-lg select-none active:scale-95"
                  title="הקטן מרחק"
                >
                  -
                </button>
                <input
                  type="range"
                  min="0.2"
                  max="15.0"
                  step="0.2"
                  value={fiberDistanceKm}
                  onChange={(e) => setFiberDistanceKm(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setFiberDistanceKm(Math.min(15.0, parseFloat((fiberDistanceKm + 0.5).toFixed(1))));
                  }}
                  className="min-w-[44px] min-h-[44px] rounded-lg bg-[#1A1D24] border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-lg select-none active:scale-95"
                  title="הגדל מרחק"
                >
                  +
                </button>
              </div>
            </div>

            {/* Connectors and splices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">כמות מחברי LC (Mated Pairs):</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={connectorCount}
                  onChange={(e) => setConnectorCount(parseInt(e.target.value, 10) || 2)}
                  className="w-full bg-[#1A1D24] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 font-mono min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">כמות ריתוכי סיב (Fusion Splices):</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={spliceCount}
                  onChange={(e) => setSpliceCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#1A1D24] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 font-mono min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Optical Results */}
          <div className="lg:col-span-6 rounded-2xl bg-[#0F1117] border border-white/10 p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#E2E8F0]">מדדים אופטיים צפויים (Optical Power)</h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[10px] text-slate-400 block">עוצמת שידור משדר (Tx):</span>
                  <span className="font-mono font-bold text-slate-200">-3.0 dBm (10G-LR)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[10px] text-slate-400 block">סך ניחות מחושב (Loss):</span>
                  <span className="font-mono font-bold text-amber-400">-{totalOpticalLoss.toFixed(2)} dB</span>
                </div>
                <div className="col-span-2 p-3 rounded-xl bg-[#1A1D24] border border-white/10">
                  <span className="text-[10px] text-slate-400 block">עוצמת קליטה במתג היעד (Rx Power):</span>
                  <span className={`font-mono text-base font-bold ${
                    rxPowerDbm < -14.0 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {rxPowerDbm.toFixed(2)} dBm {rxPowerDbm >= -14.0 ? '(אופטימלי - ירוק)' : '(אזהרה: ניחות גבוה מדי!)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10 text-xs text-slate-300">
              <strong>דגש מבחן דרג ב&apos;:</strong> בעיריית רעננה, כל הקווים בין בניין העירייה למוקד 106, פארק רעננה והבתי ספר מבוססים על סיב <strong>Single-Mode OS2 9/125</strong> (צהוב/שחור) עם מחברי LC כחולים, עקב מרחקים של 2-6 קילומטרים.
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: RJ45 PINOUT COLOR CODE */}
      {activeTab === 'pinout' && (
        <div className="rounded-2xl bg-[#0F1117] border border-white/10 p-5 space-y-4 shadow-sm">
          <h4 className="font-bold text-sm text-[#E2E8F0] flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            תקן כבילה ישראלי ועירוני: T-568B (Cat6A SFTP)
          </h4>

          <p className="text-xs text-slate-300">
            בכל עבודת תשתית בארונות תקשורת עיריית רעננה, לחיצת שקעי קיסטון (Keystone Jack) ותקעי RJ45 מבוצעת אך ורק לפי תקן <strong>T568B</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 font-mono text-center text-xs">
            {[
              { pin: 1, color: 'לבן-כתום', hex: 'bg-orange-200 text-orange-950 border-orange-400' },
              { pin: 2, color: 'כתום', hex: 'bg-orange-500 text-white border-orange-600' },
              { pin: 3, color: 'לבן-ירוק', hex: 'bg-green-200 text-green-950 border-green-400' },
              { pin: 4, color: 'כחול', hex: 'bg-blue-500 text-white border-blue-600' },
              { pin: 5, color: 'לבן-כחול', hex: 'bg-blue-200 text-blue-950 border-blue-400' },
              { pin: 6, color: 'ירוק', hex: 'bg-green-500 text-white border-green-600' },
              { pin: 7, color: 'לבן-חום', hex: 'bg-amber-200 text-amber-950 border-amber-400' },
              { pin: 8, color: 'חום', hex: 'bg-amber-800 text-white border-amber-900' },
            ].map((p) => (
              <div key={p.pin} className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-between h-24 ${p.hex}`}>
                <span className="text-[10px] opacity-75">Pin {p.pin}</span>
                <span className="text-xs">{p.color}</span>
                <span className="text-[10px] opacity-75">{p.pin <= 2 ? 'Tx' : p.pin === 3 || p.pin === 6 ? 'Rx' : 'PoE'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
