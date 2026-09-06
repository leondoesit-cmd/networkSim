'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  LEARNING_NODES,
  LearningNode,
  NodeProgress,
} from '@/data/curriculumData';
import {
  LIVING_CASE,
  OSI_META,
  TOPIC_NAMES,
  TRIAGE_DILEMMAS,
  tx,
  type CaseSite,
  type CaseTriageDilemma,
  type CaseTriageOption,
  type Lang,
  type OsiLayer,
  type SiteStatus,
} from '@/data/livingCase';
import { useLanguage } from '@/context/LanguageContext';
import { audioFeedback } from '@/lib/audioFeedback';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  Award,
  Binary,
  BookOpen,
  Briefcase,
  Cable,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Flame,
  Globe,
  HelpCircle,
  Layers,
  Lock,
  Network,
  Pause,
  PhoneCall,
  Play,
  RotateCcw,
  Server,
  ServerCrash,
  ShieldAlert,
  Terminal,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
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

const STATUS_DOT: Record<CaseSite['status'], string> = {
  critical: 'bg-[var(--alert)]',
  degraded: 'bg-[var(--brass)]',
  watch: 'bg-[var(--ink)]/40',
  ok: 'bg-[var(--signal)]',
};

const LINK_STROKE: Record<string, string> = {
  up: 'stroke-[var(--signal)]/50',
  degraded: 'stroke-[var(--brass)]/70',
  down: 'stroke-[var(--alert)]/80',
};

interface CaseTheaterProps {
  progress: NodeProgress;
  onOpenTopic: (node: LearningNode) => void;
}

export function CaseTheater({ progress, onOpenTopic }: CaseTheaterProps) {
  const { lang, isRtl } = useLanguage();
  const L = lang as Lang;

  const [stageId, setStageId] = useState(LIVING_CASE.stages[0].id);
  const [topicId, setTopicId] = useState(LIVING_CASE.topics[0].nodeId);
  const [symptomId, setSymptomId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // War Room Triage Mode State
  const [theaterMode, setTheaterMode] = useState<'guided' | 'war_room'>('guided');
  const [userDecisions, setUserDecisions] = useState<Record<string, string>>({});
  const [triageScore, setTriageScore] = useState(0);
  const [siteStatusOverrides, setSiteStatusOverrides] = useState<Record<string, SiteStatus>>({});
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);

  const handleResetWarRoom = () => {
    audioFeedback.playChime();
    setUserDecisions({});
    setTriageScore(0);
    setSiteStatusOverrides({});
    setGameCompleted(false);
    setShowScorecard(false);
    setStageId('cameras');
  };

  const handleSelectTriageOption = (sId: string, option: CaseTriageOption) => {
    if (option.isCorrect) {
      audioFeedback.playSuccess();
    } else if (option.isCatastrophic) {
      audioFeedback.playWarning();
    } else {
      audioFeedback.playKeyClick();
    }

    setUserDecisions((prev) => {
      const next = { ...prev, [sId]: option.id };
      const allDilemmas = Object.keys(TRIAGE_DILEMMAS);
      const allDone = allDilemmas.every((k) => k === sId || !!next[k]);
      if (allDone) {
        setGameCompleted(true);
      }
      return next;
    });

    setTriageScore((prev) => Math.max(0, Math.min(100, prev + option.scoreDelta)));

    if (option.isCorrect && option.resolvedSites && option.resolvedSites.length > 0) {
      setSiteStatusOverrides((prev) => {
        const next = { ...prev };
        option.resolvedSites?.forEach((siteKey) => {
          next[siteKey] = 'ok';
        });
        return next;
      });
    }
  };

  const handleRetryStageDilemma = (sId: string) => {
    audioFeedback.playKeyClick();
    const prevOptionId = userDecisions[sId];
    if (prevOptionId) {
      const dilemma = TRIAGE_DILEMMAS[sId];
      const prevOpt = dilemma?.options.find((o) => o.id === prevOptionId);
      if (prevOpt) {
        setTriageScore((prev) => Math.max(0, Math.min(100, prev - prevOpt.scoreDelta)));
        if (prevOpt.resolvedSites) {
          setSiteStatusOverrides((prev) => {
            const next = { ...prev };
            prevOpt.resolvedSites?.forEach((k) => {
              delete next[k];
            });
            return next;
          });
        }
      }
      setUserDecisions((prev) => {
        const next = { ...prev };
        delete next[sId];
        return next;
      });
      setGameCompleted(false);
    }
  };

  const stage = LIVING_CASE.stages.find((s) => s.id === stageId) ?? LIVING_CASE.stages[0];
  const topic = LIVING_CASE.topics.find((t) => t.nodeId === topicId) ?? LIVING_CASE.topics[0];
  const node = LEARNING_NODES.find((n) => n.id === topic.nodeId) ?? LEARNING_NODES[0];
  const Icon = ICONS[node.iconName] ?? Layers;

  const relatedFromSymptom = useMemo(() => {
    if (!symptomId) return null;
    return LIVING_CASE.symptoms.find((s) => s.id === symptomId)?.relatedNodeIds ?? null;
  }, [symptomId]);

  const completedCount = LEARNING_NODES.filter((n) => progress[n.id]?.completed).length;

  useEffect(() => {
    if (!playing) return;
    const i = LIVING_CASE.stages.findIndex((s) => s.id === stageId);
    const timer = window.setTimeout(() => {
      const next = LIVING_CASE.stages[(i + 1) % LIVING_CASE.stages.length];
      setStageId(next.id);
      setTopicId(next.primaryNodeIds[0]);
      setSymptomId(null);
      audioFeedback.playKeyClick();
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [playing, stageId]);

  const selectStage = (id: string) => {
    audioFeedback.playKeyClick();
    setPlaying(false);
    setStageId(id);
    setSymptomId(null);
    setShowScorecard(id === 'close');
    const next = LIVING_CASE.stages.find((s) => s.id === id);
    if (next) {
      setTopicId(next.primaryNodeIds[0]);
      setSheetOpen(true);
    }
  };

  const selectTopic = (id: string, jumpHome = false) => {
    audioFeedback.playKeyClick();
    setPlaying(false);
    setTopicId(id);
    setSheetOpen(true);
    const role = LIVING_CASE.topics.find((t) => t.nodeId === id);
    if (jumpHome && role) setStageId(role.homeStageId);
  };

  const selectSymptom = (id: string) => {
    audioFeedback.playKeyClick();
    setPlaying(false);
    const next = symptomId === id ? null : id;
    setSymptomId(next);
    if (next) {
      const sym = LIVING_CASE.symptoms.find((s) => s.id === next);
      if (sym?.relatedNodeIds[0]) {
        setTopicId(sym.relatedNodeIds[0]);
        setSheetOpen(true);
      }
    }
  };

  const stageIndex = LIVING_CASE.stages.findIndex((s) => s.id === stageId);
  const go = (dir: -1 | 1) => {
    const next = LIVING_CASE.stages[(stageIndex + dir + LIVING_CASE.stages.length) % LIVING_CASE.stages.length];
    selectStage(next.id);
  };

  const topicHot =
    stage.primaryNodeIds.includes(topic.nodeId) ||
    (relatedFromSymptom?.includes(topic.nodeId) ?? false);

  return (
    <div className={cn("flex flex-col gap-3", theaterMode === 'guided' ? "max-md:pb-[calc(var(--sheet-peek)+0.5rem)]" : "pb-2")} suppressHydrationWarning>
      <div className="flex flex-wrap items-start justify-between gap-2.5 sm:gap-3">
        <div className="min-w-0 max-w-3xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--brass)]">
            {tx(L, LIVING_CASE.kicker)}
          </p>
          <h2 className="mt-0.5 font-serif text-[1.25rem] leading-tight text-[var(--ink)] sm:text-[1.75rem]">
            {tx(L, LIVING_CASE.title)}
          </h2>
          <p className="case-lede mt-1 text-xs leading-relaxed text-[var(--muted)]">{tx(L, LIVING_CASE.lede)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-0.5 text-xs">
            <button
              type="button"
              onClick={() => {
                audioFeedback.playKeyClick();
                setTheaterMode('guided');
                setShowScorecard(false);
              }}
              className={cn(
                'rounded-md px-2.5 py-1 sm:px-3 sm:py-1.5 font-medium transition-all text-xs',
                theaterMode === 'guided'
                  ? 'bg-[var(--panel)] text-[var(--ink)] shadow-sm border border-[var(--line)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              )}
            >
              {L === 'en' ? 'Guided Tour' : 'תחקיר מודרך'}
            </button>
            <button
              type="button"
              onClick={() => {
                audioFeedback.playKeyClick();
                setTheaterMode('war_room');
                if (stageId === 'intake') {
                  setStageId('cameras');
                }
              }}
              className={cn(
                'inline-flex items-center gap-1 sm:gap-1.5 rounded-md px-2.5 py-1 sm:px-3 sm:py-1.5 font-medium transition-all text-xs',
                theaterMode === 'war_room'
                  ? 'bg-[var(--brass)] text-[#1a160f] font-semibold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              )}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">{L === 'en' ? 'War Room Triage' : 'חדר מלחמה אינטראקטיבי'}</span>
              <span className="xs:hidden">{L === 'en' ? 'War Room' : 'חדר מלחמה'}</span>
            </button>
          </div>

          {theaterMode === 'war_room' ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="rounded-lg border border-[var(--brass)]/50 bg-[var(--brass)]/15 px-2 py-1 sm:px-3 sm:py-1.5 font-mono text-[11px] sm:text-xs font-bold text-[var(--brass)] flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-[var(--brass)] shrink-0" />
                <span>{L === 'en' ? 'Score' : 'ציון'}: {triageScore}/100</span>
              </div>
              <button
                type="button"
                onClick={() => setShowScorecard((s) => !s)}
                className="inline-flex min-h-9 sm:min-h-11 items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-2.5 sm:px-3 text-xs font-semibold text-[var(--ink)] hover:border-[var(--brass)]/50"
              >
                <Award className="h-3.5 w-3.5 text-[var(--brass)]" />
                <span className="hidden xs:inline">{L === 'en' ? 'Scorecard' : 'לוח תוצאות'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetWarRoom}
                title={L === 'en' ? 'Reset War Room simulation' : 'איפוס תחקיר חדר מלחמה'}
                className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--line-strong)] shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-mono text-[11px] text-[var(--muted)]">
                <span className="text-[var(--ink)]">{completedCount}</span>
                <span>/{LEARNING_NODES.length}</span>
                <span className="mx-2 text-[var(--line-strong)]">·</span>
                <span className="hidden min-[360px]:inline">{L === 'en' ? 'forces identified' : 'כוחות שזוהו'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setPlaying((p) => !p);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--brass)]/40 bg-[var(--brass)]/10 px-3 text-xs font-semibold text-[var(--brass)]"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing
                  ? L === 'en' ? 'Pause walk' : 'השהה הליכה'
                  : L === 'en' ? 'Walk the morning' : 'צעד את הבוקר'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rail-x -mx-3 px-3 sm:mx-0 sm:px-0">
        {LIVING_CASE.symptoms.map((sym) => {
          const on = symptomId === sym.id;
          return (
            <button
              key={sym.id}
              type="button"
              title={tx(L, sym.ticket)}
              onClick={() => selectSymptom(sym.id)}
              className={cn(
                'min-h-11 shrink-0 rounded-md border px-2.5 py-1.5 text-start',
                on
                  ? 'border-[var(--alert)]/50 bg-[var(--alert)]/10'
                  : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--line-strong)]'
              )}
            >
              <span className="font-mono text-[10px] text-[var(--brass)]">{sym.clock}</span>
              <span className="mx-1.5 text-[11px] font-semibold text-[var(--ink)]">{tx(L, sym.title)}</span>
              <span className="font-mono text-[10px] text-[var(--muted)]">{sym.relatedNodeIds.length}</span>
            </button>
          );
        })}
      </div>

      <div className="rail-x -mx-3 px-3 pb-0.5 sm:mx-0 sm:px-0">
        {LIVING_CASE.stages.map((s, idx) => {
          const on = s.id === stageId;
          const stageDilemma = TRIAGE_DILEMMAS[s.id];
          const stageDecision = userDecisions[s.id];
          const chosenOpt = stageDilemma?.options.find((o) => o.id === stageDecision);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => selectStage(s.id)}
              className={cn(
                'min-h-11 min-w-[8.25rem] flex-1 rounded-md border px-2.5 py-1.5 text-start transition-all',
                on
                  ? 'border-[var(--brass)]/45 bg-[var(--brass)]/10 ring-1 ring-[var(--brass)]/30'
                  : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--line-strong)]'
              )}
            >
              <div className="flex items-baseline justify-between gap-2 font-mono text-[10px] text-[var(--muted)]">
                <span>{String(idx + 1).padStart(2, '0')}</span>
                <span className="text-[var(--brass)]">{s.clock}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-1 text-xs font-semibold leading-snug text-[var(--ink)]">
                <span className="truncate">{tx(L, s.title)}</span>
                {theaterMode === 'war_room' && stageDilemma && (
                  <span className="shrink-0">
                    {chosenOpt?.isCorrect ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--signal)]" />
                    ) : chosenOpt?.isCatastrophic ? (
                      <Flame className="h-3.5 w-3.5 text-[var(--alert)]" />
                    ) : chosenOpt ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-[var(--brass)]" />
                    ) : (
                      <span className="inline-block h-2 w-2 rounded-full bg-[var(--brass)]/40 animate-pulse" />
                    )}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {sheetOpen && theaterMode === 'guided' && (
        <button
          type="button"
          aria-label={L === 'en' ? 'Close topic sheet' : 'סגור את לוח הנושא'}
          className="fixed inset-0 z-20 bg-black/45 md:hidden"
          onClick={() => setSheetOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,340px)] lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <section className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)]">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-2">
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--brass)]">
                {L === 'en' ? 'Municipal schematic · this morning' : 'סכמה עירונית · הבוקר הזה'}
              </div>
              <div className="truncate text-xs text-[var(--muted)]">{tx(L, stage.title)}</div>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-md border border-[var(--line)] text-[var(--muted)]">
                {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-md border border-[var(--line)] text-[var(--muted)]">
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="case-map relative bg-[radial-gradient(circle_at_50%_40%,rgba(196,163,90,0.07),transparent_42%)]">
            <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(239,232,214,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,232,214,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {LIVING_CASE.links.map((link) => {
                const a = LIVING_CASE.sites.find((s) => s.id === link.from);
                const b = LIVING_CASE.sites.find((s) => s.id === link.to);
                if (!a || !b) return null;
                const hot =
                  stage.focusSiteIds.includes(a.id) && stage.focusSiteIds.includes(b.id);
                const aStatus = siteStatusOverrides[a.id] ?? a.status;
                const bStatus = siteStatusOverrides[b.id] ?? b.status;
                const effectiveLinkStatus = (aStatus === 'ok' && bStatus === 'ok') ? 'up' : link.status;
                return (
                  <line
                    key={link.id}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={cn(LINK_STROKE[effectiveLinkStatus], hot ? 'stroke-[2.2]' : 'stroke-[1.1] opacity-50')}
                    strokeDasharray={link.media === 'radio' ? '1.2 1.4' : link.media === 'metro' ? '2.5 1.2' : undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>

            {LIVING_CASE.sites.map((site) => {
              const currentStatus = siteStatusOverrides[site.id] ?? site.status;
              const isResolved = siteStatusOverrides[site.id] === 'ok';
              const focused = stage.focusSiteIds.includes(site.id);
              const topicHere = topic.siteIds.includes(site.id);
              const siteTopics = LIVING_CASE.topics.filter((t) => t.siteIds.includes(site.id));
              const homePins = LIVING_CASE.topics.filter(
                (t) =>
                  t.siteIds[0] === site.id &&
                  (stage.primaryNodeIds.includes(t.nodeId) || t.nodeId === topic.nodeId)
              );
              // Clamp horizontal positioning so pins near edges (e.g. Weizmann 88% or Park 12%) never bleed past viewport on narrow fold/mobile screens
              const clampedX = Math.max(16, Math.min(84, site.x));
              return (
                <div
                  key={site.id}
                  className="absolute z-[1] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${clampedX}%`, top: `${site.y}%` }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const first = siteTopics.find((t) => stage.primaryNodeIds.includes(t.nodeId)) ?? siteTopics[0];
                      if (first) selectTopic(first.nodeId);
                    }}
                    className={cn(
                      'text-start transition-all',
                      focused
                        ? 'min-w-[3.2rem] max-w-[5.4rem] rounded-md border border-[var(--brass)]/55 bg-[#1a1813] px-1.5 py-1 sm:min-w-[4.6rem] sm:max-w-none sm:px-2 sm:py-1.5'
                        : 'h-3.5 w-3.5 rounded-full border border-[var(--line)] bg-[#12110e] sm:h-auto sm:w-auto sm:min-w-[4.6rem] sm:rounded-md sm:px-2 sm:py-1.5',
                      topicHere && 'ring-1 ring-[var(--signal)]/55',
                      isResolved && 'ring-1 ring-[var(--signal)]/70 shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                    )}
                  >
                    <div className={cn('flex items-center gap-1.5', !focused && 'max-sm:hidden')}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[currentStatus], (focused || isResolved) && 'animate-pulse')} />
                      <span className="font-mono text-[9px] text-[var(--muted)]">{site.vlan === 'WAN' ? 'WAN' : site.vlan}</span>
                    </div>
                    <div className={cn('truncate text-[11px] font-semibold leading-tight text-[var(--ink)]', !focused && 'max-sm:hidden')}>
                      {tx(L, site.short)}
                    </div>
                  </button>
                  {homePins.length > 0 && (
                    <div className={cn('mt-1 flex max-w-[7.2rem] flex-wrap justify-center gap-0.5', !focused && 'max-sm:hidden')}>
                      {homePins.map((t) => (
                        <button
                          key={t.nodeId}
                          type="button"
                          onClick={() => selectTopic(t.nodeId)}
                          className={cn(
                            'rounded border px-1 py-px font-mono text-[9px]',
                            t.nodeId === topic.nodeId
                              ? 'border-[var(--brass)] bg-[var(--brass)] text-[#1a160f]'
                              : 'border-[var(--line-strong)] bg-[var(--canvas)] text-[var(--ink)]'
                          )}
                        >
                          {tx(L, t.pinLabel)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-5 border-t border-[var(--line)]">
            {(Object.keys(OSI_META) as OsiLayer[]).map((layer) => {
              const hot = stage.layerFocus.includes(layer) || topic.osiLayers.includes(layer);
              const layerTopics = LIVING_CASE.topics.filter((t) => t.osiLayers.includes(layer));
              return (
                <button
                  key={layer}
                  type="button"
                  onClick={() => {
                    const pick =
                      layerTopics.find((t) => stage.primaryNodeIds.includes(t.nodeId)) ?? layerTopics[0];
                    if (pick) selectTopic(pick.nodeId);
                  }}
                  className={cn(
                    'min-h-11 border-[var(--line)] px-1 py-1.5 text-center first:border-s-0 sm:px-1.5 sm:py-2',
                    isRtl ? 'border-r' : 'border-l',
                    hot ? 'bg-[var(--brass)]/8' : 'opacity-55'
                  )}
                >
                  <div className="font-mono text-[10px] text-[var(--brass)]">{layer}</div>
                  <div className="text-[10px] text-[var(--ink)]">{tx(L, OSI_META[layer].name)}</div>
                  <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                    {layerTopics.slice(0, 3).map((t) => (
                      <span
                        key={t.nodeId}
                        className={cn(
                          'h-1 w-1 rounded-full',
                          t.nodeId === topic.nodeId ? 'bg-[var(--brass)]' : 'bg-[var(--muted)]'
                        )}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside
          className={cn(
            'flex flex-col overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)]',
            theaterMode === 'war_room'
              ? 'relative inset-auto z-auto h-auto min-h-[360px] md:max-h-[660px]'
              : cn(
                  'max-md:fixed max-md:inset-x-0 max-md:z-30 max-md:rounded-b-none max-md:rounded-t-2xl max-md:bottom-[var(--dock-h)]',
                  sheetOpen ? 'max-md:h-[min(72dvh,580px)] md:max-h-[660px]' : 'max-md:h-[var(--sheet-peek)] md:max-h-[660px]'
                )
          )}
        >
          {theaterMode === 'guided' && (
            <button
              type="button"
              className="flex min-h-11 w-full items-center gap-2 border-b border-[var(--line)] px-4 py-2 md:hidden"
              onClick={() => setSheetOpen((open) => !open)}
              aria-expanded={sheetOpen}
            >
              <span className="h-1 w-8 shrink-0 rounded-full bg-[var(--ink)]/25" />
              <span className="min-w-0 flex-1 truncate text-start text-xs font-semibold text-[var(--ink)]">
                {tx(L, TOPIC_NAMES[topic.nodeId])}
              </span>
              <ChevronDown className={cn('h-4 w-4 shrink-0 text-[var(--muted)] transition-transform', !sheetOpen && 'rotate-180')} />
            </button>
          )}

          {theaterMode === 'war_room' ? (
            /* WAR ROOM TRIAGE CONSOLE */
            <div className="flex flex-col h-full overflow-hidden">
              <div className="border-b border-[var(--line)] px-4 py-3 bg-[var(--canvas)]/40">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--brass)]/15 text-[var(--brass)] border border-[var(--brass)]/30">
                      <ShieldAlert className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--brass)] font-semibold">
                        {L === 'en' ? 'Incident Triage Console' : 'חדר מלחמה מבצעי · תחקיר תקלות'}
                      </span>
                      <div className="text-xs font-semibold text-[var(--ink)]">
                        {stage.clock} · {tx(L, stage.title)}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border border-[var(--brass)]/50 bg-[var(--brass)]/15 px-2.5 py-1 font-mono text-xs font-bold text-[var(--brass)]">
                    {triageScore}/100
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                {showScorecard || stageId === 'close' || (gameCompleted && Object.keys(TRIAGE_DILEMMAS).every(k => !!userDecisions[k])) ? (
                  /* WAR ROOM SCORECARD */
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[var(--brass)]/40 bg-[var(--brass)]/10 p-4 text-center space-y-2">
                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--brass)]/20 border border-[var(--brass)]/50 text-[var(--brass)]">
                        <Award className="h-6 w-6" />
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[var(--ink)]">
                        {L === 'en' ? 'War Room Incident Scorecard' : 'ציון תחקיר שטח סופי'}
                      </h4>
                      <div className="font-mono text-3xl font-extrabold text-[var(--brass)]">
                        {triageScore} <span className="text-sm font-normal text-[var(--muted)]">/ 100</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold font-mono">
                        {triageScore >= 80 ? (
                          <span className="rounded-full border border-[var(--signal)] bg-[var(--signal)]/20 px-3 py-0.5 text-[var(--signal)]">
                            {L === 'en' ? 'RANK: Certified Level II Engineer' : 'דירוג: דרג ב׳ מוסמך (עבר בהצלחה)'}
                          </span>
                        ) : (
                          <span className="rounded-full border border-[var(--alert)] bg-[var(--alert)]/20 px-3 py-0.5 text-[var(--alert)]">
                            {L === 'en' ? 'RANK: Needs Improvement' : 'דירוג: דורש שיפור'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted)] leading-relaxed pt-1">
                        {triageScore >= 80
                          ? (L === 'en'
                            ? 'Excellent! You isolated every failure systematically using OSI, prevented blind core reboots, and protected 106 dispatch.'
                            : 'מצוין! בידדת את שורש התקלות בצורה שיטתית לפי שכבות OSI, מנעת אתחול עיוור של הליבה ושמרת על מוקד 106.')
                          : (L === 'en'
                            ? 'Critical missteps detected. Erroneous moves or reboots threatened municipal operations. Review the incident log and retry.'
                            : 'נרשמו הכרעות שגויות שסיכנו את מוקד 106 ושרתי העירייה. מומלץ לאפס את הסימולציה ולנתח מחדש.')}
                      </p>
                    </div>

                    {/* Dilemmas Breakdown */}
                    <div className="space-y-2">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                        {L === 'en' ? 'Stage Triage Results' : 'פירוט הכרעות לפי זירות:'}
                      </div>
                      {Object.entries(TRIAGE_DILEMMAS).map(([sId, dilemma]) => {
                        const s = LIVING_CASE.stages.find(x => x.id === sId);
                        const decisionId = userDecisions[sId];
                        const opt = dilemma.options.find(o => o.id === decisionId);
                        return (
                          <div
                            key={sId}
                            className={cn(
                              'rounded-lg border p-2.5 text-start transition-all',
                              opt?.isCorrect
                                ? 'border-[var(--signal)]/40 bg-[var(--signal)]/5'
                                : opt?.isCatastrophic
                                  ? 'border-[var(--alert)]/40 bg-[var(--alert)]/5'
                                  : opt
                                    ? 'border-[var(--brass)]/40 bg-[var(--brass)]/5'
                                    : 'border-[var(--line)] bg-[var(--canvas)] opacity-60'
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] text-[var(--brass)]">
                                {s?.clock} · {s ? tx(L, s.title) : sId}
                              </span>
                              {opt ? (
                                <span className={cn(
                                  'font-mono text-[10px] font-bold px-1.5 py-0.5 rounded',
                                  opt.scoreDelta > 0
                                    ? 'bg-[var(--signal)]/20 text-[var(--signal)]'
                                    : 'bg-[var(--alert)]/20 text-[var(--alert)]'
                                )}>
                                  {opt.scoreDelta > 0 ? `+${opt.scoreDelta}` : opt.scoreDelta}
                                </span>
                              ) : (
                                <span className="font-mono text-[10px] text-[var(--muted)]">
                                  {L === 'en' ? 'Pending' : 'טרם הוכרע'}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-xs text-[var(--ink)] font-medium leading-snug">
                              {opt ? tx(L, opt.label) : (L === 'en' ? 'No decision recorded yet' : 'טרם בוצעה פעולה בזירה זו')}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleResetWarRoom}
                        className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brass)] text-xs font-bold text-[#1a160f]"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>{L === 'en' ? 'Reset Simulation' : 'אתחל תחקיר חדר מלחמה'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowScorecard(false);
                          setStageId('cameras');
                        }}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 text-xs font-semibold text-[var(--ink)]"
                      >
                        {L === 'en' ? 'Review Stages' : 'חזור לזירות'}
                      </button>
                    </div>
                  </div>
                ) : stageId === 'intake' ? (
                  /* INTAKE BRIEFING */
                  <div className="space-y-3">
                    <div className="rounded-xl border border-[var(--brass)]/30 bg-[var(--brass)]/10 p-3.5 space-y-2">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--brass)] font-semibold">
                        <Flame className="h-3.5 w-3.5 text-[var(--alert)]" />
                        <span>{L === 'en' ? 'Priority 1 Incident Wave' : 'גל תקלות בעדיפות עליונה'}</span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-[var(--ink)]">
                        {L === 'en' ? 'Do NOT reboot the core switch!' : 'כלל ברזל: לא מאתחלים את מתג הליבה!'}
                      </h4>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        {L === 'en'
                          ? 'Five critical tickets landed within 22 minutes. Junior engineers will rush to reload the core, knocking out emergency 106 and city servers. Level II engineers isolate each failure systematically across OSI layers.'
                          : 'חמש קריאות דחופות נחתו תוך 22 דקות. טכנאי חסר ניסיון ימהר לאתחל את הליבה ויפיל את מוקד 106. איש דרג ב׳ מקצועי בודק טלמטריית PRTG, מבודד לפי OSI ופותר זירה אחר זירה.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => selectStage('cameras')}
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brass)] text-xs font-bold text-[#1a160f] shadow-sm"
                    >
                      <Zap className="h-4 w-4" />
                      <span>{L === 'en' ? 'Start Field Triage (Cameras 06:52)' : 'התחל הכרעות שטח (זירת המצלמות 06:52)'}</span>
                    </button>
                  </div>
                ) : TRIAGE_DILEMMAS[stageId] ? (
                  /* ACTIVE STAGE DILEMMA */
                  (() => {
                    const dilemma = TRIAGE_DILEMMAS[stageId];
                    const decision = userDecisions[stageId];
                    const chosen = dilemma.options.find((o) => o.id === decision);

                    return (
                      <div className="space-y-3">
                        <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-3">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--brass)] uppercase tracking-wider mb-1">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span>{L === 'en' ? 'Operational Dilemma' : 'דילמה מבצעית בשטח'}</span>
                          </div>
                          <p className="text-xs font-semibold text-[var(--ink)] leading-relaxed">
                            {tx(L, dilemma.question)}
                          </p>
                        </div>

                        {chosen ? (
                          /* CONSEQUENCE BANNER */
                          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
                            <div
                              className={cn(
                                'rounded-xl border p-3.5 space-y-2 text-start',
                                chosen.isCorrect
                                  ? 'border-[var(--signal)]/60 bg-[var(--signal)]/10 shadow-[0_0_15px_rgba(74,222,128,0.15)]'
                                  : chosen.isCatastrophic
                                    ? 'border-[var(--alert)] bg-[var(--alert)]/15 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
                                    : 'border-[var(--brass)]/60 bg-[var(--brass)]/10 shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  {chosen.isCorrect ? (
                                    <CheckCircle2 className="h-4 w-4 text-[var(--signal)] shrink-0" />
                                  ) : chosen.isCatastrophic ? (
                                    <Flame className="h-4 w-4 text-[var(--alert)] shrink-0" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-[var(--brass)] shrink-0" />
                                  )}
                                  <span className={cn(
                                    'text-xs font-bold font-mono',
                                    chosen.isCorrect
                                      ? 'text-[var(--signal)]'
                                      : chosen.isCatastrophic
                                        ? 'text-[var(--alert)]'
                                        : 'text-[var(--brass)]'
                                  )}>
                                    {chosen.isCorrect
                                      ? (L === 'en' ? 'Triage Successful! (+20 pts)' : 'הכרעה מבצעית מדויקת! (+20 נקודות)')
                                      : chosen.isCatastrophic
                                        ? (L === 'en' ? 'Catastrophic Move! (-25 pts)' : 'פעולה קטסטרופלית! (25- נקודות)')
                                        : (L === 'en' ? 'Naive Move / Wasted SLA (-10 pts)' : 'תגובה נאיבית / בזבוז משאבים (10- נקודות)')}
                                  </span>
                                </div>
                                <span className={cn(
                                  'font-mono text-xs font-bold px-2 py-0.5 rounded',
                                  chosen.scoreDelta > 0
                                    ? 'bg-[var(--signal)]/20 text-[var(--signal)]'
                                    : 'bg-[var(--alert)]/20 text-[var(--alert)]'
                                )}>
                                  {chosen.scoreDelta > 0 ? `+${chosen.scoreDelta}` : chosen.scoreDelta}
                                </span>
                              </div>

                              <p className="text-xs text-[var(--ink)] leading-relaxed">
                                {tx(L, chosen.consequence)}
                              </p>

                              {chosen.resolvedSites && chosen.resolvedSites.length > 0 && (
                                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[var(--signal)] font-mono">
                                  <Check className="h-3.5 w-3.5" />
                                  <span>
                                    {L === 'en' ? 'Map Status Restored: ' : 'אתרים ששוקמו במפה: '}
                                    {chosen.resolvedSites.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const stageIdx = LIVING_CASE.stages.findIndex(s => s.id === stageId);
                                  const next = LIVING_CASE.stages[stageIdx + 1];
                                  if (next) {
                                    selectStage(next.id);
                                  } else {
                                    setShowScorecard(true);
                                  }
                                }}
                                className="flex-1 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--brass)] text-xs font-bold text-[#1a160f]"
                              >
                                <span>{L === 'en' ? 'Advance to Next Stage' : 'המשך לזירה הבאה'}</span>
                                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRetryStageDilemma(stageId)}
                                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>{L === 'en' ? 'Retry' : 'נסה שוב'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* OPTION BUTTONS */
                          <div className="space-y-2">
                            <div className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider">
                              {L === 'en' ? 'Choose your immediate move:' : 'בחר את הפעולה המיידית שלך:'}
                            </div>
                            {dilemma.options.map((opt, optIdx) => {
                              const letter = String.fromCharCode(65 + optIdx);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleSelectTriageOption(stageId, opt)}
                                  className="w-full flex items-start gap-2.5 rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-3 text-start transition-all hover:border-[var(--brass)] hover:bg-[var(--brass)]/5 group"
                                >
                                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-[var(--line)] bg-[var(--panel)] font-mono text-xs font-bold text-[var(--brass)] group-hover:border-[var(--brass)] group-hover:bg-[var(--brass)] group-hover:text-[#1a160f] transition-colors">
                                    {letter}
                                  </span>
                                  <span className="text-xs font-medium text-[var(--ink)] leading-snug pt-0.5">
                                    {tx(L, opt.label)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-3 text-xs text-[var(--muted)]">
                    {L === 'en' ? 'No dilemma for this stage. Proceed to the next stage.' : 'אין דילמה בשלב זה. המשך לשלב הבא.'}
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--line)] p-3 flex items-center justify-between gap-2 bg-[var(--canvas)]/40">
                <button
                  type="button"
                  onClick={() => setShowScorecard((s) => !s)}
                  className="text-xs text-[var(--brass)] font-medium hover:underline inline-flex items-center gap-1 font-mono"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>{showScorecard ? (L === 'en' ? 'Hide Scorecard' : 'הסתר לוח תוצאות') : (L === 'en' ? 'View Scorecard' : 'צפה בלוח תוצאות')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playChime();
                    onOpenTopic(node);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{L === 'en' ? 'Lesson Reference' : 'שיעור תיאורטי'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* GUIDED STUDY PANEL */
            <>
              <div className="border-b border-[var(--line)] px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--brass)]">
                    {L === 'en' ? 'This topic in this case' : 'הנושא הזה במקרה הזה'}
                  </span>
                  {progress[topic.nodeId]?.completed && (
                    <CheckCircle2 className="h-4 w-4 text-[var(--signal)]" />
                  )}
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[var(--line)] bg-[var(--canvas)] text-[var(--brass)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl leading-tight text-[var(--ink)]">
                      {tx(L, TOPIC_NAMES[topic.nodeId])}
                    </h3>
                    <p className="mt-1 text-xs leading-snug text-[var(--muted)]">{tx(L, topic.headline)}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                <p className="text-sm leading-relaxed text-[var(--ink)]/90">{tx(L, topic.inThisCase)}</p>
                <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-3 py-2">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--alert)]">
                    {L === 'en' ? 'If you skip this' : 'אם מדלגים על זה'}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{tx(L, topic.withoutThis)}</p>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-[#0a0a08] p-3">
                  <div className="font-mono text-[10px] text-[var(--signal)]">
                    {L === 'en' ? 'Evidence' : 'ראיה'}
                  </div>
                  <pre className="mt-1 overflow-x-auto font-mono text-[11px] text-[var(--ink)]">{topic.cli.command}</pre>
                  <p className="mt-1.5 text-[11px] leading-snug text-[var(--muted)]">{tx(L, topic.cli.meaning)}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {topic.osiLayers.map((layer) => (
                    <span key={layer} className="rounded border border-[var(--line)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--brass)]">
                      {layer} {tx(L, OSI_META[layer].name)}
                    </span>
                  ))}
                  {topic.siteIds.map((id) => {
                    const site = LIVING_CASE.sites.find((s) => s.id === id);
                    return (
                      <span key={id} className="rounded border border-[var(--line)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">
                        {site ? tx(L, site.short) : id}
                      </span>
                    );
                  })}
                </div>
                {!topicHot && (
                  <button
                    type="button"
                    onClick={() => selectTopic(topic.nodeId, true)}
                    className="text-[11px] text-[var(--brass)] underline-offset-2 hover:underline"
                  >
                    {L === 'en' ? 'Jump to the hour this force peaks' : 'קפוץ לשעה שבה הכוח הזה בשיא'}
                  </button>
                )}
              </div>

              <div className="border-t border-[var(--line)] p-3">
                <button
                  type="button"
                  onClick={() => {
                    audioFeedback.playChime();
                    onOpenTopic(node);
                  }}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brass)] text-sm font-semibold text-[#1a160f]"
                >
                  <BookOpen className="h-4 w-4" />
                  {L === 'en' ? 'Open full lesson' : 'פתח את השיעור המלא'}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg text-[var(--ink)]">
              {L === 'en' ? 'Every topic is on the board' : 'כל נושא נמצא על הלוח'}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              {L === 'en'
                ? 'Seventeen forces, one Sunday. Brass = active in this hour. Tickets filter the same map.'
                : 'שבעה־עשר כוחות, ראשון אחד. פליז = פעיל בשעה הזו. הקריאות מסננות את אותה מפה.'}
            </p>
          </div>
          <div className="font-mono text-[11px] text-[var(--muted)]">
            {stage.clock} · {tx(L, stage.move)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {LIVING_CASE.topics.map((t) => {
            const n = LEARNING_NODES.find((x) => x.id === t.nodeId);
            const TopicIcon = n ? ICONS[n.iconName] ?? Layers : Layers;
            const selected = t.nodeId === topic.nodeId;
            const primary = stage.primaryNodeIds.includes(t.nodeId);
            const inTicket = relatedFromSymptom?.includes(t.nodeId) ?? false;
            const done = !!progress[t.nodeId]?.completed;
            return (
              <button
                key={t.nodeId}
                type="button"
                onClick={() => selectTopic(t.nodeId)}
                className={cn(
                  'flex min-h-11 items-start gap-2 rounded-lg border px-2 py-2 text-start',
                  selected
                    ? 'border-[var(--brass)] bg-[var(--brass)]/15'
                    : primary
                      ? 'border-[var(--brass)]/35 bg-[var(--canvas)]'
                      : inTicket
                        ? 'border-[var(--alert)]/40 bg-[var(--alert)]/5'
                        : 'border-[var(--line)] bg-[var(--canvas)] opacity-80'
                )}
              >
                <TopicIcon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', selected ? 'text-[var(--brass)]' : 'text-[var(--muted)]')} />
                <span className="min-w-0">
                  <span className="flex items-center gap-1">
                    <span className="font-mono text-[9px] text-[var(--brass)]">{tx(L, t.pinLabel)}</span>
                    {done && <CheckCircle2 className="h-3 w-3 text-[var(--signal)]" />}
                  </span>
                  <span className="block truncate text-[11px] font-medium text-[var(--ink)]">
                    {tx(L, TOPIC_NAMES[t.nodeId])}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3">
        <p className="text-sm leading-relaxed text-[var(--ink)]/90">{tx(L, stage.narration)}</p>
        <p className="mt-2 font-mono text-[11px] text-[var(--brass)]">{tx(L, stage.move)}</p>
      </section>
    </div>
  );
}
