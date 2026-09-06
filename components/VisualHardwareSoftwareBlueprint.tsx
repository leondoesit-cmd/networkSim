'use client';

import React, { useState, useMemo } from 'react';
import { 
  LearningNode, 
  NodeProgress, 
  LEARNING_NODES 
} from '@/data/curriculumData';
import { audioFeedback } from '@/lib/audioFeedback';
import { 
  Server, 
  Network, 
  Cable, 
  ShieldAlert, 
  Camera, 
  PhoneCall, 
  Radio, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  Lock, 
  Zap, 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Layers, 
  Cpu, 
  Globe, 
  Sliders, 
  Eye, 
  Sparkles,
  MapPin,
  Check,
  Flame,
  Info
} from 'lucide-react';

interface VisualHardwareSoftwareBlueprintProps {
  nodes: LearningNode[];
  progress: NodeProgress;
  onSelectNode: (node: LearningNode) => void;
}

// Visual entity definition linking hardware and software
interface ArchitectureEntity {
  id: string;
  nodeId: string; // Linked curriculum node ID
  type: 'hardware' | 'software' | 'endpoint' | 'infrastructure';
  title: string;
  category: string;
  elevation: number;
  hardwareSpecs: {
    model: string;
    formFactor: string;
    physicalPorts: string;
    indicators: string;
    fieldNotes: string;
  };
  softwareSpecs: {
    protocol: string;
    layer: string;
    keyParameters: string;
    cliCheck: string;
  };
  raananaContext: {
    site: string;
    useCase: string;
  };
}

const ARCHITECTURE_ENTITIES: ArchitectureEntity[] = [
  {
    id: 'ent-passive-cabling',
    nodeId: 'node-cabling-poe',
    type: 'infrastructure',
    title: 'פנל כבילה מוקשח ו-Cat6A Keystone',
    category: 'תשתיות פסיביות',
    elevation: 0,
    hardwareSpecs: {
      model: 'Patch Panel 24-Port 1U Cat6A S/FTP מוארק',
      formFactor: '19" Rackmount 1U',
      physicalPorts: '24x RJ45 עם חיבור סיכוך 360°',
      indicators: 'בדיקת Fluke Channel Class Ea (500MHz)',
      fieldNotes: 'חיווט לפי תקן T568B: לבן-כתום, כתום, לבן-ירוק, כחול, לבן-כחול, ירוק, לבן-חום, חום',
    },
    softwareSpecs: {
      protocol: 'PoE+ (IEEE 802.3at up to 30W / 802.3bt 60W)',
      layer: 'Layer 1 - Physical',
      keyParameters: 'ניחות (Attenuation) < 3 dB, NEXT > 44 dB ב-250MHz',
      cliCheck: 'show power inline gigabitEthernet 1/0/1',
    },
    raananaContext: {
      site: 'בניין העירייה ברחוב אחוזה 103 (ארון קומה 2)',
      useCase: 'הזנת עמדות מחשב וטלפוני IP במוקד השירות העירוני',
    },
  },
  {
    id: 'ent-fiber-odf',
    nodeId: 'node-fiber-optics',
    type: 'infrastructure',
    title: 'מגירת סיבים אופטיים ODF ומתאמי LC/SC',
    category: 'תשתיות אופטיות',
    elevation: 0,
    hardwareSpecs: {
      model: '19" 1U Optical Distribution Frame (ODF) 24 Cores',
      formFactor: '19" 1U מתכת מגולוונת עם מגש ריתוך סיבים',
      physicalPorts: '12x Duplex LC/UPC (כחול) + 6x Duplex SC/APC (ירוק)',
      indicators: 'עוצמת ניחות מדודה: -3.8 dBm (תקין בטווח -3 עד -9)',
      fieldNotes: 'סיבי Single-Mode 9/125 (צהוב) לפריסה עירונית, OM4 50/125 (טורקיז) בתוך הדאטה-סנטר',
    },
    softwareSpecs: {
      protocol: '10GBASE-LR (1310nm 10km) / 10GBASE-SR (850nm 300m)',
      layer: 'Layer 1 - Optical Physical',
      keyParameters: 'SFP+ DOM (Digital Optical Monitoring) Rx/Tx Power',
      cliCheck: 'show interfaces transceiver detail',
    },
    raananaContext: {
      site: 'קו סיב אופטי ראשי: בניין העירייה ➔ מוקד 106 ברמב״ם',
      useCase: 'עורק תמסורת עירוני 10Gbps שריד בין אתרי העירייה',
    },
  },
  {
    id: 'ent-access-switch',
    nodeId: 'node-switching-vlan',
    type: 'hardware',
    title: 'מתג גישה Cisco Catalyst 9200 / Aruba CX 6200',
    category: 'מיתוג רשת',
    elevation: 250,
    hardwareSpecs: {
      model: 'Cisco C9200-24P-E (24 Ports PoE+ 370W, 4x 10G SFP+)',
      formFactor: '1U Chassis עם ספק כוח מודולרי כפול ומאווררים נשלפים',
      physicalPorts: '24x 1G RJ45 PoE+ + 4x 10G SFP+ Uplink + RJ45 Console',
      indicators: 'System LED (ירוק), Stat/Duplex/Speed/PoE נוריות לד לכל פורט',
      fieldNotes: 'שרידות מתח: ספק כוח שני מחובר לאל-פסק (UPS) בארון',
    },
    softwareSpecs: {
      protocol: '802.1Q VLAN Tagging, 802.1w Rapid-PVST+, LACP',
      layer: 'Layer 2 - Data Link',
      keyParameters: 'VLAN 10: Management, VLAN 20: Voice, VLAN 30: Cameras',
      cliCheck: 'show vlan brief | show interfaces trunk',
    },
    raananaContext: {
      site: 'ארון תקשורת בית הספר "אוסטרובסקי" רעננה',
      useCase: 'חלוקה מאובטחת בין רשת המנהלה, רשת המורים והמצלמות',
    },
  },
  {
    id: 'ent-core-router',
    nodeId: 'node-routing-gateway',
    type: 'hardware',
    title: 'מתג ליבה וניתוב L3 (Core Switch & Gateway)',
    category: 'ליבת הרשת',
    elevation: 250,
    hardwareSpecs: {
      model: 'Cisco Catalyst 9500 (32x 10G/25G SFP28 Core StackWise-Virtual)',
      formFactor: '1U Wire-rate Core Switch בחדר שרתים ראשי',
      physicalPorts: '32x 25G SFP28/10G SFP+ + QSFP+ 40G Stacking',
      indicators: 'Active/Standby VSS Heartbeat LED, PSU1/PSU2 OK',
      fieldNotes: 'מחובר ישירות לקווי התמסורת הבין-עירוניים בטופולוגיית טבעת',
    },
    softwareSpecs: {
      protocol: 'IPv4 Inter-VLAN Routing, SVI, HSRP/VRRP, OSPF Area 0',
      layer: 'Layer 3 - Network',
      keyParameters: 'Default Gateways: 10.24.10.1, 10.24.20.1, 10.24.30.1',
      cliCheck: 'show ip route | show standby brief',
    },
    raananaContext: {
      site: 'חדר השרתים המרכזי (MDF) - בניין העירייה אחוזה',
      useCase: 'ניתוב מרכזי בין כל 48 מבני הציבור בעיר',
    },
  },
  {
    id: 'ent-firewall',
    nodeId: 'node-firewall-nat',
    type: 'hardware',
    title: 'חומת אש הדור הבא FortiGate 100F Cluster (HA)',
    category: 'אבטחת מידע',
    elevation: 500,
    hardwareSpecs: {
      model: 'Fortinet FortiGate 100F Active-Passive Pair',
      formFactor: '1U Appliance עם מעבדי ASIC SoC4 ייעודיים',
      physicalPorts: '2x 10G SFP+ + 14x 1G RJ45 (WAN1, WAN2, DMZ, HA1, HA2)',
      indicators: 'HA Sync LED (ירוק יציב), WAN Status (לינק פעיל)',
      fieldNotes: 'חיבור HA מסונכרן בשני כבלי קרוס ייעודיים (Heartbeat)',
    },
    softwareSpecs: {
      protocol: 'Stateful Inspection, IPsec VPN, Source/Destination NAT, SSL-Inspection',
      layer: 'Layer 4-7 - Transport & Application Security',
      keyParameters: 'WAN1: בזק קווי 1Gbps, WAN2: סלקום סיבים 1Gbps עם Failover אוטומטי',
      cliCheck: 'get system ha status | diagnose sys session stat',
    },
    raananaContext: {
      site: 'שער היציאה לאינטרנט של עיריית רעננה',
      useCase: 'הגנה על שרתי העירייה, סינון גלישה ומנהרות VPN מאובטחות',
    },
  },
  {
    id: 'ent-prtg-monitor',
    nodeId: 'node-prtg-snmp',
    type: 'software',
    title: 'מערכת שו״ב וניטור עירונית PRTG Network Monitor',
    category: 'שו״ב ובקרה',
    elevation: 500,
    hardwareSpecs: {
      model: 'שרת VMware ESXi וירטואלי ייעודי עם 8GB vRAM / 4 vCPU',
      formFactor: 'Virtual Appliance בתוך תשתית הענן המקומית של רעננה',
      physicalPorts: 'vSwitch Uplink 10Gbps מחובר ל-VLAN 10 (Management)',
      indicators: 'דשבורד ירוק/אדום על מסכי קיר ה-NOC במוקד העירוני',
      fieldNotes: 'סורק 450 מתגים, נתבים, קווי תמסורת וארונות חוץ בכל רעננה',
    },
    softwareSpecs: {
      protocol: 'SNMPv2c/v3, WMI, Ping ICMP, sFlow, Syslog, Webhook Alerts',
      layer: 'Layer 7 - Management & Application',
      keyParameters: 'Community: raanana-ro, OID ifInOctets, ifOutOctets, Ping < 5ms',
      cliCheck: 'snmp-server community raanana-ro RO 10 | show snmp',
    },
    raananaContext: {
      site: 'חדר המבצעים וה-NOC במוקד 106',
      useCase: 'התרעה מיידית ב-SMS לצוות התקשורת על נפילת אתר או חיתוך סיב',
    },
  },
  {
    id: 'ent-lpr-endpoint',
    nodeId: 'node-lpr-cameras',
    type: 'endpoint',
    title: 'מצלמת אבטחה LPR וארון חוץ מוקשח NEMA',
    category: 'עיר חכמה',
    elevation: 750,
    hardwareSpecs: {
      model: 'Hikvision DarkFighter LPR 4K + מתג מוקשח Advantech DIN-Rail',
      formFactor: 'זיווד מוקשח IP67 על עמוד תאורה + ארון תקשורת אלומיניום חיצוני',
      physicalPorts: 'פורט RJ45 מוגן מתחי יתר (Surge Protector 10kV)',
      indicators: 'נוריות Link/PoE במתג החוץ, תאורת אינפרא-אדום (IR)',
      fieldNotes: 'טמפרטורת עבודה: -30°C עד +75°C, מאוורר תרמוסטט ופילטר אבק',
    },
    softwareSpecs: {
      protocol: 'RTSP (Real-Time Streaming Protocol 554), H.265+, 802.1X NAC',
      layer: 'Layer 7 Streaming / Layer 2 MAC Security',
      keyParameters: 'VLAN 30 (Security), Static IP: 10.24.30.155, 25 FPS, PoE+ 24W',
      cliCheck: 'show port-security interface gigabitEthernet 1/0/12',
    },
    raananaContext: {
      site: 'צומת רחוב אחוזה / שדרות ירושלים (כניסה לעיר)',
      useCase: 'זיהוי לוחיות רישוי בזמן אמת של רכבים חשודים והעברה למוקד',
    },
  },
  {
    id: 'ent-voip-moked',
    nodeId: 'node-moked-106-voip',
    type: 'endpoint',
    title: 'טלפוניית מוקד 106 ושרת מרכזיית IP (SIP Trunk)',
    category: 'טלפוניה ומוקד',
    elevation: 750,
    hardwareSpecs: {
      model: 'טלפון מוקדנים Cisco 8851 Gigabit IP Phone + שרת Cisco CUCM',
      formFactor: 'עמדת מוקדן עם אוזניות Jabra + מתג PoE עם סוללת גיבוי',
      physicalPorts: '2x 1G RJ45 (PC Passthrough + LAN PoE Port)',
      indicators: 'מסך צבעוני, נורית Ring/Message Waiting אדומה דולקת',
      fieldNotes: 'כבלי רשת Cat6A נפרדים מהתחנה כדי למנוע השפעת תעבורת נתונים',
    },
    softwareSpecs: {
      protocol: 'SIP (Session Initiation Protocol 5060), RTP (Voice Audio), Codec G.711u',
      layer: 'Layer 7 Application / Voice QoS (CoS 5, DSCP EF 46)',
      keyParameters: 'Voice VLAN 20, LLDP-MED, Jitter < 20ms, Packet Loss < 0.5%',
      cliCheck: 'show auto qos | show lldp info remote-device',
    },
    raananaContext: {
      site: 'מוקד 106 - מוקד החירום והביטחון ברחוב הרמב״ם 8',
      useCase: 'קבלת פניות תושבים 24/7 ללא ניתוקי שיחה גם בשעת עומס וחירום',
    },
  },
];

export const VisualHardwareSoftwareBlueprint: React.FC<VisualHardwareSoftwareBlueprintProps> = ({
  nodes,
  progress,
  onSelectNode,
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent-access-switch');
  const [activeTab, setActiveTab] = useState<'schematic' | 'mindmap' | 'packet_trace'>('schematic');
  
  // Tracing packet simulation states
  const [isTracing, setIsTracing] = useState(false);
  const [traceStep, setTraceStep] = useState<number>(0);
  const [traceScenario, setTraceScenario] = useState<'lpr' | 'moked' | 'citizen'>('lpr');

  const selectedEntity = useMemo(() => {
    return ARCHITECTURE_ENTITIES.find((e) => e.id === selectedEntityId) || ARCHITECTURE_ENTITIES[0];
  }, [selectedEntityId]);

  const linkedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedEntity.nodeId) || nodes[0];
  }, [nodes, selectedEntity]);

  const isCompleted = progress[selectedEntity.nodeId]?.completed;

  // Packet simulation scenarios
  const packetSteps = useMemo(() => {
    if (traceScenario === 'lpr') {
      return [
        {
          step: 1,
          entityId: 'ent-lpr-endpoint',
          title: 'שלב 1: מצלמת LPR בצומת אחוזה דוגמת לוחית רישוי',
          hardwareAction: 'חיישן ה-CMOS ממיר אור לתמונה דיגיטלית, מקודד ב-H.265 ויוצר חבילת Ethernet RJ45.',
          softwareAction: 'פרוטוקול RTSP מעביר מסגרת ב-VLAN 30 (אבטחה) עם כתובת IP 10.24.30.155.',
          layer: 'L1-L2 + L7 RTSP',
        },
        {
          step: 2,
          entityId: 'ent-passive-cabling',
          title: 'שלב 2: תווך הכבילה Cat6A והזנת PoE+',
          hardwareAction: 'הסיגנל עובר בכבל מסוכך S/FTP לאורך 65 מטר, מוגן מפני השראת רשת החשמל של עמודי התאורה.',
          softwareAction: 'מתח חשמלי 54V DC מוזרק ע"י המתג (802.3at) על גידי הנחושת במקביל לדאטה.',
          layer: 'L1 Physical Copper',
        },
        {
          step: 3,
          entityId: 'ent-access-switch',
          title: 'שלב 3: כניסה למתג גישה Cisco C9200',
          hardwareAction: 'פורט GigabitEthernet 1/0/12 קולט את הפולסים, נורית ה-LED מהבהבת בירוק.',
          softwareAction: 'בדיקת Port-Security: האם ה-MAC של המצלמה מורשה? המתג מצמיד תגית 802.1Q (VLAN 30).',
          layer: 'L2 Data Link / 802.1Q',
        },
        {
          step: 4,
          entityId: 'ent-fiber-odf',
          title: 'שלב 4: המרה אופטית במודול SFP+ ותמסורת ODF',
          hardwareAction: 'משדר הלייזר (1310nm DFB) במודול 10G SFP+ שולח פולסי אור בסיב Single-Mode צהוב.',
          softwareAction: 'מסגרת ה-Ethernet עוברת ברוחב פס 10Gbps ללא עומס או שיהוי (Latency < 0.2ms).',
          layer: 'L1 Optical Laser',
        },
        {
          step: 5,
          entityId: 'ent-core-router',
          title: 'שלב 5: ניתוב במתג ליבה Cisco Catalyst 9500',
          hardwareAction: 'מתג הליבה בודק את שדות כתובת היעד בטבלת הניתוב החומרתית (TCAM).',
          softwareAction: 'ניתוב Inter-VLAN: העברת הפקטה מ-VLAN 30 ל-VLAN 50 (שרתי וידאו ומוקד).',
          layer: 'L3 Network Routing',
        },
        {
          step: 6,
          entityId: 'ent-firewall',
          title: 'שלב 6: בדיקת אבטחה ב-FortiGate 100F',
          hardwareAction: 'מעבד האבטחה (SPU) בודק את פקודת הפוליסי תוך 8 מיקרו-שניות.',
          softwareAction: 'אישור תעבורה לפי חוק: "LPR_CAMERAS ➔ VMS_SERVERS Port 554 Allow + Log".',
          layer: 'L4 Stateful Firewall',
        },
        {
          step: 7,
          entityId: 'ent-prtg-monitor',
          title: 'שלב 7: ניטור התעבורה בזמן אמת ב-PRTG',
          hardwareAction: 'שרת הניטור מעדכן את שעון הספידומטר על גבי מסך ה-NOC המרכזי ברעננה.',
          softwareAction: 'חיישן SNMP מושך OID של Port 12 ומציג קצב תעבורה שוטף של 4.8 Mbps תקין לחלוטין.',
          layer: 'L7 PRTG SNMP Monitor',
        },
      ];
    }

    if (traceScenario === 'moked') {
      return [
        {
          step: 1,
          entityId: 'ent-voip-moked',
          title: 'שלב 1: הרמת שפופרת במוקד 106 (שיחת חירום)',
          hardwareAction: 'קודק אודיו ממיר גלי קול לדגימות PCM 64Kbps (G.711u) בקצב 8,000 פעמים בשנייה.',
          softwareAction: 'שליחת הודעת SIP INVITE לשרת המרכזייה בפורט UDP 5060, תיוג QoS DSCP EF (46).',
          layer: 'L7 SIP / Voice QoS',
        },
        {
          step: 2,
          entityId: 'ent-access-switch',
          title: 'שלב 2: מתג הגישה מעניק עדיפות קריטית (Auto-QoS)',
          hardwareAction: 'המתג מקצה תור עדיפות גבוה (Strict Priority Queue) לפקודת הקול.',
          softwareAction: 'שיחה מתויגת ל-Voice VLAN 20, תוך הפרדה מוחלטת מתעבורת הגלישה של מחשב המוקדן.',
          layer: 'L2 802.1p CoS 5',
        },
        {
          step: 3,
          entityId: 'ent-core-router',
          title: 'שלב 3: ניתוב לשרת המרכזייה המקומית ללא איבוד פקטות',
          hardwareAction: 'מתג הליבה מעביר את פקטות ה-RTP בזמן שיהוי מינימלי (Jitter < 3ms).',
          softwareAction: 'ערוץ שמע דו-כיווני נפתח מול שרת המוקד ומאפשר שיחה חלקה ללא קיטועים.',
          layer: 'L3-L4 UDP Voice RTP',
        },
        {
          step: 4,
          entityId: 'ent-prtg-monitor',
          title: 'שלב 4: מוקד השו״ב מנטר תקינות תור שיחות 106',
          hardwareAction: 'חיישן ה-PRTG מוודא זמינות SIP Trunk מול ספק התקשורת (בזק/סלקום).',
          softwareAction: 'מדד MOS (Mean Opinion Score) עומד על 4.35 (איכות שיחה מצוינת).',
          layer: 'L7 Quality Telephony',
        },
      ];
    }

    // Citizen scenario
    return [
      {
        step: 1,
        entityId: 'ent-passive-cabling',
        title: 'שלב 1: חיבור מחשב קבלת קהל לשקע RJ45',
        hardwareAction: 'כבל מגשר Cat6A כחול מחבר את עמדת הגבייה לשקע הקיר הממוספר A-14.',
        softwareAction: 'שכבה 1 מזהה קישוריות פיזית (Link Up 1000Mbps Full-Duplex).',
        layer: 'L1 Physical',
      },
      {
        step: 2,
        entityId: 'ent-access-switch',
        title: 'שלב 2: קבלת כתובת IP משרת ה-DHCP העירוני',
        hardwareAction: 'המתג קולט את פקטת ה-DHCP Discover ומפעיל DHCP Snooping Option 82.',
        softwareAction: 'העמדה מקבלת כתובת IP 10.24.10.45 עם שער ברירת מחדל 10.24.10.1 ו-DNS עירוני.',
        layer: 'L2-L3 DHCP Relay',
      },
      {
        step: 3,
        entityId: 'ent-firewall',
        title: 'שלב 3: גישה מאובטחת לשירות התשלומים הממשלתי',
        hardwareAction: 'חומת האש FortiGate מבצעת בדיקת תעודת SSL ו-NAT לכתובת אינטרנט חיצונית.',
        softwareAction: 'העובד גובה תשלום ארנונה מהתושב בביטחון מלא דרך ערוץ מוצפן.',
        layer: 'L4-L7 Security & NAT',
      },
    ];
  }, [traceScenario]);

  // Start animated trace
  const handleStartTrace = () => {
    audioFeedback.playSuccess();
    setIsTracing(true);
    setTraceStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= packetSteps.length) {
        clearInterval(interval);
        setIsTracing(false);
        audioFeedback.playChime();
      } else {
        setTraceStep(current);
        audioFeedback.playKeyClick();
      }
    }, 2400);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0B0F19] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-6 text-slate-200">
      
      {/* Top Architectural Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 border border-blue-400/40 flex items-center justify-center text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] shrink-0">
            <Cpu className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                עץ מידע ויזואלי: ארכיטקטורת חומרה ⟷ תוכנה בשטח
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                חיבור מוח-שטח טקטי
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              הבנת הקשר הישיר בין רכיבי החומרה הפיזיים (כבלי Cat6A, סיבים אופטיים, מתגי Cisco/Aruba, ארונות חוץ) לבין שכבות התוכנה, הפרוטוקולים (VLAN, STP, PRTG, SIP) ומערכות עיריית רעננה.
            </p>
          </div>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#141824] border border-white/10 shrink-0 self-start lg:self-auto">
          <button
            onClick={() => {
              audioFeedback.playKeyClick();
              setActiveTab('schematic');
            }}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'schematic'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>סכמת ארון וחומרה חיה</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playKeyClick();
              setActiveTab('mindmap');
            }}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mindmap'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>עץ מידע Mindmap מקושר</span>
          </button>

          <button
            onClick={() => {
              audioFeedback.playKeyClick();
              setActiveTab('packet_trace');
            }}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'packet_trace'
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>הדמיית פקטה מקצה לקצה</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE HARDWARE RACK & PHYSICAL SCHEMATIC                     */}
      {/* ========================================================================= */}
      {activeTab === 'schematic' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================================= */}
          {/* VISUAL 19" RACK CHASSIS (ארון התקשורת הויזואלי המודרני)                  */}
          {/* ======================================================================= */}
          <div className="xl:col-span-7 rounded-2xl bg-[#080B12] border-2 border-slate-700/80 p-4 sm:p-5 shadow-2xl relative space-y-4">
            
            {/* Top Rack Rails & Fan Header */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#101420] border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white tracking-wider">ארון תקשורת עירוני 19&quot; [RACK-01-RAANANA]</span>
              </div>
              <span className="text-[11px] text-blue-300 font-bold">230V AC • UPS ON-LINE • TEMP: 21°C</span>
            </div>

            {/* Vertical 19" Rack Units Stack */}
            <div className="space-y-3 font-mono text-xs">
              
              {/* UNIT 1: ODF FIBER DISTRIBUTION PANEL */}
              <div 
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedEntityId('ent-fiber-odf');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  selectedEntityId === 'ent-fiber-odf'
                    ? 'bg-[#0E1E28] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400'
                    : 'bg-[#0E121C] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-cyan-300 text-xs font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    1U: פנל סיבים אופטיים ODF (Single-Mode 9/125 + OM4)
                  </span>
                  <span className="text-[10px] bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">Rx: -3.8 dBm</span>
                </div>
                {/* 12 Duplex Optical Couplers Graphic */}
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 py-1 bg-black/50 p-2 rounded-lg border border-white/5">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-0.5">
                      <div className={`w-full h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                        idx < 4 
                          ? 'bg-blue-600 text-white' // LC Blue UPC Single Mode
                          : idx < 8 
                          ? 'bg-emerald-600 text-white' // SC Green APC Single Mode
                          : 'bg-teal-500 text-black' // OM4 Aqua Multi Mode
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-[8px] text-slate-500">{idx < 4 ? 'SM-LC' : idx < 8 ? 'SM-SC' : 'OM4'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* UNIT 2: CAT6A KEYSTONE PATCH PANEL */}
              <div 
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedEntityId('ent-passive-cabling');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  selectedEntityId === 'ent-passive-cabling'
                    ? 'bg-[#0E201B] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400'
                    : 'bg-[#0E121C] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    1U: פנל כבילה Cat6A מסוכך (24x Keystone Ports T568B)
                  </span>
                  <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">Fluke 500MHz PASS</span>
                </div>
                {/* 24 RJ45 Ports Graphic */}
                <div className="grid grid-cols-8 sm:grid-cols-12 gap-1 py-1 bg-black/50 p-2 rounded-lg border border-white/5">
                  {Array.from({ length: 24 }).map((_, idx) => (
                    <div key={idx} className="h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-slate-300 font-mono">
                      {idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* UNIT 3: ACCESS SWITCH CISCO CATALYST 9200 (ACTIVE) */}
              <div 
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedEntityId('ent-access-switch');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  selectedEntityId === 'ent-access-switch'
                    ? 'bg-[#101C30] border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-1 ring-blue-400'
                    : 'bg-[#0E121C] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-blue-300 text-xs font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    1U: מתג גישה Cisco Catalyst 9200-24P PoE+ (370W)
                  </span>
                  <span className="text-[10px] bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">24x PoE+ | 4x 10G SFP+</span>
                </div>
                {/* Switch Front Panel Ports Graphic */}
                <div className="flex flex-col gap-1 bg-[#06080E] p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>PORTS 1-24 PoE+ (VLAN 10/20/30)</span>
                    <span className="text-emerald-400 font-bold">PoE DRAW: 142W / 370W</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const isPortActive = idx % 2 === 0 || idx === 11 || idx === 19;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isPortActive ? 'bg-emerald-400 shadow-[0_0_4px_#10b981]' : 'bg-slate-700'}`} />
                          <div className={`w-full h-4 rounded border text-[8px] flex items-center justify-center font-mono ${
                            isPortActive ? 'bg-slate-800 border-slate-600 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-600'
                          }`}>
                            {idx + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* UNIT 4: CORE SWITCH CISCO CATALYST 9500 (L3 GATEWAY) */}
              <div 
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedEntityId('ent-core-router');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  selectedEntityId === 'ent-core-router'
                    ? 'bg-[#15132B] border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] ring-1 ring-purple-400'
                    : 'bg-[#0E121C] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-purple-300 text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    1U: מתג ליבה Cisco Catalyst 9500 (StackWise-Virtual 40G)
                  </span>
                  <span className="text-[10px] bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">HSRP / OSPF / SVI Core</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 bg-black/40 p-2 rounded border border-white/5">
                  <span>Routing Gateways: 10.24.10.1 (Data) • 10.24.20.1 (VoIP) • 10.24.30.1 (LPR)</span>
                  <span className="text-purple-300 font-bold">TCAM: OK</span>
                </div>
              </div>

              {/* UNIT 5: FIREWALL FORTIGATE 100F (HA CLUSTER) */}
              <div 
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedEntityId('ent-firewall');
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  selectedEntityId === 'ent-firewall'
                    ? 'bg-[#2A1310] border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] ring-1 ring-rose-400'
                    : 'bg-[#0E121C] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-rose-300 text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    1U: חומת אש FortiGate 100F Cluster (HA Active-Passive)
                  </span>
                  <span className="text-[10px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">WAN1 בזק 1G + WAN2 סלקום 1G</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 bg-black/40 p-2 rounded border border-white/5">
                  <span>Sessions: 14,280 • IPS: Active • SSL-Inspection: Enabled</span>
                  <span className="text-emerald-400 font-bold">HA: SYNCED</span>
                </div>
              </div>

            </div>

            {/* Bottom Outdoor & Municipal Endpoints Strip */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedEntityId('ent-lpr-endpoint');
                }}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 cursor-pointer ${
                  selectedEntityId === 'ent-lpr-endpoint'
                    ? 'bg-amber-500/20 border-amber-400 text-white'
                    : 'bg-[#0E121C] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold block truncate">מצלמות LPR וארון חוץ</span>
                  <span className="text-[10px] text-slate-400">צומת אחוזה / ירושלים</span>
                </div>
              </button>

              <button
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedEntityId('ent-voip-moked');
                }}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 cursor-pointer ${
                  selectedEntityId === 'ent-voip-moked'
                    ? 'bg-indigo-500/20 border-indigo-400 text-white'
                    : 'bg-[#0E121C] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold block truncate">טלפוניית מוקד 106</span>
                  <span className="text-[10px] text-slate-400">SIP Voice VLAN 20</span>
                </div>
              </button>

              <button
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedEntityId('ent-prtg-monitor');
                }}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 cursor-pointer ${
                  selectedEntityId === 'ent-prtg-monitor'
                    ? 'bg-blue-500/20 border-blue-400 text-white'
                    : 'bg-[#0E121C] border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] font-bold block truncate">שו״ב PRTG Network</span>
                  <span className="text-[10px] text-slate-400">450 חיישנים פעילים</span>
                </div>
              </button>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* FOCUSED HARDWARE ⟷ SOFTWARE LINKAGE INSPECTION CARD                     */}
          {/* ======================================================================= */}
          <div className="xl:col-span-5 rounded-2xl bg-[#0F1422] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-5">
            
            {/* Header of Selected Entity */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono font-bold">
                    גובה {selectedEntity.elevation}m
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{selectedEntity.category}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-tight leading-snug">
                  {selectedEntity.title}
                </h3>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
                <Server className="w-5 h-5" />
              </div>
            </div>

            {/* SIDE-BY-SIDE: HARDWARE SPECIFICATIONS vs SOFTWARE PROTOCOL */}
            <div className="grid grid-cols-1 gap-3.5 text-xs">
              
              {/* Hardware Specifications Box */}
              <div className="p-4 rounded-xl bg-black/40 border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>מה רואים בארון ובשטח (חומרה פיזית):</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">דגם/תצורה:</span>
                    <span className="font-mono font-semibold text-white">{selectedEntity.hardwareSpecs.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">פורטים פיזיים:</span>
                    <span className="font-mono text-slate-200">{selectedEntity.hardwareSpecs.physicalPorts}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">נוריות/אינדיקטור:</span>
                    <span className="text-emerald-400 font-mono">{selectedEntity.hardwareSpecs.indicators}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                    <strong className="text-slate-300">דגש שטח: </strong>
                    {selectedEntity.hardwareSpecs.fieldNotes}
                  </p>
                </div>
              </div>

              {/* Software Specifications Box */}
              <div className="p-4 rounded-xl bg-[#091522] border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Layers className="w-4 h-4" />
                  <span>מה קורה בתוכנה ובפרוטוקול (לוגיקה ורשת):</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">שכבת OSI:</span>
                    <span className="font-mono font-bold text-cyan-400">{selectedEntity.softwareSpecs.layer}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">פרוטוקול ראשי:</span>
                    <span className="font-mono font-semibold text-white">{selectedEntity.softwareSpecs.protocol}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">פרמטרים קריטיים:</span>
                    <span className="font-mono text-slate-200">{selectedEntity.softwareSpecs.keyParameters}</span>
                  </div>
                  <div className="pt-1.5">
                    <span className="text-slate-400 block mb-1">פקודת CLI לבדיקה חיה בשטח:</span>
                    <code className="block p-2 rounded bg-black font-mono text-[11px] text-cyan-300 border border-slate-700">
                      {selectedEntity.softwareSpecs.cliCheck}
                    </code>
                  </div>
                </div>
              </div>

              {/* Municipal Field Context Box */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/25 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-300 block text-xs">
                    יישום בשטח עיריית רעננה ({selectedEntity.raananaContext.site}):
                  </span>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    {selectedEntity.raananaContext.useCase}
                  </p>
                </div>
              </div>

            </div>

            {/* Action Bar & Link to Lesson Node */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs font-mono">
                {isCompleted ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    מודול הושלם במערכת
                  </span>
                ) : (
                  <span className="text-blue-400 font-bold flex items-center gap-1">
                    <Zap className="w-4 h-4 animate-pulse" />
                    מוכן לתרגול מעשי
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  audioFeedback.playKeyClick();
                  onSelectNode(linkedNode);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)] cursor-pointer active:scale-95"
              >
                <span>פתח מודול לימוד מלא</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: VISUAL NETWORK MINDMAP (עץ מידע ויזואלי מקושר)                      */}
      {/* ========================================================================= */}
      {activeTab === 'mindmap' && (
        <div className="rounded-2xl bg-[#080B12] border border-white/10 p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-400" />
                <span>מפת קשרים ענפית: מתשתיות שטח פסיביות ועד לשירותי עיר חכמה</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                תרשים היררכי הממפה כיצד כל שכבת חומרה מזינה את שכבת התוכנה שמעליה ברשת עיריית רעננה
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              L1 Physical ➔ L2 Switching ➔ L3 Routing ➔ L4 Security ➔ L7 Applications
            </span>
          </div>

          {/* Connected Tree Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Pillar 1: Physical Foundation */}
            <div className="p-4 rounded-2xl bg-[#0B1516] border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-emerald-500/20 pb-2">
                <Cable className="w-4 h-4" />
                <span>1. שכבת תשתית וחומרה (L1)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                הבסיס הפיזי של הרשת: סיבים אופטיים וכבלי Cat6A מסוככים.
              </p>
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div 
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setSelectedEntityId('ent-passive-cabling');
                    setActiveTab('schematic');
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-slate-800 hover:border-emerald-400 cursor-pointer transition-all"
                >
                  <span className="text-emerald-300 font-bold block">כבילת Cat6A & Keystone</span>
                  <span className="text-[10px] text-slate-400">חיווט T568B, PoE 30W/60W</span>
                </div>
                <div 
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setSelectedEntityId('ent-fiber-odf');
                    setActiveTab('schematic');
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-slate-800 hover:border-cyan-400 cursor-pointer transition-all"
                >
                  <span className="text-cyan-300 font-bold block">סיבים אופטיים ומגירת ODF</span>
                  <span className="text-[10px] text-slate-400">SM 9/125, OM4, SFP+ 10G</span>
                </div>
              </div>
            </div>

            {/* Pillar 2: Active Switching & VLANs */}
            <div className="p-4 rounded-2xl bg-[#091526] border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm border-b border-blue-500/20 pb-2">
                <Network className="w-4 h-4" />
                <span>2. מיתוג ורשתות לוגיות (L2)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                הפרדת תעבורה, מניעת לולאות והעברת מסגרות Ethernet.
              </p>
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div 
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setSelectedEntityId('ent-access-switch');
                    setActiveTab('schematic');
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-slate-800 hover:border-blue-400 cursor-pointer transition-all"
                >
                  <span className="text-blue-300 font-bold block">Cisco C9200 / Aruba CX</span>
                  <span className="text-[10px] text-slate-400">802.1Q VLANs 10, 20, 30</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="text-blue-300 font-bold block">Rapid Spanning Tree</span>
                  <span className="text-[10px] text-slate-400">מניעת לולאות (BPDU Guard)</span>
                </div>
              </div>
            </div>

            {/* Pillar 3: Routing & Gateway */}
            <div className="p-4 rounded-2xl bg-[#140F26] border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm border-b border-purple-500/20 pb-2">
                <Server className="w-4 h-4" />
                <span>3. ליבת הרשת וניתוב (L3)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                קישוריות בין סאבנטים עירוניים ושערי ברירת מחדל.
              </p>
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div 
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setSelectedEntityId('ent-core-router');
                    setActiveTab('schematic');
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-slate-800 hover:border-purple-400 cursor-pointer transition-all"
                >
                  <span className="text-purple-300 font-bold block">Cisco C9500 Stack Core</span>
                  <span className="text-[10px] text-slate-400">Inter-VLAN Routing, OSPF</span>
                </div>
                <div 
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setSelectedEntityId('ent-firewall');
                    setActiveTab('schematic');
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-slate-800 hover:border-rose-400 cursor-pointer transition-all"
                >
                  <span className="text-rose-300 font-bold block">FortiGate 100F HA</span>
                  <span className="text-[10px] text-slate-400">WAN Redundancy, NAT, ACL</span>
                </div>
              </div>
            </div>

            {/* Pillar 4: Municipal Operations & Endpoints */}
            <div className="p-4 rounded-2xl bg-[#22170A] border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-amber-500/20 pb-2">
                <Radio className="w-4 h-4" />
                <span>4. שו״ב ורכיבי קצה (L7)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                השירותים העירוניים הפועלים מעל התשתית והחומרה.
              </p>
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div 
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setSelectedEntityId('ent-prtg-monitor');
                    setActiveTab('schematic');
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-slate-800 hover:border-blue-400 cursor-pointer transition-all"
                >
                  <span className="text-blue-300 font-bold block">שו״ב PRTG Network</span>
                  <span className="text-[10px] text-slate-400">ניטור SNMP OIDs, התרעות</span>
                </div>
                <div 
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setSelectedEntityId('ent-lpr-endpoint');
                    setActiveTab('schematic');
                  }}
                  className="p-2.5 rounded-xl bg-black/40 border border-slate-800 hover:border-amber-400 cursor-pointer transition-all"
                >
                  <span className="text-amber-300 font-bold block">מצלמות LPR וארון חוץ</span>
                  <span className="text-[10px] text-slate-400">RTSP 554, NEMA מוקשח</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: END-TO-END PACKET TRACE SIMULATOR (הדמיית פקטה חומרה ➔ תוכנה)       */}
      {/* ========================================================================= */}
      {activeTab === 'packet_trace' && (
        <div className="rounded-2xl bg-[#080C14] border border-white/10 p-5 sm:p-6 shadow-xl space-y-6">
          
          {/* Header & Scenario Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>הדמיית תנועת פקטה מקצה לקצה: חיבור חומרה לתוכנה</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                צפה כיצד ביט חשמלי או אופטי הופך לפקטת רשת, מקבל תגית VLAN, מנותב דרך הליבה ונרשם בשו״ב
              </p>
            </div>

            {/* Scenario Selection Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setTraceScenario('lpr');
                  setTraceStep(0);
                  setIsTracing(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  traceScenario === 'lpr' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                תרחיש LPR עיר חכמה
              </button>
              <button
                onClick={() => {
                  setTraceScenario('moked');
                  setTraceStep(0);
                  setIsTracing(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  traceScenario === 'moked' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                תרחיש טלפוניית 106
              </button>
              <button
                onClick={() => {
                  setTraceScenario('citizen');
                  setTraceStep(0);
                  setIsTracing(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  traceScenario === 'citizen' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                תרחיש קבלת קהל
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#101524] border border-white/10">
            <div className="flex items-center gap-3">
              <button
                disabled={isTracing}
                onClick={handleStartTrace}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isTracing ? 'הזרמת פקטה בתהליך...' : 'הפעל הדמיית תנועת פקטה'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTracing(false);
                  setTraceStep(0);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>איפוס</span>
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400">
              שלב {traceStep + 1} מתוך {packetSteps.length}
            </span>
          </div>

          {/* Active Step Display */}
          <div className="space-y-3">
            {packetSteps.map((step, idx) => {
              const isCurrent = traceStep === idx;
              const isPassed = traceStep > idx;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-950/40 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)] ring-1 ring-blue-400 scale-[1.01]'
                      : isPassed
                      ? 'bg-[#0E1520] border-emerald-500/40 text-slate-300'
                      : 'bg-[#0B0E17] border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isCurrent ? 'bg-blue-500 text-white animate-pulse' : isPassed ? 'bg-emerald-500 text-black font-bold' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {step.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-blue-300 px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      {step.layer}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2.5">
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                      <span className="text-blue-300 font-bold block mb-1">פעולת חומרה בשטח:</span>
                      <p className="text-slate-300 leading-relaxed">{step.hardwareAction}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#091522] border border-cyan-500/20">
                      <span className="text-cyan-300 font-bold block mb-1">פעולת תוכנה ופרוטוקול:</span>
                      <p className="text-slate-300 leading-relaxed">{step.softwareAction}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
