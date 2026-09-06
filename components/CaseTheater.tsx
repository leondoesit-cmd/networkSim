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
  tx,
  type CaseSite,
  type Lang,
  type OsiLayer,
} from '@/data/livingCase';
import { useLanguage } from '@/context/LanguageContext';
import { audioFeedback } from '@/lib/audioFeedback';
import { cn } from '@/lib/utils';
import {
  Activity,
  Binary,
  BookOpen,
  Briefcase,
  Cable,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Globe,
  Layers,
  Lock,
  Network,
  Pause,
  PhoneCall,
  Play,
  Server,
  ServerCrash,
  ShieldAlert,
  Terminal,
  Wifi,
  Wrench,
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
    <div className="flex flex-col gap-3 max-lg:pb-[calc(var(--sheet-peek)+0.5rem)]" suppressHydrationWarning>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 max-w-3xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--brass)]">
            {tx(L, LIVING_CASE.kicker)}
          </p>
          <h2 className="mt-0.5 font-serif text-[1.35rem] leading-tight text-[var(--ink)] sm:text-[1.75rem]">
            {tx(L, LIVING_CASE.title)}
          </h2>
          <p className="case-lede mt-1 text-xs leading-relaxed text-[var(--muted)]">{tx(L, LIVING_CASE.lede)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => selectStage(s.id)}
              className={cn(
                'min-h-11 min-w-[8.25rem] flex-1 rounded-md border px-2.5 py-1.5 text-start',
                on
                  ? 'border-[var(--brass)]/45 bg-[var(--brass)]/10'
                  : 'border-[var(--line)] bg-[var(--panel)] hover:border-[var(--line-strong)]'
              )}
            >
              <div className="flex items-baseline justify-between gap-2 font-mono text-[10px] text-[var(--muted)]">
                <span>{String(idx + 1).padStart(2, '0')}</span>
                <span className="text-[var(--brass)]">{s.clock}</span>
              </div>
              <div className="mt-1 text-xs font-semibold leading-snug text-[var(--ink)]">
                {tx(L, s.title)}
              </div>
            </button>
          );
        })}
      </div>

      {sheetOpen && (
        <button
          type="button"
          aria-label={L === 'en' ? 'Close topic sheet' : 'סגור את לוח הנושא'}
          className="fixed inset-0 z-20 bg-black/45 lg:hidden"
          onClick={() => setSheetOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
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
                return (
                  <line
                    key={link.id}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={cn(LINK_STROKE[link.status], hot ? 'stroke-[2.2]' : 'stroke-[1.1] opacity-50')}
                    strokeDasharray={link.media === 'radio' ? '1.2 1.4' : link.media === 'metro' ? '2.5 1.2' : undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>

            {LIVING_CASE.sites.map((site) => {
              const focused = stage.focusSiteIds.includes(site.id);
              const topicHere = topic.siteIds.includes(site.id);
              const siteTopics = LIVING_CASE.topics.filter((t) => t.siteIds.includes(site.id));
              const homePins = LIVING_CASE.topics.filter(
                (t) =>
                  t.siteIds[0] === site.id &&
                  (stage.primaryNodeIds.includes(t.nodeId) || t.nodeId === topic.nodeId)
              );
              return (
                <div
                  key={site.id}
                  className="absolute z-[1] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${site.x}%`, top: `${site.y}%` }}
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
                        ? 'min-w-[3.8rem] rounded-md border border-[var(--brass)]/55 bg-[#1a1813] px-1.5 py-1 sm:min-w-[4.6rem] sm:px-2 sm:py-1.5'
                        : 'h-3.5 w-3.5 rounded-full border border-[var(--line)] bg-[#12110e] sm:h-auto sm:w-auto sm:min-w-[4.6rem] sm:rounded-md sm:px-2 sm:py-1.5',
                      topicHere && 'ring-1 ring-[var(--signal)]/55'
                    )}
                  >
                    <div className={cn('flex items-center gap-1.5', !focused && 'max-sm:hidden')}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[site.status], focused && 'animate-pulse')} />
                      <span className="font-mono text-[9px] text-[var(--muted)]">{site.vlan === 'WAN' ? 'WAN' : site.vlan}</span>
                    </div>
                    <div className={cn('text-[11px] font-semibold leading-tight text-[var(--ink)]', !focused && 'max-sm:hidden')}>
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
            'max-lg:fixed max-lg:inset-x-0 max-lg:z-30 max-lg:rounded-b-none max-lg:rounded-t-2xl max-lg:bottom-[var(--dock-h)]',
            sheetOpen ? 'max-lg:h-[min(72dvh,580px)] lg:max-h-[640px]' : 'max-lg:h-[var(--sheet-peek)] lg:max-h-[640px]'
          )}
        >
          <button
            type="button"
            className="flex min-h-11 w-full items-center gap-2 border-b border-[var(--line)] px-4 py-2 lg:hidden"
            onClick={() => setSheetOpen((open) => !open)}
            aria-expanded={sheetOpen}
          >
            <span className="h-1 w-8 shrink-0 rounded-full bg-[var(--ink)]/25" />
            <span className="min-w-0 flex-1 truncate text-start text-xs font-semibold text-[var(--ink)]">
              {tx(L, TOPIC_NAMES[topic.nodeId])}
            </span>
            <ChevronDown className={cn('h-4 w-4 shrink-0 text-[var(--muted)] transition-transform', !sheetOpen && 'rotate-180')} />
          </button>
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
