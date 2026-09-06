'use client';

import React, { useState, useMemo } from 'react';
import { 
  LearningNode, 
  ELEVATION_ZONES, 
  NodeProgress,
  ElevationZone 
} from '@/data/curriculumData';
import { audioFeedback } from '@/lib/audioFeedback';
import { VisualHardwareSoftwareBlueprint } from './VisualHardwareSoftwareBlueprint';
import { 
  Layers, 
  Binary, 
  Cable, 
  Server, 
  Network, 
  ShieldAlert, 
  Wifi, 
  Globe, 
  Activity, 
  Cpu, 
  ServerCrash, 
  Camera, 
  Lock, 
  PhoneCall, 
  Wrench, 
  Terminal, 
  Briefcase,
  CheckCircle2,
  Lock as LockIcon,
  Sparkles,
  Mountain,
  Compass,
  ArrowLeft,
  Clock,
  MapPin,
  Check,
  Zap,
  TrendingUp,
  LayoutGrid,
  ChevronUp,
  Radio,
  Sliders,
  Filter,
  Eye,
  Info
} from 'lucide-react';

interface TopographicMapProps {
  nodes: LearningNode[];
  progress: NodeProgress;
  selectedNodeId: string | null;
  onSelectNode: (node: LearningNode) => void;
  filterCategory: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  Binary,
  Cable,
  Server,
  Network,
  ShieldAlert,
  Wifi,
  Globe,
  Activity,
  Cpu,
  ServerCrash,
  Camera,
  Lock,
  PhoneCall,
  Wrench,
  Terminal,
  Briefcase,
};

// Tactical theme definition per altitude tier
interface ZoneVisualConfig {
  elevation: number;
  label: string;
  tagline: string;
  gradientBg: string;
  borderColor: string;
  accentColor: string;
  textColor: string;
  badgeBg: string;
  contourStroke: string;
  icon: React.ElementType;
}

const ZONE_CONFIGS: Record<number, ZoneVisualConfig> = {
  1000: {
    elevation: 1000,
    label: 'פסגת ניהול שטח וספקים',
    tagline: 'דרג ב׳ עצמאי, פקודות CLI עמוקות, ספקי תשתיות (בזק/סלקום/חח"י) ו-SLAs',
    gradientBg: 'from-[#1A102E]/90 via-[#150D24]/90 to-[#0F0A1C]/90',
    borderColor: 'border-violet-500/40',
    accentColor: '#a855f7',
    textColor: 'text-violet-300',
    badgeBg: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    contourStroke: '#9333ea',
    icon: Mountain,
  },
  750: {
    elevation: 750,
    label: 'רמת עיר חכמה, אבטחה וטלפוניה',
    tagline: 'מצלמות LPR, מוקד 106, אבטחת גישה 802.1X וארונות חוץ מוקשחים',
    gradientBg: 'from-[#2A1806]/90 via-[#201305]/90 to-[#140C03]/90',
    borderColor: 'border-amber-500/40',
    accentColor: '#f59e0b',
    textColor: 'text-amber-300',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    contourStroke: '#d97706',
    icon: Camera,
  },
  500: {
    elevation: 500,
    label: 'רכס השו״ב, הניתוב והאינטרנט',
    tagline: 'מערכות ניטור PRTG, פרוטוקול SNMP, שרתי DNS/DHCP וחומות אש FortiGate',
    gradientBg: 'from-[#0C1E38]/90 via-[#0A172B]/90 to-[#070F1C]/90',
    borderColor: 'border-blue-500/40',
    accentColor: '#3b82f6',
    textColor: 'text-blue-300',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    contourStroke: '#2563eb',
    icon: Radio,
  },
  250: {
    elevation: 250,
    label: 'מישור האתרים, מיתוג ו-VLANs',
    tagline: 'מתגי Cisco/Aruba L2/L3, שרידות Spanning-Tree וקישורי אלחוט PTP',
    gradientBg: 'from-[#07242B]/90 via-[#061C22]/90 to-[#041317]/90',
    borderColor: 'border-cyan-500/40',
    accentColor: '#06b6d4',
    textColor: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    contourStroke: '#0891b2',
    icon: Network,
  },
  0: {
    elevation: 0,
    label: 'שפלת הבסיס והתשתיות הפסיביות',
    tagline: 'מודל OSI, חישובי IPv4/סאבנט, סיבים אופטיים Single/Multi וכבילת Cat6A/PoE',
    gradientBg: 'from-[#0A261D]/90 via-[#081F17]/90 to-[#05140F]/90',
    borderColor: 'border-emerald-500/40',
    accentColor: '#10b981',
    textColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    contourStroke: '#059669',
    icon: Cable,
  },
};

export const TopographicMap: React.FC<TopographicMapProps> = ({
  nodes,
  progress,
  selectedNodeId,
  onSelectNode,
  filterCategory,
}) => {
  const [hoveredNode, setHoveredNode] = useState<LearningNode | null>(null);
  const [activeElevation, setActiveElevation] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'blueprint' | 'strata' | 'tiers'>('blueprint');

  // Check node status: completed, available, or locked
  const getNodeStatus = (node: LearningNode): 'completed' | 'available' | 'locked' => {
    if (progress[node.id]?.completed) return 'completed';
    const arePrereqsMet = node.prerequisites.every(
      (prereqId) => progress[prereqId]?.completed
    );
    if (arePrereqsMet || node.prerequisites.length === 0) return 'available';
    return 'locked';
  };

  // Filtered nodes based on category and elevation
  const visibleNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesCategory = filterCategory === 'all' || node.category === filterCategory;
      const matchesElevation = activeElevation === null || node.elevation === activeElevation;
      return matchesCategory && matchesElevation;
    });
  }, [nodes, filterCategory, activeElevation]);

  // Elevation zone statistics
  const zoneStats = useMemo(() => {
    return ELEVATION_ZONES.map((zone) => {
      const zoneNodes = nodes.filter((n) => n.elevation === zone.elevation);
      const completed = zoneNodes.filter((n) => progress[n.id]?.completed).length;
      const total = zoneNodes.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        ...zone,
        config: ZONE_CONFIGS[zone.elevation],
        total,
        completed,
        percent,
      };
    });
  }, [nodes, progress]);

  // Calculate actual altitude climbed
  const totalNodesCount = nodes.length;
  const completedNodesCount = nodes.filter((n) => progress[n.id]?.completed).length;
  const overallPercent = totalNodesCount > 0 ? Math.round((completedNodesCount / totalNodesCount) * 100) : 0;

  // Compute highest altitude milestone fully or partially conquered
  const currentAltitudeClimbed = useMemo(() => {
    // Each completed node contributes proportionally towards the 1000m summit
    if (totalNodesCount === 0) return 0;
    return Math.round((completedNodesCount / totalNodesCount) * 1000);
  }, [completedNodesCount, totalNodesCount]);

  // Group visible nodes by elevation (from Summit 1000m down to Base 0m)
  const elevationTiers = useMemo(() => {
    const elevations = [1000, 750, 500, 250, 0];
    return elevations.map((elev) => {
      const zone = ELEVATION_ZONES.find((z) => z.elevation === elev)!;
      const tierNodes = visibleNodes.filter((n) => n.elevation === elev);
      const config = ZONE_CONFIGS[elev];
      const allTierNodes = nodes.filter((n) => n.elevation === elev);
      const completedCount = allTierNodes.filter((n) => progress[n.id]?.completed).length;
      const percent = allTierNodes.length > 0 ? Math.round((completedCount / allTierNodes.length) * 100) : 0;

      return {
        elevation: elev,
        zone,
        config,
        nodes: tierNodes,
        totalNodes: allTierNodes.length,
        completedCount,
        percent,
      };
    });
  }, [visibleNodes, nodes, progress]);

  return (
    <div className="relative w-full space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. MASTER ELEVATION CONTROL & ALTIMETER COMMAND BAR                        */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#0D111A] border border-white/10 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle radial ambient glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          
          {/* Header & Municipal Summit Branding */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400/40 flex items-center justify-center text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] shrink-0">
              <Mountain className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  ציר הגבהים הטופוגרפי: משפלת הבסיס (0m) ועד פסגת ניהול השטח (1000m)
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-mono font-semibold">
                  מכרז 7274 רעננה
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                מסלול טיפוס טקטי המחולק ל-5 מדרגות גובה מקצועיות — מחומרה פיזית וכבילת שטח, דרך מיתוג עירוני ומוקד שו״ב, ועד למרכזיית 106 ועבודה מול ספקי תשתיות.
              </p>
            </div>
          </div>

          {/* Current Altitude Gauge & View Mode Selector */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            {/* Real Altimeter Metric Gauge */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#141824] border border-white/10 shadow-inner">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between gap-2">
                  <span>גובה שהושג:</span>
                  <span className="text-blue-400 font-bold">{currentAltitudeClimbed}m / 1000m</span>
                </div>
                <div className="w-36 sm:w-44 h-2 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono text-slate-300 border-r border-slate-700 pr-3">
                {completedNodesCount}/{totalNodesCount} מודולים
              </span>
            </div>

            {/* View Mode Toggle Button */}
            <div className="p-1 rounded-2xl bg-[#141824] border border-white/10 flex flex-wrap items-center gap-1">
              <button
                id="btn-view-blueprint"
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setViewMode('blueprint');
                }}
                className={`min-h-[40px] text-xs px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'blueprint'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>ארכיטקטורת חומרה ⟷ תוכנה</span>
              </button>
              <button
                id="btn-view-strata"
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setViewMode('strata');
                }}
                className={`min-h-[40px] text-xs px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'strata'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>ציר גבהים (0-1000m)</span>
              </button>
              <button
                id="btn-view-tiers"
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setViewMode('tiers');
                }}
                className={`min-h-[40px] text-xs px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'tiers'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>סילבוס שטח</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE ALTITUDE AXIS TACTICAL SELECTOR (ציר הגבהים 0m עד 1000m)       */}
        {/* ========================================================================= */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mountain className="w-4 h-4 text-blue-400" />
              <span>בחירת מדרגת גובה לצפייה בציר:</span>
            </span>
            {activeElevation !== null && (
              <button
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setActiveElevation(null);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                הצג את כל הגבהים (0m - 1000m)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
            {/* All elevations pill */}
            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                setActiveElevation(null);
              }}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                activeElevation === null
                  ? 'bg-blue-600/25 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] ring-1 ring-blue-400'
                  : 'bg-[#141824]/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">כל הציר</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">0-1000m</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2">
                סך הכל: {totalNodesCount} מודולים
              </span>
            </button>

            {/* Individual Elevation Tiers */}
            {zoneStats.slice().reverse().map((zone) => {
              const isSelected = activeElevation === zone.elevation;
              const config = zone.config;
              const TierIcon = config.icon;

              return (
                <button
                  key={zone.elevation}
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setActiveElevation(isSelected ? null : zone.elevation);
                  }}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/25 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.35)] ring-1 ring-blue-400'
                      : 'bg-[#141824]/80 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold flex items-center gap-1.5 ${config.textColor}`}>
                      <TierIcon className="w-3.5 h-3.5" />
                      <span>{zone.elevation}m</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      {zone.completed}/{zone.total}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${zone.percent}%`,
                          backgroundColor: config.accentColor 
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {zone.name.split(' ')[0]} {zone.name.split(' ')[1] || ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. VIEW MODE 0: VISUAL HARDWARE & SOFTWARE BLUEPRINT ARCHITECTURE         */}
      {/* ========================================================================= */}
      {viewMode === 'blueprint' && (
        <VisualHardwareSoftwareBlueprint
          nodes={nodes}
          progress={progress}
          onSelectNode={onSelectNode}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW MODE 1: ELEVATION STRATA & TOPOGRAPHIC TERRACES                   */}
      {/* ========================================================================= */}
      {viewMode === 'strata' && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ======================================================================= */}
          {/* SIDEBAR: PHYSICAL TACTICAL ALTIMETER AXIS SPINE (ציר הגבהים האנכי)     */}
          {/* ======================================================================= */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0 rounded-2xl bg-[#0D111A] border border-white/10 p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>ציר הגבהים וההסמכה</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                0m ➔ 1000m
              </span>
            </div>

            {/* Vertical Altimeter Ladder */}
            <div className="relative flex flex-col space-y-3.5 pr-2">
              {/* Connected Ascent Spine Line */}
              <div className="absolute top-4 bottom-4 right-4 w-1 bg-gradient-to-t from-emerald-500 via-blue-500 to-purple-500 rounded-full opacity-40 pointer-events-none" />

              {ELEVATION_ZONES.slice().reverse().map((zone) => {
                const config = ZONE_CONFIGS[zone.elevation];
                const TierIcon = config.icon;
                const isSelected = activeElevation === zone.elevation;
                const zoneNodes = nodes.filter((n) => n.elevation === zone.elevation);
                const completedInZone = zoneNodes.filter((n) => progress[n.id]?.completed).length;
                const isFullyMastered = completedInZone === zoneNodes.length && zoneNodes.length > 0;
                const isPartiallyDone = completedInZone > 0;

                return (
                  <button
                    key={zone.elevation}
                    onClick={() => {
                      audioFeedback.playKeyClick();
                      setActiveElevation(isSelected ? null : zone.elevation);
                    }}
                    className={`relative z-10 w-full text-right p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)] ring-1 ring-blue-400'
                        : 'bg-[#141824]/90 border-white/5 hover:border-white/20 hover:bg-[#181D2D]'
                    }`}
                  >
                    {/* Elevation Beacon Pin */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
                      isFullyMastered
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : isPartiallyDone
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}>
                      {isFullyMastered ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <TierIcon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-mono font-bold ${config.textColor}`}>
                          ▲ {zone.elevation}m
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {completedInZone}/{zoneNodes.length}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight mt-0.5 truncate">
                        {zone.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                        {config.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Municipal Guidance Box */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>טיפ התקדמות למכרז 7274:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                בראיון הקבלה והמבחן המעשי בעיריית רעננה תיבדק עמידותך החל משפלת התשתיות (סיבים וכבילה) ועד לפסגת ניהול שטח ותפעול תקלות עצמאי.
              </p>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* MAIN CANVAS: THE 5 ELEVATION TERRACES (מדרגות הגובה הטופוגרפיות)         */}
          {/* ======================================================================= */}
          <div className="flex-1 w-full space-y-6">
            {elevationTiers
              .filter((tier) => activeElevation === null || tier.elevation === activeElevation)
              .map((tier) => {
                const { elevation, zone, config, nodes: tierNodes, totalNodes, completedCount, percent } = tier;
                const TierIcon = config.icon;

                return (
                  <div
                    key={elevation}
                    id={`elevation-strata-${elevation}`}
                    className={`rounded-2xl border transition-all p-5 sm:p-6 shadow-xl relative overflow-hidden bg-gradient-to-br ${config.gradientBg} ${config.borderColor}`}
                  >
                    {/* Topographic Contour Isobar Watermark */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 800 300">
                      <path d="M0,100 C200,60 400,140 600,80 C700,50 750,110 800,90" fill="none" stroke={config.contourStroke} strokeWidth="1.5" strokeDasharray="6 4" />
                      <path d="M0,180 C250,130 350,220 550,160 C680,120 740,200 800,170" fill="none" stroke={config.contourStroke} strokeWidth="1.5" strokeDasharray="8 6" />
                      <path d="M0,250 C180,210 320,280 500,230 C640,200 720,260 800,240" fill="none" stroke={config.contourStroke} strokeWidth="1.5" strokeDasharray="10 8" />
                    </svg>

                    {/* Terrace Header & Altitude Label */}
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-md shrink-0 ${config.badgeBg}`}>
                          <TierIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border ${config.badgeBg}`}>
                              ▲ גובה {elevation}m
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                              {zone.name}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-2xl">
                            {config.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Tier Progress */}
                      <div className="flex items-center gap-3 font-mono text-xs self-end sm:self-auto">
                        <span className="text-slate-300">
                          {completedCount}/{totalNodes} הושלמו
                        </span>
                        <div className="w-24 h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${percent}%`,
                              backgroundColor: config.accentColor 
                            }}
                          />
                        </div>
                        <span className="font-bold text-white">{percent}%</span>
                      </div>
                    </div>

                    {/* Terrace Nodes Cards Grid */}
                    {tierNodes.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        אין מודולים התואמים את סינון התחום הנוכחי במדרגת גובה זו.
                      </div>
                    ) : (
                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {tierNodes.map((node) => {
                          const status = getNodeStatus(node);
                          const isSelected = selectedNodeId === node.id;
                          const isHovered = hoveredNode?.id === node.id;
                          const IconComponent = ICON_MAP[node.iconName] || Layers;

                          let cardStateClasses = 'bg-[#101522]/90 border-slate-800 text-slate-300';
                          if (status === 'completed') {
                            cardStateClasses = 'bg-[#0E1B1C]/95 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-white';
                          } else if (status === 'available') {
                            cardStateClasses = 'bg-[#121A2C]/95 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.25)] text-white';
                          } else {
                            cardStateClasses = 'bg-[#0B0F17]/80 border-slate-800 text-slate-500 opacity-75';
                          }

                          if (isSelected || isHovered) {
                            cardStateClasses += ' ring-2 ring-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-[1.01]';
                          }

                          return (
                            <div
                              key={node.id}
                              id={`node-card-${node.id}`}
                              onMouseEnter={() => setHoveredNode(node)}
                              onMouseLeave={() => setHoveredNode(null)}
                              onClick={() => {
                                audioFeedback.playKeyClick();
                                onSelectNode(node);
                              }}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 backdrop-blur-md ${cardStateClasses}`}
                            >
                              <div>
                                {/* Header: Icon + Status Tag */}
                                <div className="flex items-start justify-between gap-3 mb-2.5">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                                      status === 'completed'
                                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                        : status === 'available'
                                        ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                                        : 'bg-slate-800/60 border-slate-700 text-slate-500'
                                    }`}>
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-sm font-bold text-white leading-tight">
                                        {node.title}
                                      </h4>
                                      <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                                        {node.categoryLabel}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Status tag */}
                                  {status === 'completed' ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0 flex items-center gap-1">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                      <span>הושלם</span>
                                    </span>
                                  ) : status === 'available' ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold shrink-0 flex items-center gap-1 animate-pulse">
                                      <Zap className="w-3 h-3" />
                                      <span>זמין</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-bold shrink-0 flex items-center gap-1">
                                      <LockIcon className="w-3 h-3" />
                                      <span>נעול</span>
                                    </span>
                                  )}
                                </div>

                                {/* Node Summary */}
                                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                  {node.summary}
                                </p>

                                {/* Raanana Municipal Field Snippet */}
                                <div className="mt-3 p-2 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2 text-xs">
                                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                  <div className="min-w-0">
                                    <span className="text-[10px] text-blue-300 font-bold block">
                                      {node.raananaUseCase.location}
                                    </span>
                                    <span className="text-[11px] text-slate-300 line-clamp-1">
                                      {node.raananaUseCase.scenario}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Action Strip */}
                              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                                <span className="font-mono text-[11px] flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  {node.estimatedMinutes} דק׳
                                </span>

                                <span className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 text-xs">
                                  <span>תרגל מודול</span>
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW MODE 2: EXPEDITION TIERS & SYLLABUS OVERVIEW                      */}
      {/* ========================================================================= */}
      {viewMode === 'tiers' && (
        <div className="space-y-6">
          {ELEVATION_ZONES.slice().reverse()
            .filter((z) => activeElevation === null || z.elevation === activeElevation)
            .map((zone) => {
              const zoneNodes = visibleNodes.filter((n) => n.elevation === zone.elevation);
              const config = ZONE_CONFIGS[zone.elevation];
              const TierIcon = config.icon;
              const allZoneNodes = nodes.filter((n) => n.elevation === zone.elevation);
              const completedCount = allZoneNodes.filter((n) => progress[n.id]?.completed).length;
              const zonePercent = allZoneNodes.length > 0 ? Math.round((completedCount / allZoneNodes.length) * 100) : 0;

              return (
                <div 
                  key={zone.elevation}
                  className="rounded-2xl border border-white/10 bg-[#0E121C] p-5 sm:p-6 shadow-xl space-y-4"
                >
                  {/* Zone Master Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-start gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-md shrink-0 ${config.badgeBg}`}>
                        <TierIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border ${config.badgeBg}`}>
                            גובה {zone.elevation}m
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                            {zone.name}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                          {zone.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-3 font-mono text-xs self-end sm:self-auto">
                      <span className="text-slate-300">
                        {completedCount}/{allZoneNodes.length} מודולים
                      </span>
                      <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${zonePercent}%`,
                            backgroundColor: config.accentColor 
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white">
                        {zonePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Modules Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zoneNodes.map((node) => {
                      const status = getNodeStatus(node);
                      const isSelected = selectedNodeId === node.id;
                      const IconComponent = ICON_MAP[node.iconName] || Layers;

                      return (
                        <div
                          key={node.id}
                          onClick={() => {
                            audioFeedback.playKeyClick();
                            onSelectNode(node);
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            isSelected
                              ? 'bg-[#182030] border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-2 ring-blue-400/50'
                              : status === 'completed'
                              ? 'bg-[#0E1818] border-emerald-500/40 hover:border-emerald-400'
                              : status === 'available'
                              ? 'bg-[#121726] border-slate-700/80 hover:border-blue-500 hover:bg-[#161D30]'
                              : 'bg-[#0D1017] border-slate-800/80 opacity-70 hover:opacity-90'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2.5 mb-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                                  status === 'completed'
                                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-400'
                                    : status === 'available'
                                    ? 'bg-blue-600/20 text-blue-300 border-blue-400'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-500'
                                }`}>
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-bold text-white leading-snug truncate">
                                    {node.title}
                                  </h4>
                                  <span className="text-[11px] text-slate-400 block truncate">
                                    {node.subtitle}
                                  </span>
                                </div>
                              </div>

                              {status === 'completed' ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shrink-0">
                                  הושלם
                                </span>
                              ) : status === 'available' ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold shrink-0 animate-pulse">
                                  זמין
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 font-semibold shrink-0">
                                  נעול
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                              {node.summary}
                            </p>
                          </div>

                          <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                            <span className="font-mono text-[11px] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {node.estimatedMinutes} דקות
                            </span>

                            <span className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-xs">
                              למד מודול
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Floating Tactical Inspector Drawer for quick inspection */}
      {hoveredNode && (
        <div 
          className="fixed z-50 bottom-5 left-4 right-4 sm:left-auto sm:right-8 sm:w-[440px] p-5 rounded-2xl bg-[#0C101A]/95 border border-blue-500/60 shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-bold">
                גובה {hoveredNode.elevation}m
              </span>
              <span className="text-xs text-slate-300">{hoveredNode.categoryLabel}</span>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {hoveredNode.estimatedMinutes} דק׳
            </span>
          </div>

          <h3 className="font-bold text-white text-base mb-1.5 leading-snug">
            {hoveredNode.title}
          </h3>
          
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
            {hoveredNode.summary}
          </p>

          {/* Municipal Context Snippet */}
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 mb-3 text-xs text-blue-200 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-300 block">תרחיש שטח רעננה:</span>
              <span className="text-slate-300 text-[11px] line-clamp-2">
                {hoveredNode.raananaUseCase.scenario}
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              {progress[hoveredNode.id]?.completed ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  מודול זה הושלם
                </span>
              ) : (
                <span className="text-blue-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  מוכן ללמידה ותרגול
                </span>
              )}
            </span>

            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                onSelectNode(hoveredNode);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-md text-xs cursor-pointer"
            >
              <span>פתח מודול מלא</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Municipal Knowledge Footer */}
      <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            ציר הגבהים הטופוגרפי מותאם מפורשות לתנאי הסף והדרישות במכרז 7274 של עיריית רעננה.
          </span>
        </div>
        <span className="text-slate-500 font-mono text-[11px]">
          אגף מערכות מידע, תקשורת וביטחון | רעננה
        </span>
      </div>

    </div>
  );
};
