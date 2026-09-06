export type Language = 'he' | 'en';

export interface Translations {
  // App Title & Municipal Header
  appTitle: string;
  jobCode: string;
  municipality: string;
  department: string;
  pathProgress: string;
  levelBadge: string;
  audioMute: string;
  audioUnmute: string;
  aiAdvisor: string;
  
  // Navigation Tabs
  tabCase: string;
  tabLabs: string;
  tabPacketPath: string;
  tabTopology: string;
  tabCli: string;
  tabSubnet: string;
  tabCabling: string;
  tabTree: string;
  tabSimulator: string;
  tabInterview: string;
  tabCheatSheet: string;
  
  // Search & Filter
  searchPlaceholder: string;
  filterAll: string;
  filterPassiveActive: string;
  filterSwitchingWan: string;
  filterMonitoringC2: string;
  filterSmartCity: string;
  filterSecurityVoIP: string;
  filterFieldCli: string;
  nodesFound: string;
  clearSearch: string;
  resetProgress: string;
  confirmReset: string;

  // Stats & Badges
  completedCount: string;
  badgesTitle: string;
  badge1: string;
  badge2: string;
  badge3: string;
  badgeMaster: string;

  // Elevation Zones
  zone0Name: string;
  zone0Subtitle: string;
  zone250Name: string;
  zone250Subtitle: string;
  zone500Name: string;
  zone500Subtitle: string;
  zone750Name: string;
  zone750Subtitle: string;
  zone1000Name: string;
  zone1000Subtitle: string;

  // Topology & NOC
  topologyHeader: string;
  topologySubtitle: string;
  fiberCutSim: string;
  dhcpStarvationSim: string;
  qosEmergencySim: string;
  restoreTopology: string;
  modePacketJourney: string;
  modeNocSites: string;
  fiberPrimary: string;
  wirelessBackup: string;
  vpnBackup: string;
  clickSitePrompt: string;
  rackCabinet: string;
  activeAlerts: string;
  switchPortStatus: string;
  
  // Packet Path
  scenarioTitle: string;
  playBtn: string;
  pauseBtn: string;
  nextStep: string;
  prevStep: string;
  resetPath: string;
  packetDissection: string;
  hardwareFieldTips: string;
  cliVerification: string;

  // Subnet & Tools
  subnetCalcTitle: string;
  cablingLabTitle: string;
  cliSandboxTitle: string;
  incidentSimTitle: string;
  interviewQuizTitle: string;
  cheatSheetTitle: string;
}

export const translations: Record<Language, Translations> = {
  he: {
    appTitle: 'מפת הכשרה: מומחה תקשורת ורשתות רמה ב\'',
    jobCode: 'משרה 7274',
    municipality: 'עיריית רעננה',
    department: 'אגף מערכות מידע, תקשורת וביטחון',
    pathProgress: 'התקדמות מסלול',
    levelBadge: 'רמה: מומחה שטח ב\'',
    audioMute: 'השתק צלילי ממשק',
    audioUnmute: 'הפעל צלילי ממשק',
    aiAdvisor: 'יועץ AI רעננה',
    
    tabCase: 'המקרה החי',
    tabLabs: 'מעבדות',
    tabPacketPath: 'הדמיית נתיב תקשורת (Packet Journey)',
    tabTopology: 'מפת ה-NOC וארונות שרתים',
    tabCli: 'מעבדת CLI אינטראקטיבית',
    tabSubnet: 'מחשבון Subnetting ו-VLSM',
    tabCabling: 'מעבדת סיבים וכבילה פיזית',
    tabTree: 'עץ מיומנויות מלא',
    tabSimulator: 'סימולטור תקלות שטח',
    tabInterview: 'מבחן ותרגול ראיון',
    tabCheatSheet: 'דף שליפים ופקודות שטח',
    
    searchPlaceholder: 'חיפוש נושאים, פקודות CLI, אתרים (למשל: VLAN, Spanning Tree, OSPF, מוקד 106)...',
    filterAll: 'כל המיומנויות',
    filterPassiveActive: 'תשתיות פסיביות ואקטיביות',
    filterSwitchingWan: 'מיתוג ושדרת WAN עירונית',
    filterMonitoringC2: 'שו״ב, ניטור ו-NOC',
    filterSmartCity: 'עיר חכמה ו-IoT',
    filterSecurityVoIP: 'אבטחת מידע וטלפוניה',
    filterFieldCli: 'עבודת שטח ו-CLI',
    nodesFound: 'נושאים נמצאו',
    clearSearch: 'נקה חיפוש',
    resetProgress: 'איפוס כל ההתקדמות',
    confirmReset: 'האם אתה בטוח שברצונך לאפס את כל ההתקדמות?',

    completedCount: 'הושלמו',
    badgesTitle: 'תגי הסמכה שנצברו',
    badge1: 'מוסמך תשתיות וכבילה',
    badge2: 'מאסטר מיתוג ואלחוט',
    badge3: 'מומחה שו״ב ואינטרנט',
    badgeMaster: 'מהנדס רשתות מוסמך רעננה רמה ב\'',

    zone0Name: 'שפלת היסודות והתשתיות הפסיביות',
    zone0Subtitle: 'Basecamp - 0m: מודל OSI, כתובות IP, סיבים וכבילה פיזית',
    zone250Name: 'מישור האתרים והמתגים העירוניים',
    zone250Subtitle: 'Camp 1 - 250m: מתגים L2/L3, VLANs, יתירות Spanning-Tree וקישורי רדיו',
    zone500Name: 'רכס הליבה, הניתוב והעיר החכמה',
    zone500Subtitle: 'Camp 2 - 500m: נתבי OSPF, מצלמות LPR, מוקד 106, חירום וגיבוי סלולרי',
    zone750Name: 'פסגת השו״ב, אבטחת המידע והשרידות',
    zone750Subtitle: 'Camp 3 - 750m: PRTG, שרתי FortiGate, Wi-Fi מאובטח, סיבים כפולים ו-QoS',
    zone1000Name: 'שיא ההסמכה העירונית - רמה ב\'',
    zone1000Subtitle: 'Summit - 1000m: עבודה מול בזק וספקי תשתית, תחזוקה שוטפת וניהול אירועי קצה',

    topologyHeader: 'חמ״ל שו״ב וניטור רשת עירונית - עיריית רעננה (NOC)',
    topologySubtitle: 'טלמטריה חיה, מפת סיבים, מצלמות אבטחה, קישורי רדיו וארונות תקשורת שטח',
    fiberCutSim: 'נתק סיב אופטי ראשי',
    dhcpStarvationSim: 'עומס/התקפת DHCP',
    qosEmergencySim: 'עדיפות שיחות חירום 106',
    restoreTopology: 'שחזר טופולוגיה רגילה',
    modePacketJourney: 'הדמיית נתיב תקשורת ולמידה גרפית (NEW)',
    modeNocSites: 'מפת ה-NOC וניטור ארונות שרתים',
    fiberPrimary: 'סיב אופטי ראשי (10G)',
    wirelessBackup: 'גיבוי אלחוטי (60GHz)',
    vpnBackup: 'גיבוי IPsec VPN',
    clickSitePrompt: 'לחץ על מוסד לצפייה בארון המתגים',
    rackCabinet: 'ארון תקשורת',
    activeAlerts: 'התראות רשת פעילות',
    switchPortStatus: 'סטטוס פורטים במתג',

    scenarioTitle: 'בחר תרחיש להדמיה',
    playBtn: 'נגן מסלול אוטומטי',
    pauseBtn: 'השהה ניגון',
    nextStep: 'השלב הבא',
    prevStep: 'השלב הקודם',
    resetPath: 'איפוס',
    packetDissection: 'פירוק מבנה הפקטה (Packet Header Dissection)',
    hardwareFieldTips: 'חומרה פיזית, ציוד קצה וטיפים מהשטח',
    cliVerification: 'פקודות בדיקה ואימות ב-CLI',

    subnetCalcTitle: 'מחשבון תתי-רשתות (VLSM) ופילוח כתובות עירוני',
    cablingLabTitle: 'מעבדת סיבים אופטיים, מחברים וכבילה פיזית',
    cliSandboxTitle: 'סימולטור פקודות CLI (Cisco IOS & ArubaOS-CX)',
    incidentSimTitle: 'סימולטור תקלות שטח וניהול אירועי חירום',
    interviewQuizTitle: 'מבחן מוכנות ושאלות ראיון מקצועי',
    cheatSheetTitle: 'דף שליפים מקיף: פקודות שטח, מספרי פורטים וסטנדרטים'
  },
  en: {
    appTitle: 'Training Roadmap: Senior Network Engineer Level II',
    jobCode: 'Position 7274',
    municipality: 'Ra\'anana Municipality',
    department: 'IT, Cyber & Communications Division',
    pathProgress: 'Track Progress',
    levelBadge: 'Level: Senior Field Specialist II',
    audioMute: 'Mute UI sounds',
    audioUnmute: 'Unmute UI sounds',
    aiAdvisor: 'Ra\'anana AI Advisor',

    tabCase: 'The living case',
    tabLabs: 'Labs',
    tabPacketPath: 'Packet Journey Simulation',
    tabTopology: 'City NOC & Server Racks',
    tabCli: 'Interactive CLI Sandbox',
    tabSubnet: 'VLSM Subnet Calculator',
    tabCabling: 'Fiber Optic & Cabling Lab',
    tabTree: 'Full Competency Tree',
    tabSimulator: 'Field Incident Simulator',
    tabInterview: 'Interview Simulator & Quiz',
    tabCheatSheet: 'Field Cheat Sheet & CLI',

    searchPlaceholder: 'Search competencies, CLI commands, sites (e.g., VLAN, Spanning Tree, OSPF, Dispatch 106)...',
    filterAll: 'All Competencies',
    filterPassiveActive: 'Passive & Active Infra',
    filterSwitchingWan: 'Switching & Metro WAN',
    filterMonitoringC2: 'Monitoring, C2 & NOC',
    filterSmartCity: 'Smart City & IoT',
    filterSecurityVoIP: 'Cyber Security & VoIP',
    filterFieldCli: 'Field CLI Operations',
    nodesFound: 'topics found',
    clearSearch: 'Clear search',
    resetProgress: 'Reset All Progress',
    confirmReset: 'Are you sure you want to reset all your learning progress?',

    completedCount: 'Completed',
    badgesTitle: 'Earned Certifications',
    badge1: 'Infrastructure & Cabling Specialist',
    badge2: 'Switching & Wireless Master',
    badge3: 'NOC & Security Expert',
    badgeMaster: 'Ra\'anana Municipal Certified Senior Network Engineer Level II',

    zone0Name: 'Foundations & Passive Infrastructure',
    zone0Subtitle: 'Basecamp - 0m: OSI Model, IP Addressing, Fiber Optics & Structured Cabling',
    zone250Name: 'Municipal Edge Sites & Distribution Switches',
    zone250Subtitle: 'Camp 1 - 250m: L2/L3 Switches, VLANs, Spanning-Tree Redundancy & 60GHz Radios',
    zone500Name: 'Core Routing & Smart City Infrastructure',
    zone500Subtitle: 'Camp 2 - 500m: OSPF Routers, LPR Cameras, Dispatch 106, Emergency Cellular Backup',
    zone750Name: 'Network Operations (NOC), Security & Resiliency',
    zone750Subtitle: 'Camp 3 - 750m: PRTG Monitoring, FortiGate Next-Gen Firewalls, 802.1X Wi-Fi & QoS',
    zone1000Name: 'Municipal Senior Certification - Level II',
    zone1000Subtitle: 'Summit - 1000m: ISP Coordination, Metro Fiber Maintenance & High-Impact Incidents',

    topologyHeader: 'Ra\'anana Municipal Network Operations Center (NOC)',
    topologySubtitle: 'Live Telemetry, Dark Fiber Backbone, Security Cameras, Wireless P2P & Field Cabinets',
    fiberCutSim: 'Simulate Fiber Cut',
    dhcpStarvationSim: 'DHCP Flood / Exhaustion',
    qosEmergencySim: 'Prioritize 106 Emergency VoIP',
    restoreTopology: 'Restore Normal Topology',
    modePacketJourney: 'Interactive Packet Journey (Visual)',
    modeNocSites: 'NOC Map & Rack Telemetry',
    fiberPrimary: 'Primary 10G Dark Fiber',
    wirelessBackup: '60GHz High-Speed Radio',
    vpnBackup: 'IPsec VPN Backup',
    clickSitePrompt: 'Click any municipal site to inspect its switch cabinet',
    rackCabinet: 'Rack Cabinet',
    activeAlerts: 'Active Network Alerts',
    switchPortStatus: 'Switch Port Telemetry',

    scenarioTitle: 'Choose Simulation Scenario',
    playBtn: 'Auto Play Journey',
    pauseBtn: 'Pause',
    nextStep: 'Next Hop',
    prevStep: 'Previous Hop',
    resetPath: 'Reset',
    packetDissection: 'Packet Header Dissection (Layers 2, 3, 4 & Payload)',
    hardwareFieldTips: 'Field Hardware, Physical Specs & Practical Advice',
    cliVerification: 'CLI Verification & Diagnostic Commands',

    subnetCalcTitle: 'VLSM Subnet Calculator & Municipal Addressing Plan',
    cablingLabTitle: 'Fiber Optics, Connectors & Patch Cabling Lab',
    cliSandboxTitle: 'Interactive CLI Sandbox (Cisco IOS & ArubaOS-CX)',
    incidentSimTitle: 'Field Incident Simulator & Triage Challenges',
    interviewQuizTitle: 'Technical Interview Prep & Knowledge Verification',
    cheatSheetTitle: 'Field Cheat Sheet: Commands, Ports & Protocol Standards'
  }
};
