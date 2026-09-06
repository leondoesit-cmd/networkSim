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

export const COMMAND_DICTIONARY = [
  'show interfaces trunk',
  'show interfaces status',
  'show vlan brief',
  'show power inline',
  'show processes cpu',
  'show mac address-table',
  'show ip route',
  'show ip interface brief',
  'show running-config',
  'show cdp neighbors',
  'configure terminal',
  'interface gigabitEthernet',
  'switchport mode access',
  'switchport access vlan',
  'no shutdown',
  'shutdown',
  'spanning-tree bpduguard enable',
  'ip helper-address',
  'exit',
];

// Syntax Highlighting Tokenizer for Cisco terminal output
const TOKEN_REGEX = /(administratively down|err-disabled|\b(?:GigabitEthernet|FastEthernet|TenGigabitEthernet|Gi|Fa|Te|Eth)\d+(?:\/\d+)*(?:\.\d+)?\b|\b(?:\d{1,3}\.){3}\d{1,3}(?:\/\d{1,2})?\b|\b(?:Vlan|VLAN)\s*\d+\b|\bup\b|\bdown\b)/gi;

function renderHighlightedLine(line: string, lineIndex: number) {
  const segments = line.split(TOKEN_REGEX);

  return (
    <span key={lineIndex} className="block">
      {segments.map((seg, segIdx) => {
        if (!seg) return null;
        const lower = seg.toLowerCase();

        if (lower === 'administratively down') {
          return (
            <span key={segIdx} className="text-amber-400 font-semibold">
              {seg}
            </span>
          );
        }
        if (lower === 'err-disabled') {
          return (
            <span key={segIdx} className="text-rose-400 font-semibold">
              {seg}
            </span>
          );
        }
        if (lower === 'up') {
          return (
            <span key={segIdx} className="text-emerald-400 font-semibold">
              {seg}
            </span>
          );
        }
        if (lower === 'down') {
          return (
            <span key={segIdx} className="text-red-400 font-semibold">
              {seg}
            </span>
          );
        }
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(seg)) {
          return (
            <span key={segIdx} className="text-cyan-300 font-mono">
              {seg}
            </span>
          );
        }
        if (/^vlan/i.test(seg)) {
          return (
            <span key={segIdx} className="text-amber-300 font-medium">
              {seg}
            </span>
          );
        }
        if (/^(GigabitEthernet|FastEthernet|TenGigabitEthernet|Gi|Fa|Te|Eth)\d+/i.test(seg)) {
          return (
            <span key={segIdx} className="text-[#c4a35a] font-semibold">
              {seg}
            </span>
          );
        }

        return <span key={segIdx}>{seg}</span>;
      })}
    </span>
  );
}

function CliOutputView({ output, isError }: { output: string; isError?: boolean }) {
  if (isError) {
    return (
      <pre className="whitespace-pre-wrap font-mono text-[11px] sm:text-xs overflow-x-auto text-red-400">
        {output}
      </pre>
    );
  }

  const lines = output.split('\n');
  return (
    <pre className="whitespace-pre-wrap font-mono text-[11px] sm:text-xs overflow-x-auto text-slate-300">
      {lines.map((line, idx) => renderHighlightedLine(line, idx))}
    </pre>
  );
}

export function InteractiveCliSandbox() {
  const [activeTab, setActiveTab] = useState<'free' | 'challenge'>('free');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<CliHistoryItem[]>([
    {
      prompt: '',
      command: '',
      output: 'Cisco IOS Software, Catalyst L3 Switch Software (CAT9K_IOSXE), Version 17.9.4a\nRa\'anana Municipal Core Switch 1 (Ahuza 103 Datacenter)\nType "help" or "?" for available commands, or press Tab for auto-completion.\n',
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

  // Tab completion engine
  const handleTabCompletion = () => {
    const cur = inputCommand.trim();
    const currentPrompt = getPromptString();

    if (!cur) {
      // Empty input: list available commands
      setHistory((prev) => [
        ...prev,
        {
          prompt: currentPrompt,
          command: '',
          output: COMMAND_DICTIONARY.join('\n'),
        },
      ]);
      audioFeedback.playKeyClick();
      return;
    }

    const curLower = cur.toLowerCase();
    const matches = COMMAND_DICTIONARY.filter((cmd) =>
      cmd.toLowerCase().startsWith(curLower)
    );

    if (matches.length === 1) {
      setInputCommand(matches[0]);
      audioFeedback.playKeyClick();
    } else if (matches.length > 1) {
      // Multiple matches: find longest common prefix
      let commonPrefix = matches[0];
      for (let i = 1; i < matches.length; i++) {
        while (!matches[i].toLowerCase().startsWith(commonPrefix.toLowerCase())) {
          commonPrefix = commonPrefix.slice(0, -1);
        }
      }

      if (commonPrefix.length > cur.length) {
        setInputCommand(commonPrefix);
      }

      // Show hints in terminal output
      setHistory((prev) => [
        ...prev,
        {
          prompt: currentPrompt,
          command: cur,
          output: matches.join('    '),
        },
      ]);
      audioFeedback.playKeyClick();
    } else {
      // Check partial match on sub-command (e.g. interface names or vlan params)
      if (curLower.startsWith('int ') || curLower.startsWith('interface ')) {
        setInputCommand('interface GigabitEthernet1/0/14');
        audioFeedback.playKeyClick();
      } else if (curLower.startsWith('switchport access ')) {
        setInputCommand('switchport access vlan 50');
        audioFeedback.playKeyClick();
      }
    }
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
  show interfaces trunk     - Display trunking ports & 802.1Q encapsulation
  show interfaces status    - Port status table, duplex, speed, and VLANs
  show vlan brief           - List configured municipal VLANs
  show power inline         - Show PoE allocation & power consumption
  show processes cpu        - Monitor switch CPU utilization
  show mac address-table    - Display dynamically learned MAC addresses
  show ip route             - Display IPv4 municipal routing table
  show ip interface brief   - Summary of all switch interfaces & IPs
  show running-config       - View current active configuration in RAM
  show cdp neighbors        - Discover adjacent Cisco switches and IP phones
  ping <ip_address>         - Send ICMP echo requests (e.g. ping 10.24.10.1)
  traceroute <ip_address>   - Trace packet route through Ra'anana WAN
  configure terminal (conf t) - Enter global configuration mode
  interface <interface_id>  - Enter interface config (e.g. int GigabitEthernet1/0/14)
  switchport mode access    - Set port to static access mode
  switchport access vlan <id> - Assign access VLAN (e.g. vlan 50)
  spanning-tree bpduguard enable - Enable STP BPDU Guard
  ip helper-address <ip>    - Configure DHCP Relay helper
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
    } else if (
      (configMode === 'config' || configMode === 'config-if') &&
      (cmdLower.startsWith('interface ') || cmdLower.startsWith('int ') || cmdLower === 'interface gigabitethernet')
    ) {
      const parts = rawCmd.split(' ');
      const iface = parts[1] || 'GigabitEthernet1/0/14';
      setCurrentInterface(iface);
      setConfigMode('config-if');
      output = '';
    } else if (configMode === 'config-if' && cmdLower.startsWith('switchport access vlan')) {
      const vlanNum = parseInt(rawCmd.replace(/switchport access vlan/i, '').trim(), 10);
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
    } else if (configMode === 'config-if' && cmdLower === 'switchport mode access') {
      output = `Interface ${currentInterface} mode set to access.`;
    } else if (configMode === 'config-if' && cmdLower === 'spanning-tree bpduguard enable') {
      output = `Spanning-tree BPDU Guard enabled on ${currentInterface}.`;
    } else if (configMode === 'config-if' && cmdLower.startsWith('ip helper-address')) {
      output = `DHCP helper address configured on ${currentInterface}.`;
    } else if (configMode === 'config-if' && (cmdLower === 'no shutdown' || cmdLower === 'no shut')) {
      setPortStates((prev) => ({
        ...prev,
        [currentInterface]: {
          ...prev[currentInterface],
          shutdown: false,
        },
      }));
      output = `%LINK-3-UPDOWN: Interface ${currentInterface}, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${currentInterface}, changed state to up`;
    } else if (configMode === 'config-if' && (cmdLower === 'shutdown' || cmdLower === 'shut')) {
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
    } else if (cmdLower === 'show interfaces trunk' || cmdLower === 'sh int trunk' || cmdLower === 'show int trunk') {
      output = `Port        Mode             Encapsulation  Status        Native vlan
Gi1/0/1     on               802.1q         trunking      1
Te1/0/1     on               802.1q         trunking      1
Te1/0/2     on               802.1q         trunking      1

Port        Vlans allowed on trunk
Gi1/0/1     1-4094
Te1/0/1     10,20,30,50,99
Te1/0/2     10,20,30,50,99

Port        Vlans in spanning tree forwarding state and not pruned
Gi1/0/1     1,10,30,50
Te1/0/1     10,20,30,50,99
Te1/0/2     10,20,30,50,99`;
    } else if (cmdLower === 'show interfaces status' || cmdLower === 'sh int status' || cmdLower === 'show int status') {
      const gi14State = portStates['GigabitEthernet1/0/14'];
      output = `Port      Name               Status          Vlan       Duplex  Speed Type
Gi1/0/1   TRUNK_MOKED_106    connected       trunk        a-full a-1000 10/100/1000BaseTX
Gi1/0/2   FIBER_RING_PARK    connected       trunk        a-full a-1000 10/100/1000BaseTX
Gi1/0/6   MOKED_PHONE_8845   connected       30           a-full  a-100 10/100/1000BaseTX
Gi1/0/14  LPR_WEIZMANN_CAM   ${gi14State?.shutdown ? 'disabled       ' : 'connected      '} ${gi14State?.vlan || 1}          a-full a-1000 10/100/1000BaseTX
Te1/0/1   UPLINK_PRIMARY     connected       trunk          full    10G SFP-10G-SR
Te1/0/2   UPLINK_SECONDARY   connected       trunk          full    10G SFP-10G-SR`;
    } else if (cmdLower === 'show processes cpu' || cmdLower === 'sh proc cpu' || cmdLower === 'show proc cpu') {
      output = `CPU utilization for five seconds: 9%/2%; one minute: 8%; five minutes: 7%
 PID Runtime(ms)   Invoked      uSecs   5Sec   1Min   5Min TTY Process 
   1          12       145         82  0.00%  0.00%  0.00%   0 Chunk Manager    
  34        4102     19842        206  0.89%  0.72%  0.68%   0 Net Background   
  89       18204    129381        140  2.15%  1.98%  1.85%   0 IP Input         
 142        8120     48210        168  1.04%  0.95%  0.90%   0 Spanning Tree    
 210       32104    291042        110  3.20%  2.80%  2.50%   0 IOS-XE Operating `;
    } else if (cmdLower === 'show mac address-table' || cmdLower === 'sh mac' || cmdLower === 'sh mac address-table') {
      output = `          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0014.f24a.8910    DYNAMIC     Gi1/0/2
  10    001a.a250.7274    STATIC      CPU
  30    0062.ec12.33aa    DYNAMIC     Gi1/0/6
  50    7069.79e1.4b8c    DYNAMIC     Gi1/0/14
  99    cc46.d610.a001    DYNAMIC     Te1/0/1
Total Mac Addresses for this criterion: 5`;
    } else if (cmdLower === 'show ip route' || cmdLower === 'sh ip ro' || cmdLower === 'sh ip route') {
      output = `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 

Gateway of last resort is 10.24.99.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 10.24.99.1, GigabitEthernet1/0/1
      10.0.0.0/8 is variably subnetted, 6 subnets, 2 masks
C        10.24.10.0/24 is directly connected, Vlan10
L        10.24.10.1/32 is directly connected, Vlan10
C        10.24.30.0/24 is directly connected, Vlan30
L        10.24.30.1/32 is directly connected, Vlan30
C        10.24.50.0/24 is directly connected, Vlan50
L        10.24.50.1/32 is directly connected, Vlan50
O        10.24.99.0/29 [110/2] via 10.24.99.1, 04:12:30, Te1/0/1`;
    } else if (cmdLower === 'show running-config' || cmdLower === 'sh run' || cmdLower === 'show run') {
      const gi14 = portStates['GigabitEthernet1/0/14'];
      output = `Building configuration...
Current configuration : 2840 bytes
!
version 17.9
hostname Raanana-SW1
!
ip routing
!
spanning-tree mode rapid-pvst
spanning-tree portfast bpduguard default
!
interface GigabitEthernet1/0/1
 description TRUNK TO MOKED 106
 switchport mode trunk
!
interface GigabitEthernet1/0/6
 description VOIP PHONE 8845 - MOKED 106
 switchport mode access
 switchport access vlan 30
 power inline auto
!
interface GigabitEthernet1/0/14
 description LPR TRAFFIC CAMERA - AHUZA / WEIZMANN
 switchport mode access
 switchport access vlan ${gi14?.vlan || 1}
 ${gi14?.shutdown ? 'shutdown' : 'no shutdown'}
 spanning-tree bpduguard enable
!
interface Vlan10
 description MUNICIPAL_MGMT
 ip address 10.24.10.1 255.255.255.0
!
interface Vlan30
 description MOKED_106_VOIP
 ip address 10.24.30.1 255.255.255.0
 ip helper-address 10.24.10.200
!
interface Vlan50
 description SMART_CITY_LPR
 ip address 10.24.50.1 255.255.255.0
!
end`;
    } else if (cmdLower === 'show cdp neighbors' || cmdLower === 'sh cdp nei' || cmdLower === 'show cdp nei') {
      output = `Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
Raanana-Dist-SW2 Gi 1/0/1          142              S I   WS-C3850  Gig 1/0/24
MOKED-SEP0062EC  Gi 1/0/6          165              H P   CP-8845   Port 1
Raanana-Park-SW1 Gi 1/0/2          130              S I   C9300-24P Gig 1/0/1`;
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
      output = `% Unknown or unrecognized command: "${rawCmd}". Type "help" or press Tab for list.`;
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

  // Keyboard navigation & Tab completion handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    audioFeedback.playKeyClick();

    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
      return;
    }

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
            אימון פקודות שטח אינטראקטיבי: הקלד פקודות אמת, השתמש ב-Tab להשלמה אוטומטית, ופתור תקלות במתגי ליבה
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
                הקלד פקודות למטה לתיקון ההגדרה (לחץ Tab להשלמה)
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
          'show interfaces status',
          'show interfaces trunk',
          'show vlan brief',
          'show processes cpu',
          'show running-config',
          'show power inline',
          'conf t',
          'int gi1/0/14',
          'switchport mode access',
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

        {/* Terminal Body with Real-time Syntax Highlighting */}
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
                <CliOutputView output={item.output} isError={item.isError} />
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

        {/* Mobile-Friendly Virtual Keyboard Bar */}
        <div className="p-2 bg-[#0F1117] border-t border-slate-800 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTabCompletion();
                inputRef.current?.focus();
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-lg bg-[#1A1D24] text-slate-300 hover:text-white border border-slate-700 font-mono text-xs font-bold"
              title="השלמת פקודה (Tab)"
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
