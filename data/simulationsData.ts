export interface TroubleshootingStep {
  id: string;
  label: string;
  command: string;
  output: string;
  analysis: string;
}

export interface TroubleshootingOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface IncidentSimulation {
  id: string;
  title: string;
  urgency: 'critical' | 'high' | 'medium';
  urgencyLabel: string;
  siteName: string;
  system: string;
  initialReport: string;
  backgroundInfo: string;
  investigationSteps: TroubleshootingStep[];
  rootCauseOptions: TroubleshootingOption[];
  correctResolutionDescription: string;
  badge: string;
}

export const INCIDENT_SIMULATIONS: IncidentSimulation[] = [
  {
    id: 'inc-lpr-ahuza',
    title: 'נפילת 4 מצלמות LPR עירוניות בצומת אחוזה / שברולט',
    urgency: 'critical',
    urgencyLabel: 'קריטי (משטרה וביטחון עירוני)',
    siteName: 'צומת רחוב אחוזה - קריית אתגרים, רעננה',
    system: 'מערך עיר חכמה & מצלמות LPR',
    initialReport: 'מוקד הרואה מדווח: כל 4 מצלמות זיהוי לוחיות רישוי בכניסה המזרחית לעיר הפסיקו להעביר שידור וידאו ומופיעות במצב Offline ב-PRTG.',
    backgroundInfo: 'המצלמות מותקנות על עמודי תאורה ומחוברות למתג תעשייתי מוקשח (Industrial Switch) בארון שטח מקומי. המתג מוזן בסיב אופטי Single Mode אל חדר השרתים העירוני.',
    investigationSteps: [
      {
        id: 'step-1',
        label: 'בדיקת פינג לכתובת המתג התעשייתי (10.50.85.10)',
        command: 'ping 10.50.85.10 -c 4',
        output: 'PING 10.50.85.10: 56 data bytes\n64 bytes from 10.50.85.10: icmp_seq=0 ttl=254 time=1.84 ms\n64 bytes from 10.50.85.10: icmp_seq=1 ttl=254 time=1.42 ms\n64 bytes from 10.50.85.10: icmp_seq=2 ttl=254 time=1.51 ms\n--- 10.50.85.10 ping statistics --- 4 packets transmitted, 4 received, 0% packet loss',
        analysis: 'המתג עצמו חי, מגיב, והסיב האופטי מהעירייה תקין לחלוטין! הבעיה היא בציוד הקצה או באספקת החשמל למצלמות.'
      },
      {
        id: 'step-2',
        label: 'התחברות ב-SSH למתג ובדיקת סטטוס אספקת ה-PoE',
        command: 'show power inline',
        output: 'Module   Available     Used        Remaining\n(Watts)   (Watts)     (Watts)\n------   ---------   ---------   ---------\n1        120.0       118.5       1.5\n\nInterface  Admin  Oper    Power(Watts)  Device\nGi1/1      auto   on      28.5          CCTV-LPR-East\nGi1/2      auto   on      29.0          CCTV-LPR-West\nGi1/3      auto   on      29.5          CCTV-LPR-North\nGi1/4      auto   fault   0.0           CCTV-LPR-South-Heater (Overload)',
        analysis: 'תקציב ה-PoE של המתג הגיע למקסימום המוחלט! המצלמה הרביעית הפעילה גוף חימום פנימי בלילה עקב הקור, דרשה הספק נוסף, והמתג השבית את הפורטים עקב חריגת הספק (Power Overload)!'
      },
      {
        id: 'step-3',
        label: 'בדיקת יומן שגיאות של המתג',
        command: 'show logging | include PoE',
        output: '%ILPOWER-3-CONTROLLER_PORT_ERR: Controller port error, Interface Gi1/4: Power budget exceeded. Shutting down low-priority PoE ports to protect power supply.',
        analysis: 'הלוג מאשר חד משמעית: ספק הכוח בארון שטח מוגבל ל-120W בלבד, בעוד 4 המצלמות יחד דורשות כ-135W כאשר גופי החימום נכנסים לפעולה.'
      }
    ],
    rootCauseOptions: [
      {
        id: 'rc-1',
        label: 'הסיב האופטי נקרע עקב עבודות פיתוח בכביש',
        isCorrect: false,
        feedback: 'שגוי - המתג מגיב לפינג ב-1.5ms מהעירייה, הסיב תקין לחלוטין.'
      },
      {
        id: 'rc-2',
        label: 'חריגת תקציב אספקת חשמל (PoE Budget Exceeded) במתג השטח',
        isCorrect: true,
        feedback: 'מדויק! סך צריכת המצלמות עברה את ה-120W המקסימליים של ספק הכוח במתג עקב כניסת גופי החימום לפעולה.'
      },
      {
        id: 'rc-3',
        label: 'חומת האש חסמה את הפורט של מצלמות הווידאו',
        isCorrect: false,
        feedback: 'שגוי - המצלמות כלל לא דולקות ברמה הפיזית בגלל מחסור בחשמל.'
      }
    ],
    correctResolutionDescription: 'שדרוג ספק הכוח בארון השטח ל-240W תעשייתי כפול (Redundant DIN-Rail Power Supply), והגדרת עדיפויות אספקת PoE (Power Priority High) בפורטים.',
    badge: 'אלוף שו״ב עיר חכמה'
  },
  {
    id: 'inc-voip-moked-106',
    title: 'קטיעות שמע ושיחות שנשמטות במוקד החירום 106',
    urgency: 'critical',
    urgencyLabel: 'קריטי (שירות חירום עירוני)',
    siteName: 'מוקד 106, בניין עיריית רעננה',
    system: 'מרכזיית IP וטלפוניה (VoIP)',
    initialReport: 'מנהלת מוקד 106 מדווחת: מוקדנים לא מצליחים להבין את התושבים בטלפון. יש קיטועים קשים ("קול מתכתי"), ובחלק מהשלוחות השיחה מתנתקת לאחר 20 שניות.',
    backgroundInfo: 'המוקד מפעיל 20 שלוחות IP של חברת Yealink/Cisco הרשומות מול מרכזיית IP מקומית. לפני שעה החל גיבוי אוטומטי של שרתי הגבייה העירוניים דרך אותם מתגי קומה.',
    investigationSteps: [
      {
        id: 'step-1',
        label: 'בדיקת נתוני עומס בפורטי ה-Uplink במתג הקומה',
        command: 'show interface gigabitethernet 0/48',
        output: 'GigabitEthernet0/48 is up, line protocol is up\n  5 minute input rate 985000000 bits/sec (98.5% utilization), 142000 packets/sec\n  5 minute output rate 970000000 bits/sec (97.0% utilization)\n  Input queue: 0/75/0/0 (size/max/drops/flushes); Total output drops: 45892',
        analysis: 'קו ה-Uplink של הסוויץ\' מוצף ב-98% רוחב פס עקב הגיבוי הכבד! יש מעל 45,000 חבילות שנזרקות לפח (Output Drops).'
      },
      {
        id: 'step-2',
        label: 'בדיקת הגדרות QoS ומדיניות תעדוף חבילות דיבור',
        command: 'show mls qos interface gi0/48 queueing',
        output: 'QoS is DISABLED globally on this switch.\nAll packets are handled in FIFO (First-In, First-Out) Best-Effort mode.\nPriority Queue (strict-priority): OFF',
        analysis: 'התגלתה התקלה הקריטית: מתג הקומה הוחלף בשבוע שעבר בעקבות תקלת חומרה, והטכנאי שכח להפעיל עליו QoS גלובלי! חבילות הקול של מוקד 106 נזרקות יחד עם תעבורת הגיבוי.'
      }
    ],
    rootCauseOptions: [
      {
        id: 'rc-1',
        label: 'ספקית התקשורת של קווי ה-SIP Trunk קרסה',
        isCorrect: false,
        feedback: 'שגוי - המרכזייה מקבלת את השיחות, אך הן מקוטעות בתוך הרשת הפנימית.'
      },
      {
        id: 'rc-2',
        label: 'מנגנון QoS כבוי במתג הקומתי במקביל להצפת קו ה-Uplink בגיבויי נתונים',
        isCorrect: true,
        feedback: 'בדיוק! חבילות השמע של מוקד 106 נזרקות בתור ה-FIFO של המתג כי אין להן עדיפות על פני הגיבוי הענק.'
      },
      {
        id: 'rc-3',
        label: 'כבלי הרשת של הטלפונים תקולים פיזית',
        isCorrect: false,
        feedback: 'שגוי - כל 20 השלוחות סובלות מאותה בעיה בו-זמנית בעת תחילת הגיבוי.'
      }
    ],
    correctResolutionDescription: 'הפעלת `mls qos` במתג, הגדרת Trust Boundary מול הטלפונים, והקצאת Strict Priority Queue לתעבורת DSCP EF (46) של מוקד 106.',
    badge: 'מומחה VoIP ושרידות'
  },
  {
    id: 'inc-loop-city-hall',
    title: 'קריסת רשת פתאומית ואיטיות מוחלטת באגף הנדסה',
    urgency: 'high',
    urgencyLabel: 'גבוה (השבתת אגף עירוני)',
    siteName: 'אגף הנדסה ותכנון, בניין העירייה',
    system: 'מתגים מקומיים ופרוטוקול Spanning Tree',
    initialReport: 'עשרות עובדי האגף מדווחים כי המחשבים מנותקים, הדפדפנים מציגים Network Timeout ונוריות כל המתגים בארון מהבהבות בצורה מטורפת.',
    backgroundInfo: 'עובד חדש הגיע בבוקר, קיבל שני כבלי רשת ומיתג קטן, וניסה לחבר מדפסת ומחשב בעצמו.',
    investigationSteps: [
      {
        id: 'step-1',
        label: 'התחברות בקונסול למתג הקומה ובדיקת עומס מעבד (CPU)',
        command: 'show processes cpu sorted | exclude 0.00',
        output: 'CPU utilization for five seconds: 99%/95%; one minute: 98%; five minutes: 97%\nPID Runtime(ms)   Invoked      uSecs   5Sec   1Min   5Min TTY Process\n 12    45891002    489102        938  89.4%  88.2%  87.9%   0 Spanning-tree and ARP Input',
        analysis: 'המעבד של הסוויץ\' ב-99% חנק מוחלט! תהליך ה-ARP וה-STP צורך 89% מעבד - סימן מובהק ללולאת שכבה 2 (Broadcast Storm).'
      },
      {
        id: 'step-2',
        label: 'בדיקת קצב מסגרות שידור (Broadcasts) בממשקים',
        command: 'show interfaces | include is up|broadcasts',
        output: 'GigabitEthernet0/14 is up, line protocol is up\n  Received 1,489,020 broadcasts, 2,104,210 multicasts\n  0 runts, 0 giants, 0 CRC\n  Input rate: 890,000 packets/sec',
        analysis: 'פורט Gi0/14 מקבל קרוב למיליון שידורי Broadcast בשנייה! זהו הפורט שממנו מוזרקת הלולאה.'
      }
    ],
    rootCauseOptions: [
      {
        id: 'rc-1',
        label: 'מתקפת DDoS מחוץ לישראל על אתר העירייה',
        isCorrect: false,
        feedback: 'שגוי - העומס הוא בתוך רשת ה-LAN באגף ההנדסה עקב סופת שידור פנימית.'
      },
      {
        id: 'rc-2',
        label: 'לולאת רשת פיזית (L2 Loop) שיצרה Broadcast Storm עקב חיבור לא מבוקר ללא BPDU Guard',
        isCorrect: true,
        feedback: 'מדויק לחלוטין! חיבור מעגלי סגר לולאה שהציפה את הרשת במיליוני מסגרות שחנקו את מעבד המתג.'
      },
      {
        id: 'rc-3',
        label: 'שרת ה-Active Directory קרס',
        isCorrect: false,
        feedback: 'שגוי - הבעיה היא בשכבה 2 במתגי התקשורת.'
      }
    ],
    correctResolutionDescription: 'כיבוי מיידי של הפורט הסורר (`shutdown`), ניתוק הסוויץ\' הפיראטי, והפעלת `spanning-tree bpduguard enable` ו-`storm-control broadcast` על כל פורטי הקצה באגף.',
    badge: 'מגן מפני לולאות רשת'
  }
];
