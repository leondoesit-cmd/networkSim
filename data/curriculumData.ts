export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CliCommand {
  command: string;
  description: string;
  outputExample?: string;
}

export interface LearningNode {
  id: string;
  elevation: number; // 0, 250, 500, 750, 1000
  elevationLabel: string;
  tier: number; // 1 to 5
  title: string;
  subtitle: string;
  category: 'passive_active' | 'switching_wan' | 'monitoring_c2' | 'smart_city' | 'security_voip' | 'field_cli';
  categoryLabel: string;
  iconName: string;
  coords: { x: number; y: number }; // Percentage coords on topographic map
  estimatedMinutes: number;
  prerequisites: string[];
  summary: string;
  descriptionMarkdown: string;
  raananaUseCase: {
    title: string;
    location: string;
    scenario: string;
    solution: string;
  };
  cliCommands: CliCommand[];
  interviewTip: string;
  quiz: QuizQuestion[];
}

export interface ElevationZone {
  elevation: number;
  name: string;
  subtitle: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  description: string;
}

export const ELEVATION_ZONES: ElevationZone[] = [
  {
    elevation: 0,
    name: 'שפלת היסודות והתשתיות הפסיביות',
    subtitle: 'Basecamp - 0m: מודל OSI, כתובות IP, סיבים וכבילה פיזית',
    color: 'from-emerald-950/70 to-teal-950/40',
    borderColor: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'הבסיס המוחלט של כל רשת תקשורת: מרמת הכבל הבודד והמחבר האופטי ועד לפילוח כתובות IP ומודל השכבות.'
  },
  {
    elevation: 250,
    name: 'מישור האתרים והמתגים העירוניים',
    subtitle: 'Camp 1 - 250m: מתגים L2/L3, VLANs, יתירות Spanning-Tree וקישורי רדיו',
    color: 'from-cyan-950/70 to-sky-950/40',
    borderColor: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'חיבור עשרות מבני עירייה, בתי ספר ומוסדות ציבור ברעננה באמצעות סוויצ\'ים, הפרדת רשתות וחיבורים אלחוטיים.'
  },
  {
    elevation: 500,
    name: 'רכס השו״ב, הניתוב והאינטרנט העירוני',
    subtitle: 'Ridge - 500m: מערכות ניטור PRTG, פרוטוקול SNMP, שרתי ליבה וניתוב אינטרנט',
    color: 'from-blue-950/70 to-indigo-950/40',
    borderColor: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    description: 'עין הצופר של הרשת העירונית: לדעת על כל תקלה לפני שהמשתמש מתקשר, ניתוב תעבורה לאינטרנט וסנכרון שירותי ליבה.'
  },
  {
    elevation: 750,
    name: 'רמת עיר חכמה, אבטחת מידע וטלפוניה',
    subtitle: 'Plateau - 750m: מצלמות LPR, מתגים מוקשחים, חומות אש ומרכזיות IP',
    color: 'from-amber-950/70 to-orange-950/40',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'ממשק העירייה עם השטח הציבורי: מצלמות ביטחון, ארונות חוץ, סינון גישה הדוק ושרידות מרכזיית החירום 106.'
  },
  {
    elevation: 1000,
    name: 'פסגת המצוינות התפעולית וניהול שטח',
    subtitle: 'Summit - 1000m: מתודולוגיית תקלות דרג ב\', פקודות CLI מתקדמות ועבודה מול ספקים',
    color: 'from-violet-950/70 to-purple-950/40',
    borderColor: 'border-violet-500/30',
    badgeBg: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    description: 'הדרישה המרכזית במכרז 7274: יכולת עבודה עצמאית בשטח, איתור תקלות מורכבות וניהול מקצועי של קבלנים וספקי תקשורת.'
  }
];

export const LEARNING_NODES: LearningNode[] = [
  // --- TIER 1: 0m ---
  {
    id: 'node-osi-tcp',
    elevation: 0,
    elevationLabel: '0 מטר - שפלת היסודות',
    tier: 1,
    title: 'מודל OSI ופרוטוקולי TCP/IP',
    subtitle: 'שפת האם של איש הרשתות: מ-Layer 1 ועד Layer 7',
    category: 'passive_active',
    categoryLabel: 'יסודות ותשתיות',
    iconName: 'Layers',
    coords: { x: 18, y: 88 },
    estimatedMinutes: 25,
    prerequisites: [],
    summary: 'הבנת 7 שכבות המודל, מנגנון האינקפסולציה (Encapsulation), וההבדל הקריטי בין תקשורת מבוססת MAC (L2) לתקשורת מבוססת IP (L3).',
    descriptionMarkdown: `
### מה זה מודל OSI ולמה הוא קריטי לאיש רשתות רמה ב'?
מודל ה-OSI מחלק את כל תהליך העברת המידע ל-7 שכבות לוגיות. בתור איש תקשורת בעירייה, המודל הזה הוא **מפת הדרכים הראשית שלך לפתרון תקלות** (Troubleshooting):

1. **שכבה 1 (Physical):** הכבל הפיזי (נחושת Cat6/7, סיב אופטי), כרטיס רשת, מתח חשמלי, אור בסיב.
2. **שכבה 2 (Data Link):** מתגים (Switches), כתובות פיזיות (MAC Addresses), מסגרות (Frames), VLANs.
3. **שכבה 3 (Network):** נתבים (Routers), כתובות לוגיות (IP), ניתוב (Routing), חבילות (Packets).
4. **שכבה 4 (Transport):** TCP (אמין, חיבורי Handshake) לעומת UDP (מהיר, ללא אישור, חיוני לשיחות וידאו/VoIP ומצלמות).
5. **שכבות 5-7 (Session, Presentation, Application):** שירותי קצה כגון DNS, DHCP, HTTP/S, SIP (טלפוניה).

#### הכלל החשוב לאיתור תקלות בעירייה:
כשמשתמש ברעננה מתקשר ואומר "אין לי רשת", אנחנו תמיד בודקים מלמטה למעלה (Bottom-Up):
האם נורית ה-Link דולקת בכרטיס הרשת ובסוויץ'? (L1) -> האם יש תקשורת ב-VLAN הנכון ומתקבל MAC? (L2) -> האם המחשב מקבל כתובת IP תקינה מ-DHCP? (L3).
`,
    raananaUseCase: {
      title: 'עמדת קבלת קהל באגף הגבייה (בניין העירייה ברחוב אחוזה 103)',
      location: 'אגף הגבייה וההכנסות, עיריית רעננה',
      scenario: 'עובד מדווח שמערכת התשלומים "לא עולה והכל תקוע". טכנאי מתחיל מיהר לטעון שהשרת נפל.',
      solution: 'איש תקשורת רמה ב\' בדק לפי מודל OSI: ב-L1 נורית ה-Link במתג כבויה. בבדיקה פיזית מתחת לשולחן התגלה כי רגלית כבל ה-Cat6 נשברה והכבל נותק חלקית מהשקע. החלפת מגשר פתרה את התקלה תוך 2 דקות.'
    },
    cliCommands: [
      { command: 'ping 127.0.0.1', description: 'בדיקת תקינות מחסנית ה-TCP/IP המקומית במחשב הקצה (Loopback)' },
      { command: 'arp -a', description: 'הצגת טבלת ה-ARP (מיפוי בין כתובות IP לכתובות MAC ברשת המקומית)' },
      { command: 'netstat -an', description: 'הצגת כל החיבורים והפורטים הפעילים (L4) במערכת' }
    ],
    interviewTip: 'בראיון בעירייה ישאלו אותך: "איך אתה ניגש למחשב בעירייה שלא גולש?". תמיד תענה בגישת מודל OSI: "אני מתחיל משכבה 1 - בודק נוריות לינק וכבל פיזי, ממשיך לשכבה 2 לבדיקת שיוך ל-VLAN, עובר לשכבה 3 לבדיקת קבלת IP מ-DHCP, פינג ל-Gateway ולבסוף פינג ל-DNS". זה מראה על מקצועיות וסדר.',
    quiz: [
      {
        id: 'q-osi-1',
        question: 'באיזו שכבה של מודל ה-OSI פועל מתג (Switch) סטנדרטי המחבר מחשבים במשרדי העירייה?',
        options: ['שכבה 1 (Physical)', 'שכבה 2 (Data Link)', 'שכבה 3 (Network)', 'שכבה 4 (Transport)'],
        correctIndex: 1,
        explanation: 'מתג סטנדרטי הוא רכיב Layer 2 הפועל על בסיס כתובות MAC ומסגרות (Frames).'
      }
    ]
  },
  {
    id: 'node-ip-subnetting',
    elevation: 0,
    elevationLabel: '0 מטר - שפלת היסודות',
    tier: 1,
    title: 'כתובות IPv4 וסאבנטינג CIDR',
    subtitle: 'חלוקת מרחב הכתובות העירוני בצורה יעילה ומאובטחת',
    category: 'passive_active',
    categoryLabel: 'יסודות ותשתיות',
    iconName: 'Binary',
    coords: { x: 38, y: 86 },
    estimatedMinutes: 30,
    prerequisites: ['node-osi-tcp'],
    summary: 'חישובי מסכות רשת (Subnet Masks), פילוח כתובות לפי גודל אתר/מחלקה, כתובות פרטיות RFC 1918 והבנת שער ברירת המחדל (Default Gateway).',
    descriptionMarkdown: `
### תכנון מרחב הכתובות בעיריית רעננה
עיריית רעננה מנהלת עשרות מוסדות: בניין העירייה הראשי, בתי ספר יסודיים ותיכוניים (כגון תיכון אוסטרובסקי, מור מטרו-ווסט), גני ילדים, מרכזים קהילתיים, מוקד 106, מצלמות עיר חכמה וחיישני רמזורים.
לשם כך משתמשים בטווח הכתובות הפרטי לפי **RFC 1918** (לרוב מרחב \`10.0.0.0/8\` או \`172.16.0.0/12\`).

#### מסכות נפוצות ומשמעותן:
* **/24 (\`255.255.255.0\`):** 254 כתובות שמישות למחשבים. מתאים לבניין משרדים או בית ספר גדול.
* **/26 (\`255.255.255.192\`):** 62 כתובות שמישות. מתאים לאגף קטן (למשל אגף הנדסה או שפ״ע).
* **/28 (\`255.255.255.240\`):** 14 כתובות שמישות. מתאים למתחם מצלמות עירוני בצומת בודדת.
* **/30 (\`255.255.255.252\`):** 2 כתובות שמישות בלבד (Point-to-Point). חיבור ישיר בין נתב לסוויץ' ליבה או בין אתרים.

#### שער ברירת מחדל (Default Gateway):
כתובת הנתב המקומי (לרוב הכתובת הראשונה ברשת, כגון \`10.50.12.1\`). כל חבילת מידע שמיועדת מחוץ לתת-הרשת המקומית נשלחת ישירות ל-Gateway.
`,
    raananaUseCase: {
      title: 'הקצאת רשת עבור מצלמות LPR חדשות בצומת רחוב אחוזה - ירושלים',
      location: 'צומת אחוזה / ירושלים, רעננה',
      scenario: 'הותקנו 6 מצלמות זיהוי לוחיות רישוי ובקר רמזור חכם. מנהל הפרויקט ביקש להקצות רשת מתאימה ללא בזבוז כתובות.',
      solution: 'הוקצתה תת-רשת ייעודית עם מסכה /28 המכילה 14 כתובות שמישות (VLAN 320 - Security Cameras), שבודדה לחלוטין מתעבורת המשרדים ומאפשרת מקום להתרחבות עתידית.'
    },
    cliCommands: [
      { command: 'ipconfig /all', description: 'הצגת כתובת IP, מסכת רשת, שער ברירת מחדל ושרתי DNS בווינדוס' },
      { command: 'route print', description: 'הצגת טבלת הניתוב המקומית של מערכת ההפעלה' },
      { command: 'ipcalc 10.50.20.0/26', description: 'פקודת לינוקס לחישוב מהיר של Broadcast, טווח כתובות ומספר מארחים' }
    ],
    interviewTip: 'מראיינים אוהבים לשאול: "כמה כתובות מחשבים יש ברשת עם מסכה 255.255.255.240 (/28)?". התשובה: 16 פחות 2 (כתובת רשת וכתובת ברודקאסט) = 14 כתובות שמישות.',
    quiz: [
      {
        id: 'q-sub-1',
        question: 'כמה כתובות IP זמינות להקצאה למחשבים ולמצלמות קיימות בתת-רשת עם מסכה /24?',
        options: ['256', '254', '255', '128'],
        correctIndex: 1,
        explanation: 'בסאבנט /24 יש בסך הכל 256 כתובות, אך הראשונה שמורה לכתובת הרשת והאחרונה שמורה ל-Broadcast, לכן 254 שמישות למכשירים.'
      }
    ]
  },
  {
    id: 'node-passive-fiber-cables',
    elevation: 0,
    elevationLabel: '0 מטר - שפלת היסודות',
    tier: 1,
    title: 'תשתיות פסיביות: סיבים אופטיים וכבילה',
    subtitle: 'הלב הפיזי של העירייה: Cat6A, סיבי SM/MM, מחברים ולוחות ODF',
    category: 'passive_active',
    categoryLabel: 'יסודות ותשתיות',
    iconName: 'Cable',
    coords: { x: 62, y: 88 },
    estimatedMinutes: 35,
    prerequisites: ['node-osi-tcp'],
    summary: 'היכרות מעמיקה עם סוגי סיבים (Single Mode לעומת Multi Mode), כבלי נחושת Cat6A/7, מחברי LC/SC, ארונות ODF, בדיקות שבירת סיב באמצעות OTDR ומד עוצמה אופטי (Optical Power Meter).',
    descriptionMarkdown: `
### כבילה ותשתיות פסיביות ברחבי עיריית רעננה
במכרז 7274 מצוין מפורשות: *"נדרש ידע וניסיון בהגדרה, תפעול ותחזוקה של ציוד תקשורת ותשתיות פסיביות ואקטיביות, לרבות התקנת ציוד בקצוות ובאתרים שונים"*.
איש רשתות בעירייה לא רק יושב במזגן, אלא יוצא לארונות תקשורת ברחבי העיר!

#### 1. סיבים אופטיים (Fiber Optics):
* **Single Mode (SMF - צהוב בדרך כלל):** קוטר ליבה צר (9 מיקרון). משמש לחיבור בין אתרים מרוחקים בעיר רעננה (קילומטרים רבים, למשל בין בניין העירייה הראשי למרכז התחזוקה בפארק רעננה). משתמש בלייזר (אורכי גל 1310nm / 1550nm).
* **Multi Mode (MMF - כתום/טורקיז Aqua):** קוטר ליבה רחב (50/62.5 מיקרון - OM3/OM4). מוגבל לטווחים קצרים (עד 300-500 מטר). משמש בעיקר בתוך חדר השרתים הראשי לחיבור בין ארונות וסוויצ'ים.

#### 2. מחברים ולוחות ריכוז (ODF / Patch Panels):
* מחברי **LC** (מחבר דק עם קליפס - הפופולרי ביותר במתגי סיסקו/ארובה).
* מחברי **SC** (מחבר מרובע "Push-Pull" שנפוץ במערכות טלקום ישנות יותר של בזק).
* לוחות **ODF (Optical Distribution Frame):** מגירות ריכוז סיבים בארון התקשורת שבהן מבצעים ריתוך סיבים (Fusion Splicing) ומחברים פאטצ'-קורדים (כבלי גישור).

#### 3. כבלי נחושת (Copper):
* **Cat6A / Cat7:** מוליכי נחושת מסוככים (STP/FTP) המאפשרים מהירות 10Gbps ומרחק של עד 100 מטר.
* בדיקת תקשורת עם Fluke Cable Tester (בדיקת קצרים, סיבוב גידים Wiremap, והנחתה).
`,
    raananaUseCase: {
      title: 'ניתוק קו סיב אופטי בין חדר השרתים העירוני לספרייה העירונית ברחוב השחר',
      location: 'הספרייה העירונית רעננה, רחוב השחר',
      scenario: 'התקבלה התרעה על נפילת אתר הספרייה. מתג הקצה מנותק מהרשת העירונית.',
      solution: 'איש תקשורת דרג ב\' הגיע לארון התקשורת עם מד עוצמה אופטי (Optical Power Meter). נמצא כי עוצמת ה-Rx (קליטה) היא dBm 40- (חושך מוחלט). שימוש ב-VFL (Visual Fault Locator - לייזר אדום נראה) זיהה כי קבלן חפירות עירוני פגע בצינור התקשורת בקרבת הצומת. הוזמן קבלן ריתוך סיבים לתיקון הפגיעה.'
    },
    cliCommands: [
      { command: 'show interfaces transceiver', description: 'בדיקת עוצמות קליטה ושידור (Tx/Rx Power dBm) של מודול ה-SFP במתג' },
      { command: 'show interface status', description: 'בדיקת מצב פיזי של פורט (Connected / Notconnected / Disabled)' }
    ],
    interviewTip: 'במבחן קבלה ישאלו: "איך תבדיל בין תקלת כבל פסיבי לתקלת פורט במתג?". תשובה מצוינת: "ראשית אחליף פאטצ\'קורד לכבל תקין ידוע (Known Good Cable). אם עדיין אין Link, אבדוק את הפורט במתג עם פקודת show interface, אבצע בדיקה עם בודק כבלים (Fluke/Wiremap) לשקע שבקיר, או בדיקת עוצמת אור בסיב (Optical Power Meter)".',
    quiz: [
      {
        id: 'q-fiber-1',
        question: 'איזה סוג סיב אופטי ישמש לחיבור בין בניין העירייה באחוזה לבין אתר מרוחק במרחק 3 קילומטרים?',
        options: ['Multi Mode (OM3)', 'Single Mode (SMF)', 'כבל Cat5e מוגן', 'כבל קואקסיאלי'],
        correctIndex: 1,
        explanation: 'סיב מסוג Single Mode (SMF) מיועד למרחקים ארוכים של קילומטרים רבים בזכות ליבה צרה ואורכי גל לייזר.'
      }
    ]
  },
  {
    id: 'node-racks-edge-poe',
    elevation: 0,
    elevationLabel: '0 מטר - שפלת היסודות',
    tier: 1,
    title: 'ציוד קצה, ארונות תקשורת והזנת PoE',
    subtitle: 'התקנות שטח, ארונות 19 אינץ\', אל-פסק (UPS) ותקני PoE/PoE+',
    category: 'passive_active',
    categoryLabel: 'יסודות ותשתיות',
    iconName: 'Server',
    coords: { x: 82, y: 86 },
    estimatedMinutes: 25,
    prerequisites: ['node-passive-fiber-cables'],
    summary: 'ארגון ארונות שרתים וקיר 19", כבלי הזנה ו-PDU, שרידות חשמל עם UPS, חישובי תקציב הספק PoE/PoE+/PoE++ עבור מצלמות אבטחה וטלפוני IP.',
    descriptionMarkdown: `
### עבודה בארונות תקשורת עירוניים
בתיאור המשרה צוין: *"לרבות התקנת ציוד תקשורת בקצוות ובאתרים שונים"*.
כאיש תקשורת ברעננה תפגוש ארונות תקשורת מסוגים שונים:
1. **ארונות עומדים 42U** בחדר השרתים הראשי בעירייה.
2. **ארונות תלייה 9U/12U** במזכירויות בתי ספר וגני ילדים.
3. **ארונות כביש/חוץ מוקשחים (Street Outdoor Cabinets)** בצמתי תנועה עבור רמזורים ומצלמות ביטחון.

#### טכנולוגיית Power over Ethernet (PoE):
במקום להביא שקע חשמל 220V לכל מצלמת אבטחה או טלפון IP ברחבי העירייה, הסוויץ' מספק חשמל על גבי אותו כבל נחושת (Cat6)!
* **PoE (802.3af):** מספק עד 15.4W (מתאים לטלפוני IP פשוטים, חיישנים).
* **PoE+ (802.3at):** מספק עד 30W (מתאים לנקודות גישה Wi-Fi 6, מצלמות אבטחה עם אינפרא-אדום).
* **PoE++ / UPoE (802.3bt):** מספק עד 60W-90W (מתאים למצלמות LPR מהירות ומצלמות PTZ מסתובבות עם גופי חימום ומפוח נגד אדים בחורף).

**תקציב PoE של מתג (PoE Budget):** חובה לבדוק שהסוויץ' לא חורג מסך הוואטים שלו (למשל מתג 370W שמחוברות אליו 24 מצלמות כבדות עלול לקרוס).
`,
    raananaUseCase: {
      title: 'מצלמת PTZ מסתובבת באגם פארק רעננה שמאתחלת את עצמה שוב ושוב',
      location: 'מתחם האגם, פארק רעננה',
      scenario: 'מוקד הביטחון מתלונן שבכל פעם שמפעילים את זום המצלמה בלילה - המצלמה נכבית ומאתחלת.',
      solution: 'בדיקת ה-PoE בסוויץ\' גילתה שהפורט הוגדר כ-PoE רגיל (15.4W). בלילה, כשתאורת האינפרא-אדום ומנוע ה-PTZ נכנסו לפעולה, המצלמה דרשה 25W והפורט נכנס להגנת זרם יתר (Overload). הגדרת הפורט ל-PoE+ פתרה את הבעיה מיידית.'
    },
    cliCommands: [
      { command: 'show power inline', description: 'הצגת צריכת החשמל של כל פורט PoE בסוויץ\' וסך היתרה (Power Budget)' },
      { command: 'show environment power', description: 'בדיקת תקינות ספקי הכוח (Power Supplies) הכפולים במתג' }
    ],
    interviewTip: 'שאלה קלאסית במכרזי עירייה: "חיברת נקודת גישה אלחוטית Wi-Fi 6 חדשה לסוויץ\' קיים והנורית דולקת בצבע כתום והביצועים ירודים, מה יכולה להיות הסיבה?". תשובה מנצחת: "הסוויץ\' הישן מספק רק PoE 802.3af (15W) בעוד ה-AP החדש דורש PoE+ 802.3at (30W) כדי להפעיל את כל האנטנות והרדיו בעוצמה מלאה".',
    quiz: [
      {
        id: 'q-poe-1',
        question: 'איזה תקן PoE נדרש עבור מצלמת אבטחה חיצונית הכוללת גוף חימום ומנוע סיבוב מהיר (PTZ) הצורכת 28W?',
        options: ['PoE (802.3af)', 'PoE+ (802.3at)', 'USB-C Power', 'Passive 5V'],
        correctIndex: 1,
        explanation: 'תקן 802.3at (PoE+) מספק עד 30W לפורט, מספיק לצרכנים של עד 25.5W לאחר התחשבות בהנחתת הכבל.'
      }
    ]
  },

  // --- TIER 2: 250m ---
  {
    id: 'node-switching-vlans',
    elevation: 250,
    elevationLabel: '250 מטר - מישור האתרים',
    tier: 2,
    title: 'מתגים אקטיביים L2/L3 ו-VLANs',
    subtitle: 'חלוקה לוגית של העירייה: Access, Trunk וניתוב Inter-VLAN',
    category: 'switching_wan',
    categoryLabel: 'מיתוג ורשתות אתר',
    iconName: 'Network',
    coords: { x: 22, y: 66 },
    estimatedMinutes: 35,
    prerequisites: ['node-osi-tcp', 'node-ip-subnetting'],
    summary: 'מדוע חובה להפריד רשתות בעירייה, מה ההבדל בין פורט Access ל-Trunk בתקן 802.1Q, והגדרת ממשקי ניתוב SVI במתגי שכבה 3.',
    descriptionMarkdown: `
### למה חייבים VLANs בעיריית רעננה?
בעירייה אחת קיימות רשתות עם רמות סיווג וצרכים שונים לחלוטין:
* **VLAN 10 - הנהלת עירייה ומשאבי אנוש** (מידע רגיש ושכר).
* **VLAN 20 - משרדים ועובדי עירייה כלליים** (גבייה, הנדסה, שפ"ע).
* **VLAN 30 - טלפוניית IP (Voice VLAN)** (תעבורת דיבור שחייבת עדיפות).
* **VLAN 50 - מצלמות עיר חכמה ו-CCTV** (תעבורת וידאו כבדה שלא צריכה להאט את המחשבים).
* **VLAN 99 - רשת אורחים פתוחה (Guest Wi-Fi)** (מבודדת לחלוטין מהרשת הפנימית!).

#### סוגי פורטים במתג:
1. **Access Port:** פורט שמחובר למכשיר קצה בודד (מחשב, מדפסת, מצלמה). הפורט אינו מסומן (Untagged) ושייך ל-VLAN ספציפי אחד.
2. **Trunk Port (802.1Q):** פורט המחבר בין שני סוויצ'ים או בין סוויץ' לנתב/חומת אש. הוא מסמן כל Frame ב"תגית" (VLAN Tag) כדי שהסוויץ' השני יידע לאיזה VLAN שייכת התעבורה.

#### מתג L3 וממשקי SVI (Switched Virtual Interface):
מתג שכבה 3 מסוגל לנתב בעצמו בין ה-VLANs במהירות החומרה (Hardware ASICs) מבלי לשלוח את כל התעבורה הפנימית לנתב חיצוני.
`,
    raananaUseCase: {
      title: 'הקמת שלוחה זמנית של אגף התרבות במרכז המוזיקה "יד לבנים"',
      location: 'בית יד לבנים, רחוב אחוזה, רעננה',
      scenario: 'התקינו 4 עמדות מחשב חדשות ו-4 טלפוני IP. העובדים דיווחו שהטלפון והמחשב חולקים שקע רשת בודד בקיר.',
      solution: 'הוגדר פורט המתג עם Data VLAN (VLAN 20) לצד Voice VLAN (VLAN 30). כבל הרשת מהקיר חובר לטלפון ה-IP, וכבל ממכשיר הטלפון חובר למחשב (PC Port). הטלפון תייג את שיחותיו בתגית 30 והמחשב קיבל תעבורה ללא תיוג ב-VLAN 20.'
    },
    cliCommands: [
      { command: 'show vlan brief', description: 'הצגת כל ה-VLANs הקיימים במתג והפורטים המשויכים אליהם' },
      { command: 'show interfaces trunk', description: 'בדיקת פורטי ה-Trunk הפעילים ואילו VLANs מורשים לעבור בהם' },
      { command: 'switchport mode trunk', description: 'הגדרת פורט במתג כ-Trunk להעברת תעבורה מתויגת' }
    ],
    interviewTip: 'שאלה מבוקשת: "מה קורה אם שני סוויצ\'ים מחוברים בכבל אבל בפורט אחד מוגדר Native VLAN 1 ובשני Native VLAN 99?". תשובה: "תהיה שגיאת Native VLAN Mismatch, התעבורה ללא תיוג תחצה בטעות בין ה-VLANs ותיצור פרצת אבטחה ולולאות. סיסקו תציג התראת CDP/STP".',
    quiz: [
      {
        id: 'q-vlan-1',
        question: 'איזה פרוטוקול/תקן תעשייתי משמש לתיוג חבילות מידע בין מתגים בחיבור Trunk?',
        options: ['IEEE 802.11ax', 'IEEE 802.1Q', 'IEEE 802.3af', 'RFC 1918'],
        correctIndex: 1,
        explanation: 'תקן 802.1Q (Dot1q) מוסיף תגית של 4 בתים ל-Ethernet Frame הכוללת את ה-VLAN ID.'
      }
    ]
  },
  {
    id: 'node-redundancy-stp',
    elevation: 250,
    elevationLabel: '250 מטר - מישור האתרים',
    tier: 2,
    title: 'מניעת לולאות ויתירות: Spanning-Tree & LACP',
    subtitle: 'שמירה על הרשת מפני סופות שידור (Broadcast Storms) וקריסה',
    category: 'switching_wan',
    categoryLabel: 'מיתוג ורשתות אתר',
    iconName: 'ShieldAlert',
    coords: { x: 44, y: 64 },
    estimatedMinutes: 30,
    prerequisites: ['node-switching-vlans'],
    summary: 'איך עובד פרוטוקול Spanning Tree (STP/RSTP), תפקיד ה-Root Bridge, מנגנוני BPDU Guard ו-PortFast, ואיגוד קווים עם LACP (Port-Channel) להכפלת רוחב הפס.',
    descriptionMarkdown: `
### הסיוט הכי גדול של איש תקשורת: לולאת רשת (Loop)!
מסגרות Layer 2 (Ethernet Frames) **אינן כוללות שדה TTL** (Time To Live)!
אם מחברים בטעות שני כבלים בין אותם שני מתגים (או שמשתמש מחבר שני שקעים בקיר לאותו מתג קטן מתחת לשולחן), כל הודעת Broadcast תסתובב אינסוף פעמים במהירות האור ותגרום ל-**Broadcast Storm**.
התוצאה: מעבדי המתגים קופצים ל-100%, כל רשת העירייה קופאת ונופלת לחלוטין!

#### הפתרון: Spanning Tree Protocol (STP / RSTP - 802.1w):
הפרוטוקול מזהה נתיבים מעגליים וחוסם אוטומטית את אחד הפורטים (Blocking Mode). אם הקו הראשי נקרע - הקו החסום נפתח תוך פחות משנייה (RSTP).
* **Root Bridge:** המתג המרכזי שנבחר לנהל את העץ (חובה להגדיר ידנית את מתג הליבה העירוני כ-Primary Root!).
* **PortFast:** מאפשר לפורט של מחשב/מצלמה לעלות מיד למצב Forwarding בלי להמתין 30 שניות.
* **BPDU Guard:** מנתק מיד (Errdisable) פורט שמחובר אליו משתמש, אם זוהתה חבילת STP של סוויץ' פיראטי.

#### איגוד קווים - LACP / Port-Channel (802.3ad):
במקום לחסום קו כפול בין שני מתגי ליבה, מאגדים 2 או 4 סיבים אופטיים לצינור אחד חזק של 20Gbps/40Gbps עם שרידות וחלוקת עומסים!
`,
    raananaUseCase: {
      title: 'קריסת רשת פתאומית באגף החינוך בבניין העירייה',
      location: 'אגף החינוך, רעננה',
      scenario: 'עובד הביא סוויץ\' קטן ביתי מהבית כדי לחבר לפטופ ומדפסת, וחיבר בטעות שני כבלים לשקעים שונים בקיר. הרשת העירונית כולה החלה לקרטע.',
      solution: 'בבדיקה בסוויץ\' הקומתי זוהתה תעבורת Broadcast עצומה. הפעלת מנגנון BPDU Guard הפילה מיד את הפורט הספציפי והרשת ניצלה. הוגדר PortFast + BPDU Guard על כל פורטי הקצה באגף.'
    },
    cliCommands: [
      { command: 'show spanning-tree summary', description: 'בדיקת מצב ה-STP והאם המתג הנוכחי הוא ה-Root Bridge' },
      { command: 'show spanning-tree blockedports', description: 'איתור פורטים שנחסמו למניעת לולאה ברשת' },
      { command: 'show etherchannel summary', description: 'בדיקת תקינות איגוד קווי LACP (Port-Channel)' }
    ],
    interviewTip: 'במכרז רמה ב\' ברעננה ישאלו אותך: "האם תאפשר ל-STP לבחור Root Bridge לבד?". התשובה הנכונה: "בשום אופן לא! בברירת מחדל מי שיבחר עשוי להיות מתג ישן וחלש עם כתובת MAC נמוכה. אגדיר ידנית את סוויץ\' הליבה בחדר השרתים כ-Root בעזרת פקודת spanning-tree vlan X root primary".',
    quiz: [
      {
        id: 'q-stp-1',
        question: 'מה תפקידו של מנגנון BPDU Guard המוגדר על פורטי משתמשים במתג?',
        options: [
          'להאיץ את מהירות הגלישה באינטרנט',
          'להשבית מיד פורט אם מתחבר אליו סוויץ\' אחר ששולח הודעות STP, למניעת לולאות',
          'לחלק כתובות IP אוטומטית',
          'לספק חשמל PoE למחשב'
        ],
        correctIndex: 1,
        explanation: 'BPDU Guard מגן על פורטי Access: אם מישהו מחבר מתג פיראטי ששולח BPDUs, הפורט מושבת מיד להגנה על הרשת.'
      }
    ]
  },
  {
    id: 'node-wireless-ptp-links',
    elevation: 250,
    elevationLabel: '250 מטר - מישור האתרים',
    tier: 2,
    title: 'תשתיות אלחוטיות: Wi-Fi ובקרים וקישורי רדיו PTP',
    subtitle: 'חיבור אתרים ללא סיב פיזי, אנטנות כיווניות ורשתות ציבוריות',
    category: 'switching_wan',
    categoryLabel: 'מיתוג ורשתות אתר',
    iconName: 'Wifi',
    coords: { x: 68, y: 64 },
    estimatedMinutes: 30,
    prerequisites: ['node-switching-vlans'],
    summary: 'קישורי רדיו Point-to-Point (PTP / PtMP) בין מבני עירייה, עבודה עם תדרי 5GHz/60GHz, פריסת נקודות גישה (APs) מנוהלות ע"י בקר מרכזי (WLC / Cloud), ורשתות Wi-Fi עירוניות.',
    descriptionMarkdown: `
### תקשורת אלחוטית בסביבה עירונית רחבת אתרים
בתיאור המשרה הודגש: *"הכוללת תשתיות תקשורת קוויות ואלחוטיות... באתרים שונים"*.
לא תמיד יש אפשרות לחפור באדמה ולהעביר סיב אופטי (למשל אל בית העלמין העירוני, מחסני שפ"ע באזור התעשייה, או מתקני ספורט בפארק). כאן נכנסים **קישורי רדיו ואלחוט עירוני**!

#### 1. קישורי רדיו נקודה-לנקודה (Point-to-Point - PtP):
* אנטנות צלחת/פאנל כיווניות המותקנות על גגות מבני עירייה (למשל ציוד Siklu, Ubiquiti, Ceragon, Cambium).
* עבודה בתדרי 5GHz (חופשי) או 60GHz-80GHz (רוחב פס של גיגה-ביטים עם השהיה נמוכה במיוחד).
* בדיקת קו ראייה אופטי (Line of Sight - LoS) ואזור פרנל (Fresnel Zone) ללא עצים ומבנים חוסמים.

#### 2. מערך Wi-Fi עירוני ובקרים (WLC):
* נקודות גישה (APs) חיצוניות ופנימיות מנוהלות מרכזית (Cisco Catalyst Center / Aruba Central / FortiAP).
* הפרדה בין SSID עובדי עירייה (מבוסס 802.1X והזדהות אישית) ל-SSID אורחים (פתוח עם פורטל כניסה Captive Portal).
* נדידה חלקה (Seamless Roaming - 802.11r/k/v) כשעובד מסתובב בין קומות הבניין.
`,
    raananaUseCase: {
      title: 'חיבור בית קפה ומתקני ספורט מרוחקים בפארק רעננה ללא חפירת סיב',
      location: 'פארק רעננה, מערב העיר',
      scenario: 'הוקם מתחם חדש במערב הפארק. עלות חפירת כבישים להעברת סיב נאמדה במאות אלפי שקלים ואישורי חפירה של חודשים.',
      solution: 'הותקן קישור רדיו PtP מנוהל בתדר 60GHz מגג מרכז התחזוקה של הפארק לגג המתחם החדש עם רוחב פס של 1Gbps Full Duplex. התקשורת עלתה תוך יום עבודה אחד בעלות מזערית.'
    },
    cliCommands: [
      { command: 'show ap summary', description: 'בדיקת סטטוס כל נקודות הגישה המחוברות לבקר ה-Wi-Fi העירוני' },
      { command: 'show wireless client summary', description: 'הצגת כמות המשתמשים האלחוטיים המחוברים ורמת האות שלהם (RSSI)' }
    ],
    interviewTip: 'טיפ מקצועי: "מה הדבר הראשון שתבדוק אם קישור רדיו PtP בין שני מבנים חווה פתאום ניתוקים כבדים בחורף?". תשובה: "אבדוק ירידה בעוצמת הקליטה (RSSI / SNR) עקב תזוזת תורן ברוחות חזקות, צמיחת ענפי עצים שחדרו לאזור פרנל, או הפרעות תדר ממקור חיצוני".',
    quiz: [
      {
        id: 'q-ptp-1',
        question: 'מהו התנאי הפיזי ההכרחי ביותר להקמת קישור רדיו PtP מוצלח בתדר גבוה בין שני מבני עירייה?',
        options: ['כבל נחושת תת קרקעי', 'קו ראייה נקי (Line of Sight) ללא מכשולים', 'מתג L3 בכל צד', 'שירות ענן ציבורי'],
        correctIndex: 1,
        explanation: 'בתדרי רדיו גבוהים קו ראייה נקי לחלוטין (כולל אזור פרנל נקי ממכשולים ועצים) הוא תנאי קריטי להעברת אות יציבה.'
      }
    ]
  },
  {
    id: 'node-wan-metro-sites',
    elevation: 250,
    elevationLabel: '250 מטר - מישור האתרים',
    tier: 2,
    title: 'רשת עירונית רחבת אתרים (WAN & Metro-Ethernet)',
    subtitle: 'חיבור עשרות בתי ספר, מתנ"סים ומוסדות ציבור ברחבי רעננה',
    category: 'switching_wan',
    categoryLabel: 'מיתוג ורשתות אתר',
    iconName: 'Globe',
    coords: { x: 88, y: 66 },
    estimatedMinutes: 30,
    prerequisites: ['node-switching-vlans'],
    summary: 'איך עובדת רשת ה-WAN העירונית: קווי Metro-Ethernet של בזק וסלקום, סיבים אפלים (Dark Fiber), ניתוב סטטי לעומת פרוטוקולי ניתוב דינמיים (OSPF), ופתרונות שרידות קווים.',
    descriptionMarkdown: `
### טופולוגיית ה-WAN של עיריית רעננה
עיריית רעננה מפעילה מעל 80 אתרים מפוזרים ברחבי העיר:
* בתי ספר יסודיים ותיכוניים
* מרכזים קהילתיים ומתנ"סים
* תחנות שאיבת מים ומתקני ביוב
* משרדי שפ"ע ורווחה

#### איך מחברים את כל האתרים האלה לחדר השרתים הראשי?
1. **סיבים אפלים (Dark Fiber) בבעלות עירונית:** סיבים שהעירייה הניחה בתשתיות התת-קרקעיות שלה (בתוך צינורות תאורת רחוב ורמזורים). מספקים חיבור 10G ישיר ללא עלות חודשית לחברת תקשורת.
2. **תמסורת Metro-Ethernet (ספקיות תקשורת - בזק עסקים / סלקום / פרטנר):** חיבור L2 VPN (כגון שירות שילובים של בזק) המעביר VLANs עירוניים דרך רשת ספק התקשורת כאילו האתר המרוחק נמצא באותו הבניין.
3. **קווי גיבוי (Cellular / 4G-5G Failover):** נתבי גיבוי סלולריים המבטיחים שגם אם דחפור חתך את הסיב של בית הספר, המזכירות ומצלמות החירום ימשיכו לתקשר.
`,
    raananaUseCase: {
      title: 'הפסקת תקשורת פתאומית בתיכון "אוסטרובסקי" ברעננה בעת בחינת בגרות מקוונת',
      location: 'תיכון אוסטרובסקי, רחוב רמב"ם, רעננה',
      scenario: 'כל 400 המחשבים בבית הספר איבדו קשר עם שרתי העירייה והאינטרנט בעיצומה של בגרות דיגיטלית.',
      solution: 'בדיקה בנתב האתר הראתה נפילת ממשק ה-Metro הראשי של בזק. הודות לקו גיבוי סלולרי מוגדר, הנתב העביר אוטומטית (Route Failover) את תעבורת הבחינות הקריטית על גבי הגיבוי תוך שמירה על המשכיות עסקית עד לתיקון הסיב ע"י בזק.'
    },
    cliCommands: [
      { command: 'show ip route', description: 'הצגת טבלת הניתוב בנתב (נתיבים סטטיים, רשתות מחוברות ודינמיות)' },
      { command: 'traceroute 10.50.80.1', description: 'איתור נתיב החבילות בין חדר השרתים לאתר המרוחק לצורך זיהוי צוואר בקבוק' },
      { command: 'show ip interface brief', description: 'מצב כל ממשקי הנתב, כתובות ה-IP וסטטוס הקו' }
    ],
    interviewTip: 'דגש למשרה: "איך מוודאים שאתר מרוחק כמו מוקד 106 לא ינותק לעולם?". תשובה: "מיישמים שרידות כפולה (Dual-Homing) עם שני ספקים נפרדים (למשל קו ראשי סיב אופטי של בזק וקו גיבוי עצמאי של סלקום/סלולר), עם פרוטוקול ניתוב דינמי או IP SLA Object Tracking שמעביר תעבורה אוטומטית".',
    quiz: [
      {
        id: 'q-wan-1',
        question: 'מהו היתרון המרכזי של שירות תמסורת Metro-Ethernet עבור עירייה המפעילה עשרות אתרים?',
        options: [
          'הוא מאפשר להעביר VLANs ותקשורת L2 פנימית בין אתרים כאילו הם באותה רשת מקומית',
          'הוא מחליף לחלוטין את הצורך במתגים',
          'הוא אינו דורש שום ציוד תקשורת',
          'הוא מיועד רק לחיבור טלפונים ביתיים'
        ],
        correctIndex: 0,
        explanation: 'Metro-Ethernet מאפשר לחבר אתרים מרוחקים כהרחבה של רשת ה-LAN המקומית עם ביצועים גבוהים והעברת תיוגי VLAN.'
      }
    ]
  },

  // --- TIER 3: 500m ---
  {
    id: 'node-monitoring-prtg-snmp',
    elevation: 500,
    elevationLabel: '500 מטר - רכס השו״ב',
    tier: 3,
    title: 'מערכות שו״ב ומוניטורינג עירוניות',
    subtitle: 'PRTG, Zabbix, SNMP v2/v3 והתראות מוקד שליטה ובקרה (NOC)',
    category: 'monitoring_c2',
    categoryLabel: 'שו״ב ומוניטורינג',
    iconName: 'Activity',
    coords: { x: 26, y: 44 },
    estimatedMinutes: 35,
    prerequisites: ['node-switching-vlans', 'node-wan-metro-sites'],
    summary: 'ליבת דרישות המשרה: תפעול מערכות שו״ב, פרוטוקול SNMP (MIBs & OIDs), הגדרת ספי התראה (Thresholds), זיהוי תקלות פרואקטיבי ומניעת השבתות שירות.',
    descriptionMarkdown: `
### שו״ב (שליטה ובקרה) בעיריית רעננה
במודעת המשרה צוין מפורשות: *"התפקיד כולל תפעול ותחזוקה של ציוד ותשתיות תקשורת, מערכות שו״ב ומוניטורינג..."*.
איש רשתות רמה ב' לא מחכה שמוקד 106 יקבל תלונות מתושבים או מעובדי עירייה - הוא רואה את הנורית הופכת לאדומה ב-PRTG דקות קודם לכן!

#### איך עובד פרוטוקול SNMP (Simple Network Management Protocol)?
* **SNMP Manager (שרת ה-PRTG/Zabbix):** דוגם (Polling) את כל המתגים, הנתבים, השרתים והמצלמות בעירייה.
* **SNMP Agent:** תוכנה קטנה שרצה בתוך הסוויץ' של סיסקו/ארובה ושומרת נתונים סטטיסטיים.
* **MIB & OID:** לכל רכיב יש מזהה אובייקט (OID), למשל OID שמודד טמפרטורת מעבד, עומס תעבורה בפורט (Bandwidth In/Out), שגיאות שידור (CRC Errors) או מצב מאווררים.
* **SNMP v2c לעומת SNMP v3:** ב-v2c הסיסמה (Community String) עוברת כטקסט גלוי ברשת. ב-v3 יש הצפנה מלאה ואימות (AuthPriv) - חובה ברשתות מאובטחות בעירייה!
* **SNMP Traps:** הסוויץ' שולח התראה מיידית ודחופה לשרת השו״ב ברגע שמתרחש אירוע קריטי (למשל: ספק כוח נשרף או פורט Uplink נפל).
`,
    raananaUseCase: {
      title: 'זיהוי התחממות קריטית בארון תקשורת בצומת וייצמן - אחוזה לפני שריפת הציוד',
      location: 'צומת רחובות וייצמן - אחוזה, רעננה',
      scenario: 'ביום שרב כבד מזגן הארון כשל. עשרות מצלמות עיר חכמה ובקרי תנועה היו בסכנת השבתה.',
      solution: 'חיישן טמפרטורה מנוהל SNMP הפעיל התרעת Threshold ב-PRTG כשהטמפרטורה חצתה 50 מעלות. נשלח SMS חירום לצוות הכונן, שטס לארון ופתח אוורור חירום לפני שנגרם נזק לציוד.'
    },
    cliCommands: [
      { command: 'snmp-server community RaananaNet RO', description: 'הגדרת Community String לקריאה בלבד בסוויץ\' (SNMP v2c)' },
      { command: 'snmp-server enable traps', description: 'הפעלת שליחת הודעות Trap מיידיות לשרת השו״ב בעת אירועים קריטיים' },
      { command: 'snmpwalk -v 2c -c public 10.50.1.1', description: 'פקודת בדיקה לבדיקת מענה שרת SNMP וקבלת כל ה-OIDs מהרכיב' }
    ],
    interviewTip: 'שאלה בטוחה בראיון למשרה 7274: "איזה סנסורים מרכזיים תגדיר ב-PRTG עבור מתג אקטיבי מרכזי?". תשובה: "1. Ping/Uptime לזמינות. 2. CPU & Memory Utilization. 3. Traffic & Errors (CRC/Discards) בפורטי ה-Uplink. 4. טמפרטורה ומצב ספקי כוח (Hardware Health). 5. חיבוריות ל-Default Gateway".',
    quiz: [
      {
        id: 'q-snmp-1',
        question: 'מדוע באבטחת מידע מודרנית ממליצים לעבור מ-SNMP v2c ל-SNMP v3?',
        options: [
          'כי SNMP v3 מהיר פי 100',
          'כי SNMP v3 כולל אימות מאובטח והצפנה (Authentication & Encryption), בעוד ב-v2 הסיסמה גלויה',
          'כי SNMP v3 עובד ללא כתובת IP',
          'כי ב-v3 אין צורך בשרת שו״ב'
        ],
        correctIndex: 1,
        explanation: 'ב-SNMP v2c מחרוזת ה-Community עוברת ללא הצפנה (Plaintext), בעוד v3 מספק אבטחה ברמת User, אימות (SHA) והצפנה (AES).'
      }
    ]
  },
  {
    id: 'node-internet-routing-nat',
    elevation: 500,
    elevationLabel: '500 מטר - רכס השו״ב',
    tier: 3,
    title: 'מערך התקשורת לאינטרנט העירוני ו-NAT',
    subtitle: 'ISP Peering, ניתוב BGP/סטטי, פתרונות PAT ושרידות גלישה',
    category: 'monitoring_c2',
    categoryLabel: 'שו״ב ומוניטורינג',
    iconName: 'Cpu',
    coords: { x: 50, y: 42 },
    estimatedMinutes: 30,
    prerequisites: ['node-ip-subnetting', 'node-wan-metro-sites'],
    summary: 'הדרישה מהמכרז: "מערך התקשורת לאינטרנט העירוני" - חיבור לספקיות אינטרנט, ניתוב יוצא, תרגום כתובות NAT/PAT ושרידות קווים כפולים.',
    descriptionMarkdown: `
### ניהול האינטרנט העירוני ברעננה
עיריית רעננה מחזיקה חיבורי אינטרנט ברוחב פס גבוה עבור:
1. שירותי עירייה לתושב (תשלום ארנונה מקוון, אתר העירייה, תיקי חינוך).
2. גלישת עובדי העירייה (מעל 1,500 משתמשים בו זמנית).
3. רשתות Wi-Fi פתוחות לציבור בפארקים ובספריות.

#### איך זה עובד?
* **NAT / PAT (Port Address Translation):** אלפי מחשבים עם כתובות פרטיות (\`10.X.X.X\`) יוצאים לאינטרנט דרך מספר בודד של כתובות IP ציבוריות (Public IPs) שהעירייה שוכרת מאיגוד האינטרנט / ספק ה-ISP.
* **Dual-ISP Redundancy:** חיבור לשתי ספקיות אינטרנט עצמאיות (למשל בזק בינלאומי + סלקום עסקים).
* **BGP (Border Gateway Protocol) או ניתוב מנוטר:** אם ספק אחד נופל, כל התעבורה העירונית מופנית לספק השני אוטומטית ללא ניתוק שירות.
`,
    raananaUseCase: {
      title: 'האטה קיצונית בגלישה באינטרנט בבניין העירייה בשעות הבוקר',
      location: 'חדר השרתים המרכזי, עיריית רעננה',
      scenario: 'עובדים מתלוננים שאתרי הממשלה ומערכות התשלומים לא נטענים. קו האינטרנט הראשי (1Gbps) הגיע ל-100% ניצולת.',
      solution: 'איש תקשורת דרג ב\' ניתח את ה-Flow בחומת האש וגילה כי עשרות מחשבים ברשת החינוך הורידו במקביל עדכוני ענק. הוגדר מנגנון Traffic Shaping / Bandwidth Throttling שהגביל תעבורת עדכונים ל-20% בלבד מהקו ושמר 80% לתעבורה משרדית קריטית.'
    },
    cliCommands: [
      { command: 'show ip nat translations', description: 'הצגת טבלת תרגום הכתובות הפעילה בנתב/חומת האש' },
      { command: 'show ip bgp summary', description: 'בדיקת סטטוס חיבור ה-BGP מול ספקית האינטרנט (Established)' }
    ],
    interviewTip: 'במבחן קבלה: "מה ההבדל בין Static NAT ל-PAT?". תשובה: "Static NAT ממפה כתובת פרטית אחת לכתובת ציבורית אחת (משמש לשרת פנימי שחייב להיות נגיש מבחוץ). PAT (או NAT Overload) ממפה אלפי כתובות פרטיות לכתובת ציבורית אחת על בסיס מספרי פורטים ב-Layer 4".',
    quiz: [
      {
        id: 'q-nat-1',
        question: 'איזה מנגנון מאפשר למאות מחשבי עירייה עם כתובות פרטיות לצאת לאינטרנט דרך כתובת ציבורית אחת?',
        options: ['PAT (Port Address Translation / NAT Overload)', 'STP', 'VLAN Trunking', 'DHCP Relay'],
        correctIndex: 0,
        explanation: 'PAT ממפה כתובות פרטיות לכתובת ציבורית יחידה על ידי הקצאת פורט מקור (Source Port) ייחודי לכל חיבור.'
      }
    ]
  },
  {
    id: 'node-core-dhcp-dns-ntp',
    elevation: 500,
    elevationLabel: '500 מטר - רכס השו״ב',
    tier: 3,
    title: 'שירותי תשתית ליבה: DHCP, DNS ו-NTP',
    subtitle: 'שלושת עמודי התווך של כל רשת ארגונית: כתובות, שמות וזמן',
    category: 'monitoring_c2',
    categoryLabel: 'שו״ב ומוניטורינג',
    iconName: 'ServerCrash',
    coords: { x: 74, y: 44 },
    estimatedMinutes: 25,
    prerequisites: ['node-ip-subnetting', 'node-switching-vlans'],
    summary: 'הגדרת תחומי DHCP (Scopes), שימוש קריטי ב-DHCP Relay / IP Helper Address במתגי L3, פתרון תקלות DNS עירוניות, וסנכרון שעונים אחיד ב-NTP למצלמות ומערכות לוגים.',
    descriptionMarkdown: `
### "זה תמיד ה-DNS!" - שירותי תשתית בעירייה
כשאחד משלושת השירותים האלה מגמגם - כל העירייה מרגישה ש"אין אינטרנט", למרות שהכבלים והסוויצ'ים תקינים לחלוטין!

#### 1. DHCP & IP Helper Address:
איך מחשב ב-VLAN 20 מקבל כתובת IP משרת DHCP שיושב ב-VLAN 100?
הודעת בקשת ה-IP (DHCP Discover) היא הודעת Broadcast! מתג Layer 3 לא מעביר Broadcast בין VLANs.
הפתרון: פקודת **\`ip helper-address 10.50.100.50\`** על ממשק ה-SVI. המתג הופך את הבקשה ל-Unicast ומעביר אותה ישירות לשרת ה-DHCP!

#### 2. שרתי DNS פנימיים וחיצוניים:
* תרגום שמות מחשבים ושרתים פנימיים (\`moked106.raanana.local\`) וכתובות אינטרנט חיצוניות.
* עבודה מול שני שרתי DNS פנימיים (Primary + Secondary) לשרידות.

#### 3. פרוטוקול NTP (Network Time Protocol):
חובה שכל מתגי התקשורת, חומות האש ומצלמות האבטחה בעירייה יציגו **בדיוק את אותה השנייה**! אם שעון מצלמת LPR לא מסונכרן עם שרת המשטרה - הצילום ייפסל בבית משפט.
`,
    raananaUseCase: {
      title: 'מחשבים חדשים במוקד השירות 106 לא מקבלים כתובת IP',
      location: 'מוקד 106, עיריית רעננה',
      scenario: 'נפתחו עמדות מוקדנים חדשות. המחשבים תקועים על כתובת APIPA פנימית (169.254.X.X) ואינם מחוברים לרשת.',
      solution: 'בדיקה במתג הקומה גילתה שהפורטים שויכו ל-VLAN 40 החדש, אך על ממשק ה-SVI במתג הליבה נשכחה פקודת `ip helper-address`. לאחר הוספת הפקודה עם כתובת שרת ה-DHCP, כל העמדות קיבלו כתובת תוך שניות.'
    },
    cliCommands: [
      { command: 'ip helper-address 10.50.1.15', description: 'הגדרת כתובת שרת DHCP Relay על ממשק SVI במתג L3' },
      { command: 'nslookup mail.raanana.muni.il', description: 'בדיקת תקינות שאילתות DNS ותרגום כתובות' },
      { command: 'show ntp status', description: 'בדיקת סנכרון שעון המתג מול שרת ה-NTP הארגוני' }
    ],
    interviewTip: 'מה משמעות כתובת IP המתחילה ב-169.254? תשובה מיידית: "זו כתובת APIPA (Automatic Private IP Addressing). זה אומר שהמחשב מחובר פיזית לרשת אך כשל בקבלת מענה משרת ה-DHCP (בדיקת שרת, בדיקת Scope מלא, או היעדר ip helper-address)".',
    quiz: [
      {
        id: 'q-dhcp-1',
        question: 'איזו פקודה חובה להגדיר על ממשק SVI של VLAN במתג L3 כדי להעביר בקשות DHCP לשרת מרכזי?',
        options: ['ip helper-address', 'switchport mode trunk', 'no shutdown', 'spanning-tree portfast'],
        correctIndex: 0,
        explanation: 'פקודת ip helper-address מיישמת DHCP Relay וממירה שידורי Broadcast מקומיים להודעות Unicast ישירות לשרת.'
      }
    ]
  },

  // --- TIER 4: 750m ---
  {
    id: 'node-smart-city-cctv-iot',
    elevation: 750,
    elevationLabel: '750 מטר - רמת עיר חכמה',
    tier: 4,
    title: 'פרויקטי עיר חכמה, מצלמות LPR ו-IoT',
    subtitle: 'מצלמות ביטחון, בקרת רמזורים, חיישני שטח ומתגים מוקשחים',
    category: 'smart_city',
    categoryLabel: 'עיר חכמה',
    iconName: 'Camera',
    coords: { x: 24, y: 24 },
    estimatedMinutes: 35,
    prerequisites: ['node-racks-edge-poe', 'node-monitoring-prtg-snmp'],
    summary: 'סעיף מרכזי במשרה: "ליווי והקמה של תשתיות תקשורת במסגרת פרויקטים של עיר חכמה". חיבור מצלמות זיהוי לוחיות רישוי (LPR), בקרת צמתים, תקשורת בארונות חוץ ומתגים תעשייתיים מוקשחים (Ruggedized/Industrial Switches).',
    descriptionMarkdown: `
### עיריית רעננה כעיר חכמה (Smart City)
רעננה נחשבת לאחת הערים המובילות בישראל בהטמעת טכנולוגיות עיר חכמה:
* **מערך מצלמות ביטחון עירוני (CCTV & Safe City):** מאות מצלמות ברחבי הפארקים, גני המשחקים, מוסדות החינוך והרחובות.
* **מצלמות LPR (License Plate Recognition):** מצלמות חכמות בכל הכניסות והיציאות מהעיר לזיהוי רכבים גנובים וחשודים בזמן אמת עבור השיטור העירוני.
* **בקרת רמזורים חכמה:** מתן עדיפות לתחבורה ציבורית וניהול עומסי תנועה בציר אחוזה.
* **חיישני IoT עירוניים:** חיישני פינוי פחים, חיישני הצפות בניקוז בחורף, בקרת השקיה ממוחשבת.

#### אתגרי התקשורת בשטח:
1. **מתגים מוקשחים (Industrial Switches - למשל Cisco IE Series / Moxa):** פועלים ללא מאוורר (Fanless), עמידים בטווח טמפרטורות קיצוני (מינוס 40 ועד 75 מעלות צלזיוס), לחות ואבק (IP67).
2. **הגנת מתחי יתר (Surge Protectors):** ארונות שטח סופגים ברקים וקפיצות מתח - חובה הארקה תקנית בכל ארון!
3. **ניהול רוחב פס לווידאו (Multicast & IGMP Snooping):** מצלמות וידאו ב-4K יכולות להציף את הרשת. שימוש ב-IGMP Snooping מבטיח שהווידאו יישלח אך ורק למסכי המוקד שצופים בהם.
`,
    raananaUseCase: {
      title: 'הקמת 8 מצלמות ביטחון ומערכת כריזה בפארק "לב הפארק" ברעננה',
      location: 'שכונת לב הפארק, רעננה',
      scenario: 'הוקם פארק חדש. נדרש לחבר 8 מצלמות PTZ ומערכת כריזה IP למוקד הרואה בבניין העירייה.',
      solution: 'הותקן מתג תעשייתי מוקשח בארון תקשורת חיצוני עם הזנת PoE++ כפולה, סיב אופטי Single-Mode שרותך לארון הראשי, והוגדר VLAN מבודד (VLAN 180) עם חוקי עדיפות QoS כדי שזרם הווידאו לא יחווה קפיצות ואיבוד פריימים.'
    },
    cliCommands: [
      { command: 'show ip igmp snooping', description: 'בדיקת סינון תעבורת מולטיקאסט של מצלמות הווידאו ברשת' },
      { command: 'show power inline police', description: 'מניעת חריגת צריכת חשמל של מצלמות שטח בארונות חוץ' }
    ],
    interviewTip: 'בנושא עיר חכמה ישאלו: "איך תבטיח שמצלמת אבטחה בצומת לא תציף את הרשת העירונית בברודקאסטים?". תשובה: "1. שיוך ה-Port ל-VLAN ייעודי של מצלמות. 2. הפעלת Storm Control להגבלת שידורי Broadcast. 3. הפעלת IGMP Snooping לתעבורת Multicast. 4. הגדרת Port Security כדי שאף אדם ברחוב לא יוכל לנתק את המצלמה ולחבר לפטופ לרשת העירייה!".',
    quiz: [
      {
        id: 'q-smart-1',
        question: 'מדוע בארונות תקשורת בצמתי רחוב ברעננה משתמשים במתגים תעשייתיים (Industrial Switches) ולא במתגים משרדיים רגילים?',
        options: [
          'כי הם זולים יותר',
          'כי הם מתוכננים לעמוד בטמפרטורות קיצוניות, ללא מאווררים, עם הגנות מנחשולי מתח ואבק',
          'כי אין להם פורטים של רשת',
          'כי הם עובדים רק עם Wi-Fi'
        ],
        correctIndex: 1,
        explanation: 'מתגים תעשייתיים (מוקשחים) מיועדים לאקלים שטח קשה (חום שרב, לחות, אבק והפרעות חשמל) ללא מאווררים שצוברים אבק.'
      }
    ]
  },
  {
    id: 'node-cybersecurity-hardening',
    elevation: 750,
    elevationLabel: '750 מטר - רמת עיר חכמה',
    tier: 4,
    title: 'אבטחת מידע, הקשחת מתגים וחומות אש',
    subtitle: 'Port Security, 802.1X NAC, Fortinet/Check Point ו-VPN',
    category: 'security_voip',
    categoryLabel: 'אבטחת מידע וטלפוניה',
    iconName: 'Lock',
    coords: { x: 50, y: 22 },
    estimatedMinutes: 35,
    prerequisites: ['node-switching-vlans', 'node-internet-routing-nat'],
    summary: 'דרישת משרה: "תמיכה מקצועית ומתן מענה למשימות בתחום אבטחת המידע". מניעת חדירות, הצפנת חיבורי ניהול (SSH בלבד), נעילת פורטים לפי כתובת MAC, וניהול חוקי Firewall.',
    descriptionMarkdown: `
### אבטחת מידע ברשת המוניציפלית
רשויות מקומיות בישראל הן יעד מרכזי למתקפות סייבר (כופרות, פריצה למצלמות, חדירה למאגרי תושבים).
כאיש תקשורת רמה ב', אתה **חומת המגן הפיזית והלוגית הראשונה של העירייה**!

#### שכבות ההגנה שבאחריותך:
1. **Port Security במתגים:** הגבלת הפורט כך שרק כתובת ה-MAC של המחשב המורשה תוכל לתקשר. אם גורם זר מנתק את המחשב ומחבר לפטופ משלו - הפורט ננעל אוטומטית (\`errdisable\`) ונשלחת התרעה!
2. **אימות 802.1X (Network Access Control - NAC):** מחשב שמתחבר לרשת מחויב להזדהות באמצעות תעודת אבטחה דיגיטלית או שם משתמש ארגוני לפני שהוא מורשה לקבל גישה לרשת.
3. **הקשחת ציוד תקשורת (Hardening):**
   * חסימה מוחלטת של Telnet ו-HTTP לניהול הסוויץ' - שימוש אך ורק ב-**SSHv2** מוצפן ו-HTTPS.
   * הגבלת כתובות ה-IP שמורשות לגשת לממשק הניהול של המתגים (Management ACL).
   * שינוי סיסמאות ברירת מחדל ו-Community Strings של SNMP.
4. **חומות אש ארגוניות (Firewalls - Fortinet / Check Point):** הגדרת חוקי גישה מחמירים בין ה-VLANs (למשל: למצלמות אבטחה אין שום גישה למאגר השכר של העירייה).
`,
    raananaUseCase: {
      title: 'ניסיון חדירה פיזי לרשת העירייה דרך שקע רשת במסדרון עירייה פתוח',
      location: 'מסדרון קבלת קהל, אגף ההנדסה, עיריית רעננה',
      scenario: 'אדם ניתק כבל של עמדת מידע ציבורית וחיבר מחשב נייד פרטי כדי לנסות לסרוק את הרשת הפנימית.',
      solution: 'בזכות הגדרת Port Security עם Violation Shutdown, הפורט במתג ננעל תוך 0.1 שניות. נשלח SNMP Trap למוקד השו״ב, ואיש התקשורת איתר מיידית את הפורט הנעול ועדכן את קב"ט העירייה.'
    },
    cliCommands: [
      { command: 'switchport port-security maximum 1', description: 'הגבלת הפורט לכתובת MAC בודדת אחת' },
      { command: 'switchport port-security violation shutdown', description: 'השבתת הפורט מיד במידה ומזוהה כתובת MAC זרה ולא מורשית' },
      { command: 'show port-security interface gi0/12', description: 'בדיקת סטטוס האבטחה וכתובת ה-MAC הנלמדת על הפורט' }
    ],
    interviewTip: 'שאלה נפוצה במיוחד: "מה תעשה כדי להקשיח מתג תקשורת חדש לפני התקנתו בארון באתר שטח?". תשובה: "1. אשבית את כל הפורטים שאינם בשימוש (shutdown). 2. אגדיר Port Security על פורטי קצה. 3. אבטל Telnet ואפעיל SSHv2 בלבד. 4. אשנה את ה-Native VLAN מ-1 ל-VLAN לא בשימוש. 5. אגדיר Management ACL כך שרק כתובת שרת הניהול תוכל לגשת ל-CLI".',
    quiz: [
      {
        id: 'q-sec-1',
        question: 'מה יקרה לפורט שמוגדר עליו switchport port-security violation shutdown כאשר מתחבר מכשיר בעל MAC לא מוכר?',
        options: [
          'הוא יאט את מהירות הגלישה',
          'הפורט יושבת לחלוטין ויעבור למצב errdisable עד שאיש התקשורת יפתח אותו',
          'הוא ישלח הודעת SMS למשתמש',
          'הוא ישנה את ה-VLAN שלו אוטומטית'
        ],
        correctIndex: 1,
        explanation: 'מצב shutdown הוא המחמיר ביותר: ברגע של חריגת MAC, הפורט מושבת מיידית למניעת כל ניסיון חדירה.'
      }
    ]
  },
  {
    id: 'node-voip-telephony-sip',
    elevation: 750,
    elevationLabel: '750 מטר - רמת עיר חכמה',
    tier: 4,
    title: 'מרכזיות IP, פרוטוקול SIP ואיכות שמע QoS',
    subtitle: 'ניהול שלוחות טלפוניה, שרידות מוקד 106, SIP Trunks ו-DSCP',
    category: 'security_voip',
    categoryLabel: 'אבטחת מידע וטלפוניה',
    iconName: 'PhoneCall',
    coords: { x: 76, y: 24 },
    estimatedMinutes: 30,
    prerequisites: ['node-switching-vlans', 'node-core-dhcp-dns-ntp'],
    summary: 'דרישת משרה מפורשת: "היכרות ותפעול של מרכזיות IP". עבודה עם פרוטוקולי SIP ו-RTP, קווי SIP Trunk מול ספקיות, הגדרת QoS לשמירה על איכות קול ללא קיטועים ושרידות מוקד החירום העירוני.',
    descriptionMarkdown: `
### טלפוניית IP ומרכזיות בעיריית רעננה
במכרז צוין מפורשות: *"וכן היכרות ותפעול של מרכזיות IP"*.
בעיריית רעננה פועלים מאות מכשירי טלפון:
* לשכת ראש העיר והנהלת העירייה
* מוקד 106 (שחייב לפעול 24/7/365 גם בחירום וסערות!)
* מזכירויות כל בתי הספר וגני הילדים
* שלוחות עובדים במשרדים ובמוקדי קבלת קהל

#### פרוטוקולים מרכזיים:
1. **SIP (Session Initiation Protocol - פורט 5060):** פרוטוקול הסימון (Signaling) שאחראי על חיוג, צלצול, מענה, העברת שיחה וניתוק (כמו שליחת הודעות טקסט בין הטלפון למרכזייה).
2. **RTP (Real-time Transport Protocol - UDP):** הפרוטוקול שמעביר את גלי הקול עצמם בזמן אמת. משתמש ב-UDP כי אם חבילת שמע אבדה, אין טעם לבקש אותה שוב (זה יישמע כמו השהיה מוזרה בשיחה).
3. **SIP Trunk:** חיבור דיגיטלי ישיר של המרכזייה העירונית לרשת הטלפוניה הארצית של בזק/סלקום על גבי IP, המחליף את קווי ה-PRI והנחושת הישנים.

#### איכות שירות - QoS (Quality of Service):
אם עובד מוריד קובץ ענק באותו הרגע שמוקדן 106 מקבל שיחת חירום - חבילות הקול עלולות לסבול מ-Jitter (תנודתיות) ו-Packet Loss (קיטועים).
הפתרון: תיוג חבילות קול ב-**DSCP EF (Expedited Forwarding - ערך 46)** שנותן להן קדימות עליונה בתור המתגים!
`,
    raananaUseCase: {
      title: 'תלונות על קול מקוטע ושיחות מתנתקות במוקד העירוני 106',
      location: 'מוקד 106, עיריית רעננה',
      scenario: 'מוקדנים התלוננו שאינם שומעים ברור את התושבים והשיחות נשמעות "רובוטיות ומקוטעות".',
      solution: 'איש התקשורת בדק את הגדרות ה-QoS בסוויץ\' ומצא שפורטי ה-Trunk לא שימרו את תיוג ה-CoS/DSCP (Trust Boundary). הופעלה פקודת `mls qos trust dscp` ונוצר תור עדיפות ייעודי לקול (Priority Queue) במתגים - איכות השיחה חזרה להיות צלולה לחלוטין.'
    },
    cliCommands: [
      { command: 'show voice register pool', description: 'הצגת סטטוס רישום שלוחות ה-SIP במרכזיית IP' },
      { command: 'mls qos trust dscp', description: 'הנחיה למתג לסמוך על תגיות העדיפות של טלפוני ה-IP' },
      { command: 'show mls qos interface queue', description: 'בדיקת תורי העדיפות ולווידוא שאין השמטת חבילות קול (Drops)' }
    ],
    interviewTip: 'בנושא מרכזיות IP ישאלו: "מהם שני הפרוטוקולים העיקריים בשיחת VoIP ומה ההבדל ביניהם?". תשובה: "פרוטוקול SIP אחראי על ניהול השיחה (הקמה, צלצול, ניתוק על פורט 5060), ופרוטוקול RTP אחראי על העברת זרם השמע עצמו (Audio Stream) על גבי UDP בזמן אמת".',
    quiz: [
      {
        id: 'q-voip-1',
        question: 'איזה ערך DSCP נחשב לסטנדרט התעשייתי להבטחת עדיפות עליונה לחבילות קול (Voice Payload)?',
        options: ['CS0 (Best Effort)', 'EF - Expedited Forwarding (DSCP 46)', 'AF11', 'VLAN 1'],
        correctIndex: 1,
        explanation: 'ערך EF (Expedited Forwarding, DSCP 46) מבטיח שתעבורת הקול תעבור בתור העדיפות המהיר ביותר (Priority Queue) ללא השהיה.'
      }
    ]
  },

  // --- TIER 5: 1000m ---
  {
    id: 'node-field-troubleshooting-methodology',
    elevation: 1000,
    elevationLabel: '1000 מטר - פסגת המצוינות',
    tier: 5,
    title: 'מתודולוגיית איתור תקלות דרג ב\'',
    subtitle: 'פתרון תקלות מורכבות תוך הפעלת שיקול דעת ועבודה עצמאית',
    category: 'field_cli',
    categoryLabel: 'תקלות שטח ו-CLI',
    iconName: 'Wrench',
    coords: { x: 30, y: 10 },
    estimatedMinutes: 35,
    prerequisites: ['node-monitoring-prtg-snmp', 'node-cybersecurity-hardening'],
    summary: 'לב ליבת הגדרת התפקיד במכרז: "טיפול בתקלות ברמות מורכבות בינונית עד גבוהה, איתור תקלות ומתן פתרונות תוך הפעלת שיקול דעת ויכולת עבודה עצמאית". מתודולוגיות Divide and Conquer, בידוד תקלות ושחזור שירות מהיר.',
    descriptionMarkdown: `
### מה מבדיל איש רשתות רמה ב' מטכנאי מתחיל?
טכנאי מתחיל מנחש ומאתחל מכשירים בצורה עיוורת בתקווה שזה יסתדר.
**איש רשתות רמה ב' פועל במתודולוגיה שיטתית, מבודד את הגורם, ומבין בדיוק מה גרם לתקלה!**

#### שיטות העבודה המובילות באיתור תקלות:
1. **Divide and Conquer (הפרד ומשול):** מתחילים משכבה 3 (פינג ל-Default Gateway). אם יש פינג - שכבות 1 ו-2 תקינות לחלוטין! ממשיכים לבדוק שכבות 4-7 (DNS, Port, שרת). אם אין פינג - יורדים לשכבות 1-2 (כבל, פורט, סוויץ'). חוסך 80% מהזמן!
2. **Bottom-Up (מלמטה למעלה):** אידיאלי כשמכשיר בודד מנותק (בדיקת נורית כבל, לינק בסוויץ', שיוך VLAN, קבלת IP).
3. **השוואה לרכיב תקין (Compare with Working Configuration):** בדיקת מתג סמוך שכן עובד כדי לזהות שוני בקונפיגורציה.
4. **"מה השתנה?" (What Changed?):** 90% מהתקלות ברשת נגרמות משינוי שבוצע לאחרונה (עדכון גרסה, שינוי הגדרות, קבלן שעבד בארון, כבל שהוזז).
`,
    raananaUseCase: {
      title: 'ניתוק מוחלט של מערכת תשלומי חניה באזור התעשייה ברעננה',
      location: 'רחוב התעשייה / קריית אתגרים, רעננה',
      scenario: 'עשרות מדחנים ובקרי חניה הפסיקו לתקשר בבת אחת ביום ראשון בבוקר.',
      solution: 'במקום לרוץ לכל מדחן ברחוב, איש דרג ב\' ניגש למתג ההפצה המרכזי. בפקודת `show interfaces status` ראה שפורט ה-Uplink נמצא במצב `err-disabled`. בדיקה בלוג הראתה התראת שגיאות CRC עקב סיב מלוכלך. ניקוי המחבר האופטי עם עט ניקוי ייעודי החזיר את כל המערך לפעולה תוך 10 דקות ללא החלפת רכיבים יקרה.'
    },
    cliCommands: [
      { command: 'show logging', description: 'עיון ביומן האירועים הפנימי של המתג לאיתור שגיאות וניתוקים אחרונים' },
      { command: 'show interface gigabitethernet 0/1', description: 'בדיקת מוני שגיאות (CRC, Input/Output drops, Runts, Giants)' },
      { command: 'debug ip packet', description: 'מעקב חי אחר חבילות נתונים בזמן אמת (זהירות: להפעיל במשורה!)' }
    ],
    interviewTip: 'במבחן קבלה ישאלו אותך: "הגעת לתקלה שבה כולם לחוצים וצועקים עליך שהמערכת למטה, מה הצעד הראשון שלך?". תשובה: "1. שמירה על קור רוח ואיסוף מידע מדויק (מה בדיוק לא עובד? ממתי? האם בוצע שינוי?). 2. בידוד התקלה (האם זה משתמש בודד, אגף שלם או כל הבניין?). 3. בדיקת זמינות רכיבי הליבה (פינג לנתב ולשרת השו״ב). 4. פתרון שיטתי ולא ניחושים".',
    quiz: [
      {
        id: 'q-trouble-1',
        question: 'מהי הפעולה המהירה ביותר לאימות האם שכבות 1 ו-2 פועלות כשמשתמש מדווח על חוסר גלישה?',
        options: [
          'להחליף מיד את כרטיס הרשת במחשב',
          'לבצע ping לכתובת שער ברירת המחדל (Default Gateway); אם יש מענה - שכבות 1 ו-2 תקינות',
          'לאתחל את מתג הליבה העירוני',
          'להזמין טכנאי מחברת בזק'
        ],
        correctIndex: 1,
        explanation: 'אם פינג ל-Default Gateway מצליח, זה מוכיח בוודאות ששכבה 1 (כבל) ושכבה 2 (סוויץ\' ו-VLAN) מתפקדים כהלכה.'
      }
    ]
  },
  {
    id: 'node-cli-toolset-diagnostics',
    elevation: 1000,
    elevationLabel: '1000 מטר - פסגת המצוינות',
    tier: 5,
    title: 'ארגז כלי CLI ובדיקות פקודות שטח',
    subtitle: 'שליטה בפקודות סיסקו/ארובה/לינוקס וכלי Wireshark',
    category: 'field_cli',
    categoryLabel: 'תקלות שטח ו-CLI',
    iconName: 'Terminal',
    coords: { x: 54, y: 8 },
    estimatedMinutes: 30,
    prerequisites: ['node-field-troubleshooting-methodology'],
    summary: 'שליטה מוחלטת בטרמינל: פקודות show ו-debug קריטיות, ניתוח טבלאות MAC ו-ARP, שימוש בלכידת חבילות (Packet Capture / Port Mirroring / SPAN) לאיתור בעיות עמוקות ברשת.',
    descriptionMarkdown: `
### כלי ה-CLI שאיש רשתות בעירייה חייב להכיר בעל פה
כשאתה מתחבר לארון תקשורת בשטח באמצעות כבל קונסול (Console Cable - USB to RJ45), אין לך ממשק גרפי צבעוני. הטרמינל (PuTTY / SecureCRT) הוא הנשק שלך!

#### פקודות חובה ב-Cisco IOS / ArubaOS:
* **\`show mac address-table address <MAC>\`:** מראה לך בדיוק לאיזה פורט פיזי בסוויץ' מחובר המחשב או המצלמה.
* **\`show cdp neighbors detail\` / \`show lldp info remote-device\`:** מגלה לך מיד איזה סוויץ' אחר מחובר בקצה השני של הכבל, מאיזה דגם ובאיזה פורט!
* **\`show interfaces status\`:** מציג במבט אחד את כל עשרות הפורטים: מי מחובר, באיזה מהירות (1G/10G), דופלקס מלא או חצי, ולאיזה VLAN הוא שייך.
* **Port Mirroring / SPAN (Switched Port Analyzer):** העתקת כל התעבורה שעוברת בפורט מסוים לפורט שבו מחובר המחשב הנייד שלך עם תוכנת Wireshark לניתוח חבילות.
`,
    raananaUseCase: {
      title: 'איתור מכשיר בלתי מורשה שהתחבר לרשת באולם הספורט "מטרו-ווסט"',
      location: 'אולם הספורט מטרו-ווסט, רעננה',
      scenario: 'מערכת האבטחה התריעה על כתובת IP חשודה (10.50.60.188) שמבצעת סריקות ברשת המקומית.',
      solution: 'איש התקשורת ביצע `show arp | include 10.50.60.188` וחילץ את כתובת ה-MAC. לאחר מכן הריץ במתג `show mac address-table | include <MAC>` ואיתר את הפורט המדויק (פורט Gi0/18). הפורט נותק מיידית והמכשיר אותר פיזית בארון כרוז.'
    },
    cliCommands: [
      { command: 'show cdp neighbors', description: 'גילוי מיידי של המתגים והנתבים המחוברים ישירות למתג הנוכחי' },
      { command: 'show mac address-table dynamic', description: 'הצגת כל כתובות ה-MAC של המחשבים הפעילים ברשת כרגע' },
      { command: 'monitor session 1 source interface gi0/1', description: 'הגדרת Port Mirroring (SPAN) לדגימת תעבורה ב-Wireshark' }
    ],
    interviewTip: 'טיפ מקצועי לפקודות: "איך תזהה Duplex Mismatch בין מתג למכשיר קצה?". תשובה: "ב-show interface אראה הצטברות חריגה של שגיאות מסוג Late Collisions או CRC Errors, והפורט יופיע כ-Half Duplex במקום Full Duplex, מה שגורם להאטה קיצונית בקצב התעבורה".',
    quiz: [
      {
        id: 'q-cli-1',
        question: 'איזו פקודה מאפשרת לגלות איזה מתג או נתב מחובר בקצה השני של הכבל יחד עם הדגם ופורט החיבור?',
        options: ['show cdp neighbors', 'ping', 'ipconfig', 'show version'],
        correctIndex: 0,
        explanation: 'פרוטוקול CDP (או LLDP הסטנדרטי) מגלה מידע מפורט על שכנים מחוברים ישירות ברמת שכבה 2.'
      }
    ]
  },
  {
    id: 'node-vendor-management-sla',
    elevation: 1000,
    elevationLabel: '1000 מטר - פסגת המצוינות',
    tier: 5,
    title: 'עבודה מול טכנאים, ספקים והסכמי SLA',
    subtitle: 'ניהול קריאות מול בזק/סלקום/אינטגרטורים ופיקוח קבלני שטח',
    category: 'field_cli',
    categoryLabel: 'תקלות שטח ו-CLI',
    iconName: 'Briefcase',
    coords: { x: 76, y: 10 },
    estimatedMinutes: 25,
    prerequisites: ['node-field-troubleshooting-methodology'],
    summary: 'דרישה מפורשת במכרז: "עבודה מול טכנאים וספקים... ליווי פרויקטים". איך לנהל ספקי תקשורת חיצוניים, לפקח על קבלני סיבים וחפירות, לעמוד בהסכמי רמת שירות (SLA) ולהוביל משימות מקצה לקצה בעירייה.',
    descriptionMarkdown: `
### עבודה מול ספקים וקבלנים בעיריית רעננה
במכרז מודגש: *"בנוסף, התפקיד כולל ליווי והקמה של תשתיות תקשורת במסגרת פרויקטים של עיר חכמה, עבודה מול טכנאים וספקים"*.
כאיש תקשורת ברעננה, לא את הכל אתה עושה לבד: אתה מנהל ומפקח על הגורמים המובילים במשק!
* **חברות תשתית וטלקום:** בזק, סלקום, HOT, פרטנר.
* **אינטגרטורים וחברות חומרה:** בינת, מלם-תים, נס, טלדור, One1 (ספקי מתגי Cisco, חומות אש Fortinet ורדיו).
* **קבלני עבודות עפר וסיבים:** צוותים שפורסים סיבים בצנרות העירוניות ומבצעים ריתוכים.

#### מיומנויות חובה בעבודה מול ספקים:
1. **הוכחת חפות הרשת הפנימית:** ספק התקשורת תמיד ינסה לטעון בהתחלה "אצלנו הכל תקין, הבעיה בסוויץ' שלכם". איש דרג ב' מציג לו צילומי מסך של לוגים, גרפי PRTG, ובדיקות Loopback שמוכיחות שהתקלה בקו החיצוני!
2. **ניהול זמני תגובה (SLA - Service Level Agreement):** קווי תקשורת קריטיים בעירייה (כגון מוקד 106 וחדר שרתים) מוגדרים עם SLA של עד 4 שעות לתיקון תקלה ע"י בזק (24/7).
3. **פיקוח והטמעה נכונה:** כשקבלן סיבים מסיים עבודה, איש התקשורת דורש דו"ח בדיקות Fluke / OTDR מאושר לכל סיב לפני חתימה על חשבונית!
`,
    raananaUseCase: {
      title: 'הנחת תשתית תקשורת לפרויקט המצלמות החדש בציר אחוזה המחודש',
      location: 'רחוב אחוזה, רעננה',
      scenario: 'קבלן סיבים ביצע ריתוך סיבים ב-12 ארונות תקשורת בציר אחוזה. לאחר העבודה 3 מצלמות לא עלו.',
      solution: 'איש התקשורת של העירייה ביצע בדיקת הנחתה ומצא ניחות גבוה (dB 8 במקום פחות מ-1dB). הוא סירב לקבל את העבודה והורה לקבלן לרתך מחדש את הסיב כראוי במסגרת אחריות, עד לקבלת תוצאה מושלמת.'
    },
    cliCommands: [
      { command: 'show controllers', description: 'בדיקת נתוני השכבה הפיזית והשגיאות בחיבורי תמסורת מול ספק התקשורת' },
      { command: 'ping 8.8.8.8 size 1472 df-bit', description: 'בדיקת MTU מקסימלי בקו הספק ללא פרגמנטציה' }
    ],
    interviewTip: 'בראיון למשרה 7274 ישאלו אותך: "ספק תקשורת טוען שהקו שלו תקין אבל האתר עדיין למטה, מה תעשה?". תשובה מצוינת: "1. אבצע בדיקת Loopback פנימית וחיצונית למודם/ראוטר של הספק. 2. אציג לוגים של המתג המראים שגיאות Interface פיזיות או ניתוקי BGP/Carrier. 3. במידת הצורך אדרוש הסלמה (Escalation) למנהל משמרת טכני אצל הספק תוך ציון מספר ה-SLA החוזי של עיריית רעננה".',
    quiz: [
      {
        id: 'q-vendor-1',
        question: 'מה משמעות המונח SLA (Service Level Agreement) בהסכם בין עיריית רעננה לספק תשתית אינטרנט או תמסורת?',
        options: [
          'סוג הכבל הפיזי שבו משתמשים',
          'התחייבות חוזית לזמן תגובה ותיקון תקלות (למשל פתרון תוך 4 שעות לתקלה משביתה)',
          'כתובת ה-IP של ספק האינטרנט',
          'סוג המתג המותקן בארון'
        ],
        correctIndex: 1,
        explanation: 'הסכם SLA מגדיר את המחויבות החוזית של הספק לזמינות הרשת (למשל 99.9%) וזמני תגובה ותיקון מקסימליים לתקלות.'
      }
    ]
  }
];

export interface NodeProgress {
  [nodeId: string]: {
    completed: boolean;
    quizScore?: number;
    completedAt?: string;
  };
}
