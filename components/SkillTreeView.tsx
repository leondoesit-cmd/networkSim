'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { LearningNode, ELEVATION_ZONES, NodeProgress } from '@/data/curriculumData';
import { audioFeedback } from '@/lib/audioFeedback';
import { 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Lock, 
  Sparkles,
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
  Lock as LockIcon, 
  PhoneCall, 
  Wrench, 
  Terminal, 
  Briefcase,
  GitFork,
  Eye,
  EyeOff,
  ArrowDownUp,
  Info,
  Zap,
  ChevronRight
} from 'lucide-react';

interface SkillTreeViewProps {
  nodes: LearningNode[];
  progress: NodeProgress;
  onSelectNode: (node: LearningNode) => void;
  onToggleComplete: (nodeId: string) => void;
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
  Lock: LockIcon,
  PhoneCall,
  Wrench,
  Terminal,
  Briefcase,
};

interface DependencyLine {
  id: string;
  sourceId: string;
  targetId: string;
  sourceTitle: string;
  targetTitle: string;
  path: string;
  midX: number;
  midY: number;
  status: 'completed' | 'unlocked_ready' | 'locked';
  isSourceCompleted: boolean;
  isTargetCompleted: boolean;
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  nodes,
  progress,
  onSelectNode,
  onToggleComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Settings & filters
  const [showLines, setShowLines] = useState(true);
  const [lineFilter, setLineFilter] = useState<'all' | 'unlocked_only' | 'completed_only'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // desc: 1000m -> 0m, asc: 0m -> 1000m
  const [showLegend, setShowLegend] = useState(false);

  // Interaction states
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const [activeLineTooltip, setActiveLineTooltip] = useState<DependencyLine | null>(null);

  // Calculated SVG lines
  const [lines, setLines] = useState<DependencyLine[]>([]);

  // Calculate dependency lines based on DOM coordinates
  const calculateLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    if (containerRect.width === 0) return;

    const newLines: DependencyLine[] = [];

    nodes.forEach((targetNode) => {
      targetNode.prerequisites.forEach((prereqId) => {
        const sourceNode = nodes.find((n) => n.id === prereqId);
        if (!sourceNode) return;

        const sourceEl = document.getElementById(`skill-card-${prereqId}`);
        const targetEl = document.getElementById(`skill-card-${targetNode.id}`);

        if (!sourceEl || !targetEl) return;

        const sRect = sourceEl.getBoundingClientRect();
        const tRect = targetEl.getBoundingClientRect();

        if (sRect.width === 0 || tRect.width === 0) return;

        const sCenterX = sRect.left + sRect.width / 2 - containerRect.left;
        const sCenterY = sRect.top + sRect.height / 2 - containerRect.top;
        const tCenterX = tRect.left + tRect.width / 2 - containerRect.left;
        const tCenterY = tRect.top + tRect.height / 2 - containerRect.top;

        const dy = tCenterY - sCenterY;
        const dx = tCenterX - sCenterX;

        let startX: number;
        let startY: number;
        let endX: number;
        let endY: number;
        let path = '';

        if (Math.abs(dy) > 70) {
          // Across different elevation tiers/zones
          if (dy < 0) {
            // Target is physically above source
            startX = sCenterX;
            startY = sRect.top - containerRect.top;
            endX = tCenterX;
            endY = tRect.bottom - containerRect.top;
          } else {
            // Target is physically below source
            startX = sCenterX;
            startY = sRect.bottom - containerRect.top;
            endX = tCenterX;
            endY = tRect.top - containerRect.top;
          }

          const distY = Math.abs(endY - startY);
          const curvature = Math.min(distY * 0.45, 120);
          const cp1x = startX;
          const cp1y = dy < 0 ? startY - curvature : startY + curvature;
          const cp2x = endX;
          const cp2y = dy < 0 ? endY + curvature : endY - curvature;

          path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        } else {
          // Within same zone (horizontal/adjacent)
          if (dx > 0) {
            startX = sRect.right - containerRect.left;
            startY = sCenterY;
            endX = tRect.left - containerRect.left;
            endY = tCenterY;
          } else {
            startX = sRect.left - containerRect.left;
            startY = sCenterY;
            endX = tRect.right - containerRect.left;
            endY = tCenterY;
          }

          const distX = Math.abs(endX - startX);
          const curvature = Math.min(distX * 0.35, 60);
          const cp1x = dx > 0 ? startX + curvature : startX - curvature;
          const cp1y = startY - 20;
          const cp2x = dx > 0 ? endX - curvature : endX + curvature;
          const cp2y = endY - 20;

          path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        }

        const isSourceCompleted = !!progress[sourceNode.id]?.completed;
        const isTargetCompleted = !!progress[targetNode.id]?.completed;
        
        let status: 'completed' | 'unlocked_ready' | 'locked' = 'locked';
        if (isTargetCompleted) {
          status = 'completed';
        } else if (isSourceCompleted) {
          status = 'unlocked_ready';
        }

        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        newLines.push({
          id: `${prereqId}->${targetNode.id}`,
          sourceId: prereqId,
          targetId: targetNode.id,
          sourceTitle: sourceNode.title,
          targetTitle: targetNode.title,
          path,
          midX,
          midY,
          status,
          isSourceCompleted,
          isTargetCompleted,
        });
      });
    });

    setLines(newLines);
  }, [nodes, progress]);

  // Recalculate on mount, update, sort order change and resize
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateLines();
    }, 120);

    const handleResize = () => {
      calculateLines();
    };

    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        calculateLines();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [calculateLines, sortOrder]);

  // Filter lines based on active filter
  const visibleLines = useMemo(() => {
    if (!showLines) return [];
    if (lineFilter === 'completed_only') {
      return lines.filter((l) => l.status === 'completed');
    }
    if (lineFilter === 'unlocked_only') {
      return lines.filter((l) => l.status === 'unlocked_ready' || l.status === 'completed');
    }
    return lines;
  }, [lines, showLines, lineFilter]);

  // Quick navigation helper to focus on a node
  const handleJumpToNode = useCallback((nodeId: string) => {
    audioFeedback.playKeyClick();
    setFocusedNodeId(nodeId);
    setHoveredNodeId(nodeId);

    const el = document.getElementById(`skill-card-${nodeId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-blue-400');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-blue-400');
      }, 2500);
    }
  }, []);

  // Ordered elevation zones according to sortOrder
  const displayedZones = useMemo(() => {
    return sortOrder === 'desc' 
      ? ELEVATION_ZONES.slice().reverse() 
      : ELEVATION_ZONES.slice();
  }, [sortOrder]);

  // Find modules unlocked by a specific node
  const getModulesUnlockedBy = useCallback((nodeId: string) => {
    return nodes.filter((n) => n.prerequisites.includes(nodeId));
  }, [nodes]);

  // Compute dependency counts for stats pill
  const dependencyStats = useMemo(() => {
    const totalDeps = lines.length;
    const completedDeps = lines.filter((l) => l.status === 'completed').length;
    const readyDeps = lines.filter((l) => l.status === 'unlocked_ready').length;
    return { totalDeps, completedDeps, readyDeps };
  }, [lines]);

  return (
    <div className="w-full space-y-6">
      {/* Skill Tree Control & Dependency Toolbar */}
      <div className="rounded-2xl border border-white/10 bg-[#0F1117] p-4 sm:p-5 backdrop-blur-sm shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#E2E8F0]">
                  עץ מיומנויות ורשת תלויות מודולים
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono">
                  {dependencyStats.totalDeps} קשרי תלות
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                עקוב אחר קווי התלות כדי לראות אילו מודולי יסוד פותחים מודולים מתקדמים בפסגת הרשת העירונית
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Lines Button */}
            <button
              id="btn-toggle-dependency-lines"
              onClick={() => {
                audioFeedback.playKeyClick();
                setShowLines(!showLines);
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                showLines
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-sm'
                  : 'bg-[#1A1D24] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title={showLines ? 'הסתר קווי תלות' : 'הצג קווי תלות'}
            >
              {showLines ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>קווי תלות: {showLines ? 'מוצגים' : 'מוסתרים'}</span>
            </button>

            {/* Filter Lines Mode */}
            {showLines && (
              <div className="flex items-center bg-[#1A1D24] border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setLineFilter('all');
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    lineFilter === 'all'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  הכל ({lines.length})
                </button>
                <button
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setLineFilter('unlocked_only');
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    lineFilter === 'unlocked_only'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  נתיבים פתוחים ({dependencyStats.readyDeps + dependencyStats.completedDeps})
                </button>
                <button
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setLineFilter('completed_only');
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    lineFilter === 'completed_only'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  הושלמו ({dependencyStats.completedDeps})
                </button>
              </div>
            )}

            {/* Sort Order Toggle */}
            <button
              id="btn-sort-order-toggle"
              onClick={() => {
                audioFeedback.playKeyClick();
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              }}
              className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A1D24] text-slate-300 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5"
              title="שנה סדר גבהים"
            >
              <ArrowDownUp className="w-3.5 h-3.5 text-blue-400" />
              <span>{sortOrder === 'desc' ? 'מפסגה לשפלה' : 'משפלה לפסגה'}</span>
            </button>

            {/* Legend Toggle Button */}
            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                setShowLegend(!showLegend);
              }}
              className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs border transition-all flex items-center gap-1 ${
                showLegend
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : 'bg-[#1A1D24] text-slate-400 border-slate-800 hover:text-slate-300'
              }`}
              title="מקרא קווי תלות"
            >
              <Info className="w-3.5 h-3.5" />
              <span>מקרא</span>
            </button>
          </div>
        </div>

        {/* Legend Card Drawer */}
        {showLegend && (
          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-slate-800">
              <span className="w-4 h-0.5 bg-emerald-400 rounded-full" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-emerald-400 block">דרישה הושלמה</span>
                <span className="text-[11px] text-slate-400">המודול המקדים בוצע בהצלחה</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-slate-800">
              <span className="w-4 h-0.5 bg-sky-400 border-b border-dashed border-sky-400" />
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 animate-pulse" />
              <div>
                <span className="font-semibold text-sky-400 block">פתוח ללמידה (מוכן)</span>
                <span className="text-[11px] text-slate-400">המודול פתח את השלב הבא עבורך</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-slate-800">
              <span className="w-4 h-0.5 bg-slate-600" />
              <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-400 block">תלות נעולה</span>
                <span className="text-[11px] text-slate-400">טרם הושלמו מודולי הקדם</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Node Dependency Inspector Pill */}
        {hoveredNodeId && (
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="text-slate-400">מודול ממוקד:</span>
              <span className="font-bold text-blue-300">
                {nodes.find((n) => n.id === hoveredNodeId)?.title}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>
                דרישות קדם:{' '}
                <strong className="text-amber-400">
                  {nodes.find((n) => n.id === hoveredNodeId)?.prerequisites.length || 0}
                </strong>
              </span>
              <span>•</span>
              <span>
                פותח מודולים:{' '}
                <strong className="text-sky-400">
                  {getModulesUnlockedBy(hoveredNodeId).length}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Container with SVG Overlay & Elevation Zones */}
      <div 
        ref={containerRef} 
        className="w-full space-y-8 relative"
      >
        {/* SVG Dependency Lines Overlay */}
        {showLines && (
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* Arrow Markers */}
              <marker
                id="dep-arrow-locked"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" opacity="0.6" />
              </marker>

              <marker
                id="dep-arrow-unlocked"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
              </marker>

              <marker
                id="dep-arrow-completed"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
              </marker>

              <marker
                id="dep-arrow-highlight-out"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
              </marker>

              <marker
                id="dep-arrow-highlight-in"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#fbbf24" />
              </marker>

              {/* Glow filter for highlighted lines */}
              <filter id="dep-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {visibleLines.map((line) => {
              const isSourceHovered = hoveredNodeId === line.sourceId;
              const isTargetHovered = hoveredNodeId === line.targetId;
              const isDirectlyFocused = isSourceHovered || isTargetHovered;
              const isLineHovered = hoveredLineId === line.id;
              const anyNodeHovered = !!hoveredNodeId;

              // Stroke appearance
              let strokeColor = '#475569';
              let strokeWidth = 1.5;
              let strokeOpacity = 0.35;
              let markerEnd = 'url(#dep-arrow-locked)';
              let strokeDasharray = 'none';

              if (line.status === 'completed') {
                strokeColor = '#34d399';
                strokeOpacity = 0.45;
                markerEnd = 'url(#dep-arrow-completed)';
              } else if (line.status === 'unlocked_ready') {
                strokeColor = '#38bdf8';
                strokeOpacity = 0.65;
                strokeDasharray = '5 3';
                markerEnd = 'url(#dep-arrow-unlocked)';
              }

              // Highlight override when a connected card is hovered
              if (isSourceHovered) {
                // Outgoing: This module unlocks the target!
                strokeColor = '#38bdf8';
                strokeWidth = 2.75;
                strokeOpacity = 1;
                strokeDasharray = '6 3';
                markerEnd = 'url(#dep-arrow-highlight-out)';
              } else if (isTargetHovered) {
                // Incoming: This prerequisite was required to unlock!
                strokeColor = '#fbbf24';
                strokeWidth = 2.75;
                strokeOpacity = 1;
                strokeDasharray = '6 3';
                markerEnd = 'url(#dep-arrow-highlight-in)';
              } else if (anyNodeHovered) {
                // Dim unrelated lines
                strokeOpacity = 0.08;
              }

              if (isLineHovered) {
                strokeWidth = 3;
                strokeOpacity = 1;
              }

              return (
                <g 
                  key={line.id} 
                  className="transition-all duration-300"
                >
                  {/* Invisible thicker hit-area for line hover / interaction */}
                  <path
                    d={line.path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                    className="pointer-events-auto cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredLineId(line.id);
                      setActiveLineTooltip(line);
                    }}
                    onMouseLeave={() => {
                      setHoveredLineId(null);
                      setActiveLineTooltip(null);
                    }}
                    onClick={() => {
                      audioFeedback.playKeyClick();
                      handleJumpToNode(line.targetId);
                    }}
                  />

                  {/* Rendered visible subtle line */}
                  <path
                    d={line.path}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    strokeDasharray={strokeDasharray}
                    markerEnd={markerEnd}
                    filter={isDirectlyFocused || isLineHovered ? 'url(#dep-glow)' : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Directional flow dot on highlighted lines */}
                  {(isDirectlyFocused || isLineHovered) && (
                    <circle
                      cx={line.midX}
                      cy={line.midY}
                      r={3.5}
                      fill={isTargetHovered ? '#fbbf24' : '#38bdf8'}
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Interactive Floating Tooltip on Line Hover */}
        {activeLineTooltip && (
          <div
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-[#0B0F17] border border-blue-500/50 rounded-lg p-2.5 shadow-2xl backdrop-blur-md max-w-xs text-xs animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${activeLineTooltip.midX}px`,
              top: `${activeLineTooltip.midY - 10}px`,
            }}
          >
            <div className="flex items-center gap-1.5 font-bold text-blue-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>מסלול תלות:</span>
            </div>
            <div className="text-slate-300 space-y-1">
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400">מודול מקדים:</span>
                <strong className="text-white truncate">{activeLineTooltip.sourceTitle}</strong>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-blue-400">
                <ChevronRight className="w-3 h-3 shrink-0" />
                <span>פותח את:</span>
                <strong className="text-white truncate">{activeLineTooltip.targetTitle}</strong>
              </div>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-white/10 text-[10px] font-mono">
              {activeLineTooltip.status === 'completed' && (
                <span className="text-emerald-400">✓ שתי המשימות הושלמו</span>
              )}
              {activeLineTooltip.status === 'unlocked_ready' && (
                <span className="text-sky-400">⚡ התלות נפתחה! מוכן ללמידה</span>
              )}
              {activeLineTooltip.status === 'locked' && (
                <span className="text-slate-400">🔒 נדרש להשלים את מודול המקור תחילה</span>
              )}
            </div>
          </div>
        )}

        {/* Elevation Zones Stack */}
        {displayedZones.map((zone) => {
          const zoneNodes = nodes.filter((n) => n.elevation === zone.elevation);
          const completedInZone = zoneNodes.filter((n) => progress[n.id]?.completed).length;
          const totalInZone = zoneNodes.length;
          const percent = totalInZone > 0 ? Math.round((completedInZone / totalInZone) * 100) : 0;

          return (
            <div
              key={zone.elevation}
              className="rounded-2xl border border-white/10 bg-[#0F1117] p-5 sm:p-6 backdrop-blur-sm relative shadow-md transition-all duration-300"
            >
              {/* Zone Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10 relative z-20">
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-bold border bg-blue-500/10 text-blue-400 border-blue-500/20">
                    גובה {zone.elevation}m
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#E2E8F0] flex items-center gap-2">
                      {zone.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{zone.description}</p>
                  </div>
                </div>

                {/* Progress pill */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-left font-mono">
                    <span className="text-xs font-semibold text-slate-300">
                      {completedInZone}/{totalInZone} הושלמו
                    </span>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Zone Nodes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20">
                {zoneNodes.map((node) => {
                  const isCompleted = progress[node.id]?.completed;
                  const arePrereqsMet = node.prerequisites.every(
                    (prereqId) => progress[prereqId]?.completed
                  );
                  const isLocked = !arePrereqsMet && node.prerequisites.length > 0 && !isCompleted;
                  const IconComponent = ICON_MAP[node.iconName] || Layers;
                  
                  const isHovered = hoveredNodeId === node.id;
                  const isFocused = focusedNodeId === node.id;
                  const unlockedModules = getModulesUnlockedBy(node.id);

                  return (
                    <div
                      key={node.id}
                      id={`skill-card-${node.id}`}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className={`group relative rounded-xl border p-4 transition-all duration-200 ${
                        isCompleted
                          ? 'bg-[#0A0C10] border-blue-500/50 hover:border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                          : isLocked
                          ? 'bg-[#12151C] border-slate-800 opacity-70'
                          : 'bg-[#1A1D24] border-slate-700/80 hover:border-blue-500/80 hover:shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                      } ${
                        isHovered || isFocused ? 'ring-1 ring-blue-500/80 bg-[#161A22]' : ''
                      }`}
                    >
                      {/* Anchor Port Indicator: Top (Incoming Prerequisites) */}
                      {node.prerequisites.length > 0 && (
                        <div 
                          className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30"
                          title={`דרישות קדם: ${node.prerequisites.length}`}
                        >
                          <span className={`w-2 h-2 rounded-full border ${
                            arePrereqsMet
                              ? 'bg-emerald-400 border-emerald-300 shadow-sm'
                              : 'bg-slate-700 border-slate-600'
                          }`} />
                        </div>
                      )}

                      {/* Anchor Port Indicator: Bottom (Outgoing Unlocks) */}
                      {unlockedModules.length > 0 && (
                        <div 
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30"
                          title={`פותח ${unlockedModules.length} מודולים הבאים`}
                        >
                          <span className={`w-2 h-2 rounded-full border ${
                            isCompleted
                              ? 'bg-blue-400 border-blue-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                              : 'bg-slate-700 border-slate-600'
                          }`} />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        {/* Icon and Title */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                              isCompleted
                                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                                : isLocked
                                ? 'bg-[#12151C] text-slate-500 border-slate-800'
                                : 'bg-blue-600/15 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-[#E2E8F0] text-sm group-hover:text-blue-400 transition-colors">
                                {node.title}
                              </h4>
                              {isCompleted && (
                                <span className="text-[10px] px-2 py-0.2 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
                                  הושלם
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {node.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Complete Checkbox button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            audioFeedback.playKeyClick();
                            onToggleComplete(node.id);
                          }}
                          className={`min-h-[36px] min-w-[36px] p-2 rounded-lg border transition-all flex items-center justify-center ${
                            isCompleted
                              ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                              : 'bg-[#12151C] text-slate-400 border-slate-700 hover:text-blue-400 hover:border-blue-500/40'
                          }`}
                          title={isCompleted ? 'סמן כלא נלמד' : 'סמן כנלמד'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Metadata bar */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {node.estimatedMinutes} דק&apos;
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[11px]">{node.categoryLabel}</span>
                        </div>

                        {/* Open Details CTA */}
                        <button
                          onClick={() => {
                            audioFeedback.playKeyClick();
                            onSelectNode(node);
                          }}
                          className="min-h-[32px] flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors text-xs"
                        >
                          למד מודול
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Dependency Badge: Unlocks other modules */}
                      {unlockedModules.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-sky-400" />
                            <span>פותח {unlockedModules.length} מודולים:</span>
                          </span>
                          {unlockedModules.map((uNode) => (
                            <button
                              key={uNode.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJumpToNode(uNode.id);
                              }}
                              className="px-2 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 text-[10px] transition-colors"
                              title={`קפוץ אל: ${uNode.title}`}
                            >
                              {uNode.title} ➔
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Prerequisites alert if locked */}
                      {isLocked && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-[11px] text-amber-400/90">
                          <Lock className="w-3 h-3 shrink-0" />
                          <span>מומלץ לסיים קודם:</span>
                          {node.prerequisites.map((pId) => {
                            const pNode = nodes.find((n) => n.id === pId);
                            if (!pNode) return null;
                            return (
                              <button
                                key={pId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJumpToNode(pId);
                                }}
                                className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] transition-colors underline"
                                title={`קפוץ לדרישת הקדם: ${pNode.title}`}
                              >
                                {pNode.title}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

