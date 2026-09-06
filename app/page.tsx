'use client';

import React, { useEffect, useState } from 'react';
import {
  LEARNING_NODES,
  LearningNode,
  NodeProgress,
} from '@/data/curriculumData';
import { CaseTheater } from '@/components/CaseTheater';
import { TopographicMap } from '@/components/TopographicMap';
import { SkillTreeView } from '@/components/SkillTreeView';
import { NodeDetailModal } from '@/components/NodeDetailModal';
import { IncidentSimulator } from '@/components/IncidentSimulator';
import { InterviewQuiz } from '@/components/InterviewQuiz';
import { AiMentorModal } from '@/components/AiMentorModal';
import { CertificateModal } from '@/components/CertificateModal';
import { NetworkTopologyExplorer } from '@/components/NetworkTopologyExplorer';
import { InteractiveCliSandbox } from '@/components/InteractiveCliSandbox';
import { SubnettingCalculator } from '@/components/SubnettingCalculator';
import { FiberCablingLab } from '@/components/FiberCablingLab';
import { QuickReferenceCheatSheet } from '@/components/QuickReferenceCheatSheet';
import { PacketPathVisualizer } from '@/components/PacketPathVisualizer';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { audioFeedback } from '@/lib/audioFeedback';
import {
  AlertTriangle,
  Award,
  Briefcase,
  Building2,
  Calculator,
  Cable,
  FileText,
  Filter,
  GitFork,
  Map,
  Menu,
  Search,
  Sparkles,
  Terminal,
  Trophy,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  Activity,
  Zap,
  Layers,
} from 'lucide-react';

const STORAGE_KEY = 'raanana_network_engineer_progress_v1';
const BADGES_KEY = 'raanana_network_engineer_badges_v1';

type Surface = 'case' | 'labs';
type LabId =
  | 'packet-path'
  | 'topology'
  | 'cli'
  | 'subnet'
  | 'cabling'
  | 'map'
  | 'tree'
  | 'simulator'
  | 'interview'
  | 'cheatsheet';

export default function HomePage() {
  const { lang, t, isRtl } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);
  const [lessonTab, setLessonTab] = useState<'lesson' | 'raanana' | 'cli' | 'interview' | 'quiz'>('raanana');
  const [surface, setSurface] = useState<Surface>('case');
  const [activeLab, setActiveLab] = useState<LabId>('tree');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState<NodeProgress>({});
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [aiPromptContext, setAiPromptContext] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const savedProgress = localStorage.getItem(STORAGE_KEY);
        if (savedProgress) setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error(e);
      }
      try {
        const savedBadges = localStorage.getItem(BADGES_KEY);
        if (savedBadges) setEarnedBadges(JSON.parse(savedBadges));
      } catch (e) {
        console.error(e);
      }
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const saveProgress = (newProgress: NodeProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.error('Error saving progress', e);
    }
  };

  const handleToggleComplete = (nodeId: string) => {
    const isCompleted = !!progress[nodeId]?.completed;
    const newProgress: NodeProgress = {
      ...progress,
      [nodeId]: {
        completed: !isCompleted,
        completedAt: !isCompleted ? new Date().toISOString() : undefined,
      },
    };
    saveProgress(newProgress);

    const completedCount = Object.values(newProgress).filter((p) => p.completed).length;
    const newBadges = [...earnedBadges];
    if (completedCount >= 4 && !newBadges.includes('מוסמך תשתיות וכבילה')) {
      newBadges.push('מוסמך תשתיות וכבילה');
    }
    if (completedCount >= 8 && !newBadges.includes('מאסטר מיתוג ואלחוט')) {
      newBadges.push('מאסטר מיתוג ואלחוט');
    }
    if (completedCount >= 12 && !newBadges.includes('מומחה שו״ב ואינטרנט')) {
      newBadges.push('מומחה שו״ב ואינטרנט');
    }
    if (completedCount === LEARNING_NODES.length && !newBadges.includes('איש רשתות מוסמך רעננה')) {
      newBadges.push('איש רשתות מוסמך רעננה');
    }
    if (newBadges.length !== earnedBadges.length) {
      setEarnedBadges(newBadges);
      try {
        localStorage.setItem(BADGES_KEY, JSON.stringify(newBadges));
      } catch {}
    }
  };

  const handleEarnBadge = (badgeName: string) => {
    if (!earnedBadges.includes(badgeName)) {
      const updated = [...earnedBadges, badgeName];
      setEarnedBadges(updated);
      try {
        localStorage.setItem(BADGES_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleResetProgress = () => {
    if (window.confirm(t.confirmReset)) {
      setProgress({});
      setEarnedBadges([]);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BADGES_KEY);
    }
  };

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiPromptContext(prompt);
    setIsAiModalOpen(true);
  };

  const openTopicFromCase = (node: LearningNode) => {
    setLessonTab('raanana');
    setSelectedNode(node);
  };

  const openLab = (lab: LabId) => {
    audioFeedback.playKeyClick();
    setSurface('labs');
    setActiveLab(lab);
    setIsMobileMenuOpen(false);
  };

  const filteredNodes = LEARNING_NODES.filter((node) => {
    const matchesCat = categoryFilter === 'all' || node.category === categoryFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      node.title.toLowerCase().includes(query) ||
      node.subtitle.toLowerCase().includes(query) ||
      node.summary.toLowerCase().includes(query) ||
      node.cliCommands.some((c) => c.command.toLowerCase().includes(query));
    return matchesCat && matchesSearch;
  });

  const totalCompleted = Object.values(progress).filter((p) => p.completed).length;
  const progressPercent = Math.round((totalCompleted / LEARNING_NODES.length) * 100);

  const labs: { id: LabId; label: string; icon: React.ElementType; hint: string }[] = [
    { id: 'tree', label: t.tabTree, icon: GitFork, hint: lang === 'en' ? 'Skill spine' : 'עמוד השדרה' },
    { id: 'map', label: lang === 'en' ? 'Elevation map' : 'מפת גובה', icon: Map, hint: '0–1000m' },
    { id: 'topology', label: t.tabTopology, icon: Activity, hint: 'NOC' },
    { id: 'packet-path', label: t.tabPacketPath, icon: Zap, hint: 'Packet' },
    { id: 'cli', label: t.tabCli, icon: Terminal, hint: 'IOS' },
    { id: 'subnet', label: t.tabSubnet, icon: Calculator, hint: 'VLSM' },
    { id: 'cabling', label: t.tabCabling, icon: Cable, hint: 'L1' },
    { id: 'simulator', label: t.tabSimulator, icon: AlertTriangle, hint: 'Triage' },
    { id: 'interview', label: t.tabInterview, icon: Briefcase, hint: '7274' },
    { id: 'cheatsheet', label: t.tabCheatSheet, icon: FileText, hint: 'Ref' },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--canvas)] font-sans text-[var(--ink)]">
      <div className="pointer-events-none absolute inset-0 bg-grid-dots opacity-40" />

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--canvas)]/92 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg border border-[var(--brass)]/35 bg-[var(--brass)]/10 text-[var(--brass)]">
              <Building2 className="h-4 w-4 sm:h-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="truncate font-serif text-sm leading-none text-[var(--ink)] sm:text-base md:text-xl">{t.appTitle}</h1>
                <span className="hidden font-mono text-[10px] text-[var(--brass)] sm:inline">{t.jobCode}</span>
              </div>
              <p className="mt-1 hidden text-[11px] text-[var(--muted)] sm:block">
                {t.municipality}
                <span className="mx-1.5 text-[var(--line-strong)]">·</span>
                {t.department}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center rounded-lg border border-[var(--line)] p-0.5 md:flex">
              <button
                type="button"
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSurface('case');
                }}
                className={`min-h-9 rounded-md px-3 text-xs font-semibold ${
                  surface === 'case' ? 'bg-[var(--brass)] text-[#1a160f]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {t.tabCase}
              </button>
              <button
                type="button"
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSurface('labs');
                }}
                className={`min-h-9 rounded-md px-3 text-xs font-semibold ${
                  surface === 'labs' ? 'bg-[var(--brass)] text-[#1a160f]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {t.tabLabs}
              </button>
            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3 py-1.5 font-mono text-[11px] md:flex">
              <span className="text-[var(--muted)]">{t.pathProgress}</span>
              <span className="text-[var(--brass)]">{progressPercent}%</span>
              <span className="text-[var(--ink)]">
                {totalCompleted}/{LEARNING_NODES.length}
              </span>
            </div>

            <LanguageSelector />

            <button
              id="btn-toggle-audio"
              onClick={() => setIsAudioMuted(audioFeedback.toggleMute())}
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--muted)]"
              title={isAudioMuted ? t.audioUnmute : t.audioMute}
            >
              {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[var(--brass)]" />}
            </button>

            <button
              id="btn-open-ai-mentor"
              onClick={() => {
                audioFeedback.playKeyClick();
                setAiPromptContext(undefined);
                setIsAiModalOpen(true);
              }}
              className="flex min-h-9 sm:min-h-10 items-center gap-1.5 sm:gap-2 rounded-lg border border-[var(--brass)]/30 bg-[var(--brass)]/15 px-2.5 sm:px-3 text-xs font-semibold text-[var(--ink)]"
            >
              <Sparkles className="h-4 w-4 text-[var(--brass)]" />
              <span className="hidden sm:inline">{t.aiAdvisor}</span>
            </button>
          </div>
        </div>
        <div className="h-px bg-[var(--line)]">
          <div className="h-px bg-[var(--brass)] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[1400px] flex-1 space-y-3 px-3 pb-[calc(var(--dock-h)+0.85rem)] pt-3 sm:px-6 md:pb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
            <Trophy className="h-3.5 w-3.5 text-[var(--brass)] shrink-0" />
            {earnedBadges.length > 0 ? (
              earnedBadges.map((badge) => (
                <span key={badge} className="rounded-md border border-[var(--brass)]/30 bg-[var(--brass)]/10 px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs text-[var(--brass)]">
                  {badge}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-[var(--muted)] truncate">
                {lang === 'en' ? 'Complete nodes to earn municipal badges' : 'השלם יחידות למידה ומעבדות לצבירת תגי הסמכה'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 ms-auto">
            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                setIsCertModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--brass)]/60 bg-[var(--brass)]/15 hover:bg-[var(--brass)]/25 px-2.5 py-1 text-xs font-bold text-[var(--brass)] shadow-[0_0_10px_rgba(196,163,90,0.2)] transition-all"
              title={lang === 'en' ? 'Generate Official Municipal Certificate' : 'הפק תעודת הסמכה רשמית'}
            >
              <Award className="h-3.5 w-3.5 text-[var(--brass)]" />
              <span>{lang === 'en' ? 'Issue Certificate' : 'הפק תעודת הסמכה'}</span>
            </button>

            {totalCompleted > 0 && (
              <button
                onClick={handleResetProgress}
                className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)] hover:text-[var(--alert)]"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden xs:inline">{t.resetProgress}</span>
              </button>
            )}
          </div>
        </div>

        {surface === 'case' && (
          <CaseTheater progress={progress} onOpenTopic={openTopicFromCase} />
        )}

        {surface === 'labs' && (
          <>
            <div className="rail-x -mx-3 px-3 pb-1 sm:mx-0 sm:px-0">
              {labs.map((lab) => {
                const Icon = lab.icon;
                const on = activeLab === lab.id;
                return (
                  <button
                    key={lab.id}
                    type="button"
                    onClick={() => openLab(lab.id)}
                    className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-semibold ${
                      on
                        ? 'border-[var(--brass)]/50 bg-[var(--brass)]/15 text-[var(--ink)]'
                        : 'border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {lab.label}
                  </button>
                );
              })}
            </div>

            {(activeLab === 'map' || activeLab === 'tree') && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-72">
                  <Search className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)] ${isRtl ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className={`w-full min-h-11 rounded-lg border border-[var(--line)] bg-[var(--panel)] py-2 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brass)] focus:outline-none ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                  />
                </div>
                <div className="rail-x items-center text-xs">
                  <Filter className="h-3.5 w-3.5 shrink-0 text-[var(--brass)]" />
                  {[
                    { id: 'all', label: t.filterAll },
                    { id: 'passive_active', label: t.filterPassiveActive },
                    { id: 'switching_wan', label: t.filterSwitchingWan },
                    { id: 'monitoring_c2', label: t.filterMonitoringC2 },
                    { id: 'smart_city', label: t.filterSmartCity },
                    { id: 'security_voip', label: t.filterSecurityVoIP },
                    { id: 'field_cli', label: t.filterFieldCli },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`min-h-11 shrink-0 rounded-lg border px-2.5 py-1.5 ${
                        categoryFilter === cat.id
                          ? 'border-[var(--brass)]/40 bg-[var(--brass)]/10 text-[var(--brass)]'
                          : 'border-[var(--line)] text-[var(--muted)]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeLab === 'packet-path' && <PacketPathVisualizer />}
            {activeLab === 'topology' && <NetworkTopologyExplorer initialMode="path_journey" />}
            {activeLab === 'cli' && <InteractiveCliSandbox />}
            {activeLab === 'subnet' && <SubnettingCalculator />}
            {activeLab === 'cabling' && <FiberCablingLab />}
            {activeLab === 'map' && (
              <TopographicMap
                nodes={filteredNodes}
                progress={progress}
                selectedNodeId={selectedNode?.id || null}
                onSelectNode={(node) => {
                  setLessonTab('lesson');
                  setSelectedNode(node);
                }}
                filterCategory={categoryFilter}
              />
            )}
            {activeLab === 'tree' && (
              <SkillTreeView
                nodes={filteredNodes}
                progress={progress}
                onSelectNode={(node) => {
                  setLessonTab('lesson');
                  setSelectedNode(node);
                }}
                onToggleComplete={handleToggleComplete}
              />
            )}
            {activeLab === 'simulator' && <IncidentSimulator onEarnBadge={handleEarnBadge} />}
            {activeLab === 'interview' && <InterviewQuiz onAskAiQuestion={handleOpenAiWithPrompt} />}
            {activeLab === 'cheatsheet' && <QuickReferenceCheatSheet />}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--line)] bg-[var(--canvas)]/95 px-2 pt-1.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          <button
            onClick={() => {
              audioFeedback.playKeyClick();
              setSurface('case');
              setIsMobileMenuOpen(false);
            }}
            className={`flex min-h-12 min-w-[64px] flex-col items-center justify-center rounded-lg ${
              surface === 'case' ? 'bg-[var(--brass)]/15 text-[var(--brass)]' : 'text-[var(--muted)]'
            }`}
          >
            <Layers className="h-5 w-5" />
            <span className="mt-0.5 text-[10px]">{t.tabCase}</span>
          </button>
          <button
            onClick={() => openLab('tree')}
            className={`flex min-h-12 min-w-[64px] flex-col items-center justify-center rounded-lg ${
              surface === 'labs' && activeLab === 'tree' ? 'bg-[var(--brass)]/15 text-[var(--brass)]' : 'text-[var(--muted)]'
            }`}
          >
            <GitFork className="h-5 w-5" />
            <span className="mt-0.5 text-[10px]">{lang === 'en' ? 'Path' : 'מסלול'}</span>
          </button>
          <button
            onClick={() => openLab('cli')}
            className={`flex min-h-12 min-w-[64px] flex-col items-center justify-center rounded-lg ${
              surface === 'labs' && activeLab === 'cli' ? 'bg-[var(--brass)]/15 text-[var(--brass)]' : 'text-[var(--muted)]'
            }`}
          >
            <Terminal className="h-5 w-5" />
            <span className="mt-0.5 text-[10px]">CLI</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className={`flex min-h-12 min-w-[64px] flex-col items-center justify-center rounded-lg ${
              isMobileMenuOpen ? 'bg-[var(--brass)]/15 text-[var(--brass)]' : 'text-[var(--muted)]'
            }`}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="mt-0.5 text-[10px]">{t.tabLabs}</span>
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="max-h-[85dvh] space-y-3 overflow-y-auto rounded-t-2xl border-t border-[var(--line)] bg-[var(--panel)] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg">{t.tabLabs}</h3>
              <LanguageSelector variant="pill" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {labs.map((lab) => {
                const Icon = lab.icon;
                return (
                  <button
                    key={lab.id}
                    onClick={() => openLab(lab.id)}
                    className={`min-h-11 rounded-xl border p-3 text-start ${
                      surface === 'labs' && activeLab === lab.id
                        ? 'border-[var(--brass)]/50 bg-[var(--brass)]/10'
                        : 'border-[var(--line)] bg-[var(--canvas)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                      <Icon className="h-4 w-4 text-[var(--brass)]" />
                      {lab.label}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-[var(--muted)]">{lab.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <footer className="hidden border-t border-[var(--line)] px-4 py-3 text-[11px] text-[var(--muted)] md:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <span>
            {lang === 'en'
              ? "Ra'anana Municipality · IT & Cyber · Position 7274"
              : 'עיריית רעננה · אגף מערכות מידע · משרה 7274'}
          </span>
          <span className="font-mono text-[var(--brass)]">
            {lang === 'en' ? 'Sunday 07:14 still on the board' : 'ראשון 07:14 עדיין על הלוח'}
          </span>
        </div>
      </footer>

      <NodeDetailModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        isCompleted={selectedNode ? !!progress[selectedNode.id]?.completed : false}
        onToggleComplete={handleToggleComplete}
        onOpenAiWithPrompt={handleOpenAiWithPrompt}
        initialTab={lessonTab}
      />

      <AiMentorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialPrompt={aiPromptContext}
      />

      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
}
