'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  PhoneCall, 
  Wifi, 
  ShieldAlert, 
  Server, 
  Layers, 
  Cpu, 
  Cable, 
  Zap, 
  Binary, 
  Activity, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  AlertTriangle, 
  Radio, 
  Gauge, 
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Volume2
} from 'lucide-react';
import { audioFeedback } from '@/lib/audioFeedback';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedScenario } from '@/lib/curriculumTranslations';

export interface PathHop {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  locationName: string;
  siteId: string; // matches topology site ID
  layer: 'L1 Physical' | 'L2 Data Link' | 'L3 Network' | 'L4 Transport' | 'L7 Application';
  mediaType: 'copper' | 'fiber' | 'rf' | 'internal';
  signalDescription: string;
  
  // Hardware & Physical details
  hardwareName: string;
  hardwareModel: string;
  hardwareRole: string;
  physicalSpecs: { label: string; value: string }[];
  
  // What happens here
  whatHappensHardware: string;
  whatHappensSoftware: string;
  
  // Cognitive Mental Model to engrave
  mentalModelTitle: string;
  mentalModelDescription: string;
  
  // Packet dissection at this hop
  packetHeaders: {
    layer: string;
    fields: { key: string; value: string; note?: string }[];
  }[];
  activeHighlightedField?: string;

  // Real-world CLI command and output
  cliCommand: string;
  cliOutput: string;

  // Municipal Field Trap / Gotcha
  fieldTrapTitle: string;
  fieldTrapDescription: string;
}

export interface PathScenario {
  id: string;
  title: string;
  shortDesc: string;
  icon: 'camera' | 'phone' | 'wifi' | 'security';
  badgeColor: string;
  sourceLabel: string;
  targetLabel: string;
  totalDistance: string;
  avgLatency: string;
  hops: PathHop[];
}

export const PATH_SCENARIOS: PathScenario[] = [
  {
    id: 'lpr_camera',
    title: 'מצלמת LPR חכמה בצומת ויצמן ➔ שרת וידאו VMS בחדר השרתים העירוני',
    shortDesc: 'מסע של 8 Mbps וידאו בזמן אמת: מחיישן הפיקסלים, דרך סיכוך Cat6A, מתג מוקשח Moxa, סיב אופטי 1310nm, ניתוב L3 ב-Catalyst 9500 ועד אחסון SAN.',
    icon: 'camera',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    sourceLabel: 'צומת אחוזה / ויצמן (עמוד תאורה)',
    targetLabel: 'חדר שרתים ראשי (RACK-04 VMS Storage)',
    totalDistance: '2.4 ק"מ סיב אופטי',
    avgLatency: '1.4 ms',
    hops: [
      {
        id: 'lpr_hop_1',
        stepNumber: 1,
        title: 'דגימת פיקסלים, דחיסת H.265 והזנת PoE 30W',
        subtitle: 'חיישן המצלמה ממיר פוטונים לאות חשמלי ואורז פקטות וידאו',
        locationName: 'עמוד תאורה ומצלמה בצומת אחוזה / ויצמן',
        siteId: 'weizmann_junction',
        layer: 'L1 Physical',
        mediaType: 'copper',
        signalDescription: 'מתח חשמלי רציף 48V DC (PoE) יחד עם אותות נתונים מרובעים',
        hardwareName: 'מצלמת אבטחה חכמה לזיהוי לוחיות רישוי',
        hardwareModel: 'Axis Q1700-LE LPR Camera (4K Starlight Sensor)',
        hardwareRole: 'צילום לוחית רישוי ב-60fps, זיהוי OCR מובנה והפקת זרם RTSP',
        physicalSpecs: [
          { label: 'הזנת מתח', value: 'IEEE 802.3at PoE+ (Class 4, 30W)' },
          { label: 'קצב דחיסה', value: '8 Mbps H.265 High Profile' },
          { label: 'קונקטור שטח', value: 'RJ45 מוגן מים IP67' },
          { label: 'ממשק רשת', value: '1000Base-T (Gigabit Ethernet)' }
        ],
        whatHappensHardware: 'חיישן ה-CMOS ממיר אור לאותות חשמליים אנלוגיים, מעבד ה-DSP המשובץ דוחס את הפריימים לפורמט H.265. המצלמה שואבת 24.5 וואט מהכבל לצורך תאורת ה-IR בלילה.',
        whatHappensSoftware: 'תוכנת המצלמה מקימה חיבור RTSP (פורט 554), פורסת את הזרם לפקטות בגודל MTU סטנדרטי (1500 בתים), ומצמידה חותמת זמן מדויקת (RTP Timestamp).',
        mentalModelTitle: 'התמונה איננה קובץ אחד - היא זרם של אלפי רסיסים',
        mentalModelDescription: 'מצלמת IP אינה שולחת "תמונה" אלא מפרקת אותה לעשרות פקטות קטנות בכל שנייה. איבוד של פקטה אחת בלבד עלול לקרוע את הפריים כולו (Macroblocking).',
        packetHeaders: [
          {
            layer: 'L7 - Application (RTSP/RTP)',
            fields: [
              { key: 'Protocol', value: 'RTSP (Real-Time Streaming)' },
              { key: 'Payload', value: 'H.265 NAL Unit (License Plate Crop)' },
              { key: 'Timestamp', value: '0x3F8821B (90kHz Clock)' }
            ]
          },
          {
            layer: 'L4 - Transport (UDP)',
            fields: [
              { key: 'Source Port', value: '49210 (Dynamic Ephemeral)' },
              { key: 'Dest Port', value: '554 (RTSP Standard Stream)' },
              { key: 'Length', value: '1472 Bytes' }
            ]
          },
          {
            layer: 'L3 - Network (IPv4)',
            fields: [
              { key: 'Source IP', value: '10.24.50.14 (Camera IP)' },
              { key: 'Dest IP', value: '10.24.10.88 (Milestone VMS Server)' },
              { key: 'TTL', value: '64' },
              { key: 'DSCP', value: '32 (CS4 - Video Streaming)' }
            ]
          },
          {
            layer: 'L2 - Data Link (Ethernet)',
            fields: [
              { key: 'Source MAC', value: '00:40:8C:F2:A1:04 (Axis OUI)' },
              { key: 'Dest MAC', value: '00:0E:D7:99:33:11 (Switch Gateway)' },
              { key: 'EtherType', value: '0x0800 (IPv4)' }
            ]
          }
        ],
        activeHighlightedField: 'Source IP',
        cliCommand: 'show power inline Gi1/0/4',
        cliOutput: `Interface Admin  Oper       Power   Device              Class Max
--------- ------ ---------- ------- ------------------- ----- ----
Gi1/0/4   auto   on         24.8W   Axis-Q1700-LPR-01   4     30.0W`,
        fieldTrapTitle: 'נפילת מצלמות עם כניסת החושך (PoE Budget)',
        fieldTrapDescription: 'ביום המצלמה צורכת רק 8W, אך בלילה כשנורות ה-IR פועלות הצריכה מזנקת ל-25W. אם המתג הוגדר על 802.3af (15.4W) ולא 802.3at (PoE+), המצלמה תקרוס ברגע שיחשיך!'
      },
      {
        id: 'lpr_hop_2',
        stepNumber: 2,
        title: 'כבילה מוקשחת Cat6A S/FTP ושקע קיסטון תעשייתי',
        subtitle: 'הולכת האות החשמלי הדיפרנציאלי תוך סיכוך רעשים אלקטרומגנטיים',
        locationName: 'צינור תת-קרקעי מתחת לכביש אחוזה וצומת ויצמן',
        siteId: 'weizmann_junction',
        layer: 'L1 Physical',
        mediaType: 'copper',
        signalDescription: 'אותות חשמליים דיפרנציאליים ±2.5V בשיטת PAM-16',
        hardwareName: 'כבל נחושת קשיח מסוכך Cat6A S/FTP',
        hardwareModel: 'Teldor Heavy-Duty Outdoor UV & Rodent Resistant',
        hardwareRole: 'הולכת נתונים ומתח PoE באמינות מלאה בסמוך לקווי רמזורים ומתח גבוה',
        physicalSpecs: [
          { label: 'מבנה כבל', value: '4 זוגות שזורים (23 AWG Solid Copper)' },
          { label: 'סיכוך', value: 'S/FTP (סיכוך רשת חיצוני + סיכוך אלומיניום לכל זוג)' },
          { label: 'מרחק מרבי', value: 'עד 100 מטר (נמדד בשטח: 68 מטר)' },
          { label: 'הארקה', value: 'חיבור רציף של גיד הסיכוך להארקת הארון' }
        ],
        whatHappensHardware: 'הביטים מועברים כפולסים חשמליים דיפרנציאליים (Differential Signaling). זוג החוטים המשולב מבטל השראות אלקטרומגנטיות מהמנועים ופנסי הרמזורים של הצומת.',
        whatHappensSoftware: 'ברובד הפיזי (L1) המתג והמצלמה מסנכרנים את תדרי השעון (Clock Recovery) ומבצעים בדיקת איכות זוגות (Auto-MDIX).',
        mentalModelTitle: 'מדוע הזוגות שזורים (Twisted)? קסם הביטול העצמי',
        mentalModelDescription: 'כאשר רעש חיצוני חודר לכבל, הוא נקלט בשני החוטים בצורה זהה. כשהמקלט מחסר את האות של חוט A מחוט B, הרעש מתאפס (Noise Cancellation) ורק המידע המקורי נשאר!',
        packetHeaders: [
          {
            layer: 'L1 - Physical Signals',
            fields: [
              { key: 'Pair 1-2', value: 'Tx+ / Tx- (Differential Data + 48V DC)' },
              { key: 'Pair 3-6', value: 'Rx+ / Rx- (Differential Data + 48V DC)' },
              { key: 'Pair 4-5', value: 'Bi-directional Data + DC Return' },
              { key: 'Pair 7-8', value: 'Bi-directional Data + DC Return' }
            ]
          }
        ],
        activeHighlightedField: 'Pair 1-2',
        cliCommand: 'test cable-diagnostics tdr interface Gi1/0/4',
        cliOutput: `TDR test status: Completed
Port      Speed Pair Cable length        Pair status
--------- ----- ---- ------------------- --------------------
Gi1/0/4   1000M A    68 +/- 2 meters     Normal
                B    68 +/- 2 meters     Normal
                C    68 +/- 2 meters     Normal
                D    68 +/- 2 meters     Normal`,
        fieldTrapTitle: 'ביטול סיכוך בקצה הכבל (Unshielded Keystone)',
        fieldTrapDescription: 'אם טכנאי שטח מחבר כבל מסוכך יקר לקונקטור פלסטיק פשוט ללא הארקת מתכת, סיכוך האלומיניום הופך לאנטנה שקולטת רעשים במקום לחסום אותם!'
      },
      {
        id: 'lpr_hop_3',
        stepNumber: 3,
        title: 'מתג שטח מוקשח Moxa: בידוד VLAN 50 והוספת תג 802.1Q',
        subtitle: 'המתג מקבל את המסגרת, לומד MAC, ומתייג אותה לקראת ה-Trunk',
        locationName: 'ארון בקרת רמזורים בצומת אחוזה / ויצמן',
        siteId: 'weizmann_junction',
        layer: 'L2 Data Link',
        mediaType: 'internal',
        signalDescription: 'לוגיקת מיתוג חומרה ASIC ובדיקת טבלת CAM',
        hardwareName: 'מתג מוקשח לפס DIN תעשייתי',
        hardwareModel: 'Moxa EDS-G512E Industrial Managed Switch',
        hardwareRole: 'מיתוג L2, אספקת PoE+ בעומס חום קיצוני (-40°C עד 75°C), ותיוג VLAN',
        physicalSpecs: [
          { label: 'זיווד', value: 'DIN-Rail מתכת מוקשחת IP30' },
          { label: 'פורט כניסה', value: 'Port 4 (Access VLAN 50 - Cameras)' },
          { label: 'פורט יציאה', value: 'Port 11 SFP+ (Trunk 802.1Q)' },
          { label: 'הזנה', value: 'הזנה כפולה 24-48V DC מגובה מצברים' }
        ],
        whatHappensHardware: 'מעבד המיתוג של Moxa קורא את כתובת ה-Source MAC של המצלמה, מעדכן את טבלת ה-MAC (CAM Table), ובוחן את ה-Destination MAC. מאחר והיעד הוא מחוץ לסאבנט המקומי, המסגרת מכוונת ל-Default Gateway.',
        whatHappensSoftware: 'לפני הוצאת המסגרת לפורט ה-Trunk האופטי, המתג מחדיר לתוך ה-Header של ה-Ethernet תג 802.1Q בן 4 בתים המציין: `VLAN ID: 50, Priority: 4`.',
        mentalModelTitle: 'תג ה-VLAN הוא "מדבקת מחלקה סודית"',
        mentalModelDescription: 'פורט Access שולף את המדבקה כשמשהו יוצא למצלמה, ומדביק את המדבקה (VLAN 50) כשהמסגרת עולה לטראנק. המצלמה עצמה לעולם אינה רואה את תג ה-VLAN!',
        packetHeaders: [
          {
            layer: 'L2 - Data Link (802.1Q Tagged Frame)',
            fields: [
              { key: 'Dest MAC', value: '00:0E:D7:99:33:11 (Gateway Core SVI)' },
              { key: 'Source MAC', value: '00:40:8C:F2:A1:04 (Axis Camera)' },
              { key: 'TPID', value: '0x8100 (VLAN Tagged Identifier)' },
              { key: 'TCI / PCP', value: 'Priority 4 (Video Traffic)' },
              { key: 'VLAN ID', value: '50 (Municipal CCTV & LPR)' },
              { key: 'EtherType', value: '0x0800 (IPv4 Packet)' }
            ]
          }
        ],
        activeHighlightedField: 'VLAN ID',
        cliCommand: 'show mac-address-table port 4',
        cliOutput: `Port    MAC Address       VLAN  Type     Age
------- ----------------- ----- -------- ----
Port 4  00:40:8c:f2:a1:04 50    Dynamic  300`,
        fieldTrapTitle: 'טראנק ללא אישור VLAN (Allowed VLANs)',
        fieldTrapDescription: 'אם בפורט ה-Trunk של המתג הוגדר `switchport trunk allowed vlan 10,20,30` ונשכח `vlan 50`, המסגרת תיזרק לפח בשקט והמצלמה לא תעלה לעולם!'
      },
      {
        id: 'lpr_hop_4',
        stepNumber: 4,
        title: 'טרנסיבר SFP+ 10G-LR וטבעת סיבים אופטיים Singlemode',
        subtitle: 'המרה אופטו-אלקטרונית והעברת הבזקי לייזר 1310nm בזכוכית',
        locationName: 'שוחת תקשורת עירונית תת-קרקעית ברחוב אחוזה',
        siteId: 'weizmann_junction',
        layer: 'L1 Physical',
        mediaType: 'fiber',
        signalDescription: 'הבזקי אור אינפרא-אדום בלתי נראים בלייזר 1310nm',
        hardwareName: 'משדר-מקלט אופטי SFP+ וכבל סיב אופטי',
        hardwareModel: 'Cisco SFP-10G-LR על כבל Teldor 24-Cores OS2 Singlemode',
        hardwareRole: 'העברת 10Gbps למרחק קילומטרים ללא ניחות וללא השפעת ברקים',
        physicalSpecs: [
          { label: 'אורך גל', value: '1310nm (DFB Laser)' },
          { label: 'קוטר ליבה', value: '9 מיקרון (זכוכית סיליקה טהורה)' },
          { label: 'עוצמת שידור Tx', value: '-2.8 dBm (בטווח התקין)' },
          { label: 'עוצמת קליטה Rx', value: '-4.6 dBm (מרווח עוצמה מעולה)' }
        ],
        whatHappensHardware: 'ה-SFP+ ממיר את הביטים החשמליים מפסי הנחושת של לוח האם לפעימות אור לייזר. הפעימות דוהרות בתוך ליבת זכוכית בעובי שערת אדם במהירות של כ-200,000 ק"מ בשנייה.',
        whatHappensSoftware: 'מערכת ה-DDM (Digital Diagnostic Monitoring) דוגמת ברציפות את הטמפרטורה ועוצמת הלייזר (dBm) ומדווחת על ירידה בעוצמה לפני שהקו מתנתק.',
        mentalModelTitle: 'למה Singlemode ולא Multimode? קרן יחידה בלי התפזרות',
        mentalModelDescription: 'בסיב Multimode עבה קרני האור נשברות בהמון זוויות (Modal Dispersion) ומטשטשות את הפולסים במרחקים. ב-Singlemode דק קרן האור נעה ישר כמו סרגל לאורך קילומטרים!',
        packetHeaders: [
          {
            layer: 'L1 - Optical Layer (10GBASE-LR)',
            fields: [
              { key: 'Wavelength', value: '1310 nm' },
              { key: 'Tx Optical Power', value: '-2.8 dBm' },
              { key: 'Rx Optical Power', value: '-4.6 dBm' },
              { key: 'Link Status', value: '10G Full-Duplex (0 CRC Errors)' }
            ]
          }
        ],
        activeHighlightedField: 'Rx Optical Power',
        cliCommand: 'show interfaces TenGigabitEthernet1/0/1 transceiver detail',
        cliOutput: `Optical        High Alarm  High Warn  Low Warn   Low Alarm
Parameter      Threshold   Threshold  Threshold  Threshold  Current
-------------  ----------  ---------  ---------  ---------  -------
Tx Power(dBm)  1.4         -1.0       -6.0       -10.0      -2.8 dBm (OK)
Rx Power(dBm)  1.4         -1.0       -11.0      -14.4      -4.6 dBm (OK)`,
        fieldTrapTitle: 'קונקטור מלוכלך בגרגיר אבק בודד',
        fieldTrapDescription: 'גרגיר אבק בגודל 5 מיקרון על קצה הקונקטור (Ferrule) מסוגל לחסום לחלוטין את הליבה (9 מיקרון) ולגרום לאיבוד של 10dBm - הקו ייפול מיד!'
      },
      {
        id: 'lpr_hop_5',
        stepNumber: 5,
        title: 'מתג ליבה Cisco Catalyst 9500: ניתוב L3, שינוי MAC והורדת TTL',
        subtitle: 'הסרת מעטפת L2, ניתוב בין VLANs (סאבנט 50 ל-10) ויצירת Header חדש',
        locationName: 'ארון ראשי RACK-01 בחדר השרתים העירוני',
        siteId: 'city_hall_dc',
        layer: 'L3 Network',
        mediaType: 'internal',
        signalDescription: 'מנוע ניתוב בחומרה CEF (Cisco Express Forwarding) וטבלת FIB',
        hardwareName: 'מתג ליבה עירוני כפול (StackWise-Virtual)',
        hardwareModel: 'Cisco Catalyst 9500-40X (Enterprise Spine)',
        hardwareRole: 'ניתוב מרכזי בין כל ה-VLANs של העירייה במהירות Wirespeed של 40Gbps',
        physicalSpecs: [
          { label: 'מעבדי מיתוג', value: 'Dual UADP 3.0 ASIC' },
          { label: 'רוחב פס ליבה', value: '3.2 Tbps Forwarding Capacity' },
          { label: 'ממשק כניסה', value: 'TenGigE1/0/1 (Trunk מהצומת)' },
          { label: 'ממשק יציאה', value: 'TenGigE1/0/14 (אל שרת ה-VMS)' }
        ],
        whatHappensHardware: 'מנוע ה-CEF בודק את כתובת ה-IP של היעד (10.24.10.88). הוא מזהה שמדובר ברשת 10.24.10.0/24 של חוות השרתים. מעבד ה-ASIC מבצע את ההעברה בתוך פחות ממיקרו-שנייה.',
        whatHappensSoftware: '1. מקלף את ה-MAC Header הישן של הצומת.\n2. מוריד את ה-TTL ב-1 (מ-64 ל-63) ומחשב מחדש Checksum.\n3. מלביש MAC Header חדש: Source MAC של הליבה ו-Destination MAC של כרטיס הרשת בשרת הווידאו.',
        mentalModelTitle: 'ה-MAC משתנה בכל תחנה - ה-IP נשאר זהה לכל אורך הדרך!',
        mentalModelDescription: 'כמו מכתב בדואר: כתובת השולח והנמען (IP) נשארים קבועים על המעטפה, אך השליחים והמשאיות המעבירות אותו (כתובות ה-MAC) מתחלפים בכל סניף בדרך!',
        packetHeaders: [
          {
            layer: 'L3 - Network (IP Route & TTL Decrement)',
            fields: [
              { key: 'Source IP', value: '10.24.50.14 (Camera)' },
              { key: 'Dest IP', value: '10.24.10.88 (Milestone Server)' },
              { key: 'Old TTL', value: '64 ➔ New TTL: 63' },
              { key: 'Next Hop', value: '10.24.10.88 via VLAN 10 SVI' }
            ]
          },
          {
            layer: 'L2 - Data Link (Rewritten MAC Header)',
            fields: [
              { key: 'New Source MAC', value: '00:0E:D7:99:33:0A (Core SVI VLAN 10)' },
              { key: 'New Dest MAC', value: '00:50:56:B4:72:E1 (Milestone Server NIC)' },
              { key: 'VLAN Tag', value: 'None (Untagged Native on Access Server Port)' }
            ]
          }
        ],
        activeHighlightedField: 'Old TTL',
        cliCommand: 'show ip route 10.24.10.88',
        cliOutput: `Routing entry for 10.24.10.0/24
  Known via "connected", distance 0, metric 0 (connected, via interface)
  Routing Descriptor Blocks:
  * directly connected, via Vlan10
      Route metric is 0, share count 1`,
        fieldTrapTitle: 'לולאת ניתוב ללא מונה TTL',
        fieldTrapDescription: 'ללא שדה ה-TTL (Time to Live), פקטה שנכנסת לטעות הגדרה הייתה מסתובבת במעגלים לנצח ומחממת את המעבדים עד קריסת הרשת כולה!'
      },
      {
        id: 'lpr_hop_6',
        stepNumber: 6,
        title: 'שרת וידאו Milestone XProtect: פיענוח Socket ושמירה ב-Storage',
        subtitle: 'כרטיס רשת 10G קולט, מערכת ההפעלה מעבירה ל-RAM, והקובץ נכתב לדיסק',
        locationName: 'ארון שרתים RACK-04 ב-Data Center העירוני',
        siteId: 'city_hall_dc',
        layer: 'L7 Application',
        mediaType: 'internal',
        signalDescription: 'קליטת פסיקות כרטיס רשת (PCIe DMA) וחישוב שרתי אחסון SAN',
        hardwareName: 'שרת הקלטות עירוני VMS Enterprise',
        hardwareModel: 'Dell PowerEdge R750 + כרטיס Intel X520 Dual 10G SFP+',
        hardwareRole: 'קליטת מאות זרמי וידאו, ניתוח אלגוריתם OCR ללוחיות רישוי ושמירה 30 יום',
        physicalSpecs: [
          { label: 'זיכרון RAM', value: '128 GB DDR4 ECC' },
          { label: 'מערך אחסון', value: '120 TB SAS 12G RAID-6 Enterprise' },
          { label: 'כרטיס רשת', value: 'Intel X520 10GbE SFP+ Direct Attach Copper' },
          { label: 'כתובת IP', value: '10.24.10.88 (פורט שירות: 554 RTSP, 80/443 Web)' }
        ],
        whatHappensHardware: 'המסגרת נקלטת בפורט 10G של כרטיס הרשת. ה-NIC מבצע אימות Checksum בחומרה, ומעביר את המידע ישירות ל-RAM של השרת באמצעות מנגנון DMA (Direct Memory Access).',
        whatHappensSoftware: 'תוכנת Milestone XProtect מקבלת את הבתים מתוך ה-Socket, מרכיבה את הפריים המלא, מזהה את תווי לוחית הרישוי, ומצליבה אותם מול מאגר רכבים גנובים של משטרת ישראל.',
        mentalModelTitle: 'המסע הושלם! 2.4 קילומטרים תוך 1.4 מילישניות בלבד',
        mentalModelDescription: 'מרגע שקרני האור של פנסי הרכב פגעו בחיישן המצלמה בצומת, דרך החיווט, הסיב, המתגים והפיירוולים ועד לקריאת הלוחית במוקד הרואה - הכל התרחש מהר יותר ממצמוץ עין אנושית!',
        packetHeaders: [
          {
            layer: 'L7 - VMS License Plate Recognition Event',
            fields: [
              { key: 'Plate Number', value: '88-421-39 (Mazda 3 Gray)' },
              { key: 'Confidence', value: '98.7% Recognition Score' },
              { key: 'Junction ID', value: 'AHUZA-WEIZMANN-NORTH' },
              { key: 'Action', value: 'Logged to SQL + Live Alert to Moked 106' }
            ]
          }
        ],
        activeHighlightedField: 'Plate Number',
        cliCommand: 'ss -tulpn | grep 554',
        cliOutput: `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
tcp   LISTEN 0      128    0.0.0.0:554         0.0.0.0:*    users:(("milestone-vms",pid=2841,fd=14))`,
        fieldTrapTitle: 'עומס Ring Buffer בכרטיס הרשת (Packet Drops)',
        fieldTrapDescription: 'אם כרטיס הרשת של השרת מוגדר עם Buffer קטן (למשל 512 פקטות במקום 4096), פקטות ייזרקו בשקט תחת עומס ויגרמו לקפיאות והבהובים במסכי המוקד!'
      }
    ]
  },
  {
    id: 'moked_106_voip',
    title: 'שיחת חירום במוקד 106 ➔ שרת מרכזיה CUCM ועמדת מוקדן',
    shortDesc: 'מסע של אות קול אנלוגי מומר ל-RTP: דגימת קול G.711u, תיוג QoS עליון CoS 5 / DSCP 46 EF, Voice VLAN 30, וסנכרון מול Cisco CallManager.',
    icon: 'phone',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    sourceLabel: 'טלפון IP Cisco 8845 של אזרח/עובד',
    targetLabel: 'עמדת מוקדן חירום 106 (Jitter Buffer)',
    totalDistance: '1.2 ק"מ טבעת סיבים',
    avgLatency: '0.8 ms (Jitter < 1ms)',
    hops: [
      {
        id: 'voip_hop_1',
        stepNumber: 1,
        title: 'דגימת קול אנושי (G.711 Codec) וייצור פקטות RTP כל 20ms',
        subtitle: 'גלי הקול נדגמים 8,000 פעמים בשנייה ונארזים לחבילות קול זעירות',
        locationName: 'עמדת שירות לקוחות / עובד עירייה',
        siteId: 'moked_106',
        layer: 'L1 Physical',
        mediaType: 'copper',
        signalDescription: 'קול אנלוגי מומר לביטים דיגיטליים PCM 64kbps',
        hardwareName: 'טלפון IP משרדי מתקדם עם מצלמת HD',
        hardwareModel: 'Cisco IP Phone 8845 Video & Voice Endpoint',
        hardwareRole: 'דגימת קול, דחיסת שמע, הצגת מסך שיחה ותיוג תעבורת Voice',
        physicalSpecs: [
          { label: 'קודק שמע', value: 'G.711u-law (64 kbps לא דחוס, איכות צלולה)' },
          { label: 'קצב פקטות', value: '50 פקטות בשנייה (אחת בכל 20 מילישניות)' },
          { label: 'גודל פקטה', value: '214 בתים בסך הכל (160 בתי שמע + כותרות)' },
          { label: 'סוויץ פנימי', value: 'Dual-Port Gigabit (PC Port + LAN Port)' }
        ],
        whatHappensHardware: 'מיקרופון השפופרת קולט לחץ אוויר (גלי קול), ממיר אותם למתח אנלוגי. רכיב ה-DSP דוגם את האות 8,000 פעמים בשנייה ומפיק 8 ביטים לכל דגימה (PCM).',
        whatHappensSoftware: 'תוכנת הטלפון מקבצת 160 דגימות לחבילת RTP אחת כל 20ms. החבילה נשלחת באמצעות פרוטוקול UDP (ולא TCP!) כדי להימנע מהשהיות של אישור קבלה (ACK).',
        mentalModelTitle: 'למה אודיו חי לעולם אינו משתמש ב-TCP?',
        mentalModelDescription: 'בשיחת טלפון, אם פקטה אחת מאחרת ב-200ms היא חסרת תועלת לחלוטין! ב-TCP השולח היה עוצר הכל וממתין לשליחה חוזרת, מה שהיה גורם להקפאת השיחה.',
        packetHeaders: [
          {
            layer: 'L7 - Voice Payload (RTP Audio)',
            fields: [
              { key: 'Payload Type', value: 'G.711 PCMU (Code 0)' },
              { key: 'Sequence Number', value: '14902 (Incremented every 20ms)' },
              { key: 'Timestamp', value: '0x1A294 (Sample Clock)' }
            ]
          },
          {
            layer: 'L4 - Transport (UDP)',
            fields: [
              { key: 'Protocol', value: 'UDP (No retransmission)' },
              { key: 'Source Port', value: '16420' },
              { key: 'Dest Port', value: '24580 (RTP Voice Channel)' }
            ]
          },
          {
            layer: 'L3 - Network (IP)',
            fields: [
              { key: 'Source IP', value: '10.24.30.45 (Phone)' },
              { key: 'Dest IP', value: '10.24.30.12 (Dispatcher Desk)' },
              { key: 'DSCP', value: '46 (EF - Expedited Forwarding)' }
            ]
          }
        ],
        activeHighlightedField: 'DSCP',
        cliCommand: 'show cdp neighbors Gi1/0/6 detail',
        cliOutput: `Device ID: SEP0038DF82A109
Entry address(es): IP address: 10.24.30.45
Platform: Cisco IP Phone 8845, Capabilities: Host Phone
Interface: GigabitEthernet1/0/6, Port ID (outgoing port): Port 1
Power drawn: 7.200 Watts (IEEE 802.3af Class 2)`,
        fieldTrapTitle: 'טלפון שמחובר ל-Data VLAN בגלל חוסר CDP',
        fieldTrapDescription: 'אם פרוטוקול CDP מנוטרל בפורט המתג, הטלפון לא ילמד על קיום ה-Voice VLAN וינסה לבקש IP ברשת הנתונים הרגילה - הקול יישמע מקוטע בגלל עומס מחשבים!'
      },
      {
        id: 'voip_hop_2',
        stepNumber: 2,
        title: 'תיוג QoS: עדיפות CoS 5 (L2) ו-DSCP 46 EF (L3)',
        subtitle: 'הטלפון מסמן את הפקטה בעדיפות המקסימלית כדי שלא תמתין בתור',
        locationName: 'כרטיס הרשת המובנה של הטלפון',
        siteId: 'moked_106',
        layer: 'L2 Data Link',
        mediaType: 'internal',
        signalDescription: 'תיוג שדות איכות שירות 802.1p CoS ו-DSCP',
        hardwareName: 'מנוע איכות שירות חומרתי (QoS Hardware Engine)',
        hardwareModel: 'Cisco Trust-CoS Engine',
        hardwareRole: 'הקצאת עדיפות עליונה בטורי התורים של כל המתגים ברשת',
        physicalSpecs: [
          { label: 'שכבה 2 (802.1p)', value: 'CoS = 5 (Voice Bearer Priority)' },
          { label: 'שכבה 3 (IP)', value: 'DSCP = 46 (Expedited Forwarding - EF)' },
          { label: 'תור יציאה', value: 'Strict Priority Queue (LLQ - Low Latency)' }
        ],
        whatHappensHardware: 'לפני שידור המסגרת, המעבד מגדיר ב-Header של ה-IP את שדה ה-DSCP לערך 46 (101110 בינארי). ב-Header של ה-Ethernet הוא מסמן CoS 5.',
        whatHappensSoftware: 'המתג מקבל את המסגרת. מאחר והוגדר `mls qos trust cos` (או בקרת MQC), המתג סומך על הסימון של הטלפון ושומר על העדיפות לאורך כל שרשרת המתגים.',
        mentalModelTitle: 'תיוג QoS הוא "סירנת אמבולנס ברשת"',
        mentalModelDescription: 'כשמתג עמוס בתעבורת הורדות של גיגה-בייט, פקטות רגילות ממתינות בתור. פקטה עם תג DSCP 46 עוקפת מיד את כל המכוניות בתור ונשלחת ללא שניית עיכוב!',
        packetHeaders: [
          {
            layer: 'L2 - 802.1Q Header with QoS',
            fields: [
              { key: 'VLAN ID', value: '30 (Voice VLAN)' },
              { key: 'CoS (Priority)', value: '5 (Critical Voice Stream)' }
            ]
          },
          {
            layer: 'L3 - IPv4 Header with DSCP',
            fields: [
              { key: 'DSCP Value', value: '46 (Expedited Forwarding - EF)' },
              { key: 'Explicit Congestion', value: 'ECT(0) - ECN Capable' }
            ]
          }
        ],
        activeHighlightedField: 'CoS (Priority)',
        cliCommand: 'show mls qos interface Gi1/0/6 queueing',
        cliOutput: `Priority Queue (Queue 1): Enabled
Strict Priority Bandwidth: 30% Allocated
Queue 1 Drops: 0 (No Voice Packets Dropped)`,
        fieldTrapTitle: 'מתג שדורס את תג ה-QoS לערך 0 (Untrusted Port)',
        fieldTrapDescription: 'אם המתג לא הוגדר ב-Trust, הוא ימחק את תג ה-DSCP וישנה אותו ל-Best Effort (0). ברגע הראשון של עומס ברשת, המוקדן ישמע רעש מקוטע ורובוטי!'
      },
      {
        id: 'voip_hop_3',
        stepNumber: 3,
        title: 'מתג גישה Catalyst 9300: הפרדת Voice VLAN מ-Data VLAN',
        subtitle: 'המתג מפריד לחלוטין את מחשב המוקדן משיחת הטלפון על גבי אותו כבל',
        locationName: 'ארון תקשורת קומתי בבניין המוקד והביטחון',
        siteId: 'moked_106',
        layer: 'L2 Data Link',
        mediaType: 'copper',
        signalDescription: 'מיתוג פנימי בעל שני ערוצים נפרדים על גבי פורט בודד',
        hardwareName: 'מתג גישה ארגוני Cisco Catalyst 9300 PoE+',
        hardwareModel: 'Cisco C9300-48P (740W PoE Budget)',
        hardwareRole: 'הזנת טלפוני IP ב-PoE, אספקת Voice VLAN וטראנקים לליבה',
        physicalSpecs: [
          { label: 'פורט', value: 'GigabitEthernet1/0/6' },
          { label: 'Data VLAN', value: 'VLAN 35 (CAD Workstations)' },
          { label: 'Voice VLAN', value: 'VLAN 30 (Cisco VoIP Telephony)' },
          { label: 'מתח מסופק', value: '7.2W PoE (IEEE 802.3af)' }
        ],
        whatHappensHardware: 'אותו כבל רשת יחיד מחבר את המתג לטלפון, ומהטלפון כבל קצר נוסף מחבר את המחשב של המוקדן. המתג מעביר את תעבורת המחשב ללא תג ב-VLAN 35, ואת תעבורת הטלפון עם תג ב-VLAN 30.',
        whatHappensSoftware: 'המתג מונע לחלוטין כל זליגה (Snooping) בין תעבורת המחשב לשיחת הטלפון, ומבטיח שווירוס במחשב לא יוכל להקליט את השיחה החשאית.',
        mentalModelTitle: 'כבל אחד - שני עולמות מקבילים ונפרדים',
        mentalModelDescription: 'תכונת ה-Voice VLAN מאפשרת לחסוך פריסת שני שקעי רשת בכל שולחן, תוך שמירה על בידוד אבטחתי מוחלט בין ה-PC למכשיר הטלפון.',
        packetHeaders: [
          {
            layer: 'L2 - Multi-VLAN Port Architecture',
            fields: [
              { key: 'Untagged Traffic', value: 'VLAN 35 (Dispatcher CAD PC)' },
              { key: 'Tagged 802.1Q', value: 'VLAN 30 (Voice Telephony)' }
            ]
          }
        ],
        activeHighlightedField: 'Tagged 802.1Q',
        cliCommand: 'show run interface Gi1/0/6',
        cliOutput: `interface GigabitEthernet1/0/6
 switchport access vlan 35
 switchport voice vlan 30
 switchport mode access
 trust device cisco-phone
 spanning-tree portfast
 spanning-tree bpduguard enable`,
        fieldTrapTitle: 'חוסר בהגדרת BPDU Guard בפורטי טלפונים',
        fieldTrapDescription: 'אם עובד מחבר בטעות סוויץ קטן ביתי לשקע המחשב בגב הטלפון, ללא BPDU Guard תיווצר לולאת רשת שתשבית את כל הקומה!'
      },
      {
        id: 'voip_hop_4',
        stepNumber: 4,
        title: 'שרת מרכזיה Cisco CallManager (CUCM): ניתוב שיחה SIP',
        subtitle: 'המרכזיה מאמתת את המספר המחייג, בודקת תור ומקימה את השיחה',
        locationName: 'חוות שרתים מרכזית בבניין העירייה',
        siteId: 'city_hall_dc',
        layer: 'L7 Application',
        mediaType: 'internal',
        signalDescription: 'החלפת הודעות איתות SIP (Session Initiation Protocol)',
        hardwareName: 'אשכול שרתי מרכזיה עירוניים (CUCM Cluster)',
        hardwareModel: 'Cisco Unified Communications Manager 14.x on UCS Blade',
        hardwareRole: 'ניהול שלוחות, רישום מכשירים, ניתוב שיחות חוץ ומוקד חירום',
        physicalSpecs: [
          { label: 'פרוטוקול איתות', value: 'SIP over TLS / UDP 5060' },
          { label: 'מספר מקוצר', value: '106 (המוקד העירוני)' },
          { label: 'מנגנון תורים', value: 'Cisco UCCX (Automatic Call Distribution)' },
          { label: 'זמן הקמת שיחה', value: '180 מילישניות' }
        ],
        whatHappensHardware: 'שרת ה-CUCM מעבד את בקשת ה-SIP INVITE שנשלחה מהטלפון. הוא בודק את תוכנית המספור (Dial Plan), מאמת הרשאות ומצלצל בעמדת המוקדן הפנוי.',
        whatHappensSoftware: 'ברגע שהמוקדן מרים את השפופרת, ה-CUCM שולח הודעת `200 OK` המכילה את כתובות ה-IP והפורטים של שני הצדדים. מרגע זה, האודיו עובר ישירות (Peer-to-Peer RTP) ללא מעבר בשרת!',
        mentalModelTitle: 'איתות לעומת מדיה: השדכן והחתונה',
        mentalModelDescription: 'המרכזיה (CUCM) היא רק השדכן - היא מקשרת בין שני הטלפונים בפרוטוקול SIP. ברגע שהשיחה מתחילה, השדכן זז הצידה ושני הטלפונים משוחחים ביניהם ישירות ב-RTP!',
        packetHeaders: [
          {
            layer: 'L7 - SIP Protocol Exchange',
            fields: [
              { key: 'SIP Method', value: 'INVITE sip:106@10.24.10.20' },
              { key: 'From', value: '<sip:3045@raanana.muni.il>' },
              { key: 'To', value: '<sip:106@raanana.muni.il>' },
              { key: 'Call-ID', value: 'c94f1b-4491-a1b@10.24.30.45' },
              { key: 'Audio Format', value: 'm=audio 16420 RTP/AVP 0' }
            ]
          }
        ],
        activeHighlightedField: 'SIP Method',
        cliCommand: 'show voice call summary',
        cliOutput: `Active Calls: 18
Call ID: 9481 | Caller: 09-7610000 | Called: 106 | Codec: g711ulaw | Status: CONNECTED
Call Duration: 00:02:14 | Jitter: 0.4ms | Packet Loss: 0.00%`,
        fieldTrapTitle: 'חסימת פורט UDP 5060 או פילטר SIP ALG בפיירוול',
        fieldTrapDescription: 'אם בפיירוול מופעל מנגנון SIP ALG פגום, הוא ישבש את כתובות ה-IP שבתוך ה-Header של ה-SDP ויגרום לתופעת "שיחה ללא שמע באחד הצדדים" (One-Way Audio)!'
      },
      {
        id: 'voip_hop_5',
        stepNumber: 5,
        title: 'עמדת מוקדן חירום: Jitter Buffer והשמעה באוזניות',
        subtitle: 'סידור פקטות שהגיעו בהפרשי זמנים והמרה חוזרת לאות אנלוגי צלול',
        locationName: 'עמדת מוקד 106 בבניין הביטחון',
        siteId: 'moked_106',
        layer: 'L7 Application',
        mediaType: 'copper',
        signalDescription: 'מחסן פקטות זיכרון Jitter Buffer והמרת DAC לאודיו',
        hardwareName: 'טלפון מוקדן עם מערכת ראש מקצועית',
        hardwareModel: 'Cisco IP Phone 8851 + Plantronics Noise-Canceling Headset',
        hardwareRole: 'קבלת פקטות ה-RTP, סידורן מחדש והשמעה מיידית למוקדן',
        physicalSpecs: [
          { label: 'גודל Buffer', value: '30 מילישניות (Adaptive Jitter Buffer)' },
          { label: 'שיהוי כולל', value: '18ms (מתחת לתקן המחמיר של ITU-T G.114)' },
          { label: 'איכות שיחה', value: 'MOS 4.41 (איכות שיחה מושלמת)' }
        ],
        whatHappensHardware: 'רכיב ה-DAC (Digital-to-Analog Converter) בטלפון הופך את הביטים בחזרה למתח חשמלי זעיר המרעיד את ממברנת האוזניות ומשמיע את קול האזרח בבירור מוחלט.',
        whatHappensSoftware: 'אם פקטה מסוימת התעכבה בגלל עומס מקומי, ה-Jitter Buffer מפצה על העיכוב ומשמיע את הצלילים בקצב קבוע ואחיד ללא תופעת גמגום.',
        mentalModelTitle: 'ה-Jitter Buffer: המחסן שמיישר את השבילים',
        mentalModelDescription: 'פקטות באינטרנט מגיעות בקפיצות (פעם מהר, פעם לאט). ה-Jitter Buffer הוא דלי מים קטן: ממלאים אותו בקצב לא אחיד, אבל הברז למטה מוציא מים בקצב מדויק וחלק!',
        packetHeaders: [
          {
            layer: 'L7 - Audio DAC Output',
            fields: [
              { key: 'Audio Stream', value: 'Clean Voice Feed' },
              { key: 'Measured Jitter', value: '0.4 ms' },
              { key: 'Lost Packets', value: '0 Packets (100% Delivery)' }
            ]
          }
        ],
        activeHighlightedField: 'Measured Jitter',
        cliCommand: 'show voice call stats',
        cliOutput: `Stream ID: 412
Rx Packets: 6720 | Lost: 0 | Discarded: 0
Avg Latency: 4.2ms | Max Jitter: 0.8ms | MOS Score: 4.41`,
        fieldTrapTitle: 'שימוש ב-Wi-Fi לטלפוניה ללא 802.11r/k/v',
        fieldTrapDescription: 'כשעוברים עם טלפון אלחוטי בין אנטנות ללא מנגנון Roaming מהיר (Fast BSS Transition), הניתוק הרגעי של חצי שנייה יקטע את מילת המפתח של האזרח בעת דיווח חירום!'
      }
    ]
  },
  {
    id: 'wifi_citizen',
    title: 'תושב גולש ב-Wi-Fi ציבורי בפארק ➔ סינון FortiGate ➔ אינטרנט',
    shortDesc: 'מסע של גלי רדיו אלחוטיים 5GHz: נקודת גישה Aruba AP-575, בידוד Client Isolation, מנהרת סיב דרומית, בדיקת חוקי אבטחה ב-FortiGate 200F ותרגום כתובות NAT/PAT.',
    icon: 'wifi',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    sourceLabel: 'סמארטפון תושב ליד אגם פארק רעננה',
    targetLabel: 'שדרת ספקיות האינטרנט (בזק מטרו 10G)',
    totalDistance: '3.8 ק"מ סיב ומערכות ליבה',
    avgLatency: '2.1 ms',
    hops: [
      {
        id: 'wifi_hop_1',
        stepNumber: 1,
        title: 'גלי רדיו 5GHz Wi-Fi 6 (802.11ax) והקצאת כתובת DHCP',
        subtitle: 'המכשיר משדר גלי רדיו אלקטרומגנטיים ומקבל כתובת בסאבנט אורחים',
        locationName: 'ספסל ציבורי ליד האגם בפארק רעננה',
        siteId: 'raanana_park',
        layer: 'L1 Physical',
        mediaType: 'rf',
        signalDescription: 'גלי רדיו סינוסואידליים בתדר 5.2 GHz מאופננים ב-QAM-1024',
        hardwareName: 'סמארטפון תושב (Client Station)',
        hardwareModel: 'מכשיר נייד עם כרטיס Wi-Fi 6 Dual-Band',
        hardwareRole: 'חיבור לרשת האלחוטית העירונית הפתוחה Raanana_Free_WiFi',
        physicalSpecs: [
          { label: 'תדר שידור', value: '5.240 GHz (Channel 48, 80MHz Width)' },
          { label: 'אפנון אות', value: '1024-QAM (OFDMA)' },
          { label: 'עוצמת קליטה RSSI', value: '-58 dBm (קליטה חזקה ומצוינת)' },
          { label: 'כתובת IP שהוקצתה', value: '10.24.60.114 (VLAN 60 Guest)' }
        ],
        whatHappensHardware: 'אנטנת המכשיר פולטת גלי רדיו זעירים בהספק 50 מיליוואט. גלי הרדיו פוגעים באנטנות נקודת הגישה החיצונית המותקנת על עמוד התאורה.',
        whatHappensSoftware: 'המכשיר משלים תהליך 4-Way Handshake, ושולח בקשת DHCP Discover. שרת ה-DHCP העירוני מקצה לו כתובת IP פרטית עם זמן חכירה (Lease) של שעתיים.',
        mentalModelTitle: 'האוויר הוא תווך משותף: כולם מדברים באותו חדר',
        mentalModelDescription: 'בניגוד לכבל נחושת פרטי, באלחוט כולם משדרים באותו האוויר. פרוטוקול CSMA/CA מוודא שהטלפון "מקשיב" לפני שהוא משדר כדי לא להתנגש בשידור של תושב אחר!',
        packetHeaders: [
          {
            layer: 'L2 - 802.11 Wireless Frame Header',
            fields: [
              { key: 'Frame Control', value: 'Data Frame (QoS Data)' },
              { key: 'Addr 1 (Receiver)', value: '00:0B:86:14:8A:20 (Aruba AP BSSID)' },
              { key: 'Addr 2 (Transmitter)', value: '48:D7:05:88:12:FE (Citizen Phone)' },
              { key: 'Addr 3 (Dest)', value: 'Default Gateway' }
            ]
          },
          {
            layer: 'L3 - DHCP Request',
            fields: [
              { key: 'Requested IP', value: '10.24.60.114' },
              { key: 'Lease Time', value: '7200 seconds (2 Hours)' },
              { key: 'DNS Server', value: '10.24.10.5 (Municipal DNS Cluster)' }
            ]
          }
        ],
        activeHighlightedField: 'Requested IP',
        cliCommand: 'show ap association client 48:D7:05:88:12:FE',
        cliOutput: `Client MAC: 48:d7:05:88:12:fe | IP: 10.24.60.114 | AP: AP-Park-Lake-02
SSID: Raanana_Free_WiFi | Band: 5GHz | Channel: 48 | Speed: 574 Mbps
RSSI: 42 dB | SNR: 38 dB | Encryption: Open + OWE`,
        fieldTrapTitle: 'הפרעות תדרים ב-2.4GHz באזורים פתוחים',
        fieldTrapDescription: 'בתדר 2.4GHz יש רק 3 ערוצים שאינם חופפים (1, 6, 11). אם נקודות הגישה בפארק משדרות כולן באותו ערוץ, תיווצר הפרעה הרסנית (Co-Channel Interference) והגלישה תקרטע!'
      },
      {
        id: 'wifi_hop_2',
        stepNumber: 2,
        title: 'נקודת גישה Aruba AP-575: בידוד Client Isolation והמרת 802.11 ל-802.3',
        subtitle: 'המרה מגדרי אלחוט לאתרנט חוטי וחסימת תקשורת בין מכשירי תושבים',
        locationName: 'עמוד תאורה גבוה מול האמפיתיאטרון בפארק',
        siteId: 'raanana_park',
        layer: 'L2 Data Link',
        mediaType: 'internal',
        signalDescription: 'המרת מסגרות 802.11 Wireless ל-802.3 Ethernet חוטי',
        hardwareName: 'נקודת גישה חיצונית מוגנת מים Wi-Fi 6',
        hardwareModel: 'Aruba AP-575 Outdoor Access Point (IP67 Rated)',
        hardwareRole: 'כיסוי אלחוטי רחב, תמיכה בעד 500 משתמשים בו-זמנית ובידוד אבטחה',
        physicalSpecs: [
          { label: 'תקן עמידות', value: 'IP67 (אטומה לגשם, אבק ושרב)' },
          { label: 'חיבור רשת', value: 'SmartRate 2.5Gbps PoE 802.3bt' },
          { label: 'מצב אבטחה', value: 'Client Isolation (Station-to-Station Denied)' }
        ],
        whatHappensHardware: 'רכיב ה-Radio מקבל את גלי הרדיו, מפענח את הביטים ומזין אותם למעבד הרשת של ה-AP. ה-AP הופך את ה-Header של ה-802.11 Wireless ל-802.3 Ethernet תקני.',
        whatHappensSoftware: 'מופעל מנגנון Client Isolation: האקסס פוינט חוסם באופן קשיח כל ניסיון של תושב א\' לשלוח פקטות לתושב ב\' המחובר לאותה רשת. התעבורה מותרת אך ורק החוצה לשער ברירת המחדל!',
        mentalModelTitle: 'בידוד תושבים (Client Isolation): חומות שקופות בפארק',
        mentalModelDescription: 'ברשת ציבורית פתוחה ללא בידוד, האקר בספסל הסמוך יכול להריץ תוכנת סריקה ולראות את כל המכשירים של שאר המבלים. הבידוד מבודד כל משתמש בתוך בועה סגורה הרמטית.',
        packetHeaders: [
          {
            layer: 'L2 - Converted 802.3 Ethernet Frame',
            fields: [
              { key: 'Source MAC', value: '48:D7:05:88:12:FE (Citizen Phone)' },
              { key: 'Dest MAC', value: '00:0E:D7:99:33:01 (Park Switch Default Gateway)' },
              { key: 'VLAN Tag', value: '60 (Guest Public Wi-Fi)' }
            ]
          }
        ],
        activeHighlightedField: 'VLAN Tag',
        cliCommand: 'show wlan virtual-ap Raanana-Guest-VAP',
        cliOutput: `Virtual AP Profile: Raanana-Guest-VAP
SSID: Raanana_Free_WiFi | VLAN: 60
Station-to-Station Isolation: Enabled (Strict Forwarding to Gateway Only)`,
        fieldTrapTitle: 'שכחת Client Isolation ברשתות עירייה',
        fieldTrapDescription: 'ללא בידוד תחנות, משתמש זדוני יכול לבצע מתקפת Man-in-the-Middle (ARP Spoofing) וליירט סיסמאות של תושבים תמימים שגולשים ברשת הפארק!'
      },
      {
        id: 'wifi_hop_3',
        stepNumber: 3,
        title: 'מתג פארק Aruba CX 6200F והגבלת רוחב פס (Rate Limiting)',
        subtitle: 'הגבלת כל משתמש ל-20 Mbps כדי שמשתמש בודד לא "ישתה" את כל הקו',
        locationName: 'ארון תקשורת ממוזג בבניין הנהלת הפארק',
        siteId: 'raanana_park',
        layer: 'L2 Data Link',
        mediaType: 'fiber',
        signalDescription: 'מנגנון עיצוב תעבורה (Traffic Shaping / Policing)',
        hardwareName: 'מתג קמפוס מתקדם Aruba CX',
        hardwareModel: 'Aruba CX 6200F 24G Class 4 PoE 4SFP+',
        hardwareRole: 'מיתוג מקומי, אספקת PoE לאנטנות והגבלת רוחב פס לכל משתמש אורח',
        physicalSpecs: [
          { label: 'מדיניות רוחב פס', value: 'Max 20 Mbps Download / 5 Mbps Upload' },
          { label: 'פורט Uplink', value: 'SFP+ 10Gbps אל טבעת הסיבים הדרומית' }
        ],
        whatHappensHardware: 'המסגרת נקלטת בפורט של האנטנה. מנגנון ה-Policer בודק את קצב השידור של ה-MAC הספציפי. כל עוד המשתמש עומד במכסה של 20 Mbps, החבילות מועברות מיד אל ה-Uplink האופטי.',
        whatHappensSoftware: 'המתג שולח את התעבורה כשהיא מתוייגת ב-VLAN 60 Guest לאורך טבעת הסיבים הדרומית ישירות אל חומת האש המרכזית בחדר השרתים.',
        mentalModelTitle: 'רוחב פס ציבורי הוא ברז משותף: אסור לתת לאחד לרוקן את הבריכה',
        mentalModelDescription: 'אם תושב אחד יחליט להוריד משחק מחשב של 80GB, ללא Rate Limiting שאר מאות התושבים בפארק ירגישו שהאינטרנט קרס. ההגבלה שומרת על הגינות שוויונית לכולם.',
        packetHeaders: [
          {
            layer: 'L2 - Traffic Policing Token Bucket',
            fields: [
              { key: 'Cir Rate', value: '20,000 kbps (Committed Info Rate)' },
              { key: 'Burst Size', value: '256 KB' },
              { key: 'Action on Conforming', value: 'Transmit via 10G SFP+' }
            ]
          }
        ],
        activeHighlightedField: 'Cir Rate',
        cliCommand: 'show qos rate-limiting interface 1/1/8',
        cliOutput: `Port 1/1/8: Rate-limit in: 20000 kbps, out: 20000 kbps
Passed Packets: 198,401 | Dropped Over-Limit Packets: 0`,
        fieldTrapTitle: 'השארת רשתות אורחים ללא הגבלת רוחב פס',
        fieldTrapDescription: 'מספיק רכב אחד שחונה ליד הפארק ומפעיל עדכוני תוכנה כדי להציף את הסיב העירוני ולסתום את תעבורת ה-Uplink לשאר המערכות.'
      },
      {
        id: 'wifi_hop_4',
        stepNumber: 4,
        title: 'חומת אש FortiGate 200F: בדיקת IPS, סינון אתרים ותרגום NAT/PAT',
        subtitle: 'הפיירוול מגן על הרשת, חוסם אתרים אסורים ומתרגם את ה-IP הפרטי לציבורי',
        locationName: 'חוות שרתים מרכזית / שער האינטרנט העירוני',
        siteId: 'isp_edge',
        layer: 'L3 Network',
        mediaType: 'internal',
        signalDescription: 'מעבדי אבטחה ייעודיים CP9 ו-NP6X לסינון בחומרה',
        hardwareName: 'אשכול חומת אש הדור הבא (NGFW Active-Passive Cluster)',
        hardwareModel: 'Fortinet FortiGate 200F HA Cluster',
        hardwareRole: 'הגנת סייבר עמוקה, סינון תוכן, אנטי-וירוס ותרגום כתובות אינטרנט',
        physicalSpecs: [
          { label: 'מעבדי האצה', value: 'CP9 (Content Processor) + NP6XLite (Network Processor)' },
          { label: 'כתובת מקור פרטית', value: '10.24.60.114 (סאבנט אורחים פנימי)' },
          { label: 'כתובת מתורגמת (NAT)', value: '194.90.150.2 (כתובת ציבורית חוקית באינטרנט)' },
          { label: 'פורט מתורגם (PAT)', value: 'פורט 52189' }
        ],
        whatHappensHardware: 'שבב ה-NP6 מבצע בדיקת חוקי פיירוול בחומרה מלאה במהירות 27 Gbps. שבב ה-CP9 סורק את תוכן ה-Payload לאיתור נוזקות, סוסים טרויאניים ואתרים פוגעניים.',
        whatHappensSoftware: '1. פוליסי אבטחה בודק האם ל-VLAN 60 מותר לצאת לאינטרנט בפורטים 80/443 (HTTP/HTTPS).\n2. מנגנון ה-NAT/PAT מקצה לחיבור פורט מקור חדש (למשל 52189) ומחליף את כתובת ה-IP הפנימית (10.24.60.114) בכתובת הציבורית של העירייה (194.90.150.2).',
        mentalModelTitle: 'NAT/PAT הוא כמו מרכזיה טלפונית עם שלוחה אחת החוצה',
        mentalModelDescription: 'לכל התושבים בעירייה יש כתובות IP פרטיות שלא מוכרות באינטרנט העולמי. הפיירוול מדביק את כתובת העירייה הציבורית ושומר בטבלה איזה פורט שייך לאיזה תושב!',
        packetHeaders: [
          {
            layer: 'L3 - Network (Before NAT - Internal Municipal Network)',
            fields: [
              { key: 'Internal Source IP', value: '10.24.60.114 (Private Citizen IP)' },
              { key: 'Dest IP', value: '142.250.185.206 (Google Web Server)' },
              { key: 'Source Port', value: '54321' }
            ]
          },
          {
            layer: 'L3 - Network (After NAT/PAT - Public Internet Edge)',
            fields: [
              { key: 'Translated Source IP', value: '194.90.150.2 (Public Raanana Muni IP)' },
              { key: 'Dest IP', value: '142.250.185.206' },
              { key: 'Translated Port', value: '52189 (Allocated NAT Session Port)' }
            ]
          }
        ],
        activeHighlightedField: 'Translated Source IP',
        cliCommand: 'diagnose sys session filter src 10.24.60.114; diagnose sys session list',
        cliOutput: `session info: proto=6 proto_state=01 duration=4 expire=3596
orgin->sink: 10.24.60.114:54321 142.250.185.206:443 [polid=12]
sink->orgin: 142.250.185.206:443 194.90.150.2:52189 [polid=12]`,
        fieldTrapTitle: 'מיצוי טבלת NAT Sessions (Port Exhaustion)',
        fieldTrapDescription: 'לכתובת IP ציבורית אחת יש כ-65,000 פורטים. אם מאות משתמשים פותחים עשרות חיבורים בו-זמנית ואין בריכת כתובות (IP Pool) מספקת, חיבורי אינטרנט חדשים ייחסמו!'
      },
      {
        id: 'wifi_hop_5',
        stepNumber: 5,
        title: 'שדרת ספקיות האינטרנט (בזק מטרו 10G) וניתוב BGP עולמי',
        subtitle: 'הפקטה המאומתת והמתורגמת יוצאת מסיב העירייה אל שדרת האינטרנט העולמית',
        locationName: 'מתקן שער האינטרנט העירוני (Edge POP)',
        siteId: 'isp_edge',
        layer: 'L3 Network',
        mediaType: 'fiber',
        signalDescription: 'ניתוב פרוטוקול BGP (Border Gateway Protocol) אל ספקיות Tier-1',
        hardwareName: 'קו תמסורת עירוני ראשי סיב כפול',
        hardwareModel: 'Bezeq Metro DWDM 10Gbps Dark Fiber',
        hardwareRole: 'חיבור שדרת האינטרנט של עיריית רעננה לצומת האינטרנט הישראלי (IIX) ולעולם',
        physicalSpecs: [
          { label: 'רוחב פס', value: '10 Gbps סימטרי ללא הגבלה' },
          { label: 'פרוטוקול ניתוב', value: 'BGP AS-Number 8551' },
          { label: 'קו גיבוי', value: 'Partner IP-VPN 1Gbps + גיבוי סלולרי 5G' }
        ],
        whatHappensHardware: 'הפקטה יוצאת דרך ממשק ה-10G האופטי של ה-Edge Router ישירות לרשת המטרו של חברת התקשורת. בתוך פחות מ-15 מילישניות היא חוצה את הים התיכון לשרת היעד.',
        whatHappensSoftware: 'נתבי הספקית בודקים את ה-Prefix ומעבירים את החבילה לפי טבלת ה-BGP העולמית. התושב בפארק מקבל את דף האינטרנט המבוקש חלק ומהר.',
        mentalModelTitle: 'השער לעולם: אימות, הגנה, שילוח',
        mentalModelDescription: 'המסע של חבילת הגלישה הציבורית הוכיח כיצד עיר חכמה מבודדת רשתות: התושב נהנה מגלישה חופשית, אך אינו יכול לגעת במצלמות, ברמזורים או בשרתי העירייה הפנימיים!',
        packetHeaders: [
          {
            layer: 'L3 - BGP Internet Peering Routing',
            fields: [
              { key: 'Autonomous System', value: 'AS8551 (Bezeq International)' },
              { key: 'Next Hop Router', value: '194.90.150.1' },
              { key: 'Destination Status', value: 'Routed to Global CDN' }
            ]
          }
        ],
        activeHighlightedField: 'Next Hop Router',
        cliCommand: 'show ip bgp summary',
        cliOutput: `Neighbor        V    AS    MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
194.90.150.1    4  8551     142091  142088       24    0    0 42w3d    1 (Established)`,
        fieldTrapTitle: 'חוסר בקו גיבוי אוטומטי (BGP Failover)',
        fieldTrapDescription: 'אם טרקטור פוגע בסיב האופטי של בזק ברחוב, ללא הגדרת BGP Multihoming לקו הגיבוי של פרטנר, כל עיריית רעננה והשירותים לתושב ינותקו מהאינטרנט!'
      }
    ]
  },
  {
    id: 'cyber_containment',
    title: 'ניסיון תקיפה וחדירה רוחבית (Lateral Movement) ➔ זיהוי וחסימת DAI',
    shortDesc: 'מסע של פקטה זדונית מנוטרלת: תחנה מודבקת בכופרה בבית הוורדים שולחת ARP Poisoning וסריקת SMB, מתג הגישה מזהה אי-התאמה מול DHCP Snooping, חוסם את הפורט ומשגר Syslog ל-SOC.',
    icon: 'security',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    sourceLabel: 'מחשב עובד נגוע בכופרה (בית הוורדים)',
    targetLabel: 'מתג גישה C9200 (חסימת DAI) ➔ שרת SIEM/SOC',
    totalDistance: 'נבלם בפורט הגישה הראשון (Zero Trust)',
    avgLatency: '< 0.1 ms (בלימה מיידית בחומרה)',
    hops: [
      {
        id: 'sec_hop_1',
        stepNumber: 1,
        title: 'מחשב נגוע משגר מתקפת ARP Spoofing וסריקת SMB 445',
        subtitle: 'תוכנת כופר מנסה להשתלט על שער ברירת המחדל כדי ליירט תעבורה עירונית',
        locationName: 'מנהל הרווחה והשירותים החברתיים (בית הוורדים)',
        siteId: 'welfare_building',
        layer: 'L2 Data Link',
        mediaType: 'copper',
        signalDescription: 'שידור רצף פקטות Gratuitous ARP מזויפות בקצב מהיר',
        hardwareName: 'מחשב שולחני שנדבק בנוזקת כופר דרך דיסק-און-קי',
        hardwareModel: 'HP EliteDesk 800 G8 Workstation',
        hardwareRole: 'עמדת קצה נגועה שממנה מנסה התוקף לבצע תנועה רוחבית (Lateral Movement)',
        physicalSpecs: [
          { label: 'כתובת IP אמיתית', value: '10.24.25.72 (VLAN 25 Welfare)' },
          { label: 'כתובת MAC אמיתית', value: 'A4:BB:6D:12:89:C4' },
          { label: 'כתובת מזויפת ב-ARP', value: '10.24.25.1 (מתחזה ל-Gateway העירוני!)' },
          { label: 'פורט יעד מותקף', value: 'TCP 445 (Microsoft SMB EternalBlue)' }
        ],
        whatHappensHardware: 'כרטיס הרשת של המחשב מוצף בפקטות ARP רעילות. הנוזקה מכריזה לרשת: "כתובת ה-IP של הראוטר שייכת ל-MAC שלי! שלחו אלי את כל התעבורה".',
        whatHappensSoftware: 'המחשב שולח פקטות ARP Reply ללא בקשה (Gratuitous ARP) במטרה להרעיל את טבלאות ה-ARP של כל מחשבי המחלקה ולבצע Man-in-the-Middle.',
        mentalModelTitle: 'זיוף ARP: להתחזות לשוטר תנועה בצומת',
        mentalModelDescription: 'בפרוטוקול ARP המקורי כל אחד יכול לטעון "אני הראוטר". תוקף שמרעיל את ה-ARP גורם לכל שאר המחשבים לשלוח אליו את כל הסיסמאות והמסמכים הסודיים!',
        packetHeaders: [
          {
            layer: 'L2 - Malicious Spoofed ARP Reply Packet',
            fields: [
              { key: 'Sender MAC', value: 'A4:BB:6D:12:89:C4 (Attacker PC)' },
              { key: 'Sender IP (SPOOFED!)', value: '10.24.25.1 (CLAIMING TO BE GATEWAY!)' },
              { key: 'Target MAC', value: 'FF:FF:FF:FF:FF:FF (Broadcast to all PCs)' },
              { key: 'ARP Opcode', value: '2 (ARP Reply - Unsolicited)' }
            ]
          }
        ],
        activeHighlightedField: 'Sender IP (SPOOFED!)',
        cliCommand: 'show ip arp 10.24.25.1',
        cliOutput: `Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  10.24.25.1              -   000e.d799.3325  ARPA   Vlan25
[ALERT: Received conflicting ARP reply claiming 10.24.25.1 from a4bb.6d12.89c4]`,
        fieldTrapTitle: 'השארת מתגי גישה ללא הגנת Dynamic ARP Inspection',
        fieldTrapDescription: 'ללא מנגנון DAI, כל עובד או אורח שמחבר מחשב נייד יכול להוריד כלי תקיפה חינמי וליירט את כל תעבורת הרשת של המחלקה תוך 10 שניות!'
      },
      {
        id: 'sec_hop_2',
        stepNumber: 2,
        title: 'מתג Cisco Catalyst 9200: חסימת Dynamic ARP Inspection (DAI)',
        subtitle: 'המתג מיירט את הפקטה, משווה מול מסד ה-DHCP Snooping ומזהה את הזיוף',
        locationName: 'ארון תקשורת קומתי בבית הוורדים',
        siteId: 'welfare_building',
        layer: 'L2 Data Link',
        mediaType: 'internal',
        signalDescription: 'אימות קבצי Binding מול זיכרון ה-DHCP Snooping של המתג',
        hardwareName: 'מתג גישה ארגוני עם יכולות סייבר מובנות',
        hardwareModel: 'Cisco Catalyst 9200-24T + Cisco DNA Security',
        hardwareRole: 'בדיקת תאימות של כל חבילת ARP בחומרה והפלת חבילות מתחזות',
        physicalSpecs: [
          { label: 'מנגנון פעיל', value: 'Dynamic ARP Inspection (DAI) on VLAN 25' },
          { label: 'מסד נתונים', value: 'DHCP Snooping Database Table' },
          { label: 'פורט כניסה', value: 'GigabitEthernet1/0/9 (Untrusted Port)' }
        ],
        whatHappensHardware: 'מעבד ה-ASIC של המתג מיירט את חבילת ה-ARP ובודק אותה בחומרה מול טבלת ה-DHCP Snooping Binding. הוא רואה שפורט 9 קיבל בעבר משרת ה-DHCP את ה-IP `10.24.25.72` ולא `10.24.25.1`!',
        whatHappensSoftware: 'המתג מכריז מיד: `INVALID ARP PACKET - SPOOFING DETECTED!`. הפקטה מושלכת לפח (Drop) ונמנעת הרעלת טבלת ה-ARP של שאר המחשבים.',
        mentalModelTitle: 'DAI הוא המאבטח בכניסה עם תעודת זהות חתומה',
        mentalModelDescription: 'המתג לא מאמין לאף מחשב שטוען שהוא הראוטר. הוא בודק בספר הכתובות המאובטח שלו (DHCP Snooping) מיהו באמת בעל הכתובת. שקרן נזרק מיד החוצה!',
        packetHeaders: [
          {
            layer: 'L2 - Switch DAI Enforcement Table Lookup',
            fields: [
              { key: 'DHCP Snooping Record', value: 'MAC: a4:bb:6d:12:89:c4 ➔ Valid IP: 10.24.25.72 on Port Gi1/0/9' },
              { key: 'Incoming Packet Claim', value: 'MAC: a4:bb:6d:12:89:c4 ➔ Claimed IP: 10.24.25.1' },
              { key: 'Verdict', value: 'MISMATCH! PACKET DROPPED BY HARDWARE' }
            ]
          }
        ],
        activeHighlightedField: 'Verdict',
        cliCommand: 'show ip arp inspection vlan 25',
        cliOutput: `Source Mac Validation      : Disabled
Destination Mac Validation : Disabled
IP Address Validation      : Enabled

 Vlan     Configuration    Operation   Permitted    Dropped
 ----     -------------    ---------   ---------    -------
   25     Enabled          Active          42901         14 (SPOOF BLOCKED!)`,
        fieldTrapTitle: 'הפעלת DAI ללא הגדרת Uplink כ-Trust',
        fieldTrapDescription: 'אם מפעילים DAI ושוכחים להגדיר `ip arp inspection trust` בפורט ה-Trunk שעולה לראוטר, המתג יחסום גם את הודעות ה-ARP החוקיות של הראוטר וינתק את כל הרשת!'
      },
      {
        id: 'sec_hop_3',
        stepNumber: 3,
        title: 'חסימת פורט מיידית: Port-Security ומצב Err-Disable',
        subtitle: 'המתג מנתק את החשמל והקישור מהפורט הנגוע כדי לבודד את המחשב',
        locationName: 'פורט GigabitEthernet1/0/9 במתג בית הוורדים',
        siteId: 'welfare_building',
        layer: 'L2 Data Link',
        mediaType: 'internal',
        signalDescription: 'ניתוק שכבה פיזית L1 של הפורט וכיבוי נורית ה-Link',
        hardwareName: 'מנגנון הגנת פורט בחומרה (Port Security Engine)',
        hardwareModel: 'Cisco Auto-Remediation & Port Lockdown',
        hardwareRole: 'בידוד מוחלט של העמדה הנגועה ומניעת התפשטות הנוזקה ברשת העירונית',
        physicalSpecs: [
          { label: 'סטטוס פורט חדש', value: 'err-disabled (קישור פיזי כבוי)' },
          { label: 'נורית LED במתג', value: 'Amber מהבהב (התראה פיזית)' },
          { label: 'זמן בידוד', value: 'פחות מ-1 מילישנייה ממועד הזיהוי' }
        ],
        whatHappensHardware: 'שבב ה-PHY במתג מנתק את אות ה-Clock והסנכרון של פורט 9. המחשב הנגוע מקבל הודעת "Network cable unplugged" ומנותק פיזית מכל תקשורת.',
        whatHappensSoftware: 'מערכת ה-Cisco IOS-XE רושמת אירוע קריטי בלוג, מכניסה את הפורט למצב `err-disabled`, ומונעת ממנו לחזור לפעילות עד לבדיקה ידנית של איש אבטחת מידע.',
        mentalModelTitle: 'הסגר מיידי (Quarantine): לנתק את הזרוע כדי להציל את הגוף',
        mentalModelDescription: 'כאשר מתגלה נוזקת כופר, אין זמן לשאול שאלות. בידוד הפורט תוך מילישנייה מבטיח שהכופרה לא תצליח להצפין אף שרת נוסף בעירייה!',
        packetHeaders: [
          {
            layer: 'L1/L2 - Port State Transition',
            fields: [
              { key: 'Previous State', value: 'Up / Connected (1000Base-T)' },
              { key: 'Trigger', value: 'DAI Rate-Limit Exceeded & Spoofing Match' },
              { key: 'New State', value: 'DOWN / ERR-DISABLE (Link Down)' }
            ]
          }
        ],
        activeHighlightedField: 'New State',
        cliCommand: 'show interfaces Gi1/0/9 status',
        cliOutput: `Port      Name               Status       Vlan       Duplex  Speed Type
Gi1/0/9   Welfare-Worker-09  err-disabled 25           auto    auto 10/100/1000BaseTX`,
        fieldTrapTitle: 'הגדרה ללא errdisable recovery cause',
        fieldTrapDescription: 'באירועי אבטחת מידע אסור להפעיל שחזור אוטומטי (Auto Recovery)! אם הפורט ייפתח מחדש מעצמו אחרי 5 דקות, הכופרה תמשיך לתקוף שוב ושוב.'
      },
      {
        id: 'sec_hop_4',
        stepNumber: 4,
        title: 'שיגור התראת סייבר SNMP Trap ו-Syslog אל מרכז ה-SOC/SIEM',
        subtitle: 'המתג שולח דיווח מוצפן לחמ״ל הסייבר המרכזי עם פרטי התוקף והפורט',
        locationName: 'סיב אופטי מבית הוורדים אל מרכז השליטה העירוני',
        siteId: 'city_hall_dc',
        layer: 'L7 Application',
        mediaType: 'fiber',
        signalDescription: 'הודעות UDP Syslog (פורט 514) ו-SNMPv3 Traps מוצפנות ב-AES',
        hardwareName: 'מערכת ניטור אירועי אבטחה (SIEM / SOC)',
        hardwareModel: 'Splunk Enterprise Security + FortiSIEM',
        hardwareRole: 'איסוף אירועים מכל רכיבי העירייה, קורלציה חכמה והקפצת אנליסט סייבר',
        physicalSpecs: [
          { label: 'חומרת אירוע', value: 'CRITICAL / SEVERITY 1 (Attack Blocked)' },
          { label: 'פרטי אירוע', value: 'Port Gi1/0/9 placed in err-disable by DAI' },
          { label: 'זמן הגעה ל-SOC', value: '2.3 מילישניות' }
        ],
        whatHappensHardware: 'מעבד המתג מנסח חבילת Syslog בפורמט RFC 5424 ושולח אותה דרך רשת הניהול (VLAN 99 Out-of-Band) אל שרתי ה-SIEM בחדר השרתים.',
        whatHappensSoftware: 'מערכת ה-SIEM מצליבה את כתובת ה-MAC של המחשב מול שרת ה-Active Directory, מזהה את שם העובד, מיקום החדר בבית הוורדים, ומציגה מסך אדום לחוקר הסייבר במוקד.',
        mentalModelTitle: 'השומר הזעיק את חדר המצב: שרשרת התגובה המהירה',
        mentalModelDescription: 'חסימת הפקטה במתג היא רק חצי עבודה. שיגור ההתראה המיידי למוקד ה-SOC מאפשר לצוות התשתיות לרוץ לעמדה הפיזית, לקחת את המחשב הנגוע ולבצע חקירה פורנזית.',
        packetHeaders: [
          {
            layer: 'L7 - Syslog Security Message',
            fields: [
              { key: 'Facility', value: 'LOCAL7 (Network Security)' },
              { key: 'Severity', value: 'CRITICAL (1)' },
              { key: 'Log Message', value: '%SW_DAI-4-PACKET_BURST_RATE_EXCEEDED: 14 packets received on Gi1/0/9' },
              { key: 'Follow-up Action', value: '%PM-4-ERR_DISABLE: arp-inspection error detected on Gi1/0/9, putting in err-disable' }
            ]
          }
        ],
        activeHighlightedField: 'Log Message',
        cliCommand: 'show logging | include SW_DAI',
        cliOutput: `*Sep 6 09:14:22.108: %SW_DAI-4-PACKET_BURST_RATE_EXCEEDED: 14 packets received in 1000 milliseconds on Gi1/0/9.
*Sep 6 09:14:22.109: %PM-4-ERR_DISABLE: arp-inspection error detected on Gi1/0/9, putting Gi1/0/9 in err-disable state`,
        fieldTrapTitle: 'שליחת לוגים ללא סנכרון שעון NTP מדויק',
        fieldTrapDescription: 'אם שעון המתג מפגר ב-10 דקות אחרי שרת ה-SIEM, חוקר הסייבר לא יוכל לחבר את סדר האירועים הנכון (Timeline Analysis) ולא יבין מתי התחילה התקיפה!'
      }
    ]
  }
];

interface PacketPathVisualizerProps {
  onSelectSite?: (siteId: string) => void;
}

export function PacketPathVisualizer({ onSelectSite }: PacketPathVisualizerProps) {
  const { lang } = useLanguage();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('lpr_camera');
  const [activeHopIndex, setActiveHopIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 2
  const [activeTab, setActiveTab] = useState<'visual' | 'dissection' | 'cli' | 'gotchas'>('visual');

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const localizedScenarios = PATH_SCENARIOS.map((s) => getLocalizedScenario(s, lang));
  const currentScenario = localizedScenarios.find((s) => s.id === selectedScenarioId) || localizedScenarios[0];
  const currentHop = currentScenario.hops[activeHopIndex] || currentScenario.hops[0];

  // Notify parent site selection if requested
  useEffect(() => {
    if (onSelectSite && currentHop?.siteId) {
      onSelectSite(currentHop.siteId);
    }
  }, [activeHopIndex, currentHop?.siteId, onSelectSite]);

  // Handle step change
  const handleGoToHop = (index: number) => {
    if (index >= 0 && index < currentScenario.hops.length) {
      audioFeedback.playKeyClick();
      setActiveHopIndex(index);
    }
  };

  const handleNextHop = () => {
    if (activeHopIndex < currentScenario.hops.length - 1) {
      audioFeedback.playKeyClick();
      setActiveHopIndex((prev) => prev + 1);
    } else {
      audioFeedback.playSuccess();
      setIsPlaying(false);
    }
  };

  const handlePrevHop = () => {
    if (activeHopIndex > 0) {
      audioFeedback.playKeyClick();
      setActiveHopIndex((prev) => prev - 1);
    }
  };

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      const delayMs = (4000 / playbackSpeed);
      playTimerRef.current = setTimeout(() => {
        if (activeHopIndex < currentScenario.hops.length - 1) {
          audioFeedback.playKeyClick();
          setActiveHopIndex((prev) => prev + 1);
        } else {
          audioFeedback.playSuccess();
          setIsPlaying(false);
        }
      }, delayMs);
    } else {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, activeHopIndex, playbackSpeed, currentScenario.hops.length]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Scenario Selector */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#101422] to-[#141A2E] border border-blue-500/20 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>
                {lang === 'en'
                  ? 'End-to-End Packet Path Simulator'
                  : 'הדמיית מסע חבילת מידע מקצה לקצה (End-to-End Packet Path Simulator)'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'en'
                ? 'Live Communication Path: Graphical Learning of Hardware, Signals & Protocols'
                : 'נתיב תקשורת חי: למידה גרפית של חומרה, אותות ופרוטוקולים'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              {lang === 'en'
                ? 'Select a real-world municipal scenario, trace physical signal pulses along fibers and copper lines, and anchor deep mental models of hardware and protocols at every hop.'
                : 'בחר תרחיש עירוני אמיתי, עקוב אחר פעימות האותות לאורך הסיבים והכבלים, וחקוק בראש בדיוק מה מתרחש בחומרה ובתוכנה בכל תחנה ותחנה.'}
            </p>
          </div>

          {/* Key Stats Pill */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 self-start md:self-auto shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">
                {lang === 'en' ? 'Total Distance:' : 'מרחק כולל:'}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">{currentScenario.totalDistance}</span>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">
                {lang === 'en' ? 'Avg Latency:' : 'שיהוי ממוצע:'}
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">{currentScenario.avgLatency}</span>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">
                {lang === 'en' ? 'Path Hops:' : 'תחנות בנתיב:'}
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">
                {currentScenario.hops.length} {lang === 'en' ? 'hops' : 'שלבים'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Real-World Municipal Scenarios Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
          {localizedScenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  audioFeedback.playKeyClick();
                  setSelectedScenarioId(scenario.id);
                  setActiveHopIndex(0);
                  setIsPlaying(false);
                }}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between gap-2 min-h-[95px] cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-2 ring-blue-500/30'
                    : 'bg-[#0E121D] border-white/10 hover:border-slate-600 hover:bg-[#131724]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      scenario.icon === 'camera' ? 'bg-emerald-500/20 text-emerald-400' :
                      scenario.icon === 'phone' ? 'bg-blue-500/20 text-blue-400' :
                      scenario.icon === 'wifi' ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {scenario.icon === 'camera' && <Camera className="w-4 h-4" />}
                      {scenario.icon === 'phone' && <PhoneCall className="w-4 h-4" />}
                      {scenario.icon === 'wifi' && <Wifi className="w-4 h-4" />}
                      {scenario.icon === 'security' && <ShieldAlert className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-white line-clamp-1">
                      {scenario.id === 'lpr_camera' ? (lang === 'en' ? 'LPR Camera ➔ VMS' : 'מצלמת LPR ➔ VMS') :
                       scenario.id === 'moked_106_voip' ? (lang === 'en' ? '106 Call ➔ CUCM' : 'שיחת חירום 106 ➔ CUCM') :
                       scenario.id === 'wifi_citizen' ? (lang === 'en' ? 'Park Wi-Fi ➔ Internet' : 'גלישת Wi-Fi ➔ אינטרנט') :
                       (lang === 'en' ? 'Cyber Attack ➔ DAI Drop' : 'מתקפת סייבר ➔ חסימת DAI')}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {scenario.shortDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Path Timeline Navigation Strip (Breadcrumbs & Step Pills) */}
      <div className="p-4 rounded-2xl bg-[#0E121E] border border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              {lang === 'en' ? 'Path Progress:' : 'התקדמות במסלול:'}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
              {lang === 'en'
                ? `Hop ${activeHopIndex + 1} of ${currentScenario.hops.length}`
                : `תחנה ${activeHopIndex + 1} מתוך ${currentScenario.hops.length}`}
            </span>
          </div>

          {/* Interactive Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                setIsPlaying(!isPlaying);
              }}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>
                {isPlaying
                  ? (lang === 'en' ? 'Pause' : 'השהה ניגון')
                  : (lang === 'en' ? 'Play Path Animation' : 'נגן מסלול אוטומטי')}
              </span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center rounded-xl bg-[#141826] border border-white/10 p-0.5 text-xs font-mono">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    audioFeedback.playKeyClick();
                    setPlaybackSpeed(spd);
                  }}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    playbackSpeed === spd ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={() => handleGoToHop(0)}
              className="p-2 rounded-xl bg-[#141826] border border-white/10 text-slate-400 hover:text-white transition-colors"
              title={lang === 'en' ? 'Reset to start' : 'חזור לתחילת המסלול'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevHop}
                disabled={activeHopIndex === 0}
                className="p-2 rounded-xl bg-[#141826] border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
                title={lang === 'en' ? 'Previous hop' : 'תחנה קודמת'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextHop}
                disabled={activeHopIndex === currentScenario.hops.length - 1}
                className="p-2 rounded-xl bg-[#141826] border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
                title={lang === 'en' ? 'Next hop' : 'תחנה הבאה'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Step Nodes Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {currentScenario.hops.map((hop, hIdx) => {
            const isCurrent = hIdx === activeHopIndex;
            const isPast = hIdx < activeHopIndex;

            return (
              <button
                key={hop.id}
                onClick={() => handleGoToHop(hIdx)}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden group ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md font-bold'
                    : isPast
                    ? 'bg-[#141826] text-slate-300 border-slate-700/80 hover:border-slate-500'
                    : 'bg-[#0A0D15] text-slate-500 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    {lang === 'en' ? `Hop #${hop.stepNumber}` : `תחנה #${hop.stepNumber}`}
                  </span>
                  {isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  ) : null}
                </div>
                <div className="text-xs font-bold line-clamp-1">{hop.title}</div>
                <div className={`text-[10px] mt-0.5 truncate ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                  {hop.layer}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE HOP INTERACTIVE STAGE & DEEP LEARNING CONSOLE                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Signal / Oscilloscope & Mental Model Graphic (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Active Station Header Banner */}
          <div className="p-5 rounded-2xl bg-[#0F131F] border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  {currentHop.layer}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  {currentHop.mediaType === 'copper'
                    ? (lang === 'en' ? 'Cat6A Copper Media' : 'תווך נחושת Cat6A')
                    : currentHop.mediaType === 'fiber'
                    ? (lang === 'en' ? 'Singlemode Optical Fiber' : 'סיב אופטי Singlemode')
                    : currentHop.mediaType === 'rf'
                    ? (lang === 'en' ? '5GHz RF Wireless Waves' : 'גלי רדיו אלחוטיים 5GHz')
                    : (lang === 'en' ? 'Internal Switching ASIC' : 'מנוע מיתוג פנימי (ASIC)')}
                </span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                {currentHop.locationName}
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-white leading-tight">
              {lang === 'en' ? `Hop ${currentHop.stepNumber}: ` : `תחנה ${currentHop.stepNumber}: `}
              {currentHop.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentHop.subtitle}
            </p>
          </div>

          {/* DYNAMIC SIGNAL OSCILLOSCOPE & PHYSICAL WAVEFORM GRAPHIC */}
          <div className="p-5 rounded-2xl bg-[#0A0D15] border border-white/10 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="font-bold text-white">
                  {lang === 'en' ? 'Signal Oscilloscope & Physical Waveform:' : 'אוסצילוסקופ אותות וצורת גל בתווך הפיזי:'}
                </span>
              </div>
              <span className="font-mono text-emerald-400 text-[11px]">{currentHop.signalDescription}</span>
            </div>

            {/* SVG Interactive Waveform Animation */}
            <div className="h-32 w-full bg-[#05070B] rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden p-2">
              <div className="absolute inset-0 bg-grid-dots opacity-20 pointer-events-none" />
              
              {/* Copper Differential Square Wave */}
              {currentHop.mediaType === 'copper' && (
                <svg className="w-full h-full" viewBox="0 0 600 120">
                  <defs>
                    <linearGradient id="squareGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  {/* Zero Voltage Baseline */}
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="10" y="55" fill="#64748b" fontSize="9" fontFamily="monospace">0V Baseline (GND)</text>
                  <text x="10" y="25" fill="#3b82f6" fontSize="9" fontFamily="monospace">+2.5V (Tx+ Data Pulse)</text>
                  <text x="10" y="105" fill="#f43f5e" fontSize="9" fontFamily="monospace">-2.5V (Tx- Inverse Phase)</text>

                  {/* Differential Square Waveform */}
                  <path
                    d="M 0 60 L 40 60 L 40 25 L 80 25 L 80 95 L 120 95 L 120 25 L 160 25 L 160 60 L 200 60 L 200 95 L 240 95 L 240 25 L 280 25 L 280 60 L 320 60 L 320 25 L 360 25 L 360 95 L 400 95 L 400 25 L 440 25 L 440 60 L 480 60 L 480 95 L 520 95 L 520 25 L 560 25 L 560 60 L 600 60"
                    fill="none"
                    stroke="url(#squareGrad)"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                  {/* Moving Data Packet Dot */}
                  <circle r="5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)">
                    <animate
                      attributeName="cx"
                      from="0"
                      to="600"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="cy"
                      values="60;25;25;95;95;25;60;95;25;60"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              )}

              {/* Optical Laser Infrared Pulses */}
              {currentHop.mediaType === 'fiber' && (
                <svg className="w-full h-full" viewBox="0 0 600 120">
                  <defs>
                    <linearGradient id="laserGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <text x="10" y="25" fill="#ec4899" fontSize="9" fontFamily="monospace">1310nm Single-Mode DFB Laser Pulses</text>
                  <text x="10" y="105" fill="#64748b" fontSize="9" fontFamily="monospace">Speed: ~200,000 km/s in Silica Glass Core (9µm)</text>

                  {/* Optical Pulse Wave */}
                  <path
                    d="M 0 60 Q 30 15, 60 60 T 120 60 T 180 60 T 240 60 T 300 60 T 360 60 T 420 60 T 480 60 T 540 60 T 600 60"
                    fill="none"
                    stroke="url(#laserGrad)"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                  {/* Pulsing Light Photons */}
                  <circle r="6" fill="#f472b6" filter="drop-shadow(0 0 8px #f472b6)">
                    <animate attributeName="cx" from="0" to="600" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="60;20;60;100;60" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              )}

              {/* Radio Frequency (RF) Wireless Sine Wave */}
              {currentHop.mediaType === 'rf' && (
                <svg className="w-full h-full" viewBox="0 0 600 120">
                  <defs>
                    <linearGradient id="rfGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  <text x="10" y="25" fill="#c084fc" fontSize="9" fontFamily="monospace">5.2 GHz 1024-QAM High-Frequency Radio Waves</text>
                  <text x="10" y="105" fill="#64748b" fontSize="9" fontFamily="monospace">OFDMA Subcarriers with CSMA/CA Collision Avoidance</text>

                  {/* Sine waves superimposed */}
                  <path
                    d="M 0 60 C 25 10, 50 110, 75 60 C 100 10, 125 110, 150 60 C 175 10, 200 110, 225 60 C 250 10, 275 110, 300 60 C 325 10, 350 110, 375 60 C 400 10, 425 110, 450 60 C 475 10, 500 110, 525 60 C 550 10, 575 110, 600 60"
                    fill="none"
                    stroke="url(#rfGrad)"
                    strokeWidth="2.5"
                  />
                  <circle r="6" fill="#a855f7" filter="drop-shadow(0 0 10px #c084fc)">
                    <animate attributeName="cx" from="0" to="600" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="60;15;60;105;60" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </svg>
              )}

              {/* Internal Switching Logic / ASIC Bus */}
              {currentHop.mediaType === 'internal' && (
                <svg className="w-full h-full" viewBox="0 0 600 120">
                  <defs>
                    <linearGradient id="asicGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  <text x="10" y="25" fill="#34d399" fontSize="9" fontFamily="monospace">ASIC Crossbar Matrix & CAM Table Match (Wirespeed)</text>
                  <text x="10" y="105" fill="#64748b" fontSize="9" fontFamily="monospace">Memory Bus: Direct Memory Access (DMA) 0.8µs Latency</text>

                  {/* Circuit Board Traces */}
                  <path
                    d="M 0 40 H 120 L 150 80 H 280 L 310 40 H 450 L 480 80 H 600"
                    fill="none"
                    stroke="url(#asicGrad)"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0 80 H 100 L 130 40 H 260 L 290 80 H 420 L 450 40 H 600"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <circle r="5" fill="#34d399" filter="drop-shadow(0 0 8px #34d399)">
                    <animate attributeName="cx" from="0" to="600" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="40;40;80;80;40;40;80;80" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              )}
            </div>
          </div>

          {/* MENTAL MODEL VISUAL CALLOUT ("לחקוק בראש") */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#161B26] to-[#0E121C] border-2 border-amber-500/40 shadow-lg space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'en' ? 'Cognitive Mental Model:' : 'תמונה מנטלית לחקוק בראש (Cognitive Mental Model):'}</span>
            </div>
            <h5 className="text-base sm:text-lg font-black text-white">
              {currentHop.mentalModelTitle}
            </h5>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              {currentHop.mentalModelDescription}
            </p>
          </div>

          {/* DUAL COLUMN: WHAT HAPPENS IN HARDWARE & WHAT HAPPENS IN SOFTWARE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hardware Box */}
            <div className="p-4 rounded-xl bg-[#0F131F] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Cpu className="w-4 h-4" />
                <span>{lang === 'en' ? 'Physical Hardware:' : 'מה קורה בברזלים (Physical Hardware):'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentHop.whatHappensHardware}
              </p>
            </div>

            {/* Software Box */}
            <div className="p-4 rounded-xl bg-[#0F131F] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Layers className="w-4 h-4" />
                <span>{lang === 'en' ? 'Software & Protocol Logic:' : 'מה קורה בפרוטוקולים (Software Logic):'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {currentHop.whatHappensSoftware}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hardware Inspector, Packet Dissection & CLI (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Sub-Tabs for Right Pane: Hardware Specs / Packet Dissection / CLI / Field Trap */}
          <div className="p-1 rounded-xl bg-[#0F131F] border border-white/10 flex items-center justify-between text-xs font-bold">
            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                setActiveTab('visual');
              }}
              className={`flex-1 py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer ${
                activeTab === 'visual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Hardware' : 'מפרט חומרה'}
            </button>
            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                setActiveTab('dissection');
              }}
              className={`flex-1 py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer ${
                activeTab === 'dissection' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Packet Dissection' : 'דיסקציית חבילה'}
            </button>
            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                setActiveTab('cli');
              }}
              className={`flex-1 py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer ${
                activeTab === 'cli' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'CLI Command' : 'פקודת CLI'}
            </button>
            <button
              onClick={() => {
                audioFeedback.playKeyClick();
                setActiveTab('gotchas');
              }}
              className={`flex-1 py-2 px-2.5 rounded-lg transition-all text-center cursor-pointer ${
                activeTab === 'gotchas' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'Field Gotchas' : 'מילכוד שטח'}
            </button>
          </div>

          {/* TAB 1: HARDWARE SPECS CARD */}
          {activeTab === 'visual' && (
            <div className="p-5 rounded-2xl bg-[#0F131F] border border-white/10 space-y-4 shadow-sm animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider block">
                  {lang === 'en' ? 'Active Hardware at this station:' : 'רכיב החומרה הפעיל בתחנה זו:'}
                </span>
                <h5 className="text-base font-bold text-white">
                  {currentHop.hardwareName}
                </h5>
                <p className="text-xs font-mono text-blue-400">
                  {currentHop.hardwareModel}
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#141826] p-3 rounded-xl border border-white/5">
                {currentHop.hardwareRole}
              </p>

              {/* Specs Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">
                  {lang === 'en' ? 'Measured Technical Specs:' : 'מאפיינים טכניים נמדדים בשטח:'}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {currentHop.physicalSpecs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0D15] border border-white/5 text-xs">
                      <span className="text-slate-400">{spec.label}:</span>
                      <span className="font-mono font-bold text-slate-200 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PACKET PDU DISSECTION VIEW */}
          {activeTab === 'dissection' && (
            <div className="p-5 rounded-2xl bg-[#0F131F] border border-white/10 space-y-4 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h5 className="text-sm font-bold text-white">
                    {lang === 'en' ? 'Packet Header Dissector' : 'דיסקציית שדות החבילה (Packet Header Dissector)'}
                  </h5>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'en' ? 'How the packet appears across layers at this hop' : 'איך החבילה נראית בשכבות השונות בתחנה זו'}
                  </span>
                </div>
                <Binary className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="space-y-3">
                {currentHop.packetHeaders.map((headerGroup, gIdx) => (
                  <div key={gIdx} className="p-3 rounded-xl bg-[#0A0D15] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-400 border-b border-white/5 pb-1.5">
                      <span>{headerGroup.layer}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {headerGroup.fields.map((fld, fIdx) => {
                        const isHighlighted = fld.key === currentHop.activeHighlightedField;
                        return (
                          <div
                            key={fIdx}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono transition-colors ${
                              isHighlighted
                                ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50 font-bold'
                                : 'bg-[#131724] text-slate-300'
                            }`}
                          >
                            <span className="text-slate-400">{fld.key}:</span>
                            <span className="text-emerald-400 text-right">{fld.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLI PRODUCTION COMMAND */}
          {activeTab === 'cli' && (
            <div className="p-5 rounded-2xl bg-[#0A0D15] border border-slate-800 space-y-3 shadow-sm font-mono animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">
                    {lang === 'en' ? 'Production Verification Command' : 'אימות פקודת שטח (Production Verification)'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">Cisco / Linux CLI</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#141824] border border-white/10 text-xs text-cyan-300 flex items-center gap-2">
                  <span className="text-slate-500 select-none">#</span>
                  <span className="font-bold">{currentHop.cliCommand}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#05070B] border border-slate-900 text-[11px] text-slate-300 leading-relaxed overflow-x-auto whitespace-pre font-mono">
                  {currentHop.cliOutput}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MUNICIPAL FIELD TRAP (GOTCHA) */}
          {activeTab === 'gotchas' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-[#0F131F] border border-amber-500/30 space-y-3 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>{lang === 'en' ? 'Municipal Field Gotcha:' : 'מלכודת שטח אמיתית ברעננה (Field Gotcha):'}</span>
              </div>

              <h5 className="text-sm sm:text-base font-bold text-white">
                {currentHop.fieldTrapTitle}
              </h5>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                {currentHop.fieldTrapDescription}
              </p>
            </div>
          )}

          {/* Bottom Next / Prev Big Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrevHop}
              disabled={activeHopIndex === 0}
              className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl border border-white/10 bg-[#0F131F] text-xs font-bold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#141A2E] hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <ChevronRight className="w-4 h-4" />
              <span>{lang === 'en' ? 'Previous Hop' : 'לתחנה הקודמת'}</span>
            </button>
            <button
              onClick={handleNextHop}
              disabled={activeHopIndex === currentScenario.hops.length - 1}
              className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-blue-600 text-xs font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-500 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <span>{lang === 'en' ? 'Next Hop in Path' : 'לתחנה הבאה במסע'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
