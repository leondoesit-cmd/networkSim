export type Lang = 'he' | 'en';

export interface Copy {
  he: string;
  en: string;
}

export type OsiLayer = 'L1' | 'L2' | 'L3' | 'L4' | 'L7';
export type SiteStatus = 'critical' | 'degraded' | 'watch' | 'ok';
export type SiteKind = 'core' | 'dispatch' | 'cabinet' | 'campus' | 'isp' | 'park' | 'floor';
export type LinkMedia = 'fiber' | 'radio' | 'copper' | 'metro';
export type LinkStatus = 'up' | 'degraded' | 'down';

export interface CaseSite {
  id: string;
  kind: SiteKind;
  x: number;
  y: number;
  name: Copy;
  short: Copy;
  subnet: string;
  vlan: string;
  hardware: Copy;
  status: SiteStatus;
}

export interface CaseLink {
  id: string;
  from: string;
  to: string;
  media: LinkMedia;
  label: string;
  status: LinkStatus;
}

export interface CaseSymptom {
  id: string;
  clock: string;
  title: Copy;
  ticket: Copy;
  relatedNodeIds: string[];
}

export interface CaseStage {
  id: string;
  clock: string;
  title: Copy;
  narration: Copy;
  move: Copy;
  focusSiteIds: string[];
  primaryNodeIds: string[];
  layerFocus: OsiLayer[];
}

export interface CaseTriageOption {
  id: string;
  label: Copy;
  isCorrect: boolean;
  isCatastrophic?: boolean;
  consequence: Copy;
  resolvedSites?: string[];
  scoreDelta: number; // e.g. +15 for correct, -10 for naive, -25 for catastrophic
}

export interface CaseTriageDilemma {
  stageId: string;
  question: Copy;
  options: CaseTriageOption[];
}

export interface CaseTopicRole {
  nodeId: string;
  osiLayers: OsiLayer[];
  siteIds: string[];
  homeStageId: string;
  pinLabel: Copy;
  headline: Copy;
  inThisCase: Copy;
  withoutThis: Copy;
  cli: { command: string; meaning: Copy };
}

export function tx(lang: Lang, copy: Copy): string {
  return lang === 'en' ? copy.en : copy.he;
}

export const OSI_META: Record<OsiLayer, { name: Copy; short: string }> = {
  L1: { short: 'L1', name: { he: 'פיזי', en: 'Physical' } },
  L2: { short: 'L2', name: { he: 'קישור', en: 'Data Link' } },
  L3: { short: 'L3', name: { he: 'רשת', en: 'Network' } },
  L4: { short: 'L4', name: { he: 'תחבורה', en: 'Transport' } },
  L7: { short: 'L7', name: { he: 'יישום', en: 'Application' } },
};

export const LIVING_CASE = {
  id: 'ahuza-cascade-sunday',
  kicker: { he: 'תרחיש שטח אחד · כל נושא המסלול פועל בתוכו', en: 'One field case · every topic on the path is acting inside it' },
  title: { he: 'ראשון 07:14 — מפל אחוזה', en: 'Sunday 07:14 — The Ahuza Cascade' },
  lede: {
    he: 'ארבע מצלמות LPR כבו, מוקד 106 נשמע רובוטי, אגף הנדסה מת, עמדות חדשות תקועות על 169.254, והאינטרנט בעירייה זוחל. חמש קריאות. בוקר אחד. מפל אחד.',
    en: 'Four LPR cameras go dark, Dispatch 106 sounds robotic, Engineering is dead, new PCs sit on 169.254, and City Hall internet crawls. Five tickets. One morning. One cascade.',
  },
  stakes: {
    he: 'שיטור עירוני עיוור בכניסה המזרחית. מוקד חירום עם שמע מקוטע. אגף שלם בלי שרטוטים. אם מאתחלים את הליבה — מחמירים את כולם בבת אחת.',
    en: 'Municipal policing is blind at the east gate. Emergency audio is tearing. A whole department has no drawings. Reboot the core and you make every ticket worse at once.',
  },
  sites: [
    {
      id: 'isp',
      kind: 'isp',
      x: 50,
      y: 9,
      name: { he: 'שער אינטרנט כפול', en: 'Dual ISP edge' },
      short: { he: 'ISP', en: 'ISP' },
      subnet: '194.90.150.0/29',
      vlan: 'WAN',
      hardware: { he: 'FortiGate 200F HA · בזק 1G + סלקום 1G', en: 'FortiGate 200F HA · Bezeq 1G + Cellcom 1G' },
      status: 'degraded',
    },
    {
      id: 'core',
      kind: 'core',
      x: 50,
      y: 40,
      name: { he: 'חדר שרתים · אחוזה 103', en: 'Core DC · Ahuza 103' },
      short: { he: 'ליבה', en: 'Core' },
      subnet: '10.24.10.0/24',
      vlan: '10',
      hardware: { he: 'Catalyst 9500 SV · PRTG · CUCM · DHCP', en: 'Catalyst 9500 SV · PRTG · CUCM · DHCP' },
      status: 'degraded',
    },
    {
      id: 'moked',
      kind: 'dispatch',
      x: 80,
      y: 20,
      name: { he: 'מוקד 106', en: 'Dispatch 106' },
      short: { he: '106', en: '106' },
      subnet: '10.24.30.0/24',
      vlan: '30',
      hardware: { he: 'C9300-48P · 20 שלוחות SIP', en: 'C9300-48P · 20 SIP sets' },
      status: 'critical',
    },
    {
      id: 'weizmann',
      kind: 'cabinet',
      x: 88,
      y: 52,
      name: { he: 'ארון חוץ · אחוזה / ויצמן', en: 'Street cabinet · Ahuza / Weizmann' },
      short: { he: 'LPR', en: 'LPR' },
      subnet: '10.24.50.0/28',
      vlan: '50',
      hardware: { he: 'Moxa IE · 4× Axis LPR · PoE 120W', en: 'Moxa IE · 4× Axis LPR · 120W PoE' },
      status: 'critical',
    },
    {
      id: 'engineering',
      kind: 'floor',
      x: 68,
      y: 78,
      name: { he: 'אגף הנדסה · קומה 2', en: 'Engineering · floor 2' },
      short: { he: 'הנדסה', en: 'Eng' },
      subnet: '10.24.20.0/24',
      vlan: '20',
      hardware: { he: 'C9200 Access · BPDU Guard כבוי', en: 'C9200 Access · BPDU Guard off' },
      status: 'critical',
    },
    {
      id: 'park',
      kind: 'park',
      x: 12,
      y: 58,
      name: { he: 'פארק רעננה', en: 'Ra\'anana Park' },
      short: { he: 'פארק', en: 'Park' },
      subnet: '10.24.60.0/24',
      vlan: '60',
      hardware: { he: 'Aruba CX · PtP 60GHz מוכן', en: 'Aruba CX · 60GHz PtP standing by' },
      status: 'ok',
    },
    {
      id: 'school',
      kind: 'campus',
      x: 30,
      y: 86,
      name: { he: 'תיכון אוסטרובסקי', en: 'Ostrovsky High' },
      short: { he: 'חינוך', en: 'School' },
      subnet: '10.24.40.0/22',
      vlan: '40',
      hardware: { he: 'Metro-E בזק · גיבוי סלולר', en: 'Bezeq Metro-E · LTE failover' },
      status: 'watch',
    },
    {
      id: 'club',
      kind: 'park',
      x: 12,
      y: 22,
      name: { he: 'קאנטרי', en: 'Country Club' },
      short: { he: 'קאנטרי', en: 'Club' },
      subnet: '10.24.45.0/24',
      vlan: '45',
      hardware: { he: 'קישור רדיו 60GHz לגג התחזוקה', en: '60GHz radio to maintenance roof' },
      status: 'ok',
    },
  ] satisfies CaseSite[],
  links: [
    { id: 'e1', from: 'isp', to: 'core', media: 'fiber', label: '10G', status: 'degraded' },
    { id: 'e2', from: 'core', to: 'moked', media: 'fiber', label: '10G', status: 'up' },
    { id: 'e3', from: 'core', to: 'weizmann', media: 'fiber', label: '1G SM', status: 'up' },
    { id: 'e4', from: 'core', to: 'engineering', media: 'copper', label: 'Cu', status: 'down' },
    { id: 'e5', from: 'core', to: 'park', media: 'fiber', label: '10G', status: 'degraded' },
    { id: 'e6', from: 'core', to: 'school', media: 'metro', label: 'Metro-E', status: 'up' },
    { id: 'e7', from: 'core', to: 'club', media: 'radio', label: '60GHz', status: 'up' },
    { id: 'e8', from: 'park', to: 'school', media: 'fiber', label: 'Ring', status: 'up' },
    { id: 'e9', from: 'moked', to: 'engineering', media: 'copper', label: 'Bldg', status: 'degraded' },
  ] satisfies CaseLink[],
  symptoms: [
    {
      id: 'sym-lpr',
      clock: '06:52',
      title: { he: 'LPR כבוי', en: 'LPR dark' },
      ticket: { he: '4 מצלמות לוחיות בצומת ויצמן Offline ב-PRTG', en: '4 plate cameras at Weizmann Offline in PRTG' },
      relatedNodeIds: [
        'node-racks-edge-poe',
        'node-smart-city-cctv-iot',
        'node-passive-fiber-cables',
        'node-ip-subnetting',
        'node-switching-vlans',
        'node-monitoring-prtg-snmp',
      ],
    },
    {
      id: 'sym-voice',
      clock: '07:02',
      title: { he: '106 מקוטע', en: '106 clipping' },
      ticket: { he: 'שמע רובוטי וניתוקים אחרי 20 שניות במוקד', en: 'Robotic audio and drops after 20s at dispatch' },
      relatedNodeIds: [
        'node-voip-telephony-sip',
        'node-internet-routing-nat',
        'node-switching-vlans',
        'node-monitoring-prtg-snmp',
      ],
    },
    {
      id: 'sym-loop',
      clock: '07:08',
      title: { he: 'הנדסה מתה', en: 'Engineering dead' },
      ticket: { he: 'נוריות המתג מהבהבות בטירוף, Timeout בכל העמדות', en: 'Switch LEDs thrashing, timeouts on every desk' },
      relatedNodeIds: [
        'node-redundancy-stp',
        'node-cybersecurity-hardening',
        'node-field-troubleshooting-methodology',
        'node-cli-toolset-diagnostics',
      ],
    },
    {
      id: 'sym-apipa',
      clock: '07:11',
      title: { he: 'APIPA ב-106', en: '106 APIPA' },
      ticket: { he: '3 עמדות חדשות תקועות על 169.254.x.x', en: '3 new desks stuck on 169.254.x.x' },
      relatedNodeIds: [
        'node-core-dhcp-dns-ntp',
        'node-ip-subnetting',
        'node-switching-vlans',
        'node-osi-tcp',
      ],
    },
    {
      id: 'sym-wan',
      clock: '07:14',
      title: { he: 'אינטרנט זוחל', en: 'Internet crawl' },
      ticket: { he: 'אתרי ממשלה ומערכת ארנונה לא נטענים', en: 'Gov sites and arnona payments will not load' },
      relatedNodeIds: [
        'node-internet-routing-nat',
        'node-wan-metro-sites',
        'node-vendor-management-sla',
        'node-wireless-ptp-links',
      ],
    },
  ] satisfies CaseSymptom[],
  stages: [
    {
      id: 'intake',
      clock: '07:14',
      title: { he: 'קליטה · אל תאתחל', en: 'Intake · do not reboot' },
      narration: {
        he: 'חמש קריאות נפתחו ב־22 דקות. המתחיל יאתחל את מתג הליבה. דרג ב׳ קורא את לוח PRTG: הטמפרטורה בארון ויצמן עלתה ב־06:41, ה-PoE נגמר ב־06:52, MOS של 106 נפל ב־07:02, שידורי Broadcast בהנדסה ב־07:08. אלה לא חמש תקלות. זה מפל.',
        en: 'Five tickets in 22 minutes. A junior reboots the core. Level II reads the PRTG wall: cabinet temperature rose at 06:41, PoE died at 06:52, 106 MOS fell at 07:02, broadcasts exploded in Engineering at 07:08. Not five faults. A cascade.',
      },
      move: {
        he: 'מחלקים לפי שכבות OSI. פינג למתג ויצמן, ל-SVI של 106, ולשער של הנדסה — שלוש תשובות שונות, שלושה כיוונים.',
        en: 'Split by OSI. Ping the Weizmann switch, the 106 SVI, and Engineering gateway — three different answers, three directions.',
      },
      focusSiteIds: ['core', 'weizmann', 'moked', 'engineering', 'isp'],
      primaryNodeIds: ['node-field-troubleshooting-methodology', 'node-osi-tcp', 'node-monitoring-prtg-snmp'],
      layerFocus: ['L1', 'L2', 'L3', 'L4', 'L7'],
    },
    {
      id: 'cameras',
      clock: '06:52',
      title: { he: 'המצלמות · המתג חי', en: 'Cameras · the switch is alive' },
      narration: {
        he: 'פינג ל־10.24.50.1 חוזר ב־1.5ms. הסיב תקין. Rx ‎-4.8 dBm. ארבע המצלמות ב־VLAN 50 /28 כבו כי גופי החימום בלילה דחפו את תקציב ה־PoE של 120W. המתג התעשייתי הגן על עצמו והפיל פורטים.',
        en: 'Ping to 10.24.50.1 returns in 1.5ms. Fiber is fine. Rx −4.8 dBm. The four cameras on VLAN 50 /28 died because night heaters pushed the 120W PoE budget over the edge. The industrial switch protected itself and killed ports.',
      },
      move: {
        he: 'show power inline לפני שמזמינים בזק. לא מחליפים סיב על ארון שפשוט נגמר לו הוואט.',
        en: 'show power inline before you call Bezeq. Do not splice fiber on a cabinet that simply ran out of watts.',
      },
      focusSiteIds: ['weizmann', 'core'],
      primaryNodeIds: [
        'node-racks-edge-poe',
        'node-smart-city-cctv-iot',
        'node-passive-fiber-cables',
        'node-ip-subnetting',
        'node-switching-vlans',
      ],
      layerFocus: ['L1', 'L2', 'L3'],
    },
    {
      id: 'voice',
      clock: '07:02',
      title: { he: 'הקול · תור בלי עדיפות', en: 'Voice · a queue with no priority' },
      narration: {
        he: 'גיבוי שרתי הגבייה מציף את Gi0/48 ב־98%. מתג הקומה של 106 הוחלף בשבוע שעבר — QoS כבוי, FIFO. חבילות RTP עם DSCP EF 46 נזרקות יחד עם הגיבוי. SIP עדיין מצלצל; השמע נקרע.',
        en: 'Billing-server backup floods Gi0/48 at 98%. The 106 floor switch was replaced last week — QoS off, FIFO. RTP marked DSCP EF 46 is dropped with the backup. SIP still rings; audio tears.',
      },
      move: {
        he: 'מפרידים סימון (SIP) מזרם (RTP), מדליקים mls qos trust dscp, וחותכים את הגיבוי ב־shaping לפני שהוא אוכל את קו ה־NAT.',
        en: 'Separate signaling (SIP) from media (RTP), turn on mls qos trust dscp, and shape the backup before it eats the NAT uplink.',
      },
      focusSiteIds: ['moked', 'core', 'isp'],
      primaryNodeIds: ['node-voip-telephony-sip', 'node-internet-routing-nat', 'node-switching-vlans'],
      layerFocus: ['L2', 'L3', 'L4', 'L7'],
    },
    {
      id: 'storm',
      clock: '07:08',
      title: { he: 'הלולאה · מעבד ב־99%', en: 'The loop · CPU at 99%' },
      narration: {
        he: 'עובד חדש חיבר סוויץ׳ ביתי לשני שקעים. Ethernet בלי TTL. סופת Broadcast. CPU של מתג הקומה 99%. BPDU Guard לא היה על פורטי הגישה. במסדרון מישהו גם שלף קיוסק וחיבר לפטופ — Port Security תפס, אבל זה רעש ליד הלולאה.',
        en: 'A new hire bridged a home switch across two wall jacks. Ethernet has no TTL. Broadcast storm. Floor-switch CPU 99%. BPDU Guard was never on access ports. In the corridor someone also unplugged a kiosk and jacked a laptop — Port Security caught it, but that is noise beside the loop.',
      },
      move: {
        he: 'כיבוי Gi0/14, storm-control, bpduguard על כל Access. לא נוגעים בליבה עד שהלולאה מתה.',
        en: 'Shut Gi0/14, storm-control, bpduguard on every access port. Do not touch the core until the loop is dead.',
      },
      focusSiteIds: ['engineering', 'core'],
      primaryNodeIds: [
        'node-redundancy-stp',
        'node-cybersecurity-hardening',
        'node-cli-toolset-diagnostics',
      ],
      layerFocus: ['L2'],
    },
    {
      id: 'identity',
      clock: '07:11',
      title: { he: 'הזהות · Helper חסר', en: 'Identity · missing helper' },
      narration: {
        he: 'שלוש עמדות חדשות במוקד שויכו ל־VLAN 40. Broadcast של DHCP לא חוצה SVI. חסר ip helper-address. APIPA זה לא "אין כבל" — זה L1/L2 חיים בלי L3. שעון המצלמות חייב NTP; בלי זה תמונת LPR לא תעמוד בבית משפט.',
        en: 'Three new dispatch desks were placed in VLAN 40. DHCP broadcast does not cross an SVI. ip helper-address was never added. APIPA is not "no cable" — it is live L1/L2 with a dead L3. Camera clocks need NTP; without it an LPR still will not stand in court.',
      },
      move: {
        he: 'מוסיפים helper על SVI 40, בודקים Scope, ומוודאים NTP מול אותה מקור זמן של VMS והמשטרה.',
        en: 'Add helper on SVI 40, check the scope, and verify NTP against the same time source as the VMS and police.',
      },
      focusSiteIds: ['moked', 'core'],
      primaryNodeIds: ['node-core-dhcp-dns-ntp', 'node-ip-subnetting', 'node-osi-tcp'],
      layerFocus: ['L2', 'L3', 'L7'],
    },
    {
      id: 'paths',
      clock: '07:18',
      title: { he: 'הנתיבים · אל תפתח SLA על PoE', en: 'Paths · do not burn SLA on PoE' },
      narration: {
        he: 'בזק יגידו שה־Metro תקין. הם צודקים. הסיב לוויצמן חי. קישור ה־60GHz לפארק עומד כגיבוי — אם מפילים עליו בטעות את מצלמות ה־4K בזמן שהבעיה היא ספק 120W, חונקים גם את הקאנטרי. CRC על אפלינק הפארק הוא מחבר מלוכלך, לא חיתוך.',
        en: 'Bezeq will say Metro is fine. They are right. Fiber to Weizmann is up. The 60GHz park radio is standing by — fail 4K cameras onto it by mistake while the real fault is a 120W PSU, and you choke the club too. CRC on the park uplink is a dirty connector, not a cut.',
      },
      move: {
        he: 'מציגים לוגים, dBm וגרף PRTG. SLA של 4 שעות נשמר לניתוק ספק אמיתי, לא לארון שטח.',
        en: 'Show logs, dBm, and the PRTG graph. A 4-hour SLA is for a real carrier cut, not a street cabinet.',
      },
      focusSiteIds: ['isp', 'school', 'park', 'club', 'weizmann'],
      primaryNodeIds: [
        'node-wan-metro-sites',
        'node-wireless-ptp-links',
        'node-vendor-management-sla',
        'node-passive-fiber-cables',
      ],
      layerFocus: ['L1', 'L3'],
    },
    {
      id: 'close',
      clock: '07:40',
      title: { he: 'סגירה · ראיות ב־CLI', en: 'Close · evidence in the CLI' },
      narration: {
        he: 'כל נושא במסלול כבר דיבר. עכשיו אוספים: power inline, logging, cpu, qos, helper, mac, cdp. מחזירים PoE, מדליקים QoS, הורגים לולאה, מוסיפים helper, מנקים מחבר, משדרגים ספק, כותבים לרשומה. הבוקר הזה הוא המשרה.',
        en: 'Every topic on the path has already spoken. Now collect: power inline, logging, cpu, qos, helper, mac, cdp. Restore PoE, enable QoS, kill the loop, add helper, clean the ferrule, upgrade the PSU, write it down. This morning is the job.',
      },
      move: {
        he: 'דו״ח אחד: חמש קריאות, מפל אחד, שבעה מנגנונים, בלי קריאת ספק מיותרת.',
        en: 'One report: five tickets, one cascade, seven mechanisms, no wasted carrier call.',
      },
      focusSiteIds: ['core', 'weizmann', 'moked', 'engineering', 'isp'],
      primaryNodeIds: ['node-cli-toolset-diagnostics', 'node-field-troubleshooting-methodology', 'node-vendor-management-sla'],
      layerFocus: ['L1', 'L2', 'L3', 'L4', 'L7'],
    },
  ] satisfies CaseStage[],
  topics: [
    {
      nodeId: 'node-osi-tcp',
      osiLayers: ['L1', 'L2', 'L3', 'L4', 'L7'],
      siteIds: ['core', 'weizmann', 'moked', 'engineering'],
      homeStageId: 'intake',
      pinLabel: { he: 'OSI', en: 'OSI' },
      headline: { he: 'חמש הקריאות יושבות על שכבות שונות של אותו בוקר', en: 'The five tickets sit on different layers of the same morning' },
      inThisCase: {
        he: '״הכל למטה״ הוא לא אבחנה. LPR זה L1 (PoE). הלולאה זה L2. APIPA זה L3. קיטוע 106 זה L4/L7 (RTP/SIP). בלי המודל מערבבים סיב, מתג ומרכזייה לאותו אתחול.',
        en: '"Everything is down" is not a diagnosis. LPR is L1 (PoE). The loop is L2. APIPA is L3. 106 clipping is L4/L7 (RTP/SIP). Without the model you reboot fiber, switch, and PBX as if they were one thing.',
      },
      withoutThis: {
        he: 'רצים לארון הלא נכון ומחליפים כבל בזמן שמעבד המתג נחנק.',
        en: 'You run to the wrong cabinet and swap a patch cord while the switch CPU is choking.',
      },
      cli: {
        command: 'ping 10.24.50.1 && ping 10.24.30.1 && ping 10.24.20.1',
        meaning: { he: 'שלושה פינגים — שלוש תשובות — שלוש שכבות', en: 'Three pings — three answers — three layers' },
      },
    },
    {
      nodeId: 'node-ip-subnetting',
      osiLayers: ['L3'],
      siteIds: ['weizmann', 'moked', 'engineering'],
      homeStageId: 'cameras',
      pinLabel: { he: 'CIDR', en: 'CIDR' },
      headline: { he: 'המצלמות חיות ב־/28; המוקד ב־/24; העמדות החדשות נפלו בין הסקופים', en: 'Cameras live in a /28; dispatch in a /24; the new desks fell between scopes' },
      inThisCase: {
        he: 'VLAN 50 הוא 10.24.50.0/28 — 14 כתובות לצומת. 106 הוא 10.24.30.0/24. העמדות החדשות הושלכו ל־VLAN 40 בלי Scope מתאים. בלי מסכה אי אפשר לדעת אם 169.254 הוא כשל DHCP או כתובת מחוץ לרשת.',
        en: 'VLAN 50 is 10.24.50.0/28 — 14 addresses for the junction. 106 is 10.24.30.0/24. New desks were dropped into VLAN 40 with no matching scope. Without the mask you cannot tell APIPA from "wrong network".',
      },
      withoutThis: {
        he: 'נותנים למצלמה כתובת משרדית וחושבים שהסיב מת.',
        en: 'You give a camera an office address and decide the fiber is dead.',
      },
      cli: {
        command: 'ipcalc 10.24.50.0/28',
        meaning: { he: '14 מארחים, לא 254 — זה ארון צומת, לא אגף', en: '14 hosts, not 254 — this is a junction cabinet, not a floor' },
      },
    },
    {
      nodeId: 'node-passive-fiber-cables',
      osiLayers: ['L1'],
      siteIds: ['park', 'weizmann', 'core'],
      homeStageId: 'cameras',
      pinLabel: { he: 'סיב', en: 'Fiber' },
      headline: { he: 'הסיב לוויצמן חי; ה־CRC בפארק הוא מחבר מלוכלך', en: 'Fiber to Weizmann is alive; park CRC is a dirty ferrule' },
      inThisCase: {
        he: 'Single-Mode לארון החוץ מחזיר Rx תקין. מי שמזמין ריתוך עכשיו מבזבז את הבוקר. על אפלינק הפארק יש CRC — עט ניקוי LC, לא OTDR של קילומטרים. ההבחנה הזו היא כל הסיב במקרה.',
        en: 'Single-mode to the street cabinet returns a healthy Rx. Ordering a splice now wastes the morning. The park uplink has CRC — an LC cleaning pen, not a kilometre of OTDR. That distinction is the whole fiber story in this case.',
      },
      withoutThis: {
        he: 'פותחים קריאת בזק על מצלמות שפשוט נשארו בלי חשמל.',
        en: 'You open a Bezeq ticket on cameras that simply lost power.',
      },
      cli: {
        command: 'show interfaces transceiver',
        meaning: { he: 'Rx ‎-4.8 dBm בוויצמן = לא חושך, לא חיתוך', en: 'Rx −4.8 dBm at Weizmann = not dark, not a cut' },
      },
    },
    {
      nodeId: 'node-racks-edge-poe',
      osiLayers: ['L1'],
      siteIds: ['weizmann'],
      homeStageId: 'cameras',
      pinLabel: { he: 'PoE', en: 'PoE' },
      headline: { he: '120W מול ארבעה גופי חימום — זו נפילת ה־LPR', en: '120W versus four heaters — that is the LPR outage' },
      inThisCase: {
        he: 'המתג בארון החוץ עדיין עונה לפינג. המצלמות לא. בלילה נכנסו גופי חימום ב־PTZ, תקציב 120W נגמר, פורט Gi1/4 ב־fault. שדרוג ספק ל־240W ו־Power Priority — לא החלפת מצלמות.',
        en: 'The street-cabinet switch still answers ping. The cameras do not. Overnight PTZ heaters came on, the 120W budget died, Gi1/4 went to fault. Upgrade the PSU to 240W and set power priority — do not replace cameras.',
      },
      withoutThis: {
        he: 'מחליפים Axis ב־04:00 בבוקר ואותה קריסה חוזרת בלילה הבא.',
        en: 'You swap Axis units at 04:00 and the same collapse returns the next night.',
      },
      cli: {
        command: 'show power inline',
        meaning: { he: 'Available 120 · Used 118.5 · Remaining 1.5 · Gi1/4 Overload', en: 'Available 120 · Used 118.5 · Remaining 1.5 · Gi1/4 Overload' },
      },
    },
    {
      nodeId: 'node-switching-vlans',
      osiLayers: ['L2'],
      siteIds: ['moked', 'weizmann', 'engineering', 'core'],
      homeStageId: 'cameras',
      pinLabel: { he: 'VLAN', en: 'VLAN' },
      headline: { he: '50 מצלמות, 30 קול, 20 משרד, 40 עמדות חדשות — בלי תיוג זה כאוס אחד', en: '50 cameras, 30 voice, 20 office, 40 new desks — without tags it is one mess' },
      inThisCase: {
        he: 'הפרדת VLAN הצילה את המצלמות מהלולאה בהנדסה — עד שמעבד המתג עצמו נחנק. ב־106 הטלפון והמחשב חולקים שקע: Voice tagged 30, Data untagged 20. VLAN 40 החדש לא רץ בטראנק, לכן גם Helper לא היה מציל בלי Trunk.',
        en: 'VLAN split saved the cameras from the Engineering loop — until the switch CPU itself choked. At 106 the phone and PC share a jack: voice tagged 30, data untagged 20. New VLAN 40 was not allowed on the trunk, so a helper alone would not have saved the desks.',
      },
      withoutThis: {
        he: 'שידורי המצלמה ממלאים את תור הקול, או שמחשב מוקד נופל ל־VLAN המצלמות.',
        en: 'Camera multicast fills the voice queue, or a dispatch PC lands on the camera VLAN.',
      },
      cli: {
        command: 'show vlan brief ; show interfaces trunk',
        meaning: { he: 'מי מתויג, מי Access, ומי נשכח מהטראנק', en: 'Who is tagged, who is access, and who was left off the trunk' },
      },
    },
    {
      nodeId: 'node-redundancy-stp',
      osiLayers: ['L2'],
      siteIds: ['engineering', 'core'],
      homeStageId: 'storm',
      pinLabel: { he: 'STP', en: 'STP' },
      headline: { he: 'הלולאה בהנדסה היא הסיבה שהאגף "מת" ב־07:08', en: 'The Engineering loop is why the floor "died" at 07:08' },
      inThisCase: {
        he: 'שני כבלים לשני שקעים דרך סוויץ׳ ביתי. בלי TTL. Broadcast storm. Root Bridge לא הוגדר על הליבה, BPDU Guard כבוי. RSTP היה אמור לחסום; במקום זה המעבד אוכל BPDUs. כיבוי Gi0/14 מחזיר את האגף בלי לגעת בליבה.',
        en: 'Two cords into two jacks through a home switch. No TTL. Broadcast storm. Root was never pinned on the core, BPDU Guard off. RSTP should have blocked; instead the CPU eats BPDUs. Shutting Gi0/14 restores the floor without touching the core.',
      },
      withoutThis: {
        he: 'אתחול ליבה בזמן סופה — ומפילים גם את 106 ואת המצלמות.',
        en: 'You reload the core during a storm — and take 106 and the cameras with it.',
      },
      cli: {
        command: 'show processes cpu sorted ; show spanning-tree blockedports',
        meaning: { he: '99% CPU על STP/ARP ופורט שמזרים מיליון broadcasts', en: '99% CPU on STP/ARP and a port injecting a million broadcasts' },
      },
    },
    {
      nodeId: 'node-wireless-ptp-links',
      osiLayers: ['L1', 'L2'],
      siteIds: ['club', 'park', 'core'],
      homeStageId: 'paths',
      pinLabel: { he: 'PtP', en: 'PtP' },
      headline: { he: 'הרדיו לפארק הוא גיבוי — לא מקום לזרוק עליו מצלמות 4K בטעות', en: 'The park radio is a spare — not a place to dump 4K cameras by mistake' },
      inThisCase: {
        he: 'קישור 60GHz לקאנטרי ולפארק חי. אם מזהים בטעות את נפילת ה־LPR כחיתוך סיב ומעבירים זרם וידאו לרדיו, חונקים גם Wi‑Fi ציבורי. LoS נקי הבוקר; הבעיה לא בפרנל.',
        en: 'The 60GHz links to the club and park are up. Misread the LPR outage as a fiber cut and fail video onto the radio, and you also choke public Wi‑Fi. LoS is clean this morning; this is not a Fresnel problem.',
      },
      withoutThis: {
        he: 'גיבוי אלחוטי הופך לצוואר בקבוק בזמן שספק ה־PoE הוא האשם.',
        en: 'The wireless spare becomes a bottleneck while the PoE supply is the culprit.',
      },
      cli: {
        command: 'show ap summary',
        meaning: { he: 'הרדיו וה־AP בפארק ירוקים — לא נוגעים', en: 'Park radio and APs are green — leave them' },
      },
    },
    {
      nodeId: 'node-wan-metro-sites',
      osiLayers: ['L2', 'L3'],
      siteIds: ['school', 'isp', 'core'],
      homeStageId: 'paths',
      pinLabel: { he: 'WAN', en: 'WAN' },
      headline: { he: 'Metro-E לאוסטרובסקי תקין; אל תערבבו אותו עם ארון החוץ', en: 'Metro-E to Ostrovsky is fine; do not mix it with the street cabinet' },
      inThisCase: {
        he: 'בית הספר על Metro-E עם failover סלולרי. הוא צופה מהצד. מי שמאחד את כל האתרים לקריאת ספק אחת מאבד את ה־SLA האמיתי. 106 כן דורש Dual-Homing; ויצמן לא.',
        en: 'The school sits on Metro-E with cellular failover. It is a spectator. Bundle every site into one carrier ticket and you burn the real SLA. 106 does need dual-homing; Weizmann does not.',
      },
      withoutThis: {
        he: 'משאירים את בזק על הקו בזמן שהתקלה היא ספק DIN-rail של 120W.',
        en: 'You keep Bezeq on the phone while the fault is a 120W DIN-rail PSU.',
      },
      cli: {
        command: 'show ip route ; traceroute 10.24.40.1',
        meaning: { he: 'נתיב החינוך חי — לא חלק מהמפל', en: 'The education path is alive — not part of the cascade' },
      },
    },
    {
      nodeId: 'node-monitoring-prtg-snmp',
      osiLayers: ['L7'],
      siteIds: ['core', 'weizmann', 'moked', 'engineering'],
      homeStageId: 'intake',
      pinLabel: { he: 'PRTG', en: 'PRTG' },
      headline: { he: 'הקיר ידע ב־06:41; הטלפונים התחילו רק ב־07:14', en: 'The wall knew at 06:41; the phones only started at 07:14' },
      inThisCase: {
        he: 'Threshold טמפרטורה, PoE remaining, MOS, broadcasts, CRC — חמישה חיישנים, סדר כרונולוגי. SNMP Trap על Gi1/4 חסך ניחוש. בלי שו״ב זה חמש קריאות מבולבלות; עם שו״ב זה מפל שקוראים אותו משמאל לימין.',
        en: 'Temperature threshold, PoE remaining, MOS, broadcasts, CRC — five sensors, in time order. The SNMP trap on Gi1/4 saved the guesswork. Without NOC this is five confused tickets; with it, a cascade you can read left to right.',
      },
      withoutThis: {
        he: 'עובדים לפי מי שצעק אחרון במקום לפי מי שנפל ראשון.',
        en: 'You work whoever shouted last instead of whatever fell first.',
      },
      cli: {
        command: 'snmpwalk -v3 ... ifOperStatus ; show logging | include PoE',
        meaning: { he: 'הטראפ והלוג מספרים את הסדר שהמשתמשים לא ראו', en: 'Trap and log tell the order users never saw' },
      },
    },
    {
      nodeId: 'node-internet-routing-nat',
      osiLayers: ['L3', 'L4'],
      siteIds: ['isp', 'core', 'moked'],
      homeStageId: 'voice',
      pinLabel: { he: 'NAT', en: 'NAT' },
      headline: { he: 'גיבוי הגבייה ממלא את ה־PAT וחונק את הקול על אותו אפלינק', en: 'Billing backup fills PAT and strangles voice on the same uplink' },
      inThisCase: {
        he: 'אלפי תרגומי PAT על כתובת ציבורית אחת. גיבוי לילי בלי shaping דוחף 1G ל־100%. בלי QoS במתג הקומה, RTP מת, והמשתמשים קוראים לזה "אין אינטרנט". Dual-ISP קיים; אף אחד לא הפעיל מעבר כי הקו לא נפל — הוא נחנק.',
        en: 'Thousands of PAT translations on one public address. An unshaped night backup drives 1G to 100%. With no QoS on the floor switch, RTP dies and users call it "no internet". Dual-ISP exists; nobody failed over because the circuit did not drop — it choked.',
      },
      withoutThis: {
        he: 'מאשימים את ספק האינטרנט במקום לחתוך גיבוי ולהדליק תור קול.',
        en: 'You blame the ISP instead of cutting the backup and lighting a voice queue.',
      },
      cli: {
        command: 'show ip nat translations ; show interface gi0/48',
        meaning: { he: '98% ניצולת, 45k drops, PAT חי — זו חנק לא ניתוק', en: '98% util, 45k drops, PAT alive — choke, not a cut' },
      },
    },
    {
      nodeId: 'node-core-dhcp-dns-ntp',
      osiLayers: ['L3', 'L7'],
      siteIds: ['moked', 'core', 'weizmann'],
      homeStageId: 'identity',
      pinLabel: { he: 'DHCP', en: 'DHCP' },
      headline: { he: '169.254 על VLAN 40 הוא Helper חסר, לא כבל תלוש', en: '169.254 on VLAN 40 is a missing helper, not a yanked cable' },
      inThisCase: {
        he: 'Discover הוא Broadcast. SVI 40 בלי ip helper לא מעביר לשרת ב־VLAN 100. Link דולק — L1 חי. APIPA מוכיח שהמחסנית חיה בלי שרת. באותו בוקר NTP על המצלמות חייב להישאר מסונכרן אם תרצו שאחת התמונות תחזיק בבית משפט.',
        en: 'Discover is broadcast. SVI 40 without ip helper never reaches the server in VLAN 100. Link light on — L1 is alive. APIPA proves the stack is alive without a server. That same morning, camera NTP still has to match if you want a still to hold in court.',
      },
      withoutThis: {
        he: 'מחליפים כרטיסי רשת בשלוש עמדות בזמן שחסרה שורה אחת ב־SVI.',
        en: 'You replace three NICs while a single SVI line is missing.',
      },
      cli: {
        command: 'ip helper-address 10.50.1.15',
        meaning: { he: 'שורה אחת על SVI 40 — העמדות מקבלות כתובת', en: 'One line on SVI 40 — the desks get an address' },
      },
    },
    {
      nodeId: 'node-smart-city-cctv-iot',
      osiLayers: ['L1', 'L2', 'L7'],
      siteIds: ['weizmann'],
      homeStageId: 'cameras',
      pinLabel: { he: 'LPR', en: 'LPR' },
      headline: { he: 'הקצה של המפל הוא מתג מוקשח וארבע מצלמות על עמוד', en: 'The edge of the cascade is a hardened switch and four cameras on a pole' },
      inThisCase: {
        he: 'ארון חוץ, מתג תעשייתי, PoE++, VLAN מצלמות, IGMP. הקור בלילה הוא חלק מהתכנון — לא מזג אוויר מפתיע. המצלמות לא "נפלו מהרשת"; הן נכבו כי לא היה להן חשמל על אותו כבל שמביא את ה־RTSP.',
        en: 'Street cabinet, industrial switch, PoE++, camera VLAN, IGMP. Overnight cold is a design input — not a surprise. The cameras did not "fall off the network"; they powered off because the same cable that carries RTSP ran out of watts.',
      },
      withoutThis: {
        he: 'שמים מתג משרדי בארון צומת ומגלים את זה בשרב הבא.',
        en: 'You put an office switch in a junction cabinet and discover it on the next heatwave.',
      },
      cli: {
        command: 'show ip igmp snooping ; show power inline police',
        meaning: { he: 'וידאו רק למוקד, חשמל רק למי שמותר', en: 'Video only to dispatch, power only to what is allowed' },
      },
    },
    {
      nodeId: 'node-cybersecurity-hardening',
      osiLayers: ['L2'],
      siteIds: ['engineering', 'moked'],
      homeStageId: 'storm',
      pinLabel: { he: 'SEC', en: 'SEC' },
      headline: { he: 'Port Security תפס לפטופ במסדרון; BPDU Guard היה חסר על אותו רצפה', en: 'Port Security caught a corridor laptop; BPDU Guard was missing on the same floor' },
      inThisCase: {
        he: 'שקע קיוסק עם violation shutdown עשה את העבודה — errdisable, SNMP trap. זה לא המפל. החור האמיתי: פורטי Access בלי BPDU Guard אפשרו סוויץ׳ ביתי. הקשחה זו לא סיסמה; זו רשימת פורטים באותו ארון.',
        en: 'The kiosk jack with violation shutdown did its job — errdisable, SNMP trap. That is not the cascade. The real hole: access ports without BPDU Guard let a home switch in. Hardening is not a password; it is the port list in that cabinet.',
      },
      withoutThis: {
        he: 'רודפים אחרי הלפטופ במסדרון בזמן שהלולאה אוכלת את האגף.',
        en: 'You chase the corridor laptop while the loop eats the floor.',
      },
      cli: {
        command: 'show port-security interface gi0/12 ; spanning-tree bpduguard enable',
        meaning: { he: 'הקיוסק נעול נכון; פורטי המשתמש עדיין פתוחים ללולאה', en: 'The kiosk is locked correctly; user ports are still open to a loop' },
      },
    },
    {
      nodeId: 'node-voip-telephony-sip',
      osiLayers: ['L4', 'L7'],
      siteIds: ['moked', 'core'],
      homeStageId: 'voice',
      pinLabel: { he: 'SIP', en: 'SIP' },
      headline: { he: 'השיחה מתחברת ב־SIP ונקרעת ב־RTP כי EF לא מכובד', en: 'The call sets up on SIP and tears on RTP because EF is not trusted' },
      inThisCase: {
        he: '5060 עובד. המוקדן שומע צלצול. RTP על UDP נזרק בתור FIFO. DSCP 46 לא נשמר על הטראנק אחרי החלפת המתג. Jitter ו־loss נשמעים כמו "רובוט". שתי פרוטוקולים, שתי אבחנות.',
        en: '5060 works. The operator hears ring. RTP over UDP is dropped in a FIFO. DSCP 46 was not trusted on the trunk after the switch swap. Jitter and loss sound like a "robot". Two protocols, two diagnoses.',
      },
      withoutThis: {
        he: 'מאשימים את ספק ה־SIP Trunk בזמן שהבעיה היא תור מקומי.',
        en: 'You blame the SIP trunk provider while the fault is a local queue.',
      },
      cli: {
        command: 'show mls qos interface gi0/48 queueing',
        meaning: { he: 'QoS DISABLED · Priority Queue OFF', en: 'QoS DISABLED · Priority Queue OFF' },
      },
    },
    {
      nodeId: 'node-field-troubleshooting-methodology',
      osiLayers: ['L1', 'L2', 'L3', 'L4', 'L7'],
      siteIds: ['core', 'weizmann', 'moked', 'engineering'],
      homeStageId: 'intake',
      pinLabel: { he: 'שיטה', en: 'Method' },
      headline: { he: 'Divide and conquer: שלושה פינגים לפני כל אתחול', en: 'Divide and conquer: three pings before any reload' },
      inThisCase: {
        he: 'מה השתנה? מתג 106 הוחלף בשבוע שעבר. מה משותף? כלום — עד שקוראים את חותמות הזמן. מבודדים: מצלמות (PoE), קול (QoS), הנדסה (לולאה), עמדות (Helper). עבודה עצמאית כאן היא הסירוב לטפל בחמש הקריאות כחמש תקלות.',
        en: 'What changed? The 106 switch was replaced last week. What is in common? Nothing — until you read the timestamps. Isolate: cameras (PoE), voice (QoS), Engineering (loop), desks (helper). Autonomy here is refusing to treat five tickets as five faults.',
      },
      withoutThis: {
        he: '45 דקות של אתחולים, ואף אחד מהמנגנונים לא טופל.',
        en: 'Forty-five minutes of reloads, and none of the mechanisms got treated.',
      },
      cli: {
        command: 'show logging | include 06:|07:',
        meaning: { he: 'סדר הזמן לפני סדר הצעקות', en: 'Time order before shout order' },
      },
    },
    {
      nodeId: 'node-cli-toolset-diagnostics',
      osiLayers: ['L1', 'L2', 'L3'],
      siteIds: ['engineering', 'weizmann', 'moked', 'core'],
      homeStageId: 'close',
      pinLabel: { he: 'CLI', en: 'CLI' },
      headline: { he: 'כל ראיה במפל הזה היא פלט של פקודת show', en: 'Every proof in this cascade is the output of a show command' },
      inThisCase: {
        he: 'power inline מוכיח PoE. logging מוכיח overload. processes cpu מוכיח לולאה. mac/cdp מוצאים את הסוויץ׳ הביתי. qos מוכיח FIFO. בלי הטרמינל נשארים עם סיפורי משתמשים.',
        en: 'power inline proves PoE. logging proves overload. processes cpu proves the loop. mac/cdp find the home switch. qos proves FIFO. Without the terminal you are left with user stories.',
      },
      withoutThis: {
        he: 'מתווכחים עם בזק בלי צילום מסך אחד.',
        en: 'You argue with Bezeq without a single screenshot.',
      },
      cli: {
        command: 'show mac address-table dynamic ; show cdp neighbors',
        meaning: { he: 'הסוויץ׳ הביתי יושב על Gi0/14 — לא "איפשהו באגף"', en: 'The home switch sits on Gi0/14 — not "somewhere on the floor"' },
      },
    },
    {
      nodeId: 'node-vendor-management-sla',
      osiLayers: ['L1', 'L3'],
      siteIds: ['isp', 'school', 'weizmann'],
      homeStageId: 'paths',
      pinLabel: { he: 'SLA', en: 'SLA' },
      headline: { he: 'לא שורפים SLA של 4 שעות על ארון שנגמר לו הוואט', en: 'Do not burn a 4-hour SLA on a cabinet that ran out of watts' },
      inThisCase: {
        he: 'ספק תמיד יגיד שהקו שלו תקין. הפעם הוא צודק. מציגים Rx, פינג, גרף PRTG, וסוגרים את הקריאה הפנימית. Metro-E נשאר בכיס ליום שבו traceroute נשבר אצלם. פיקוח קבלנים: אם מישהו ירתך היום בלי OTDR — לא חותמים.',
        en: 'The carrier will always say their circuit is clean. This time they are right. Show Rx, ping, PRTG, and close it internally. Metro-E stays in your pocket for the day traceroute dies on their side. Contractor control: if someone splices today without OTDR — you do not sign.',
      },
      withoutThis: {
        he: 'שעון SLA רץ על תקלה שנגמרת בספק כוח מקומי.',
        en: 'An SLA clock runs on a fault that ends with a local power supply.',
      },
      cli: {
        command: 'ping 8.8.8.8 size 1472 df-bit',
        meaning: { he: 'ה־MTU והקו החיצוני חיים — האשמה בפנים', en: 'MTU and the outside circuit are alive — the fault is inside' },
      },
    },
  ] satisfies CaseTopicRole[],
};

export type LivingCase = typeof LIVING_CASE;

export const TOPIC_NAMES: Record<string, Copy> = {
  'node-osi-tcp': { he: 'מודל OSI ו־TCP/IP', en: 'OSI model & TCP/IP' },
  'node-ip-subnetting': { he: 'IPv4 וסאבנטינג', en: 'IPv4 & CIDR' },
  'node-passive-fiber-cables': { he: 'סיבים וכבילה', en: 'Fiber & cabling' },
  'node-racks-edge-poe': { he: 'ארונות ו־PoE', en: 'Racks & PoE' },
  'node-switching-vlans': { he: 'מתגים ו־VLAN', en: 'Switching & VLANs' },
  'node-redundancy-stp': { he: 'STP ויתירות', en: 'STP & redundancy' },
  'node-wireless-ptp-links': { he: 'קישורי רדיו', en: 'Wireless PtP' },
  'node-wan-metro-sites': { he: 'WAN עירוני', en: 'Metro WAN' },
  'node-monitoring-prtg-snmp': { he: 'PRTG ו־SNMP', en: 'PRTG & SNMP' },
  'node-internet-routing-nat': { he: 'אינטרנט ו־NAT', en: 'Internet & NAT' },
  'node-core-dhcp-dns-ntp': { he: 'DHCP · DNS · NTP', en: 'DHCP · DNS · NTP' },
  'node-smart-city-cctv-iot': { he: 'עיר חכמה ו־LPR', en: 'Smart city & LPR' },
  'node-cybersecurity-hardening': { he: 'הקשחה ואבטחה', en: 'Hardening' },
  'node-voip-telephony-sip': { he: 'VoIP ו־QoS', en: 'VoIP & QoS' },
  'node-field-troubleshooting-methodology': { he: 'מתודולוגיית תקלות', en: 'Field method' },
  'node-cli-toolset-diagnostics': { he: 'ארגז CLI', en: 'CLI toolkit' },
  'node-vendor-management-sla': { he: 'ספקים ו־SLA', en: 'Vendors & SLA' },
};

export const TRIAGE_DILEMMAS: Record<string, CaseTriageDilemma> = {
  cameras: {
    stageId: 'cameras',
    question: {
      he: 'בשעה 06:52 ארבע מצלמות LPR בצומת אחוזה/ויצמן כבו במקביל. הטמפרטורה בארון עלתה ל-41°C. מה הצעד המיידי שלך?',
      en: 'At 06:52, four LPR cameras at Ahuza/Weizmann junction went offline simultaneously. Cabinet temperature rose to 41°C. What is your immediate triage move?'
    },
    options: [
      {
        id: 'cameras-power-inline',
        label: {
          he: 'בדיקת show power inline וזיהוי עומס יתר על תקציב 120W בגלל גופי החימום',
          en: 'Check show power inline and recognize 120W budget overload from cold night heaters'
        },
        isCorrect: true,
        scoreDelta: 20,
        resolvedSites: ['weizmann'],
        consequence: {
          he: 'מדויק! מתג ה-Moxa התעשייתי ניתק פורטים כדי להגן על עצמו מעודף צריכה של גופי החימום בלילה הקר. הגדרת עדיפות PoE או ספק מוגדל מחזירים את המצלמות ללא נגיעה בסיב.',
          en: 'Spot on! The industrial Moxa switch shed ports to protect itself from cold-night heater overload. Setting PoE priority or expanding the PSU restores the cameras without touching fiber.'
        }
      },
      {
        id: 'cameras-bezeq-ticket',
        label: {
          he: 'פתיחת קריאה דחופה לבזק על חשד לקרע בסיב האופטי',
          en: 'Open urgent Bezeq ticket on suspected fiber cut'
        },
        isCorrect: false,
        scoreDelta: -10,
        consequence: {
          he: 'שגוי (תגובה נאיבית): פינג למתג החזיר 1.5ms וה-Rx האופטי הוא -4.8 dBm. הסיב תקין לחלוטין. בזק יחייבו על קריאת שווא בעוד 4 שעות ואבד זמן יקר.',
          en: 'Incorrect (naive response): Ping to switch returns in 1.5ms and optical Rx is -4.8 dBm. Fiber is fine. Bezeq will bill for a false dispatch after 4 hours with zero progress.'
        }
      },
      {
        id: 'cameras-reload-core',
        label: {
          he: 'אתחול (Reload) של מתג הליבה כדי "לאפס את ה-PoE בארון"',
          en: 'Reload the core switch to "reset PoE"'
        },
        isCorrect: false,
        isCatastrophic: true,
        scoreDelta: -25,
        consequence: {
          he: 'קטסטרופה! אתחול הליבה הפיל את מוקד 106, ניתק את כל שרתי העירייה, ומתג ה-PoE שבארון הרחוב כלל לא הושפע! החמרת את כל הקריאות בבת אחת.',
          en: 'Catastrophic! Core reload knocked out dispatch 106, dropped all city hall servers, and the street PoE switch was completely unaffected! You worsened every ticket at once.'
        }
      }
    ]
  },
  voice: {
    stageId: 'voice',
    question: {
      he: 'בשעה 07:02 מוקד 106 מדווח על שמע רובוטי וקיטועים בשיחות נכנסות, בזמן ששרת הגבייה מגבה נתונים ב-98% רוחב פס. מה המהלך שלך?',
      en: 'At 07:02, Dispatch 106 reports robotic clipping audio and call drops while billing server backup saturates Gi0/48 at 98%. What is your move?'
    },
    options: [
      {
        id: 'voice-qos-trust-shape',
        label: {
          he: 'בדיקת תורי QoS במתג Gi0/48, הפעלת mls qos trust dscp ו-Shaping לגיבוי',
          en: 'Inspect QoS queueing on floor switch Gi0/48, enable mls qos trust dscp and shape backup'
        },
        isCorrect: true,
        scoreDelta: 20,
        resolvedSites: ['moked'],
        consequence: {
          he: 'מצוין! חבילות RTP עם DSCP EF 46 מקבלות עכשיו עדיפות בתור Priority Queue, ותעבורת הגיבוי מוגבלת ולא חונקת את ה-Uplink. השמע במוקד 106 חזר להיות צלול!',
          en: 'Excellent! RTP packets with DSCP EF 46 now receive Priority Queue forwarding, while backup traffic is rate-shaped and no longer chokes the uplink. Dispatch audio is clear!'
        }
      },
      {
        id: 'voice-blame-sip-provider',
        label: {
          he: 'התקשרות לספק ה-SIP Trunk והטלת האשמה עליהם',
          en: 'Call SIP trunk provider and blame them'
        },
        isCorrect: false,
        scoreDelta: -10,
        consequence: {
          he: 'שגוי (תגובה נאיבית): ספק ה-SIP יוכיח שסימוני ה-SIP תקינים ושהעומס הוא מקומי פנימי במתג הקומה שלך Gi0/48 עקב גיבוי ללא תעדוף QoS.',
          en: 'Incorrect (naive response): SIP provider demonstrates signaling is clean and that packet drops are inside your own floor switch Gi0/48 queue due to missing QoS.'
        }
      },
      {
        id: 'voice-kill-sip-daemon',
        label: {
          he: 'הריגת תהליך (Kill) שירות ה-SIP במרכזייה / CUCM',
          en: 'Kill the SIP service daemon on PBX / CUCM'
        },
        isCorrect: false,
        isCatastrophic: true,
        scoreDelta: -25,
        consequence: {
          he: 'קטסטרופה! השבתת לחלוטין את מוקד החירום 106! שיחות חירום של תושבים נופלות מיד עם צליל תפוס וכל מוקדני החירום מושבתים.',
          en: 'Catastrophic! You took down emergency dispatch 106 completely! Resident emergency calls immediately drop to busy signals while all call takers are severed.'
        }
      }
    ]
  },
  storm: {
    stageId: 'storm',
    question: {
      he: 'בשעה 07:08 אגף הנדסה מנותק כליל, נוריות המתג מהבהבות בטירוף והמעבד על 99%. איך תעצור את הסופה?',
      en: 'At 07:08, Engineering department is completely cut off, switch LEDs are thrashing, and CPU is at 99%. How do you halt the storm?'
    },
    options: [
      {
        id: 'storm-shut-loop-bpdu',
        label: {
          he: 'בדיקת processes cpu ו-show mac, כיבוי פורט Gi0/14 עם הלולאה והפעלת bpduguard',
          en: 'Check show processes cpu and show mac, shut Gi0/14 with home loop, enable bpduguard'
        },
        isCorrect: true,
        scoreDelta: 20,
        resolvedSites: ['engineering'],
        consequence: {
          he: 'מדויק! ניתקת את הפורט שאליו חובר מתג ביתי שיצר לולאת L2 קטלנית ללא STP. מעבד המתג ירד מ-99% ל-3%, ו-BPDU Guard ימנע לולאות דומות בעתיד.',
          en: 'Spot on! You shut down the port where an unmanaged switch caused a lethal L2 loop. CPU plummeted from 99% to 3%, and BPDU Guard secures against future rogue loops.'
        }
      },
      {
        id: 'storm-patch-cable',
        label: {
          he: 'חיבור כבל רשת נוסף בין המתג לקיר כדי "לחלק את עומס השידורים"',
          en: 'Patch another cable into the office switch'
        },
        isCorrect: false,
        scoreDelta: -10,
        consequence: {
          he: 'שגוי (תגובה נאיבית): יצרת לולאת Layer 2 נוספת! היעדר מנגנון מניעה הכפיל את סופת ה-Broadcast והמתג קרס כליל.',
          en: 'Incorrect (naive response): You created an additional Layer 2 loop! The absence of loop protection doubled the broadcast storm, crashing the switch.'
        }
      },
      {
        id: 'storm-reload-during-storm',
        label: {
          he: 'אתחול (Reload) של מתג הליבה בזמן שסופת ה-Broadcast משתוללת',
          en: 'Reload the core switch while storm is active'
        },
        isCorrect: false,
        isCatastrophic: true,
        scoreDelta: -25,
        consequence: {
          he: 'קטסטרופה! בזמן עליית הליבה, חבילות ה-Broadcast מהסוויץ׳ הביתי הציפו את כל הפורטים לפני ש-STP התכנס, והשבתת את כל קריית העירייה!',
          en: 'Catastrophic! During core reboot, broadcasts from the rogue switch overwhelmed interfaces before STP converged, taking down all of City Hall!'
        }
      }
    ]
  },
  identity: {
    stageId: 'identity',
    question: {
      he: 'בשעה 07:11 שלוש עמדות חדשות במוקד מקבלות 169.254 (APIPA) ב-VLAN 40 ולא מגיעות ל-DHCP. מה התיקון?',
      en: 'At 07:11, three new dispatch desks sit on 169.254 (APIPA) in VLAN 40 and cannot reach DHCP. What is the fix?'
    },
    options: [
      {
        id: 'identity-helper-address',
        label: {
          he: 'הוספת ip helper-address 10.50.1.15 ל-SVI 40 ואימות Scope ב-DHCP',
          en: 'Add ip helper-address 10.50.1.15 to SVI 40 and check scope'
        },
        isCorrect: true,
        scoreDelta: 20,
        resolvedSites: ['moked'],
        consequence: {
          he: 'מדויק! שידורי Broadcast של DHCP אינם חוצים ממשקי SVI (נתב L3). ה-helper-address העביר אותם כ-Unicast לשרת ה-DHCP בליבה, והעמדות קיבלו מיד כתובות תקינות.',
          en: 'Spot on! DHCP broadcasts do not cross an SVI without a relay agent. The helper-address forwarded them as unicast to the core DHCP server, and desks immediately acquired valid IPs.'
        }
      },
      {
        id: 'identity-replace-nics',
        label: {
          he: 'החלפה פיזית של כרטיסי הרשת (NIC) בשלוש העמדות הבעייתיות',
          en: 'Replace the network cards on the 3 desks'
        },
        isCorrect: false,
        scoreDelta: -10,
        consequence: {
          he: 'שגוי (תגובה נאיבית): בזבוז זמן ומשאבים. APIPA מעיד ששכבות L1 ו-L2 תקינות וכרטיסי הרשת עובדים, אך אין מענה בשכבה L3.',
          en: 'Incorrect (naive response): Waste of time and parts. APIPA indicates L1 and L2 are functioning fine, but there is no L3 response from the DHCP server.'
        }
      },
      {
        id: 'identity-static-core-subnet',
        label: {
          he: 'הגדרת כתובות סטטיות בעמדות מתת-הרשת של שרתי הליבה (VLAN 10)',
          en: 'Assign static IP from core subnet to desks'
        },
        isCorrect: false,
        isCatastrophic: true,
        scoreDelta: -20,
        consequence: {
          he: 'סכנה חמורה! הגדרת כתובות ידניות מ-VLAN הליבה יצרה התנגשות כתובות IP (IP Conflict) מול שרתי ה-DC/PRTG והפרה את חוקי האבטחה וה-VLANs!',
          en: 'Severe hazard! Setting manual IPs from the core server subnet caused an IP conflict with core DC/PRTG servers and severely violated segmentation policies!'
        }
      }
    ]
  },
  paths: {
    stageId: 'paths',
    question: {
      he: 'בשעה 07:18 בזק טוענים שה-Metro תקין, בסיב לפארק יש שגיאות CRC, ורדיו 60GHz בהמתנה. מה הצעד הנכון?',
      en: 'At 07:18, Bezeq confirms Metro-E is healthy, park fiber shows CRC errors, and 60GHz radio is on standby. What is the right move?'
    },
    options: [
      {
        id: 'paths-verify-metro-ferrule',
        label: {
          he: 'אימות תקינות Metro-E, השארת רדיו 60GHz כגיבוי, וניקוי מחבר סיב (Ferrule)',
          en: 'Verify Bezeq Metro-E is healthy, keep 60GHz radio as standby, clean fiber ferrule'
        },
        isCorrect: true,
        scoreDelta: 20,
        resolvedSites: ['isp', 'park'],
        consequence: {
          he: 'מעולה! בזק אכן היו תקינים. שגיאות ה-CRC נבעו ממחבר סיב אופטי מלוכלך וניקויו פתר את הבעיה, תוך שמירה על רדיו 60GHz כגיבוי מבלי להציף את הקאנטרי.',
          en: 'Superb! Bezeq was indeed healthy. CRC errors were caused by a dirty optical ferrule; cleaning it resolved packet loss while keeping 60GHz as standby without choking the club.'
        }
      },
      {
        id: 'paths-failover-radio-cameras',
        label: {
          he: 'העברת כל מצלמות ה-4K לקישור הרדיו 60GHz והצפת קישור הקאנטרי',
          en: 'Failover all 4K cameras onto 60GHz wireless link and saturate club'
        },
        isCorrect: false,
        scoreDelta: -15,
        consequence: {
          he: 'שגוי: תעבורת מצלמות 4K כבדה סתמה לחלוטין את קישור הרדיו, יצרה השהיות כבדות והפילה את הרשת של מועדון הספורט והקאנטרי.',
          en: 'Incorrect: Heavy 4K camera streams completely overwhelmed the wireless link, creating massive latency and collapsing the country club network.'
        }
      },
      {
        id: 'paths-break-fiber-ring',
        label: {
          he: 'ניתוק יזום של חיבור טבעת הסיב האופטי (Fiber Ring) לבדיקה',
          en: 'Break the fiber ring connection'
        },
        isCorrect: false,
        isCatastrophic: true,
        scoreDelta: -25,
        consequence: {
          he: 'קטסטרופה! שבירת טבעת הסיב ניתקה במקביל את בית הספר ואת הפארק, גרמה ל-Topology Change מתמיד והפילה קווים עירוניים קריטיים!',
          en: 'Catastrophe! Breaking the fiber ring simultaneously severed the school and the park, triggered continuous STP/ring flapping, and downed critical municipal links!'
        }
      }
    ]
  }
};
