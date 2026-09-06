'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Server, 
  Wifi, 
  Camera, 
  PhoneCall, 
  ShieldAlert, 
  Radio, 
  Activity, 
  Layers, 
  Flame, 
  RotateCcw, 
  Zap, 
  AlertCircle,
  Clock,
  Gauge
} from 'lucide-react';
import { audioFeedback } from '@/lib/audioFeedback';
import { PacketPathVisualizer } from './PacketPathVisualizer';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedSite } from '@/lib/curriculumTranslations';

export interface MunicipalSite {
  id: string;
  name: string;
  hebrewName: string;
  role: string;
  address: string;
  x: number; // Percentage 0-100 on city map
  y: number;
  status: 'optimal' | 'warning' | 'critical';
  ipSubnet: string;
  gateway: string;
  coreVlan: number;
  switchModel: string;
  swVersion: string;
  opticPowerDbm: number; // e.g. -4.2 dBm
  activeAlerts: string[];
  ports: {
    port: number;
    name: string;
    vlan: number;
    status: 'up' | 'down' | 'error';
    poeWatts: number;
    speed: '1G' | '10G' | '100M';
    connectedDevice: string;
  }[];
}

export interface NetworkLink {
  id: string;
  from: string;
  to: string;
  media: 'fiber' | 'microwave' | 'vpn';
  bandwidth: string;
  latencyMs: number;
  status: 'active' | 'redundant' | 'failed';
}

const INITIAL_SITES: MunicipalSite[] = [
  {
    id: 'city_hall_dc',
    name: 'City Hall Core DC',
    hebrewName: 'בניין העירייה הראשי (חדר שרתים ראשי)',
    role: 'Core Data Center & Municipal Spine',
    address: 'אחוזה 103, רעננה',
    x: 50,
    y: 42,
    status: 'optimal',
    ipSubnet: '10.24.10.0/24',
    gateway: '10.24.10.1',
    coreVlan: 10,
    switchModel: 'Cisco Catalyst 9500 StackWise-Virtual (40G Core)',
    swVersion: 'Cisco IOS-XE 17.9.4a',
    opticPowerDbm: -3.4,
    activeAlerts: [],
    ports: Array.from({ length: 24 }, (_, i) => ({
      port: i + 1,
      name: `TenGigE1/0/${i + 1}`,
      vlan: i < 8 ? 10 : i < 16 ? 20 : 99,
      status: 'up',
      poeWatts: 0,
      speed: '10G',
      connectedDevice: i === 0 ? 'Firewall Check Point Cluster A' : i === 1 ? 'Firewall Check Point Cluster B' : i === 2 ? 'SAN Storage PureStorage' : `Trunk Uplink to Site #${i + 1}`,
    }))
  },
  {
    id: 'moked_106',
    name: 'Moked 106 & Emergency Ops',
    hebrewName: 'מוקד 106 וביטחון עירוני',
    role: 'Emergency Dispatch & IP Telephony CUCM',
    address: 'רחוב הרמב״ם 8, רעננה',
    x: 58,
    y: 35,
    status: 'optimal',
    ipSubnet: '10.24.30.0/24',
    gateway: '10.24.30.1',
    coreVlan: 30,
    switchModel: 'Cisco Catalyst 9300-48P PoE+ (740W Power)',
    swVersion: 'Cisco IOS-XE 17.6.5',
    opticPowerDbm: -4.1,
    activeAlerts: [],
    ports: Array.from({ length: 24 }, (_, i) => ({
      port: i + 1,
      name: `GigabitEthernet1/0/${i + 1}`,
      vlan: 30,
      status: 'up',
      poeWatts: i < 16 ? 7.2 : 0,
      speed: '1G',
      connectedDevice: i < 16 ? `Cisco IP Phone 8845 - מוקדן #${i + 1}` : `Dispatch CAD Workstation #${i - 15}`,
    }))
  },
  {
    id: 'raanana_park',
    name: 'Raanana Park & Amphitheater',
    hebrewName: 'פארק רעננה, האגם והאמפיתיאטרון',
    role: 'Outdoor Wi-Fi, 4K Security Cameras & Public PA',
    address: 'פארק רעננה, דרך הפארק',
    x: 24,
    y: 65,
    status: 'optimal',
    ipSubnet: '10.24.60.0/24',
    gateway: '10.24.60.1',
    coreVlan: 60,
    switchModel: 'Aruba CX 6200F 24G Class 4 PoE 4SFP+',
    swVersion: 'AOS-CX 10.12.0006',
    opticPowerDbm: -5.8,
    activeAlerts: [],
    ports: Array.from({ length: 24 }, (_, i) => ({
      port: i + 1,
      name: `1/1/${i + 1}`,
      vlan: i < 12 ? 60 : 50,
      status: 'up',
      poeWatts: i < 8 ? 25.5 : 12.0,
      speed: '1G',
      connectedDevice: i < 8 ? `Axis Q6155-E PTZ Camera (אגם/אמפי #${i + 1})` : `Aruba AP-575 Outdoor Wi-Fi 6`,
    }))
  },
  {
    id: 'country_club',
    name: 'Country Club & Sports Center',
    hebrewName: 'מרכז ספורט וקאנטרי קלאב',
    role: 'Athletics, Access Control & Wireless PtP Link',
    address: 'בן גוריון 5, רעננה',
    x: 20,
    y: 28,
    status: 'optimal',
    ipSubnet: '10.24.45.0/24',
    gateway: '10.24.45.1',
    coreVlan: 45,
    switchModel: 'Cisco Catalyst 9200L-24P-4X',
    swVersion: 'Cisco IOS-XE 17.6.4',
    opticPowerDbm: -6.2,
    activeAlerts: [],
    ports: Array.from({ length: 24 }, (_, i) => ({
      port: i + 1,
      name: `Gi1/0/${i + 1}`,
      vlan: 45,
      status: 'up',
      poeWatts: i < 6 ? 15.4 : 0,
      speed: '1G',
      connectedDevice: i < 6 ? `Access Control Turnstile #${i + 1}` : 'Administrative PC',
    }))
  },
  {
    id: 'weizmann_junction',
    name: 'Traffic Control & LPR Weizmann',
    hebrewName: 'צומת אחוזה / ויצמן (בקרת תנועה ו-LPR)',
    role: 'License Plate Recognition (LPR) & Smart Traffic Lights',
    address: 'צומת אחוזה - ויצמן, רעננה',
    x: 75,
    y: 42,
    status: 'optimal',
    ipSubnet: '10.24.50.0/24',
    gateway: '10.24.50.1',
    coreVlan: 50,
    switchModel: 'Moxa EDS-G512E Ruggedized Hardened DIN-Rail Switch',
    swVersion: 'Firmware 5.1 (Industrial Extended Temp)',
    opticPowerDbm: -4.8,
    activeAlerts: [],
    ports: Array.from({ length: 12 }, (_, i) => ({
      port: i + 1,
      name: `Port ${i + 1}`,
      vlan: 50,
      status: 'up',
      poeWatts: 30.0,
      speed: '1G',
      connectedDevice: i < 4 ? `LPR High-Speed Camera צפון/דרום #${i + 1}` : 'Traffic Controller Cabinet Interface',
    }))
  },
  {
    id: 'alon_school',
    name: 'Alon High School Campus',
    hebrewName: 'חטיבת הביניים אלון ומתחם החינוך',
    role: 'Municipal Education Network & BYOD Wi-Fi',
    address: 'הפרחים 26, רעננה',
    x: 42,
    y: 72,
    status: 'optimal',
    ipSubnet: '10.24.40.0/22',
    gateway: '10.24.40.1',
    coreVlan: 40,
    switchModel: 'Aruba CX 6300M 48-Port Smart Rate Class 6 PoE',
    swVersion: 'AOS-CX 10.13.0005',
    opticPowerDbm: -3.9,
    activeAlerts: [],
    ports: Array.from({ length: 24 }, (_, i) => ({
      port: i + 1,
      name: `1/1/${i + 1}`,
      vlan: 40,
      status: 'up',
      poeWatts: 24.0,
      speed: '1G',
      connectedDevice: `Aruba AP-515 Classroom AP #${i + 1}`,
    }))
  },
  {
    id: 'welfare_building',
    name: 'Welfare Admin & Beit HaVradim',
    hebrewName: 'מנהל הרווחה והשירותים החברתיים (בית הוורדים)',
    role: 'Secure Confidential Citizen Network with 802.1X',
    address: 'רחוב הוורדים 12, רעננה',
    x: 70,
    y: 60,
    status: 'optimal',
    ipSubnet: '10.24.25.0/24',
    gateway: '10.24.25.1',
    coreVlan: 25,
    switchModel: 'Cisco Catalyst 9200-24T (Data Only) + NAC 802.1X',
    swVersion: 'Cisco IOS-XE 17.9.3',
    opticPowerDbm: -4.5,
    activeAlerts: [],
    ports: Array.from({ length: 24 }, (_, i) => ({
      port: i + 1,
      name: `Gi1/0/${i + 1}`,
      vlan: 25,
      status: 'up',
      poeWatts: 0,
      speed: '1G',
      connectedDevice: `Social Worker Secure Desktop #${i + 1}`,
    }))
  },
  {
    id: 'isp_edge',
    name: 'Edge Internet & Gov-Net Gateway',
    hebrewName: 'שדרת ספקיות האינטרנט וממשל זמין',
    role: 'Dual Uplink: Bezeq Metro 10Gbps + Partner IP-VPN + SD-WAN',
    address: 'חוות השרתים המרכזית (Edge POP)',
    x: 50,
    y: 12,
    status: 'optimal',
    ipSubnet: '194.90.150.0/29',
    gateway: '194.90.150.1',
    coreVlan: 99,
    switchModel: 'FortiGate 200F High Availability Cluster Active-Passive',
    swVersion: 'FortiOS 7.4.3',
    opticPowerDbm: -2.8,
    activeAlerts: [],
    ports: Array.from({ length: 12 }, (_, i) => ({
      port: i + 1,
      name: `port${i + 1}`,
      vlan: 99,
      status: 'up',
      poeWatts: 0,
      speed: '10G',
      connectedDevice: i === 0 ? 'Bezeq Metro Dark Fiber 10G Uplink' : i === 1 ? 'Partner IP-VPN Backup' : 'Core Spine Trunk',
    }))
  }
];

const INITIAL_LINKS: NetworkLink[] = [
  { id: 'l1', from: 'isp_edge', to: 'city_hall_dc', media: 'fiber', bandwidth: '10 Gbps (DWDM Dark Fiber)', latencyMs: 0.8, status: 'active' },
  { id: 'l2', from: 'city_hall_dc', to: 'moked_106', media: 'fiber', bandwidth: '10 Gbps (Ring Trunk)', latencyMs: 0.4, status: 'active' },
  { id: 'l3', from: 'city_hall_dc', to: 'raanana_park', media: 'fiber', bandwidth: '10 Gbps (South Optical Ring)', latencyMs: 1.2, status: 'active' },
  { id: 'l4', from: 'city_hall_dc', to: 'weizmann_junction', media: 'fiber', bandwidth: '1 Gbps (East Dark Fiber)', latencyMs: 0.9, status: 'active' },
  { id: 'l5', from: 'city_hall_dc', to: 'alon_school', media: 'fiber', bandwidth: '10 Gbps (Campus Fiber)', latencyMs: 1.1, status: 'active' },
  { id: 'l6', from: 'city_hall_dc', to: 'welfare_building', media: 'fiber', bandwidth: '1 Gbps (Single-Mode OS2)', latencyMs: 1.0, status: 'active' },
  { id: 'l7', from: 'city_hall_dc', to: 'country_club', media: 'microwave', bandwidth: '2.5 Gbps (Ubiquiti 60GHz Wave)', latencyMs: 2.1, status: 'active' },
  // Redundant ring links
  { id: 'l8', from: 'raanana_park', to: 'alon_school', media: 'fiber', bandwidth: '10 Gbps (Fiber Ring Interconnect)', latencyMs: 0.7, status: 'redundant' },
  { id: 'l9', from: 'country_club', to: 'raanana_park', media: 'microwave', bandwidth: '1 Gbps (PtP Backup Link)', latencyMs: 2.8, status: 'redundant' },
  { id: 'l10', from: 'weizmann_junction', to: 'welfare_building', media: 'vpn', bandwidth: '100 Mbps (Bezeq Metro IPsec Backup)', latencyMs: 4.5, status: 'redundant' },
];

export interface NetworkTopologyExplorerProps {
  initialMode?: 'sites' | 'path_journey';
}

export function NetworkTopologyExplorer({ initialMode = 'path_journey' }: NetworkTopologyExplorerProps = {}) {
  const { lang } = useLanguage();
  const [viewMode, setViewMode] = useState<'sites' | 'path_journey'>(initialMode);
  const [sites, setSites] = useState<MunicipalSite[]>(INITIAL_SITES);
  const [links, setLinks] = useState<NetworkLink[]>(INITIAL_LINKS);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('city_hall_dc');
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<number | null>(null);

  const selectedSiteRaw = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const selectedSite = getLocalizedSite(selectedSiteRaw, lang);

  // Simulations
  const runFiberCutSimulation = () => {
    audioFeedback.playAlert();
    setActiveSimulation('fiber_cut');

    // Break main fiber to Raanana Park (l3)
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === 'l3') {
          return { ...link, status: 'failed' };
        }
        // Activate backup ring link (l8) and PtP link (l9) via Spanning Tree RSTP / OSPF
        if (link.id === 'l8') {
          return { ...link, status: 'active' };
        }
        return link;
      })
    );

    // Update Park status to warning due to failover
    setSites((prev) =>
      prev.map((s) => {
        if (s.id === 'raanana_park') {
          return {
            ...s,
            status: 'warning',
            activeAlerts: [
              lang === 'en'
                ? 'Fiber cut on Park Way! Traffic rerouted via Alon within 1.4s by OSPF/RSTP.'
                : 'שבר סיב אופטי בדרך הפארק! תנועה נותבה מחדש דרך אלון תוך 1.4 שניות ע״י OSPF/RSTP.'
            ],
          };
        }
        return s;
      })
    );
  };

  const runDhcpStarvationSimulation = () => {
    audioFeedback.playAlert();
    setActiveSimulation('dhcp_starvation');

    setSites((prev) =>
      prev.map((s) => {
        if (s.id === 'alon_school') {
          return {
            ...s,
            status: 'warning',
            activeAlerts: [
              lang === 'en'
                ? 'Rogue DHCP / Broadcast Storm detected in computer lab! DHCP Snooping locked port 1/1/18 in Err-Disable.'
                : 'זוהתה התקפת Rogue DHCP / Broadcast Storm בכיתת מחשבים! DHCP Snooping נעל את פורט 1/1/18 במצב Err-Disable.',
            ],
            ports: s.ports.map((p) => (p.port === 18 ? { ...p, status: 'error', connectedDevice: 'ROGUE ROUTER DETECTED (Port Err-Disable)' } : p)),
          };
        }
        return s;
      })
    );
  };

  const runQoSPrioritySimulation = () => {
    audioFeedback.playSuccess();
    setActiveSimulation('qos_emergency');

    setSites((prev) =>
      prev.map((s) => {
        if (s.id === 'moked_106') {
          return {
            ...s,
            activeAlerts: [
              lang === 'en'
                ? 'Municipal Emergency activated: QoS engine prioritizes SIP/RTP voice marked DSCP 46 (EF) with 2ms latency.'
                : 'מצב חירום עירוני הופעל: מנגנון QoS מתעדף שיחות SIP/RTP בתגית DSCP 46 (Expedited Forwarding) עם השהייה של 2ms בלבד.',
            ],
          };
        }
        return s;
      })
    );
  };

  const resetSimulation = () => {
    audioFeedback.playChime();
    setActiveSimulation(null);
    setSites(INITIAL_SITES);
    setLinks(INITIAL_LINKS);
  };

  const renderTopologyMap = (compact: boolean = false) => (
    <div className={`rounded-2xl bg-[#0F1117] border border-white/10 p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-sm ${compact ? 'min-h-[260px]' : 'min-h-[460px]'}`}>
      {/* Legend and Media Types */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-white/10 flex-wrap text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-500 rounded-full" />
            {lang === 'en' ? 'Primary Fiber (10G)' : 'סיב אופטי ראשי (10G)'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-purple-500 border-dashed rounded-full" />
            {lang === 'en' ? 'Wireless Backup (60GHz)' : 'גיבוי אלחוטי (60GHz)'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-500 border-dotted rounded-full" />
            {lang === 'en' ? 'IPsec VPN Backup' : 'גיבוי IPsec VPN'}
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[10px] sm:text-xs">
          {compact 
            ? (lang === 'en' ? 'Live sync with packet path' : 'סנכרון חי עם תחנות נתיב הפקטה')
            : (lang === 'en' ? 'Click institution to inspect switch rack' : 'לחץ על מוסד לצפייה בארון המתגים')}
        </span>
      </div>

      {/* SVG Map of Ra'anana City with Links and Nodes */}
      <div className={`relative flex-1 w-full bg-[#0A0C10] rounded-xl border border-slate-800/80 overflow-hidden select-none ${compact ? 'h-[220px]' : 'h-[360px] sm:h-[400px]'}`}>
        {/* Grid Coordinates Texture */}
        <div className="absolute inset-0 bg-grid-dots opacity-20 pointer-events-none" />

        {/* City Road Overlay Landmarks (Ahuza, Weizmann, Jerusalem, Park) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="5%" y1="42%" x2="95%" y2="42%" stroke="#64748b" strokeWidth="6" strokeDasharray="8 4" />
          <text x="88%" y="40%" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
            {lang === 'en' ? 'Ahuza St.' : 'רחוב אחוזה'}
          </text>
          <line x1="75%" y1="5%" x2="75%" y2="95%" stroke="#64748b" strokeWidth="4" />
          <text x="76%" y="15%" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
            {lang === 'en' ? 'Weizmann St.' : 'רחוב ויצמן'}
          </text>
          <line x1="20%" y1="5%" x2="20%" y2="95%" stroke="#64748b" strokeWidth="3" />
          <text x="12%" y="18%" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
            {lang === 'en' ? 'Jerusalem Way' : 'דרך ירושלים'}
          </text>
        </svg>

        {/* SVG Network Links */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {links.map((link) => {
            const fromSite = sites.find((s) => s.id === link.from);
            const toSite = sites.find((s) => s.id === link.to);
            if (!fromSite || !toSite) return null;

            const isFailed = link.status === 'failed';
            const isRedundant = link.status === 'redundant';

            let strokeColor = '#3b82f6'; // Blue for fiber
            let strokeDash = 'none';

            if (link.media === 'microwave') {
              strokeColor = '#a855f7'; // Purple for 60GHz
              strokeDash = '6 4';
            } else if (link.media === 'vpn') {
              strokeColor = '#f59e0b'; // Amber for VPN
              strokeDash = '3 3';
            }

            if (isFailed) {
              strokeColor = '#ef4444'; // Red for failed
              strokeDash = '4 4';
            } else if (isRedundant) {
              strokeColor = '#475569'; // Muted for standby
            }

            return (
              <g key={link.id}>
                <line
                  x1={`${fromSite.x}%`}
                  y1={`${fromSite.y}%`}
                  x2={`${toSite.x}%`}
                  y2={`${toSite.y}%`}
                  stroke={strokeColor}
                  strokeWidth={isFailed ? 3 : 2}
                  strokeDasharray={strokeDash}
                  opacity={isRedundant ? 0.4 : 0.85}
                />

                {!isFailed && !isRedundant && (
                  <circle r="3" fill="#60a5fa">
                    <animateMotion
                      path={`M ${fromSite.x * 3.6} ${fromSite.y * 3.6} L ${toSite.x * 3.6} ${toSite.y * 3.6} Z`}
                      dur={`${link.latencyMs * 2 + 1.2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Site Nodes as Interactive Markers */}
        {sites.map((site) => {
          const isSelected = selectedSiteId === site.id;
          const locSite = getLocalizedSite(site, lang);
          let statusBg = 'bg-blue-500';
          let ringColor = 'ring-blue-400';

          if (site.status === 'warning') {
            statusBg = 'bg-amber-500';
            ringColor = 'ring-amber-400';
          } else if (site.status === 'critical') {
            statusBg = 'bg-red-500';
            ringColor = 'ring-red-400';
          }

          return (
            <button
              key={site.id}
              onClick={() => {
                audioFeedback.playKeyClick();
                setSelectedSiteId(site.id);
              }}
              style={{ left: `${site.x}%`, top: `${site.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-xl border transition-all duration-200 z-10 flex items-center gap-1.5 shadow-lg group cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-500/30 scale-110 z-20'
                  : 'bg-[#1A1D24] text-slate-200 border-white/10 hover:border-blue-400 hover:scale-105'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${statusBg} ring-2 ${ringColor} shrink-0 animate-pulse`} />
              
              {site.id === 'city_hall_dc' && <Building2 className="w-3.5 h-3.5 shrink-0" />}
              {site.id === 'moked_106' && <PhoneCall className="w-3.5 h-3.5 shrink-0" />}
              {site.id === 'raanana_park' && <Wifi className="w-3.5 h-3.5 shrink-0" />}
              {site.id === 'country_club' && <Radio className="w-3.5 h-3.5 shrink-0" />}
              {site.id === 'weizmann_junction' && <Camera className="w-3.5 h-3.5 shrink-0" />}
              {site.id === 'alon_school' && <Layers className="w-3.5 h-3.5 shrink-0" />}
              {site.id === 'welfare_building' && <ShieldAlert className="w-3.5 h-3.5 shrink-0" />}
              {site.id === 'isp_edge' && <Server className="w-3.5 h-3.5 shrink-0" />}

              <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap hidden sm:inline-block">
                {locSite.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Alert Banner if any */}
      {!compact && selectedSite.activeAlerts.length > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>{lang === 'en' ? 'Active Network Alert on this site:' : 'התראת רשת פעילה באתר זה:'}</strong>
            <p className="mt-0.5">{selectedSite.activeAlerts[0]}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* View Mode Switcher: Path Simulation vs Live NOC Racks */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5 p-1 bg-[#131722] rounded-xl border border-slate-700/80">
          <button
            id="mode-packet-journey"
            onClick={() => {
              audioFeedback.playKeyClick();
              setViewMode('path_journey');
            }}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'path_journey'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {lang === 'en' 
                ? 'Packet Path Simulation & Visual Learning (NEW)' 
                : 'הדמיית נתיב תקשורת ולמידה גרפית (NEW)'}
            </span>
          </button>

          <button
            id="mode-noc-sites"
            onClick={() => {
              audioFeedback.playKeyClick();
              setViewMode('sites');
            }}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'sites'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {lang === 'en' ? 'NOC City Map & Server Rack Monitor' : 'מפת ה-NOC וניטור ארונות שרתים'}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
          {lang === 'en' 
            ? 'Ra\'anana NOC Command Center | Municipal Fiber Backbone' 
            : 'חמ״ל שו״ב רעננה | שדרת תקשורת עירונית'}
        </span>
      </div>

      {/* VIEW 1: PATH JOURNEY SIMULATION */}
      {viewMode === 'path_journey' && (
        <div className="space-y-6">
          {/* Synchronized Ra'anana City Topology Map Banner */}
          {renderTopologyMap(true)}

          {/* Full-Fledged Packet Path Learning & Simulation Engine */}
          <PacketPathVisualizer onSelectSite={(siteId) => setSelectedSiteId(siteId)} />
        </div>
      )}

      {/* VIEW 2: LIVE NOC SITES & SWITCH PANEL TELEMETRY */}
      {viewMode === 'sites' && (
        <div className="space-y-6">
          {/* Top NOC Operations Control Bar */}
          <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0F1117] border border-white/10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#E2E8F0] flex items-center gap-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0" />
                  <span>
                    {lang === 'en' 
                      ? 'Live Municipal Network Topology - Ra\'anana NOC Command' 
                      : 'טופולוגיית רשת עירונית חיה - חמ״ל שו״ב רעננה'}
                  </span>
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {lang === 'en' 
                  ? 'Municipal backbone, Dark Fiber rings, 60GHz wireless links and switch cabinets' 
                  : 'שדרת תקשורת עירונית, טבעות סיבים (Dark Fiber), ערוצי אלחוט 60GHz וארונות מתגים'}
              </p>
            </div>

            {/* Live Simulation Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-300 ml-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'en' ? 'Field Scenarios:' : 'תרחישי שטח:'}
              </span>

              <button
                onClick={runFiberCutSimulation}
                disabled={activeSimulation === 'fiber_cut'}
                className={`min-h-[44px] text-xs px-3 py-2 rounded-lg border font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSimulation === 'fiber_cut'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-[#1A1D24] text-slate-300 border-slate-700 hover:border-red-500 hover:text-red-400'
                }`}
              >
                <span>{lang === 'en' ? 'Park Fiber Cut' : 'חיתוך סיב בפארק'}</span>
              </button>

              <button
                onClick={runDhcpStarvationSimulation}
                disabled={activeSimulation === 'dhcp_starvation'}
                className={`min-h-[44px] text-xs px-3 py-2 rounded-lg border font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSimulation === 'dhcp_starvation'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#1A1D24] text-slate-300 border-slate-700 hover:border-amber-500 hover:text-amber-400'
                }`}
              >
                <span>Rogue DHCP</span>
              </button>

              <button
                onClick={runQoSPrioritySimulation}
                disabled={activeSimulation === 'qos_emergency'}
                className={`min-h-[44px] text-xs px-3 py-2 rounded-lg border font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeSimulation === 'qos_emergency'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-[#1A1D24] text-slate-300 border-slate-700 hover:border-blue-500 hover:text-blue-400'
                }`}
              >
                <span>{lang === 'en' ? '106 Emergency Surge' : 'עומס חירום 106'}</span>
              </button>

              {activeSimulation && (
                <button
                  onClick={resetSimulation}
                  className="min-h-[44px] text-xs px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  title={lang === 'en' ? 'Restore topology' : 'שחזר טופולוגיה'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Reset' : 'איפוס'}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Site Quick-Switcher Strip (Visible on mobile/foldable for fast touch selection) */}
          <div className="lg:hidden p-3 rounded-xl bg-[#0F1117] border border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {lang === 'en' ? 'Select Municipal Site (Quick Touch):' : 'בחר אתר עירוני לבדיקה (מגע מהיר):'}
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {sites.map((s) => {
                const isSelected = selectedSiteId === s.id;
                const locS = getLocalizedSite(s, lang);
                let dotColor = 'bg-blue-400';
                if (s.status === 'warning') dotColor = 'bg-amber-400 animate-ping';
                if (s.status === 'critical') dotColor = 'bg-red-400 animate-ping';

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      audioFeedback.playKeyClick();
                      setSelectedSiteId(s.id);
                    }}
                    className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-2 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md font-bold'
                        : 'bg-[#1A1D24] text-slate-300 border-slate-700/80 hover:text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span>{locS.name.split(' ')[0]} {locS.name.split(' ')[1] || ''}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Topology Map (Left 7 Cols) + In-Depth Switch & Rack Cabinet Telemetry (Right 5 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              {renderTopologyMap(false)}
            </div>

        {/* SITE DETAILS, RACK CABINET & SWITCH PORT INSPECTION (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0F1117] border border-white/10 p-5 flex flex-col justify-between space-y-5 shadow-sm">
          
          {/* Site Header */}
          <div className="space-y-1.5 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-md font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                VLAN {selectedSite.coreVlan}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'en' ? `Optics: ${selectedSite.opticPowerDbm} dBm` : `אופטיקה: ${selectedSite.opticPowerDbm} dBm`}
              </span>
            </div>
            <h4 className="text-lg font-bold text-[#E2E8F0]">
              {selectedSite.name}
            </h4>
            <p className="text-xs text-slate-400">{selectedSite.address} | {selectedSite.role}</p>
          </div>

          {/* Network Specs Bar */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#1A1D24] border border-white/10">
              <span className="text-[10px] text-slate-400 block">
                {lang === 'en' ? 'Municipal Subnet:' : 'סאבנט עירוני:'}
              </span>
              <span className="font-mono font-bold text-blue-400">{selectedSite.ipSubnet}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#1A1D24] border border-white/10">
              <span className="text-[10px] text-slate-400 block">Default Gateway:</span>
              <span className="font-mono font-bold text-slate-200">{selectedSite.gateway}</span>
            </div>
            <div className="col-span-2 p-2.5 rounded-lg bg-[#1A1D24] border border-white/10">
              <span className="text-[10px] text-slate-400 block">
                {lang === 'en' ? 'Switch Model & Firmware:' : 'דגם מתג וגרסת מערכת:'}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-200 block">{selectedSite.switchModel}</span>
              <span className="text-[10px] text-slate-400">{selectedSite.swVersion}</span>
            </div>
          </div>

          {/* Realistic 24-Port Switch Panel Visualizer */}
          <div className="p-3.5 rounded-xl bg-black/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono font-bold text-slate-300">Front Panel Port Matrix (1-24)</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {lang === 'en' ? 'All Links Negotiated Full-Duplex' : 'כל הקישורים במצב Full-Duplex'}
              </span>
            </div>

            {/* 2-Row Switch Port Matrix with smooth mobile touch and horizontal overflow */}
            <div className="space-y-1.5 bg-[#0A0C10] p-2 sm:p-2.5 rounded-lg border border-slate-800 overflow-x-auto scrollbar-thin">
              {/* Top Row: Odd Ports */}
              <div className="flex items-center gap-1.5 min-w-[320px] justify-between pb-0.5">
                {selectedSite.ports.filter((_, idx) => idx % 2 === 0).map((p) => {
                  const isHovered = hoveredPort === p.port;
                  let portLed = 'bg-emerald-500';
                  if (p.status === 'down') portLed = 'bg-slate-700';
                  if (p.status === 'error') portLed = 'bg-red-500 animate-pulse';

                  return (
                    <button
                      key={p.port}
                      onClick={() => {
                        audioFeedback.playKeyClick();
                        setHoveredPort(p.port);
                      }}
                      onMouseEnter={() => setHoveredPort(p.port)}
                      className={`min-w-[28px] h-8 sm:w-7 sm:h-7 rounded flex flex-col items-center justify-between p-1 border text-[10px] font-mono transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-[0_0_8px_rgba(37,99,235,0.6)] z-10'
                          : 'bg-[#1A1D24] border-slate-700 text-slate-300 hover:border-slate-500 active:scale-95'
                      }`}
                      title={lang === 'en' ? `Port ${p.port}: ${p.connectedDevice}` : `פורט ${p.port}: ${p.connectedDevice}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${portLed}`} />
                      <span className="leading-none">{p.port}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Row: Even Ports */}
              <div className="flex items-center gap-1.5 min-w-[320px] justify-between pt-0.5">
                {selectedSite.ports.filter((_, idx) => idx % 2 === 1).map((p) => {
                  const isHovered = hoveredPort === p.port;
                  let portLed = 'bg-emerald-500';
                  if (p.status === 'down') portLed = 'bg-slate-700';
                  if (p.status === 'error') portLed = 'bg-red-500 animate-pulse';

                  return (
                    <button
                      key={p.port}
                      onClick={() => {
                        audioFeedback.playKeyClick();
                        setHoveredPort(p.port);
                      }}
                      onMouseEnter={() => setHoveredPort(p.port)}
                      className={`min-w-[28px] h-8 sm:w-7 sm:h-7 rounded flex flex-col items-center justify-between p-1 border text-[10px] font-mono transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-[0_0_8px_rgba(37,99,235,0.6)] z-10'
                          : 'bg-[#1A1D24] border-slate-700 text-slate-300 hover:border-slate-500 active:scale-95'
                      }`}
                      title={lang === 'en' ? `Port ${p.port}: ${p.connectedDevice}` : `פורט ${p.port}: ${p.connectedDevice}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${portLed}`} />
                      <span className="leading-none">{p.port}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hovered Port Telemetry Box */}
            {hoveredPort !== null && (
              <div className="p-2.5 rounded-lg bg-[#1A1D24] border border-blue-500/30 text-xs space-y-1 animate-in fade-in">
                {(() => {
                  const portData = selectedSite.ports.find((p) => p.port === hoveredPort);
                  if (!portData) return null;
                  return (
                    <>
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-blue-400">{portData.name}</span>
                        <span className="text-[10px] text-slate-400">VLAN {portData.vlan} | {portData.speed}</span>
                      </div>
                      <div className="text-[11px] text-slate-200">
                        {lang === 'en' ? 'Connected Device:' : 'התקן מחובר:'} <strong>{portData.connectedDevice}</strong>
                      </div>
                      {portData.poeWatts > 0 && (
                        <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {lang === 'en' ? `Active PoE Draw: ${portData.poeWatts}W` : `צריכת PoE פעילה: ${portData.poeWatts}W`}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Quick Municipal Hint */}
          <div className="p-3 rounded-xl bg-[#1A1D24] border border-white/10 text-xs text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>{lang === 'en' ? 'Average Response Time (SLA):' : 'זמן תגובה ממוצע (SLA):'}</strong>{' '}
              {lang === 'en' 
                ? 'Job 7274 requires isolating and resolving critical site outages within 15 minutes.' 
                : 'משרה 7274 מחייבת זיהוי ופתרון תקלות אתר קריטי תוך 15 דקות.'}
            </span>
          </div>

        </div>

      </div>
    </div>
  )}

</div>
  );
}
