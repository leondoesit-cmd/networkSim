'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  Check,
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioFeedback } from '@/lib/audioFeedback';

interface CliHistoryItem {
  prompt: string;
  command: string;
  output: string;
  isError?: boolean;
}

interface CliLabChallenge {
  id: string;
  title: string;
  description: string;
  initialPortState: {
    port: string;
    vlan: number;
    shutdown: boolean;
    poeEnabled: boolean;
  };
  goalVlan: number;
  goalShutdown: boolean;
  goalPoe: boolean;
  successMessage: string;
}

const CHALLENGES: CliLabChallenge[] = [
  {
    id: 'lpr_down',
    title: 'מצלמת LPR בצומת ויצמן מנותקת (משרה 7274)',
    description: 'מצלמת זיהוי לוחיות רישוי בכניסה לעיר מחוברת לממשק GigabitEthernet1/0/14 אך לא מקבלת כתובת ומנותקת. בדוק את הסטטוס ותקן את הגדרות הממשק ל-VLAN 50.',
    initialPortState: {
      port: 'GigabitEthernet1/0/14',
      vlan: 1,
      shutdown: true,
      poeEnabled: true,
    },
    goalVlan: 50,
    goalShutdown: false,
    goalPoe: true,
    successMessage: 'מצוין! הממשק הוגדר בהצלחה ל-VLAN 50 והופעל (no shut). מצלמת ה-LPR החלה לשדר וידאו למוקד!',
  },
  {
    id: 'moked_poe_disabled',
    title: 'עמדת מוקד 106 חדשה: טלפון ה-IP אינו נדלק',
    description: 'הותקן טלפון Cisco IP Phone 8845 במוקד 106 בפורט GigabitEthernet1/0/6, אך נוריות המכשיר כבויות לחלוטין. וודא ש-PoE מופעל והממשק פעיל.',
    initialPortState: {
      port: 'GigabitEthernet1/0/6',
      vlan: 30,
      shutdown: false,
      poeEnabled: false,
    },
    goalVlan: 30,
    goalShutdown: false,
    goalPoe: true,
    successMessage: 'כל הכבוד! הפעלת power inline auto. הטלפון נדלק, קיבל כתובת מ-VLAN 30 ונרשם ב-CUCM!',
  },
];

export function InteractiveCliSandbox() {
  const [activeTab, setActiveTab] = useState<'free' | 'challenge'>('free');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<CliHistoryItem[]>([
    {
      prompt: '',
      command: '',
      output: 'Cisco IOS Software, Catalyst L3 Switch Software (CAT9K_IOSXE), Version 17.9.4a\nRa\'anana Municipal Core Switch 1 (Ahuza 103 Datacenter)\nType "help" or "?" for available commands list.\n',
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  
  // CLI internal state machine
  const [configMode, setConfigMode] = useState<'exec' | 'config' | 'config-if'>('exec');
  const [currentInterface, setCurrentInterface] = useState<string>('GigabitEthernet1/0/14');
  
  // Switch port states (for challenge verification)
  const [portStates, setPortStates] = useState<{
    [key: string]: { vlan: number; shutdown: boolean; poeEnabled: boolean };
  }>({
    'GigabitEthernet1/0/14': { vlan: 1, shutdown: true, poeEnabled: true },
    'GigabitEthernet1/0/6': { vlan: 30, shutdown: false, poeEnabled: false },
  });

  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getPromptString = () => {
    if (configMode === 'config') return 'Raanana-SW1(config)#';
    if (configMode === 'config-if') return `Raanana-SW1(config-if)#`;
    return 'Raanana-SW1#';
  };

  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawCmd = inputCommand.trim();
    if (!rawCmd) return;

    audioFeedback.playCommandPing();

    const cmdLower = rawCmd.toLowerCase();
    const currentPrompt = getPromptString();

    setCommandHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(null);

    let output = '';
    let isError = false;

    // Command parser
    if (cmdLower === 'help' || cmdLower === '?') {
      output = `Available CLI Commands in this municipal environment:
  show ip interface brief   - Display summary of all switch interfaces
  show vlan brief           - List configured municipal VLANs
  show spanning-tree        - Display STP topology and root bridge info
  show power inline         - Show PoE allocation & power consumption
  show mac address-table    - Display dynamically learned MAC addresses
  show cdp neighbors        - Discover adjacent Cisco switches and IP phones
  ping <ip_address>         - Send ICMP echo requests (e.g. ping 10.24.10.1)
  traceroute <ip_address>   - Trace packet route through Ra'anana WAN
  configure terminal (conf t) - Enter global configuration mode
  interface <interface_id>  - Enter interface config (e.g. int gi1/0/14)
  switchport access vlan <id> - Assign access VLAN
  no shutdown / shutdown    - Enable or disable interface
  power inline auto         - Enable PoE on port
  write memory (wr)         - Save running configuration to NVRAM
  clear / cls               - Clear terminal screen`;
    } else if (cmdLower === 'clear' || cmdLower === 'cls') {
      setHistory([]);
      setInputCommand('');
      return;
    } else if (cmdLower === 'conf t' || cmdLower === 'configure terminal') {
      setConfigMode('config');
      output = 'Enter configuration commands, one per line. End with CNTL/Z or "exit".';
    } else if (configMode === 'config' && (cmdLower.startsWith('interface ') || cmdLower.startsWith('int '))) {
      const parts = rawCmd.split(' ');
      const iface = parts[1] || 'GigabitEthernet1/0/14';
      setCurrentInterface(iface);
      setConfigMode('config-if');
      output = '';
    } else if (configMode === 'config-if' && cmdLower.startsWith('switchport access vlan ')) {
      const vlanNum = parseInt(rawCmd.replace('switchport access vlan ', '').trim(), 10);
      if (!isNaN(vlanNum)) {
        setPortStates((prev) => ({
          ...prev,
          [currentInterface]: {
            ...prev[currentInterface],
            vlan: vlanNum,
          },
        }));
        output = `Interface ${currentInterface} access VLAN set to ${vlanNum}.`;
      } else {
        output = '% Incomplete command. Example: switchport access vlan 50';
        isError = true;
      }
    } else if (configMode === 'config-if' && cmdLower === 'no shutdown' || cmdLower === 'no shut') {
      setPortStates((prev) => ({
        ...prev,
        [currentInterface]: {
          ...prev[currentInterface],
          shutdown: false,
        },
      }));
      output = `%LINK-3-UPDOWN: Interface ${currentInterface}, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${currentInterface}, changed state to up`;
    } else if (configMode === 'config-if' && cmdLower === 'shutdown' || cmdLower === 'shut') {
      setPortStates((prev) => ({
        ...prev,
        [currentInterface]: {
          ...prev[currentInterface],
          shutdown: true,
        },
      }));
      output = `%LINK-5-CHANGED: Interface ${currentInterface}, changed state to administratively down`;
    } else if (configMode === 'config-if' && (cmdLower === 'power inline auto' || cmdLower === 'power inline')) {
      setPortStates((prev) => ({
        ...prev,
        [currentInterface]: {
          ...prev[currentInterface],
          poeEnabled: true,
        },
      }));
      output = `%ILPOWER-7-DETECT: Interface ${currentInterface}: Power supplied (802.3at PoE+ 30.0W)`;
    } else if (cmdLower === 'exit') {
      if (configMode === 'config-if') {
        setConfigMode('config');
      } else if (configMode === 'config') {
        setConfigMode('exec');
      }
      output = '';
    } else if (cmdLower === 'end') {
      setConfigMode('exec');
      output = '';
    } else if (cmdLower === 'wr' || cmdLower === 'write memory' || cmdLower === 'copy run start') {
      output = 'Building configuration...\n[OK] Running configuration saved to startup-config in NVRAM.';
      audioFeedback.playSuccess();
    } else if (cmdLower === 'show ip interface brief' || cmdLower === 'sh ip int br') {
      output = `Interface                  IP-Address      OK? Method Status                Protocol
GigabitEthernet1/0/1       10.24.10.2      YES NVRAM  up                    up      
GigabitEthernet1/0/2       unassigned      YES unset  up                    up      
GigabitEthernet1/0/6       unassigned      YES unset  ${portStates['GigabitEthernet1/0/6']?.shutdown ? 'administratively down' : 'up                  '}  ${portStates['GigabitEthernet1/0/6']?.shutdown ? 'down' : 'up'}
GigabitEthernet1/0/14      unassigned      YES unset  ${portStates['GigabitEthernet1/0/14']?.shutdown ? 'administratively down' : 'up                  '}  ${portStates['GigabitEthernet1/0/14']?.shutdown ? 'down' : 'up'}
Vlan10                     10.24.10.1      YES manual up                    up      
Vlan30                     10.24.30.1      YES manual up                    up      
Vlan50                     10.24.50.1      YES manual up                    up      `;
    } else if (cmdLower === 'show vlan brief' || cmdLower === 'sh vlan br' || cmdLower === 'show vlan') {
      output = `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi1/0/1-5, Gi1/0/7-13, Gi1/0/15-24
10   MUNICIPAL_MGMT                   active    Gi1/0/1 (Trunk to Core)
20   CITY_HALL_STAFF                  active    
30   VOIP_MOKED_106                   active    ${portStates['GigabitEthernet1/0/6']?.vlan === 30 ? 'Gi1/0/6' : ''}
40   SCHOOLS_CAMPUS                   active    
50   LPR_TRAFFIC_CAMERAS              active    ${portStates['GigabitEthernet1/0/14']?.vlan === 50 ? 'Gi1/0/14' : ''}
99   WAN_EDGE_UPLINK                  active    Te1/0/1, Te1/0/2`;
    } else if (cmdLower === 'show spanning-tree' || cmdLower === 'sh span') {
      output = `MST00 (Rapid-PVST+)
  Spanning tree enabled protocol rstp
  Root ID    Priority    4096
             Address     001a.a250.7274
             This bridge is the root (Raanana City Hall Core)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Desg FWD 4         128.1    P2p (Trunk to Moked 106)
Gi1/0/2             Desg FWD 4         128.2    P2p (Fiber Ring to Park)
Gi1/0/14            Desg FWD 19        128.14   P2p Edge (BPDU Guard Enabled)`;
    } else if (cmdLower === 'show power inline' || cmdLower === 'sh power inline') {
      output = `Available:740.0(w)  Used:124.6(w)  Remaining:615.4(w)

Interface Admin  Oper       Power(Watts) Device              Class
--------- ------ ---------- ------------ ------------------- -----
Gi1/0/1   auto   on         15.4         Aruba AP-515        3
Gi1/0/6   ${portStates['GigabitEthernet1/0/6']?.poeEnabled ? 'auto   on         7.2          Cisco IP Phone 8845 2' : 'off    off        0.0          None                n/a'}
Gi1/0/14  ${portStates['GigabitEthernet1/0/14']?.poeEnabled ? 'auto   on         30.0         Axis Q6155-E PTZ    4' : 'off    off        0.0          None                n/a'}`;
    } else if (cmdLower.startsWith('ping ')) {
      const target = rawCmd.split(' ')[1];
      output = `Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`;
    } else if (cmdLower.startsWith('traceroute ') || cmdLower.startsWith('trace ')) {
      const target = rawCmd.split(' ')[1];
      output = `Tracing the route to ${target}
 1 10.24.10.1 (City-Hall-Core-VLAN10) 0.521 ms 0.412 ms 0.398 ms
 2 10.24.1.254 (Raanana-Metro-Dark-Fiber-DWDM) 1.102 ms 0.985 ms 1.050 ms
 3 ${target} 1.840 ms 1.720 ms 1.650 ms`;
    } else {
      output = `% Unknown or unrecognized command: "${rawCmd}". Type "help" or "?" for list.`;
      isError = true;
    }

    setHistory((prev) => [
      ...prev,
      {
        prompt: currentPrompt,
        command: rawCmd,
        output,
        isError,
      },
    ]);

    setInputCommand('');

    // Check challenge completion
    const currentChallenge = CHALLENGES[currentChallengeIndex];
    if (currentChallenge) {
      const portState = portStates[currentChallenge.initialPortState.port];
      if (
        portState &&
        portState.vlan === currentChallenge.goalVlan &&
        portState.shutdown === currentChallenge.goalShutdown &&
        portState.poeEnabled === currentChallenge.goalPoe &&
        !completedChallenges.includes(currentChallenge.id)
      ) {
        setCompletedChallenges((prev) => [...prev, currentChallenge.id]);
        audioFeedback.playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  // Up / Down arrow navigation for command history
  const handleKeyDown = (e: React.KeyboardEvent) => {
    audioFeedback.playKeyClick();

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputCommand(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setInputCommand(commandHistory[nextIndex]);
      }
    }
  };

  const currentCh = CHALLENGES[currentChallengeIndex];
  const isCurrentChCompleted = completedChallenges.includes(currentCh.id);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1117] border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Terminal className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#E2E8F0]">
              סימולטור טרמינל CLI חי - Cisco IOS-XE & Aruba CX
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            אימון פקודות שטח אינטראקטיבי: הקלד פקודות אמת, פתור תקלות תצורה והגדר מתגי ליבה של עיריית רעננה
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('free')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'free'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                : 'bg-[#1A1D24] text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            טרמינל חופשי
          </button>
          <button
            onClick={() => setActiveTab('challenge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'challenge'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                : 'bg-[#1A1D24] text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            מעבדת תקלות שטח
            {completedChallenges.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[10px] font-bold">
                {completedChallenges.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Challenge Drawer if in challenge mode */}
      {activeTab === 'challenge' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1117] border border-blue-500/30 space-y-3 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                אתגר שטח #{currentChallengeIndex + 1}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-[#E2E8F0]">{currentCh.title}</h4>
            </div>

            <div className="flex items-center gap-2">
              {CHALLENGES.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setCurrentChallengeIndex(idx)}
                  className={`text-xs px-2.5 py-1 rounded-md border ${
                    currentChallengeIndex === idx
                      ? 'bg-blue-600 text-white border-blue-400'
                      : completedChallenges.includes(ch.id)
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-[#1A1D24] text-slate-400 border-slate-800'
                  }`}
                >
                  {completedChallenges.includes(ch.id) ? '✓ ' : ''}אתגר {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentCh.description}</p>

          {/* Target Checklist */}
          <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10 text-xs flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">ממשק יעד:</span>
              <code className="font-mono text-blue-400">{currentCh.initialPortState.port}</code>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">VLAN נדרש:</span>
              <code className="font-mono text-blue-400">VLAN {currentCh.goalVlan}</code>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">סטטוס:</span>
              <code className="font-mono text-emerald-400">no shutdown</code>
            </div>
            {isCurrentChCompleted ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1 mr-auto">
                <Check className="w-3.5 h-3.5" />
                האתגר נפתר בהצלחה!
              </span>
            ) : (
              <span className="text-slate-500 text-[11px] mr-auto">
                הקלד פקודות למטה לתיקון ההגדרה
              </span>
            )}
          </div>
        </div>
      )}

      {/* QUICK COMMAND PILLS FOR CONVENIENT TESTING */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          פקודות מהירות:
        </span>
        {[
          'show ip int br',
          'show vlan brief',
          'show spanning-tree',
          'show power inline',
          'ping 10.24.10.1',
          'conf t',
          'int gi1/0/14',
          'switchport access vlan 50',
          'no shutdown',
          'power inline auto',
          'wr',
          'help',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              audioFeedback.playKeyClick();
              setInputCommand(cmd);
              inputRef.current?.focus();
            }}
            className="min-h-[44px] text-xs px-3 py-2 rounded-lg bg-[#1A1D24] hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 font-mono transition-colors whitespace-nowrap flex items-center"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* INTERACTIVE TERMINAL WINDOW WITH RESPONSIVE HEIGHT */}
      <div 
        className="rounded-2xl border border-slate-800 bg-[#0A0C10] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm flex flex-col h-[380px] sm:h-[460px] lg:h-[500px]"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header Bar */}
        <div className="p-3 bg-[#0F1117] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-slate-400 text-xs font-mono ml-2 truncate max-w-[180px] sm:max-w-none">
              ssh admin@raanana-core-sw1.muni.local
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                audioFeedback.playKeyClick();
                setHistory([]);
              }}
              className="min-h-[36px] px-2 rounded hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
              title="נקה מסך"
            >
              <RotateCcw className="w-3 h-3" />
              נקה מסך
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3 leading-relaxed text-slate-200 select-text">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command && (
                <div className="flex items-center gap-2 text-slate-400 flex-wrap">
                  <span className="text-blue-400 font-bold">{item.prompt}</span>
                  <span className="text-slate-100 font-semibold break-all">{item.command}</span>
                </div>
              )}
              {item.output && (
                <pre
                  className={`whitespace-pre-wrap font-mono text-[11px] sm:text-xs overflow-x-auto ${
                    item.isError ? 'text-red-400' : 'text-slate-300'
                  }`}
                >
                  {item.output}
                </pre>
              )}
            </div>
          ))}

          {/* Current Live Input Line */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
            <span className="text-blue-400 font-bold select-none text-xs sm:text-sm shrink-0">{getPromptString()}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono focus:ring-0 p-0 text-xs sm:text-sm min-w-0"
              placeholder=""
            />
          </form>

          <div ref={terminalEndRef} />
        </div>

        {/* Mobile-Friendly Virtual Keyboard Bar (Crucial for smartphones and foldables!) */}
        <div className="p-2 bg-[#0F1117] border-t border-slate-800 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                audioFeedback.playKeyClick();
                // Tab autocomplete simulation
                const cur = inputCommand.trim();
                const candidates = [
                  'show ip int brief',
                  'show vlan brief',
                  'show spanning-tree',
                  'show power inline',
                  'configure terminal',
                  'interface GigabitEthernet1/0/14',
                  'switchport mode trunk',
                  'switchport access vlan 50',
                  'no shutdown',
                  'power inline auto',
                  'write memory',
                ];
                const match = candidates.find((c) => c.startsWith(cur));
                if (match) setInputCommand(match);
                inputRef.current?.focus();
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[#1A1D24] text-slate-300 hover:text-white border border-slate-700 font-mono text-xs font-bold"
            >
              Tab ⇥
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                audioFeedback.playKeyClick();
                if (commandHistory.length > 0) {
                  const newIdx = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                  setHistoryIndex(newIdx);
                  setInputCommand(commandHistory[newIdx] || '');
                }
                inputRef.current?.focus();
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[#1A1D24] text-slate-300 hover:text-white border border-slate-700 font-mono text-xs font-bold"
            >
              ▲ Up
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                audioFeedback.playKeyClick();
                if (historyIndex !== null) {
                  const newIdx = historyIndex + 1;
                  if (newIdx < commandHistory.length) {
                    setHistoryIndex(newIdx);
                    setInputCommand(commandHistory[newIdx]);
                  } else {
                    setHistoryIndex(null);
                    setInputCommand('');
                  }
                }
                inputRef.current?.focus();
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[#1A1D24] text-slate-300 hover:text-white border border-slate-700 font-mono text-xs font-bold"
            >
              ▼ Down
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                audioFeedback.playKeyClick();
                setConfigMode('exec');
                setInputCommand('');
                inputRef.current?.focus();
              }}
              className="min-h-[44px] px-2.5 py-1.5 rounded-lg bg-[#1A1D24] text-amber-400 hover:text-amber-300 border border-slate-700 font-mono text-xs font-bold"
            >
              Ctrl+C
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCommandSubmit();
              inputRef.current?.focus();
            }}
            className="min-h-[44px] px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold shadow-sm flex items-center gap-1 shrink-0"
          >
            <span>Enter</span>
            <span>↵</span>
          </button>
        </div>
      </div>

    </div>
  );
}
