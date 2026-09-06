export type QuestionCategory = 'Cisco' | 'PRTG' | 'VoIP' | 'Smart City' | 'L1';

export interface InterviewQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  topic: string;
  question: string;
  idealAnswer: string;
  keyPoints: string[];
  raananaRelevance: string;
  difficulty: 'מתחיל' | 'בינוני' | 'מתקדם';
  options: InterviewQuestionOption[];
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'iq-1',
    category: 'L1',
    topic: 'מתודולוגיית פתרון תקלות ו-OSI',
    question: 'משתמש באגף הגבייה ברעננה מדווח ש"אין לו רשת". איך אתה ניגש לתקלה הזו בצורה שיטתית מהרגע הראשון?',
    idealAnswer: 'אני פועל בגישת מודל OSI מסודרת מלמטה למעלה (Bottom-Up): ראשית, שלב 1 - בדיקה פיזית: האם נוריות ה-Link דולקות בכרטיס הרשת ובמתג? האם כבל הרשת מחובר היטב? שלב 2 - שכבת קישור נתונים: בדיקה בסוויץ\' בפקודת `show interface status` לאיזה VLAN הפורט משויך והאם יש תקשורת מול כתובת ה-MAC. שלב 3 - שכבת רשת: הרצת `ipconfig /all` בעמדה - האם התקבלה כתובת IP חוקית מתחום הרשת העירוני, או כתובת 169.254 (APIPA)? ביצוע פינג ל-Default Gateway. אם יש מענה - הרשת המקומית תקינה! שלב 4 - שירותי ליבה: בדיקת פינג לשרת ה-DNS (בדיקת תרגום שמות) ופינג לכתובת אינטרנט חיצונית (8.8.8.8) כדי לדעת האם הבעיה היא בניתוב, ב-DNS או בספקית האינטרנט.',
    keyPoints: [
      'שימוש במודל 7 השכבות (OSI מלמטה למעלה)',
      'בדיקת נוריות לינק פיזיות וכבלים תחילה',
      'בדיקת שיוך VLAN וטבלת MAC בסוויץ\'',
      'בדיקת כתובת IP ופינג ל-Default Gateway',
      'אימות שרתי DNS ושירותי רשת'
    ],
    raananaRelevance: 'מפגין עצמאות וסדר מול עובדי עירייה תחת לחץ.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-1-a',
        text: 'גישת Bottom-Up: בדיקת נוריות לינק פיזיות וכבילה (L1), אימות שיוך VLAN בסוויץ\' (L2), בדיקת IP ופינג ל-Gateway (L3), ולאחר מכן בדיקת DNS ואינטרנט',
        isCorrect: true,
        explanation: 'מתודולוגיה שיטתית משכבה 1 לשכבות הגבוהות מונעת קפיצה מיותרת להגדרות שרתים כשהכבל מנותק.'
      },
      {
        id: 'iq-1-b',
        text: 'אתחול מיידי של מתג הקומה של אגף הגבייה ובדיקה אם הבעיה נפתרת מעצמה',
        isCorrect: false,
        explanation: 'אתחול מתג קומה משבית עשרות עובדים נוספים ללא כל אבחון מקצועי.'
      },
      {
        id: 'iq-1-c',
        text: 'פתיחת קריאת שירות דחופה לספקית האינטרנט בטענה שנפלה התקשורת לעירייה',
        isCorrect: false,
        explanation: 'התקלה היא מקומית בעמדה אחת באגף הגבייה, פנייה לספק היא שגיאה קשה.'
      },
      {
        id: 'iq-1-d',
        text: 'שינוי כתובת ה-IP של העמדה לכתובת סטטית של שרת הליבה',
        isCorrect: false,
        explanation: 'עלול לגרום להתנגשות כתובות IP ולהשבתת שרת עירוני.'
      }
    ]
  },
  {
    id: 'iq-2',
    category: 'PRTG',
    topic: 'מערכות שו״ב ומוניטורינג (PRTG & SNMP)',
    question: 'כיצד תגדיר ניטור של מתג הפצה מרכזי בעירייה במערכת PRTG, ואילו סנסורים הם בגדר חובה?',
    idealAnswer: 'עבור מתג הפצה מרכזי אני מגדיר סוכן SNMP v3 (כולל אימות SHA והצפנת AES). הסנסורים שחובה להגדיר הם: 1. סנסור Ping & Uptime לזמינות בסיסית וזיהוי ניתוקים. 2. סנסור CPU & Memory Utilization עם התרעה אם השימוש עובר 80% ליותר מ-5 דקות. 3. סנסורי Traffic בפורטי ה-Uplink וה-Trunk (רוחב פס In/Out). 4. סנסורי Error Counters לזיהוי שגיאות פיזיות (CRC errors, packet drops). 5. סנסור Hardware Health לטמפרטורת המכשיר ומצב ספקי כוח כפולים (Redundant Power Supplies). בנוסף, אגדיר SNMP Traps למשלוח מיידי של אירוע בעת נפילת פורט קריטי או כשל מאוורר.',
    keyPoints: [
      'שימוש ב-SNMP v3 מאובטח עם SHA ו-AES',
      'ניטור זמינות (Ping) ומשאבי חומרה (CPU, RAM, Temp)',
      'ניטור תעבורה ושגיאות CRC בפורטי Uplink',
      'הגדרת Traps לאירועים מתפרצים וכשלי חומרה'
    ],
    raananaRelevance: 'דרישה ישירה במכרז 7274: "תפעול ותחזוקה של מערכות שו״ב ומוניטורינג".',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-2-a',
        text: 'שימוש ב-SNMP v3 מאובטח (SHA/AES), הגדרת סנסורי Ping/Uptime, עומס מעבד וזיכרון, תעבורה ושגיאות CRC בפורטי Uplink, וחיווי ספקי כוח וטמפרטורה',
        isCorrect: true,
        explanation: 'מערך סנסורים מקיף זה מכסה זמינות, ביצועים, תקינות פיזית ואבטחה.'
      },
      {
        id: 'iq-2-b',
        text: 'הגדרת סנסור Ping בלבד כל 60 שניות כדי לא להעמיס על מעבד המתג',
        isCorrect: false,
        explanation: 'פינג בלבד אינו מתריע על עומס מעבד, שגיאות סיב אופטי או נפילת ספק כוח יתיר.'
      },
      {
        id: 'iq-2-c',
        text: 'הפעלת SNMP v1 עם קהילת public כברירת מחדל לכל מתגי הארגון',
        isCorrect: false,
        explanation: 'חולשת אבטחה חמורה הפוגעת בהנחיות מערך הסייבר הלאומי.'
      },
      {
        id: 'iq-2-d',
        text: 'התקנת תוכנת Agent מבוססת Windows על גבי מערכת ההפעלה של ה-Cisco Catalyst',
        isCorrect: false,
        explanation: 'מתגי Cisco אינם מריצים Windows ואינם מאפשרים התקנת סוכני Windows מקומיים.'
      }
    ]
  },
  {
    id: 'iq-3',
    category: 'Smart City',
    topic: 'עיר חכמה ומצלמות LPR',
    question: 'העירייה פורסת מערך מצלמות אבטחה ו-LPR חדש בצומת מרכזי ברעננה. אילו דגשים תשתיתיים ורשתיים תדרוש במסגרת הפרויקט?',
    idealAnswer: 'בפרויקט עיר חכמה חיצוני אני מוודא מספר עוגנים קריטיים: 1. תשתית חומרה: ארון חוץ מוקשח בתקן IP66 עם בקרת אקלים, הארקה תקנית והגנת מתחי יתר (Surge Protection) נגד ברקים. 2. מתג תעשייתי (Industrial Switch) עמיד בטווח טמפרטורות רחב ללא מאוורר, עם ספק כוח כפול ותמיכה בתקציב PoE+ / PoE++ לצריכת המצלמות וגופי החימום. 3. אבטחה והפרדה: שיוך המצלמות ל-VLAN ייעודי של CCTV ומצלמות LPR המבודד לחלוטין מרשת העירייה המשרדית. 4. Port Security ו-MAC Filtering בכל פורט בארון הרחוב כדי שאף אדם זר לא יוכל לחבר מחשב לרשת. 5. הפעלת IGMP Snooping ו-QoS למניעת הצפת הרשת בשידורי וידאו.',
    keyPoints: [
      'מתג תעשייתי מוקשח עמיד בחום/אבק ו-Surge Protection',
      'תקציב PoE++ לכל המצלמות וגופי החימום',
      'הפרדת VLAN ייעודי לביטחון',
      'נעילת פורטים פיזיים (Port Security) בארונות רחוב',
      'IGMP Snooping ורוחב פס לזרמי וידאו'
    ],
    raananaRelevance: 'מכרז 7274: "ליווי והקמה של תשתיות תקשורת במסגרת פרויקטים של עיר חכמה".',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-3-a',
        text: 'ארון חוץ IP66 עם הגנת ברקים והארקה, מתג תעשייתי מוקשח עם תקציב PoE++ לגופי חימום, הפרדת VLAN ייעודי, Port Security נעול, ו-IGMP Snooping לניהול Multicast',
        isCorrect: true,
        explanation: 'זוהי התשובה המלאה המשלבת הגנה פיזית, תקציב כוח, סייבר וביצועי רשת.'
      },
      {
        id: 'iq-3-b',
        text: 'חיבור המצלמות ישירות ל-VLAN המשרדי של מנהל הנדסה באמצעות מתג שולחני ביתי רגיל',
        isCorrect: false,
        explanation: 'ציוד שולחני יישרף בחום הקיץ הישראלי, וחיבור למשרדי מסכן את כל רשת העירייה.'
      },
      {
        id: 'iq-3-c',
        text: 'הגדרת כל המצלמות בכתובות IP ציבוריות ישירות ללא חומת אש כדי להקל על צפייה מרחוק',
        isCorrect: false,
        explanation: 'מחדל אבטחה חמור המאפשר תקיפה וחדירה ישירה למצלמות העירייה מהאינטרנט.'
      },
      {
        id: 'iq-3-d',
        text: 'שימוש במתאם PoE של 15W עבור מצלמת PTZ חיצונית הכוללת גוף חימום 45W',
        isCorrect: false,
        explanation: 'חוסר הספק יוביל לנפילת המצלמה בלילות קרים ברגע שהמפוח וגוף החימום יופעלו.'
      }
    ]
  },
  {
    id: 'iq-4',
    category: 'VoIP',
    topic: 'מרכזיות IP ומוקד 106',
    question: 'מוקד 106 של עיריית רעננה חווה קיטועי שמע בשיחות נכנסות בזמן שיא. מהם הגורמים האפשריים ואיך תפתור זאת?',
    idealAnswer: 'קיטועי שמע ב-VoIP נובעים בדרך כלל משלושה גורמים: השהיה (Latency), תנודתיות בהגעת חבילות (Jitter), או איבוד חבילות (Packet Loss). הצעדים לפתרון: 1. בדיקת הגדרות QoS במתגים - לוודא שחבילות הדיבור (RTP) מתויגות ב-DSCP 46 (Expedited Forwarding - EF) ומקבלות תור בעדיפות עליונה (Priority Queue) בכל מתגי הדרך. 2. בדיקת קווי ה-Uplink וה-Trunk לעומס חריג או תעבורת גיבויים שחונקת את הקו. 3. אימות הגדרות ה-SIP Trunk מול ספקית התקשורת ורוחב הפס המוקצה. 4. בדיקת חיבורי הכבילה והפורטים לאיתור שגיאות CRC.',
    keyPoints: [
      'הבנת הגורמים: Jitter, Latency, Packet Loss',
      'הגדרת QoS DSCP 46 EF עם תור עדיפות ייעודי',
      'בדיקת קווי SIP Trunk מול בזק/סלקום',
      'בדיקת עומסי Uplink ושגיאות פיזיות'
    ],
    raananaRelevance: 'מכרז 7274: "היכרות ותפעול של מרכזיות IP" ושרידות מוקד 106.',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-4-a',
        text: 'זיהוי Jitter ו-Packet Loss, וידוא תיוג QoS DSCP 46 (EF) לחבילות RTP בתור עדיפות קשיח (Priority Queue), וביצוע Shaping לגיבויים כבדים',
        isCorrect: true,
        explanation: 'קיטועי שמע ב-VoIP נגרמים מ-Jitter עקב חוסר תעדוף RTP מול תעבורת נתונים כבדה.'
      },
      {
        id: 'iq-4-b',
        text: 'החלפה מיידית של שרת ה-CUCM של העירייה ללא בדיקת קווי תקשורת',
        isCorrect: false,
        explanation: 'שרת המרכזייה מנהל איתותים (Signaling), בעוד זרם השמע (RTP) עובר בין הטלפונים לספק.'
      },
      {
        id: 'iq-4-c',
        text: 'המרת כל הטלפונים במוקד 106 לטלפונים אנלוגיים עם כבלי נחושת ישנים',
        isCorrect: false,
        explanation: 'נסיגה טכנולוגית בלתי ישימה במרכז שליטה ומוקד חירום מודרני.'
      },
      {
        id: 'iq-4-d',
        text: 'ביטול מוחלט של מנגנוני ה-QoS בכל המתגים כדי "לפשט את הניתוב"',
        isCorrect: false,
        explanation: 'ביטול QoS יחמיר את הבעיה כי חבילות קול ייזרקו בכל פעם שמישהו מוריד קובץ.'
      }
    ]
  },
  {
    id: 'iq-5',
    category: 'L1',
    topic: 'עבודה מול ספקים וטכנאים',
    question: 'קו ה-Metro העירוני המחבר בית ספר מרוחק נפל. מוקד בזק טוען שהקו שלהם "ירוק ותקין לחלוטין". איך אתה מנהל את האירוע מולם?',
    idealAnswer: 'אני לא מקבל את התשובה כעובדה אלא מנהל שיח מקצועי ומבוסס נתונים: 1. אני מתחבר לנתב האתר ובודק בפקודת `show interface` האם יש Carrier Transition, שינויי מצב (Up/Down) או שגיאות CRC. 2. אני מבקש מנציג הספק לבצע Loopback בדיקה מול ציוד הקצה (NTU/מודם) שלהם באתר. 3. אני מציג להם פלט בדיקה המראה שהניתוק חל בצד הספק (למשל חוסר מענה ל-ARP או ניתוק BFD). 4. במידה והתקלה נמשכת, אני מבקש הסלמה למנהל תורן (Escalation) בהתאם להסכם ה-SLA החוזי של עיריית רעננה ומתאם הגעת טכנאי שטח משותף לבדיקה עם בודק תמסורת פיזי.',
    keyPoints: [
      'הצגת עובדות טכניות (לוגים ושגיאות ממשק)',
      'דרישת בדיקת Loopback מול ציוד הספק',
      'הפעלת מנגנון הסלמה לפי SLA חוזי',
      'תיאום הגעת טכנאי שטח לבדיקה משותפת באתר'
    ],
    raananaRelevance: 'מכרז 7274: "עבודה מול טכנאים וספקים... הפעלת שיקול דעת".',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-5-a',
        text: 'אימות נתוני ממשק (לוגים, CRC, BFD), דרישת בדיקת Loopback לציוד ה-NTU של הספק, הפעלת הסלמה (Escalation) לפי SLA חוזי ותיאום טכנאי שטח לבדיקה משותפת',
        isCorrect: true,
        explanation: 'שיח הנדסי מגובה בעובדות ובחוזה SLA הוא הדרך המקצועית היחידה להניע ספק לפעולה.'
      },
      {
        id: 'iq-5-b',
        text: 'קבלת הודעת המוקד כנכונה וסגירת קריאת השירות ללא המשך בירור',
        isCorrect: false,
        explanation: 'משאיר את בית הספר מנותק מתקשורת ופוגע בשירות העירוני.'
      },
      {
        id: 'iq-5-c',
        text: 'חיתוך כבל הסיב של בזק בארון התקשורת כדי להוכיח שהקו לא תקין',
        isCorrect: false,
        explanation: 'גרימת נזק מכוון לתשתית, עבירה פלילית שתביא לחיובים כבדים.'
      },
      {
        id: 'iq-5-d',
        text: 'הגדרת כתובת IP כפולה בנתב כדי לנסות לעקוף את מודם הספק',
        isCorrect: false,
        explanation: 'התנגשות IP לא תפתור כשל תמסורת פיזי או לוגי בקו ה-Metro.'
      }
    ]
  },
  {
    id: 'iq-6',
    category: 'Cisco',
    topic: 'מיתוג Cisco, VLANs ו-Trunking',
    question: 'חיברת מתג קומה חדש למתג ההפצה בחיבור סיב אופטי, אך תחנות ב-VLAN 20 אינן מקבלות תקשורת לשאר העירייה. מה תבדוק תחילה?',
    idealAnswer: 'ראשית אבדוק את הגדרת ה-Trunk בין המתגים: בפקודת `show interface trunk` אוודא שהפורט אכן במצב Trunk פעיל (802.1Q Encapsulation), וחשוב מכל - שה-VLAN המבוקש (VLAN 20) מופיע ברשימת ה-Allowed VLANs ואינו מסונן (Pruned). שנית, אוודא בפקודת `show vlan brief` ש-VLAN 20 אכן הוגדר בבסיס הנתונים המקומי של שני המתגים. לבסוף אבדוק את ה-Native VLAN לשני הצדדים כדי לוודא שאין Native VLAN Mismatch.',
    keyPoints: [
      'אימות מצב Trunk בפקודת show interface trunk',
      'בדיקת רשימת Allowed VLANs ב-Trunk',
      'אימות קיום ה-VLAN ב-show vlan brief בשני המתגים',
      'בדיקת התאמת Native VLAN למניעת חוסר סנכרון'
    ],
    raananaRelevance: 'בדיקה יומיומית בעת הרחבת מתגים במוסדות חינוך ובנייני עירייה.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-6-a',
        text: 'בדיקת show interface trunk לווידוא מצב 802.1Q פעיל, אימות ש-VLAN 20 מופיע ב-Allowed VLANs, ובדיקה ש-VLAN 20 נוצר ב-show vlan בשני המתגים',
        isCorrect: true,
        explanation: 'שכחת יצירת ה-VLAN במתג החדש או אי-הכללתו ב-Trunk Allowed הן הסיבות הנפוצות ביותר לתקלה זו.'
      },
      {
        id: 'iq-6-b',
        text: 'הגדרת הפורט המחבר בין שני המתגים כמצב switchport mode access vlan 20',
        isCorrect: false,
        explanation: 'פורט חיבור בין מתגים (Uplink) חייב להיות Trunk כדי להעביר את כל ה-VLANs ולא רק אחד.'
      },
      {
        id: 'iq-6-c',
        text: 'החלפה מיידית של מתאמי ה-SFP האופטיים בשני הצדדים',
        isCorrect: false,
        explanation: 'אם הלינק הפיזי דולק, הבעיה היא הגדרת שכבה 2 (Trunk/VLAN) ולא מתאם פיזי.'
      },
      {
        id: 'iq-6-d',
        text: 'הפעלת פרוטוקול RIP v1 בין שני המתגים',
        isCorrect: false,
        explanation: 'RIP הוא פרוטוקול ניתוב בשכבה 3 ואינו קשור לתיוג 802.1Q בשכבה 2.'
      }
    ]
  },
  {
    id: 'iq-7',
    category: 'Cisco',
    topic: 'פרוטוקול עץ פורש (STP) והגנות Spanning Tree',
    question: 'עובד חיבר כבל רשת בין שני שקעים באותו חדר, וגרם להשבתת מתג הקומה. באיזה מנגנון Cisco תשתמש כדי למנוע הישנות מקרה כזה?',
    idealAnswer: 'כדי למנוע לולאות מחיבורי משתמשים בלתי מורשים, אני מגדיר בכל פורטי הגישה (Access Ports): 1. `spanning-tree portfast` - מעביר את הפורט מיד למצב Forwarding ועוקף את שלבי ההאזנה של STP. 2. `spanning-tree bpduguard enable` - ברגע שהפורט מקבל חבילת BPDU (המעידה על חיבור מתג או לולאה), הפורט מושבת מיידית ועובר למצב err-disable. בנוסף, אפעיל `storm-control broadcast level 2.0` למניעת הצפת תעבורה.',
    keyPoints: [
      'הפעלת Spanning-Tree PortFast בכל פורטי Access',
      'הפעלת BPDU Guard להשבתת פורט במקרה קבלת BPDU (err-disable)',
      'הבנת סכנת Broadcast Storm בהיעדר מנגנון הגנה',
      'שילוב Storm-Control לריסון שידורי הצפה'
    ],
    raananaRelevance: 'מגן על משרדי העירייה מפני טעויות אנוש של עובדים ומבקרים.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-7-a',
        text: 'הפעלת BPDU Guard יחד עם PortFast בכל פורטי ה-Access, כך שקבלת BPDU תכניס את הפורט למצב err-disable ותנטרל את הלולאה',
        isCorrect: true,
        explanation: 'BPDU Guard מזהה מיד מתגים זרים או לולאות בשקעי משתמשים ומכבה את הפורט.'
      },
      {
        id: 'iq-7-b',
        text: 'ביטול מוחלט של Spanning Tree במתג הקומה באמצעות no spanning-tree vlan',
        isCorrect: false,
        explanation: 'ביטול STP יגרום לקריסה מיידית של הרשת בכל לולאה קטנה ללא כל הגנה.'
      },
      {
        id: 'iq-7-c',
        text: 'שינוי מהירות כל הפורטים מ-1Gbps ל-10Mbps',
        isCorrect: false,
        explanation: 'הפחתת מהירות לא מונעת לולאות אלא רק פוגעת בביצועי המשתמשים.'
      },
      {
        id: 'iq-7-d',
        text: 'הגדרת IP סטטי לכל שקע בקיר',
        isCorrect: false,
        explanation: 'לולאת שכבה 2 מתרחשת מתחת לשכבת ה-IP ואינה מושפעת מהגדרת כתובת IP.'
      }
    ]
  },
  {
    id: 'iq-8',
    category: 'Cisco',
    topic: 'אבטחת פורטים פיזית (Port Security)',
    question: 'בארונות תקשורת פתוחים בבתי ספר בעיר יש חשש שתלמידים ינתקו מחשב ויחברו מחשב נייד פרטי. כיצד תקשיח את הפורטים במתג?',
    idealAnswer: 'אני מגדיר Port Security בכל פורטי הגישה: 1. הגדרת הפורט כ-Access: `switchport mode access`. 2. הפעלת האבטחה: `switchport port-security`. 3. הגבלת מספר כתובות ה-MAC המורשות לאחת: `switchport port-security maximum 1`. 4. לימוד הכתובת הלגיטימית: `switchport port-security mac-address sticky` (שומר את ה-MAC בריצת התצורה). 5. קביעת תגובת ענישה מחמירה: `switchport port-security violation shutdown` כך שבחיבור מכשיר זר, הפורט יינעל מיד (err-disable) ותישלח התרעת SNMP למערכת PRTG.',
    keyPoints: [
      'הגדרת switchport port-security',
      'הגבלת maximum 1 MAC',
      'שימוש ב-mac-address sticky',
      'הגדרת violation shutdown או restrict',
      'התרעה למערכת השו״ב בעת הפרה'
    ],
    raananaRelevance: 'מכרז 7274: "אבטחת מידע והקשחת ציוד קצה ברשתות חינוך ועירוניות".',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-8-a',
        text: 'הגדרת Port Security עם maximum 1, שימוש ב-mac-address sticky ללימוד כתובת המחשב המורשה, ו-violation shutdown המכבה את הפורט בעת חיבור מכשיר זר',
        isCorrect: true,
        explanation: 'פתרון מדויק המונע חיבור של כל מכשיר לא מורשה ומתריע למנהל הרשת.'
      },
      {
        id: 'iq-8-b',
        text: 'הסרת סיסמת ה-Enable ממתג בית הספר',
        isCorrect: false,
        explanation: 'פגיעה חמורה באבטחת המכשיר.'
      },
      {
        id: 'iq-8-c',
        text: 'ניתוק כל כבלי התקשורת בבית הספר וחיבור כולם ב-Wi-Fi ללא הצפנה',
        isCorrect: false,
        explanation: 'מפר את כל תקני האבטחה העירוניים.'
      },
      {
        id: 'iq-8-d',
        text: 'הפעלת DHCP Snooping ללא הגדרת Trusted Ports',
        isCorrect: false,
        explanation: 'חסימת שרתי DHCP אינה מונעת מנייד זר להתחבר עם כתובת סטטית.'
      }
    ]
  },
  {
    id: 'iq-9',
    category: 'Cisco',
    topic: 'ניתוב Layer 3 ו-DHCP Relay',
    question: 'הגדרת VLAN 40 חדש עבור מחלקת הפיקוח העירוני, אך המחשבים אינם מקבלים כתובת IP ומקבלים 169.254. מה חסר במתג ה-L3 המרכזי?',
    idealAnswer: 'בקשות ה-DHCP נשלחות כ-Broadcast בשכבה 2 (255.255.255.255), ואינן חוצות נתב או ממשק SVI (Switch Virtual Interface). מכיוון ששרת ה-DHCP של עיריית רעננה יושב ב-VLAN השרתים (למשל VLAN 10), חובה להגדיר על ה-SVI של VLAN 40 במתג ה-L3 את הפקודה `ip helper-address <DHCP_Server_IP>`. פקודה זו הופכת את שידורי ה-Broadcast לבקשות Unicast המועברות ישירות לשרת. בנוסף יש לוודא שקיים Scope מוגדר בשרת עבור תת-הרשת של VLAN 40.',
    keyPoints: [
      'הבנה ששידורי Broadcast של DHCP אינם חוצים ממשק L3',
      'הגדרת ip helper-address על גבי ה-SVI של ה-VLAN הרלוונטי',
      'המרה מ-Broadcast ל-Unicast אל שרת ה-DHCP',
      'אימות קיום Scope מתאים בשרת ה-DHCP המרכזי'
    ],
    raananaRelevance: 'פתרון תקלה קלאסית בכל פתיחת אגף או מחלקה חדשה בעירייה.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-9-a',
        text: 'הגדרת פקודת ip helper-address עם כתובת שרת ה-DHCP המרכזי על גבי ממשק ה-SVI של VLAN 40 במתג ה-L3, ואימות Scope מתאים בשרת',
        isCorrect: true,
        explanation: 'ip helper-address מתפקד כ-DHCP Relay Agent ומאפשר לבקשות לחצות את גבול הניתוב.'
      },
      {
        id: 'iq-9-b',
        text: 'החלפת כבלי הרשת של כל עובדי מחלקת הפיקוח',
        isCorrect: false,
        explanation: 'APIPA מעיד שכבל הרשת תקין (L1/L2 up) אך שרת ה-DHCP אינו עונה.'
      },
      {
        id: 'iq-9-c',
        text: 'הגדרת default-gateway 0.0.0.0 בכל עמדת קצה',
        isCorrect: false,
        explanation: '0.0.0.0 אינו שער חוקי לעמדת משתמש.'
      },
      {
        id: 'iq-9-d',
        text: 'הפיכת כל פורטי המשתמשים לפורטי Trunk 802.1Q',
        isCorrect: false,
        explanation: 'עמדות קצה רגילות אינן תומכות בתיוג Trunk ויאבדו תקשורת לחלוטין.'
      }
    ]
  },
  {
    id: 'iq-10',
    category: 'Cisco',
    topic: 'רשימות בקרת גישה (ACLs) ואבטחת נתבים',
    question: 'נדרש לחסום גישה של תחנות ממחלקת הרווחה (VLAN 30) לשרתי השכר והגבייה (10.20.10.0/24), אך לאפשר להן גישה מלאה לאינטרנט. היכן וכיצד תיישם זאת?',
    idealAnswer: 'אני איישם Extended Access List (מכיוון ש-Standard מסננת רק לפי מקור ולא מאפשרת דיוק ביעד וסוג פרוטוקול). את ה-Extended ACL יש ליישם קרוב ככל האפשר למקור התנועה - על גבי ה-SVI או ממשק הכניסה של VLAN 30 במתג ה-L3/נתב בכיוון Inbound (`ip access-group ACL_WELFARE in`). הכללים: 1. `deny ip 10.30.0.0 0.0.255.255 10.20.10.0 0.0.0.255` (חסימת שרתי שכר). 2. `permit ip any any` (אישור שאר התעבורה לאינטרנט ולשרתים מורשים). יישום קרוב למקור חוסך רוחב פס ברשת הליבה.',
    keyPoints: [
      'שימוש ב-Extended ACL להבחנה בין שרתי שכר לשאר הרשת/אינטרנט',
      'יישום ה-ACL קרוב ככל האפשר למקור (Inbound ב-SVI של VLAN 30)',
      'הגדרת deny לתת-הרשת הרגישה ו-permit לכל השאר',
      'זכירת ה-Implicit Deny בסוף הרשימה וחובת permit ip any any'
    ],
    raananaRelevance: 'דרישות תקן ואבטחת מידע מחמירות להגנה על מאגרי מידע עירוניים רגישים.',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-10-a',
        text: 'יצירת Extended ACL החוסם תעבורה מ-VLAN 30 אל תת-רשת השכר ומאשר permit לכל השאר, והחלתו בכניסה (Inbound) על ממשק SVI 30 הקרוב למקור',
        isCorrect: true,
        explanation: 'Extended ACL קרוב למקור מונע העברת תעבורה חסומה בעמוד השדרה של הרשת ומאפשר גלישה.'
      },
      {
        id: 'iq-10-b',
        text: 'יצירת Standard ACL החוסם את כתובת ה-Default Gateway של הרווחה',
        isCorrect: false,
        explanation: 'חסימת השער תנתק את מחלקת הרווחה מכל הרשת והאינטרנט.'
      },
      {
        id: 'iq-10-c',
        text: 'חסימת פורט 80 ופורט 443 בכל הנתבים של עיריית רעננה',
        isCorrect: false,
        explanation: 'ישבית את הגלישה באינטרנט לכל עובדי העירייה.'
      },
      {
        id: 'iq-10-d',
        text: 'הגדרת כתובת MAC זהה לכל עמדות מחלקת הרווחה',
        isCorrect: false,
        explanation: 'יגרום להתנגשות MAC ולנפילת טבלת ה-CAM במתג.'
      }
    ]
  },
  {
    id: 'iq-11',
    category: 'Cisco',
    topic: 'איחוד קווים ויתירות (EtherChannel / LACP)',
    question: 'חיברת שני כבלי נחושת בין מתג הפצה למתג קומה, אך נורית אחד הכבלים כתומה ואינו מעביר תעבורה. מה הסיבה וכיצד תנצל את שניהם במקביל?',
    idealAnswer: 'הסיבה שנורית אחת כתומה היא פרוטוקול STP (Spanning Tree), שמזהה לולאה ומעביר את הפורט השני למצב Blocking כדי למנוע Broadcast Storm. כדי לנצל את שני הקווים יחד להכפלת רוחב הפס (2Gbps) וליצירת יתירות אמיתית, יש לאגד אותם ל-EtherChannel (Port-Channel) באמצעות פרוטוקול LACP (802.3ad תקני בתעשייה). פקודות: על שני הפורטים מגדירים `channel-group 1 mode active`. לאחר מכן כל הגדרות ה-Trunk וה-VLANs מוגדרות על גבי ממשק ה-Port-channel1.',
    keyPoints: [
      'הבנת תפקיד STP בחסימת הקו השני כברירת מחדל (Blocking)',
      'הגדרת EtherChannel / Port-Channel לאיגוד פיזי ולוגי',
      'שימוש בפרוטוקול תקני LACP (802.3ad) עם mode active',
      'השגת הכפלת רוחב פס ושרידות ללא חסימת STP'
    ],
    raananaRelevance: 'הקמת Uplinks עתירי ביצועים למבני עירייה מרכזיים.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-11-a',
        text: 'STP חוסם את הפורט למניעת לולאה; יש לאגד את הפורטים ל-EtherChannel באמצעות LACP (mode active) כדי לקבל רוחב פס כפול ויתירות מלאה',
        isCorrect: true,
        explanation: 'LACP מאגד את שני הלינקים לממשק לוגי אחד ש-STP רואה כקו בודד.'
      },
      {
        id: 'iq-11-b',
        text: 'כיבוי ה-Spanning Tree במתג כדי ששני הכבלים יעבדו בחופשיות',
        isCorrect: false,
        explanation: 'יגרום לולאת L2 קטלנית וקריסה טוטאלית של הרשת תוך שניות.'
      },
      {
        id: 'iq-11-c',
        text: 'החלפת הכבל הכתום בכבל סיב אופטי חד-גידי',
        isCorrect: false,
        explanation: 'הצבע הכתום מציג סטטוס STP ולא כשל פיזי בכבל.'
      },
      {
        id: 'iq-11-d',
        text: 'הגדרת IP שונה לכל אחד משני הפורטים במתג שכבה 2',
        isCorrect: false,
        explanation: 'פורטי L2 רגילים במתג אינם מקבלים כתובות IP ישירות.'
      }
    ]
  },
  {
    id: 'iq-12',
    category: 'PRTG',
    topic: 'אבטחת פרוטוקול SNMP (v2c מול v3)',
    question: 'מנהל אבטחת המידע בעירייה דורש להסיר את כל הגדרות SNMP v2c ממתגי הרשת ולעבור ל-SNMP v3 בלבד. מדוע הוא דורש זאת?',
    idealAnswer: 'ב-SNMP v2c המידע, וחשוב מכל - קהילת האימות (Community String כדוגמת "public" או "private") מועברים בטקסט גלוי (Cleartext) ללא כל הצפנה ברשת. כל תוקף עם Wireshark או מכשיר מאזין יכול לחלץ את הסיסמה ולקבל מידע מלא על טופולוגיית הרשת, או אף לשנות הגדרות ב-SNMP Write. לעומת זאת, SNMP v3 מספק שלושה עוגני אבטחה קריטיים במצב authPriv: 1. אימות משתמשים חזק (SHA / HMAC-SHA-256). 2. הצפנת תעבורה מקצה לקצה (AES-128 / AES-256). 3. שלמות מידע (Message Integrity) המונעת שינוי חבילות בדרך.',
    keyPoints: [
      'SNMP v2c מעביר Community String בטקסט גלוי לחלוטין',
      'סכנת חשיפת טופולוגיית הרשת ושינוי הגדרות מרחוק',
      'SNMP v3 מספק אימות (Authentication באמצעות SHA)',
      'SNMP v3 מספק הצפנה (Encryption באמצעות AES)',
      'עמידה בהנחיות מערך הסייבר הלאומי לרשויות מקומיות'
    ],
    raananaRelevance: 'עמידה בביקורות אבטחת מידע מחמירות בעיריית רעננה.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-12-a',
        text: 'SNMP v2c מעביר סיסמאות בטקסט גלוי ללא הצפנה, בעוד SNMP v3 ברמת authPriv כולל אימות חזק מבוסס משתמש (SHA) והצפנה מלאה של המידע (AES)',
        isCorrect: true,
        explanation: 'SNMP v3 מבטיח סודיות, אימות ושלמות נתונים מפני האזנה ברשת.'
      },
      {
        id: 'iq-12-b',
        text: 'SNMP v3 פועל מעל TCP במקום UDP ולכן הוא מהיר פי 10',
        isCorrect: false,
        explanation: 'שתי הגרסאות משתמשות ב-UDP (פורטים 161 ו-162).'
      },
      {
        id: 'iq-12-c',
        text: 'SNMP v2c אינו תומך במתגים בעלי יותר מ-8 פורטים',
        isCorrect: false,
        explanation: 'גרסת SNMP אינה תלויה במספר הפורטים במתג.'
      },
      {
        id: 'iq-12-d',
        text: 'SNMP v3 אינו דורש הגדרת שום סיסמה או אימות במתג',
        isCorrect: false,
        explanation: 'להפך, SNMP v3 דורש משתמש, סיסמת אימות וסיסמת הצפנה.'
      }
    ]
  },
  {
    id: 'iq-13',
    category: 'PRTG',
    topic: 'סנסורים מותאמים אישית (Custom OID / MIB)',
    question: 'במערכת PRTG סנסור ה-SNMP הסטנדרטי מציג רק תעבורה, אך נדרש לנטר את טמפרטורת ארון החוץ של מצלמות LPR ממתג ה-Moxa. כיצד תגדיר זאת?',
    idealAnswer: 'כדי לנטר מדד ייחודי של יצרן כגון טמפרטורת מארז במתג Moxa: 1. אני מוריד את קובץ ה-MIB הספציפי של דגם המתג מאתר היצרן (Moxa MIB File). 2. אני מייבא את ה-MIB ל-PRTG (או משתמש ב-MIB Compiler / MIB Importer). 3. מאתר את ה-OID (Object Identifier) הייעודי של חיישן הטמפרטורה, למשל באמצעות SNMP Walk. 4. יוצר ב-PRTG סנסור מסוג "SNMP Custom" או "SNMP Custom String/Value", מזין את ה-OID ומגדיר את היחידות כמעלות צלזיוס (°C). 5. מגדיר ספי התרעה (Thresholds): התרעת Warning ב-45°C והתרעת Error ב-55°C.',
    keyPoints: [
      'הורדת קובץ MIB ייעודי של היצרן (Moxa)',
      'איתור ה-OID של סנסור הטמפרטורה באמצעות SNMP Walk',
      'הגדרת סנסור מסוג SNMP Custom ב-PRTG',
      'הגדרת יחידות מידה (°C) וספי התרעה (Thresholds)'
    ],
    raananaRelevance: 'ניטור מנע למניעת שריפת ציוד בארונות רחוב בקיץ הישראלי.',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-13-a',
        text: 'ייבוא קובץ ה-MIB של יצרן הציוד, איתור ה-OID הייעודי של מד הטמפרטורה באמצעות SNMP Walk, והגדרת סנסור SNMP Custom עם ספי התרעה מתאימים',
        isCorrect: true,
        explanation: 'סנסור SNMP Custom מאפשר לנטר כל פרמטר חומרה שהיצרן חושף ב-MIB.'
      },
      {
        id: 'iq-13-b',
        text: 'התקנת מדחום כספית רגיל בתוך הארון ובדיקתו ידנית פעם ביום',
        isCorrect: false,
        explanation: 'אינו מאפשר ניטור אוטומטי רציף או התרעות בזמן אמת במוקד.'
      },
      {
        id: 'iq-13-c',
        text: 'הרצת פקודת Ping מרובה עד שהמתג יתחמם',
        isCorrect: false,
        explanation: 'חסר היגיון הנדסי ועלול להעמיס על הרשת.'
      },
      {
        id: 'iq-13-d',
        text: 'שינוי כתובת ה-IP של מתג ה-Moxa לכתובת בטווח של PRTG',
        isCorrect: false,
        explanation: 'שינוי IP אינו מספק סנסור טמפרטורה פנימי.'
      }
    ]
  },
  {
    id: 'iq-14',
    category: 'PRTG',
    topic: 'התרעות שו״ב (Traps מול Polling)',
    question: 'מה ההבדל בין ניטור מבוסס Polling לבין ניטור מבוסס SNMP Traps במערכת PRTG העירונית, ומתי תשתמש בכל אחד?',
    idealAnswer: 'Polling הוא תהליך משיכה (Pull) שבו שרת ה-PRTG שולח שאילתה למתג כל X שניות (למשל כל 60 שניות) כדי לקבל את ערך המונה (כמו רוחב פס, מעבד או טמפרטורה). זהו הבסיס לגרפים ומגמות היסטוריות. לעומת זאת, SNMP Trap הוא אירוע דחיפה (Push): המתג שולח באופן יזום ומידי הודעת התרעה ל-PRTG בשנייה שמתרחש אירוע חריג (כגון נפילת פורט קריטי, פתיחת דלת ארון רחוב, או כשל מאוורר). בעיריית רעננה אשתמש ב-Polling לניטור רציף של עומסים ומגמות, וב-Traps לקבלת התרעה מיידית של שניות בודדות על תקלות קריטיות.',
    keyPoints: [
      'Polling: משיכה תקופתית (Pull) משרת הניטור, מתאים לגרפים ומגמות',
      'Traps: דחיפה מיידית (Push) מהמתג בעת אירוע חריג',
      'Traps אינו מחכה למחזור הבדיקה הבא ומספק זמן תגובה מהיר',
      'שילוב שניהם מעניק תמונת מצב אופטימלית במערך שו״ב'
    ],
    raananaRelevance: 'הבטחת זמני תגובה מהירים לאירועי חירום במוקד העירוני.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-14-a',
        text: 'Polling שואל את המכשיר במרווח זמן קבוע (Pull) ומייצר גרפים ומגמות; SNMP Trap נשלח מיד מהמכשיר בעת אירוע קריטי (Push) ומספק התרעה מיידית ללא המתנה',
        isCorrect: true,
        explanation: 'זהו ההבדל המהותי בין תשאול יזום מתוזמן לבין אירוע מתפרץ בזמן אמת.'
      },
      {
        id: 'iq-14-b',
        text: 'Polling נועד רק למדפסות ו-Traps נועד רק למחשבים ניידים',
        isCorrect: false,
        explanation: 'פרוטוקולי SNMP מיושמים על כל סוגי ציוד הרשת.'
      },
      {
        id: 'iq-14-c',
        text: 'Trap דורש התחברות ב-Telnet לכל מתג בכל 5 שניות',
        isCorrect: false,
        explanation: 'Trap נשלח כהודעת UDP עצמאית מהמתג אל השרת.'
      },
      {
        id: 'iq-14-d',
        text: 'אין כל הבדל, מדובר בשני שמות שונים לאותה פעולה בדיוק',
        isCorrect: false,
        explanation: 'מדובר בשני מנגנונים הפוכים בארכיטקטורת רשת (Pull מול Push).'
      }
    ]
  },
  {
    id: 'iq-15',
    category: 'PRTG',
    topic: 'ניתוח שגיאות ממשק ורוחב פס',
    question: 'סנסור ה-Traffic ב-PRTG מציג 30% ניצולת בלבד בקו הסיב, אך מופיעות עשרות אלפי שגיאות "Interface Discards" ו-"CRC Errors". מה המשמעות וכיצד תפתור זאת?',
    idealAnswer: 'ניצולת של 30% מוכיחה שהקו אינו עמוס ברוחב פס, אך שגיאות CRC Errors ו-Discards מעידות באופן חד משמעי על תקלה פיזית בשכבה 1 (L1) או 2 (L2): 1. בקו סיב אופטי, שגיאות CRC נגרמות לרוב מעוצמת אות אופטית נמוכה (Low Optical Rx Power), מחבר סיב אופטי (LC/SC) מלוכלך באבק או שומן, כיפוף יתר של הסיב (Macro-bend), או מתאם SFP פגום. 2. פעולות לפתרון: בדיקת עוצמות אופטיות בפקודת `show interfaces transceiver detail`, ניקוי מקצועי של מחברי הסיב באמצעות עט ניקוי ייעודי (Fiber Cleaner), ואם הבעיה נמשכת - בדיקת הסיב במכשיר OTDR או החלפת מודול ה-SFP.',
    keyPoints: [
      'הבנה ש-CRC אינו קשור לעומס רוחב פס אלא לכשל פיזי בשכבה 1',
      'גורמים בסיב: לכלוך במחברים, כיפופים, הנחתה אופטית גבוהה, או SFP תקול',
      'בדיקת עוצמות אופטיות בפקודת show interfaces transceiver',
      'ניקוי סיבים ושימוש ב-OTDR לאיתור נקודת השבר'
    ],
    raananaRelevance: 'תקלה נפוצה בתשתיות סיבים עירוניות המובילות לאתרי קצה.',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-15-a',
        text: 'שגיאות CRC מעידות על פגיעה פיזית בשכבה 1 (אות אופטי חלש, מחבר מלוכלך, כיפוף סיב או SFP תקול); יש לבדוק עוצמות dBm ב-transceiver detail ולנקות מחברים',
        isCorrect: true,
        explanation: 'CRC מודד פגיעה בשלמות המסגרת הפיזית עקב רעש או הנחתה ולא עקב עומס לוגי.'
      },
      {
        id: 'iq-15-b',
        text: 'הגדלת מהירות ה-Interface מ-1Gbps ל-10Gbps כדי לדלל את השגיאות',
        isCorrect: false,
        explanation: 'הגדלת מהירות על תשתית פיזית לקויה תחמיר את שגיאות ה-CRC פי עשרה.'
      },
      {
        id: 'iq-15-c',
        text: 'התעלמות מהשגיאות כל עוד ניצולת רוחב הפס נמוכה מ-90%',
        isCorrect: false,
        explanation: 'שגיאות CRC גורמות לנשירת חבילות (Packet Loss) ולניתוקי שיחות קול ומצלמות.'
      },
      {
        id: 'iq-15-d',
        text: 'איפוס סיסמת ה-VTP במתג המקומי',
        isCorrect: false,
        explanation: 'אינו קשור לתקינות שידור פיזית של ביטים בסיב אופטי.'
      }
    ]
  },
  {
    id: 'iq-16',
    category: 'VoIP',
    topic: 'סיווג ותעדוף תעבורה (QoS Marking & DSCP)',
    question: 'איזה ערך DSCP נדרש להגדיר עבור חבילות קול (RTP Audio Streams) כדי להבטיח איכות שמע במוקד 106, ומה ההבדל בינו לבין איתותי SIP?',
    idealAnswer: 'עבור חבילות הקול עצמן (RTP Media Payload) הסטנדרט התעשייתי הוא DSCP 46 הידוע כ-Expedited Forwarding (EF). ערך זה מבטיח שהחבילות יוכנסו לתור עדיפות עליונה קשיח (Strict Priority Queue) ויעברו לפני כל תעבורת נתונים אחרת במתגים ובנתבים. לעומת זאת, איתותי שיחה (SIP Signaling) אינם זרם שמע רציף אלא פקודות הקמת וניתוק שיחה (Port 5060), ולכן הם מתויגים בערך נמוך יותר של DSCP 24 או CS3 (Class Selector 3) / AF31. יש להפעיל `mls qos trust dscp` בכל פורט uplink כדי שהתיוג יישמר לכל אורך הדרך.',
    keyPoints: [
      'RTP Audio: DSCP 46 EF (Expedited Forwarding)',
      'הכנסה לתור עדיפות עליונה קשיח (Strict Priority Queue)',
      'SIP Signaling: DSCP 24 / CS3 / AF31 (הקמת שיחות)',
      'הפעלת mls qos trust dscp לשמירה על התיוג בין המתגים'
    ],
    raananaRelevance: 'הבטחת תפקוד מוקד החירום העירוני 106 בזמני עומס חריגים.',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-16-a',
        text: 'זרם הקול (RTP) מתויג ב-DSCP 46 EF ומקבל Priority Queue עליון; איתותי SIP מתויגים ב-DSCP 24 (CS3) להקמת שיחות, ויש לוודא trust dscp במתגים',
        isCorrect: true,
        explanation: 'זוהי הארכיטקטורה המדויקת של Cisco ו-IETF להפרדה בין שמע לאיתות.'
      },
      {
        id: 'iq-16-b',
        text: 'חבילות קול מקבלות DSCP 0 (Best Effort) כדי שהנתב לא יתערב בתוכנן',
        isCorrect: false,
        explanation: 'DSCP 0 היא עדיפות אפס, שתביא לנשירת חבילות קול בעומס הראשון.'
      },
      {
        id: 'iq-16-c',
        text: 'הגדרת ערך DSCP 63 לכל תעבורת האינטרנט של העירייה',
        isCorrect: false,
        explanation: 'מתן עדיפות מקסימלית לגלישה כללית יחנוק את מוקד 106 לחלוטין.'
      },
      {
        id: 'iq-16-d',
        text: 'שימוש ב-CoS 0 בלבד בכבלי נחושת Cat5',
        isCorrect: false,
        explanation: 'CoS 0 אינו מעניק עדיפות, ואינו תומך במעבר שכבה 3 מעבר ל-Trunk.'
      }
    ]
  },
  {
    id: 'iq-17',
    category: 'VoIP',
    topic: 'מדדי איכות קול (Jitter, Latency ו-MOS)',
    question: 'בניטור מרכזיית ה-IP העירונית נמדד ציון MOS של 2.8 ו-Jitter של 85ms. מה המשמעות למשתמשי מוקד 106, ומהם ערכי היעד התקינים?',
    idealAnswer: 'ציון MOS (Mean Opinion Score) נע בין 1 ל-5. ציון של 2.8 מעיד על איכות שיחה ירודה ובלתי נסבלת (דיבור מקוטע, רובוטי וקולות נעלמים), ו-Jitter של 85ms חורג בהרבה מגודל ה-Jitter Buffer של הטלפונים (שבדרך כלל מסוגל לפצות עד 20-30ms). חבילות שמע שמגיעות באיחור כזה פשוט נזרקות. ערכי היעד התקינים לתקשורת VoIP ברמת Enterprise הם: 1. ציון MOS מעל 4.1. 2. השהיה (One-Way Latency) מתחת ל-150ms. 3. Jitter נמוך מ-30ms (רצוי מתחת ל-10ms). 4. איבוד חבילות (Packet Loss) מתחת ל-1%.',
    keyPoints: [
      'הבנת סולם MOS: מעל 4.0 תקין, מתחת ל-3.5 איכות ירודה',
      'Jitter של 85ms חורג מגבולות ה-Buffer וגורם לשמע מקוטע',
      'ערכי יעד: Latency < 150ms, Jitter < 30ms, Loss < 1%',
      'צורך בפתרון מיידי ברמת ה-QoS וה-Uplink'
    ],
    raananaRelevance: 'שמירה על רמת שירות גבוהה לתושבים הפונים למוקד העירוני.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-17-a',
        text: 'איכות השיחה ירודה ומקוטעת מאוד (חבילות נזרקות עקב חריגה מה-Jitter Buffer); ערכי היעד הם MOS מעל 4.1, Jitter מתחת ל-30ms ו-Packet Loss קטן מ-1%',
        isCorrect: true,
        explanation: 'MOS של 2.8 נחשב לבלתי שמיש במוקדי חירום ומחייב טיפול תשתיתי דחוף.'
      },
      {
        id: 'iq-17-b',
        text: 'ציון 2.8 מעיד על שיחה באיכות HD מעולה ואין צורך בשום שינוי',
        isCorrect: false,
        explanation: 'הפוך לחלוטין - 5 הוא הציון המושלם, 2.8 הוא ציון נכשל.'
      },
      {
        id: 'iq-17-c',
        text: 'החלפת שפופרות הטלפון של מוקדני 106 בשפופרות אלחוטיות',
        isCorrect: false,
        explanation: 'אינו משפיע על פרמטרי הרשת של Jitter ו-Packet Loss.'
      },
      {
        id: 'iq-17-d',
        text: 'כיבוי שרתי המוקד והעברת כל השיחות להודעות SMS',
        isCorrect: false,
        explanation: 'אינו פתרון הנדסי לשרידות מוקד טלפוני עירוני.'
      }
    ]
  },
  {
    id: 'iq-18',
    category: 'VoIP',
    topic: 'פרוטוקול SIP מול זרמי RTP',
    question: 'טלפון IP של מנהל אגף מצלצל, אך כשהוא עונה לשיחה יש דממה מוחלטת (One-Way / No-Way Audio). מה ההסבר הרשתי לתופעה?',
    idealAnswer: 'תופעה זו היא תקלה קלאסית ב-VoIP הנובעת מההפרדה בין פרוטוקול האיתות (SIP) לבין זרם המדיה (RTP): שיחת ה-SIP משתמשת בפורט UDP 5060 כדי לגרום לטלפון לצלצל ולהחליף כתובות ב-SDP. ברגע שהשיחה נענית, זרם השמע נשלח ישירות בין תחנות הקצה בפורטי UDP אקראיים ודינמיים בטווח גבוה (בדרך כלל 16384-32767). דממה מוחלטת מתרחשת כאשר חומת אש (Firewall), רשימת ACL או מנגנון NAT (כגון SIP ALG משובש או חסימת UDP) חוסמים את טווח פורטי ה-RTP, או כאשר יש בעיית ניתוב אסימטרית בין תתי-הרשתות.',
    keyPoints: [
      'הבחנה בין SIP (איתות בפורט 5060) לבין RTP (שמע בפורטי UDP גבוהים)',
      'חסימת פורטי RTP ב-Firewall או ב-ACL גורמת לדממת שמע למרות שהטלפון צלצל',
      'בעיות NAT / SIP ALG המשבשות את כתובת ה-IP בחבילות ה-SDP',
      'ניתוב אסימטרי המונע חזרת חבילות שמע בכיוון ההפוך'
    ],
    raananaRelevance: 'פתרון בעיות חיבור מרכזיה עם שלוחות מרוחקות באתרים עירוניים.',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-18-a',
        text: 'איתות ה-SIP (פורט 5060) עבר בהצלחה ולכן הטלפון צלצל, אך זרם השמע (RTP) בפורטי UDP גבוהים נחסם על ידי Firewall/ACL או סובל מתקלת NAT/ניתוב',
        isCorrect: true,
        explanation: 'הפרדה מוחלטת בין ערוץ השליטה (SIP) לערוץ המדיה (RTP) היא שורש תופעת No Audio.'
      },
      {
        id: 'iq-18-b',
        text: 'נורת ה-LED במסך הטלפון שרופה ודורשת הלחמה',
        isCorrect: false,
        explanation: 'תקלת חומרה כזו אינה מסבירה חוסר שמע ברשת.'
      },
      {
        id: 'iq-18-c',
        text: 'הסרת כרטיס ה-SIM של טלפון ה-IP הנייח',
        isCorrect: false,
        explanation: 'טלפוני IP נייחים בארגון מחוברים בכבל רשת ואינם כוללים כרטיסי SIM.'
      },
      {
        id: 'iq-18-d',
        text: 'החלפת ספק האינטרנט של עיריית רעננה באופן מיידי',
        isCorrect: false,
        explanation: 'התקלה היא מקומית בהגדרות Firewall/NAT ואינה קשורה לספק.'
      }
    ]
  },
  {
    id: 'iq-19',
    category: 'VoIP',
    topic: 'רוחב פס וקיבולת שיחות (Codec G.711 מול G.729)',
    question: 'אתר מרוחק של העירייה מחובר בקישור מוגבל ברוחב פס. איזה Codec קול תבחר עבור השלוחות, ומה ההשפעה על איכות השמע ורוחב הפס?',
    idealAnswer: 'בקישור מוגבל רוחב פס אבחר ב-Codec מסוג G.729 במקום G.711: 1. G.711 (תקן PCM ללא דחיסה) צורך כ-87.2Kbps לכל שיחה כולל תקורה של L2/IP/UDP/RTP, ומספק איכות שמע מצוינת (MOS 4.1). 2. G.729 עושה שימוש בדחיסה מתקדמת (CS-ACELP) וצורך רק כ-31.2Kbps לכל שיחה כולל תקורות (רוחב הפס נטו לחבילת הקול הוא 8Kbps בלבד), תוך שמירה על איכות שמע טובה מאוד (MOS 3.92). מעבר ל-G.729 מאפשר להעביר פי 2.5 יותר שיחות במקביל על אותו קו תמסורת מבלי לחנוק אותו.',
    keyPoints: [
      'G.711 צורך כ-87Kbps לשיחה (ללא דחיסה, איכות מעולה)',
      'G.729 צורך כ-31Kbps לשיחה (דחוס, חסכוני מאוד)',
      'התאמת ה-Codec לרוחב הפס באתרים מרוחקים',
      'שמירה על איכות שיחה סבירה (MOS קרוב ל-4.0) בחסכון ניכר'
    ],
    raananaRelevance: 'תכנון קיבולת קווי תמסורת לאתרים מרוחקים (פארק, בתי ספר, מקלטים).',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-19-a',
        text: 'שימוש ב-Codec מסוג G.729 הצורך כ-31Kbps לשיחה (כולל תקורות) במקום G.711 הצורך כ-87Kbps, מה שמאפשר להעביר פי 2.5 יותר שיחות על אותו קו',
        isCorrect: true,
        explanation: 'G.729 תוכנן במיוחד עבור קישורי WAN מוגבלים לחסכון ניכר ברוחב פס.'
      },
      {
        id: 'iq-19-b',
        text: 'שימוש בפורמט וידאו 4K לא דחוס עבור כל שיחת טלפון',
        isCorrect: false,
        explanation: 'יצרוך עשרות מגה-ביטים וימוטט את הקו המוגבל.'
      },
      {
        id: 'iq-19-c',
        text: 'הגבלת כל שיחה למשך של 30 שניות בדיוק',
        isCorrect: false,
        explanation: 'מגבלה שרירותית הפוגעת בעבודת העירייה והתושבים.'
      },
      {
        id: 'iq-19-d',
        text: 'ביטול פרוטוקול IP והעברת השמע בקוד מורס',
        isCorrect: false,
        explanation: 'אבסורדי ובלתי ישים ברשת IP מודרנית.'
      }
    ]
  },
  {
    id: 'iq-20',
    category: 'Smart City',
    topic: 'מתגים תעשייתיים (Industrial Ethernet)',
    question: 'מדוע בארונות תקשורת בצמתי רחוב ברעננה לא מתקינים מתגי Cisco Catalyst משרדיים רגילים אלא מתגים תעשייתיים (כמו Moxa או Cisco IE)?',
    idealAnswer: 'מתגים משרדיים מיועדים לחדרי שרתים ממוזגים בטמפרטורה של 20-25°C. בארון רחוב ישראלי שוררים תנאי סביבה קיצוניים: 1. טמפרטורה: בקיץ הטמפרטורה בארון עולה מעל 50-60°C. מתג תעשייתי (Industrial Ethernet) עמיד בטווח של מינוס 40°C עד פלוס 75°C. 2. אבק ולחות: מתג תעשייתי הוא חסר מאווררים (Fanless) ומשתמש בצינון פסיבי (צלעות קירור), כך שאינו יונק אבק וחול שסותמים מתגים רגילים. 3. עמידות לרעידות והארקה: מותקן על גבי פס DIN-Rail ועמיד לרעידות מתנועת משאיות בכביש. 4. מתח והזנה: תומך בספקי כוח כפולים בזרם ישר (12-48V DC) והגנה מפני קפיצות מתח והשראות ברקים (Surge Immunity).',
    keyPoints: [
      'עמידות בטווח טמפרטורה קיצוני (-40°C עד +75°C)',
      'קירור פסיבי ללא מאוורר (Fanless) למניעת שאיבת אבק',
      'עמידות ברעידות והתקנה על גבי פס DIN-Rail',
      'הזנת DC כפולה והגנה מפני קפיצות מתח והשראות ברקים'
    ],
    raananaRelevance: 'מכרז 7274: "הקמה, שדרוג ותחזוקת ארונות תקשורת ברחבי העיר".',
    difficulty: 'מתחיל',
    options: [
      {
        id: 'iq-20-a',
        text: 'מתגים תעשייתיים עמידים בטווח חום קיצוני (-40°C עד 75°C), פועלים ללא מאוורר (Fanless) למניעת שאיבת אבק, מותקנים על DIN-Rail ותומכים בהזנת DC יתירה והגנת ברקים',
        isCorrect: true,
        explanation: 'מתג משרדי רגיל ייסתם מאבק ויישרף מחום בתוך שבועות ספורים בארון שטח.'
      },
      {
        id: 'iq-20-b',
        text: 'מתגים תעשייתיים הם זולים פי 10 ממתגים משרדיים ולכן חוסכים כסף לעירייה',
        isCorrect: false,
        explanation: 'מתגים מוקשחים יקרים משמעותית בשל רכיבי חומרה עמידים במיוחד.'
      },
      {
        id: 'iq-20-c',
        text: 'מתג משרדי אינו יודע להעביר חבילות IP בצמתי רחוב',
        isCorrect: false,
        explanation: 'פרוטוקול IP זהה בכל מקום; ההבדל הוא בעמידות הפיזית של החומרה.'
      },
      {
        id: 'iq-20-d',
        text: 'החוק מחייב צביעת המתג בצבע ירוק זרחני בצומת',
        isCorrect: false,
        explanation: 'אין כל קשר לצבע המכשיר.'
      }
    ]
  },
  {
    id: 'iq-21',
    category: 'Smart City',
    topic: 'תקני PoE ותקציב כוח (Power over Ethernet)',
    question: 'בצומת מותקנות 3 מצלמות LPR (צורכות 15W כ"א) ומצלמת PTZ עם גוף חימום (צורכת 50W). מתג ה-PoE מספק 60W סה"כ. מה יקרה בלילה קר וכיצד תפתור זאת?',
    idealAnswer: 'סך הצריכה בשעות שיא (לילה קר שבו גופי החימום של המצלמות נכנסים לפעולה) מגיע ל-3×15W + 50W = 95W. מכיוון שתקציב ה-PoE (PoE Budget) של המתג הוא 60W בלבד, תתרחש חריגת עומס יתר (PoE Overload). מנגנון ההגנה של המתג ינתק אספקת חשמל לפורטים באופן שרירותי או לפי סדר עדיפויות, ומצלמות קריטיות ייכבו. פתרון: 1. שדרוג ספק הכוח של המתג התעשייתי לספק של 120W-180W התומך בתקן IEEE 802.3bt (PoE++ המספק עד 60W/90W לפורט יחיד עבור ה-PTZ). 2. הגדרת עדיפויות PoE במתג (`power inline priority critical/high`) כדי שמצלמות העיר החכמה החיוניות לא ייפלו ראשונות.',
    keyPoints: [
      'חישוב צריכת שיא (95W) מול תקציב מוגבל (60W)',
      'הבנת סכנת ניתוק פורטים בלילות קרים בגלל גופי חימום',
      'שדרוג לספק תומך תקן IEEE 802.3bt (PoE++) בהספק 120W ומעלה',
      'הגדרת עדיפות PoE בפורטים למצלמות קריטיות'
    ],
    raananaRelevance: 'מניעת השבתת מערך האבטחה וה-LPR של עיריית רעננה בלילות.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-21-a',
        text: 'סך הצריכה בלילה מגיע ל-95W ועובר את התקציב (60W), מה שיפיל מצלמות; יש לשדרג לספק 120W+ בתקן 802.3bt (PoE++) ולהגדיר עדיפויות PoE בפורטים',
        isCorrect: true,
        explanation: 'חישוב מדויק של תקציב PoE והבנת השפעת גופי החימום בלילות קרים.'
      },
      {
        id: 'iq-21-b',
        text: 'כיבוי כל המצלמות בלילה והפעלתן מחדש בבוקר כשהטמפרטורה עולה',
        isCorrect: false,
        explanation: 'מצלמות אבטחה ו-LPR נחוצות במיוחד בלילות לצרכי ביטחון.'
      },
      {
        id: 'iq-21-c',
        text: 'חיבור מצלמת ה-PTZ ישירות לשקע USB במחשב הנייד של הטכנאי',
        isCorrect: false,
        explanation: 'מתח USB אינו מספק 50W לציוד חוץ תעשייתי.'
      },
      {
        id: 'iq-21-d',
        text: 'החלפת כבלי הרשת בכבלי טלפון ישנים',
        isCorrect: false,
        explanation: 'כבלי טלפון אינם מסוגלים להעביר זרמי PoE++ ועלולים להתלקח.'
      }
    ]
  },
  {
    id: 'iq-22',
    category: 'Smart City',
    topic: 'קישורי רדיו אלחוטיים (Point-to-Point 60GHz vs 5GHz)',
    question: 'נדרש לחבר אתר של העירייה שאין אליו תשתית סיב אופטי באמצעות קישור רדיו PtP. מתי תבחר בתדר 60GHz ומתי בתדר 5GHz?',
    idealAnswer: 'הבחירה תלויה במרחק, רוחב הפס הנדרש ורגישות למזג אוויר: 1. קישור בתדר 60GHz (כגון Siklu או MikroTik Wireless Wire): מעניק רוחב פס עצום של 1Gbps-2.5Gbps ב-Full Duplex עם חביון אפסי (כמו סיב באוויר), ללא הפרעות (תדר נקי). עם זאת, טווח השידור מוגבל (עד 1-1.5 ק"מ) והתדר רגיש להנחתת גשם כבד (Rain Fade עקב בליעת גלי חמצן). מתאים ביותר לחיבור אתרים סמוכים עתירי וידאו ומצלמות. 2. קישור בתדר 5GHz: טווח שידור ארוך בהרבה (5-15 ק"מ) ועמידות גבוהה לגשם, אך רוחב הפס נמוך יותר (100-300Mbps) והתדר סובל מהפרעות Wi-Fi עירוניות ומחייב מנגנון DFS.',
    keyPoints: [
      '60GHz: רוחב פס ענק (Multi-Gigabit), חביון אפסי, ללא הפרעות, אך רגיש לגשם ומוגבל לטווח קצר',
      '5GHz: טווח ארוך, עמידות בגשם, אך רוחב פס מוגבל והפרעות מרובות',
      'חובת קו ראייה אופטי נקי (Line of Sight) ואזור Fresnel פנוי',
      'שימוש ב-60GHz כראשי עם גיבוי 5GHz אוטומטי'
    ],
    raananaRelevance: 'חיבור מהיר של מצלמות פארק רעננה ואתרי בנייה זמניים.',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-22-a',
        text: '60GHz מספק רוחב פס של 1-2.5Gbps וחביון אפסי לטווחים קצרים (עד 1.5 ק"מ) ללא הפרעות אך רגיש לגשם; 5GHz מתאים למרחקים גדולים אך מוגבל ברוחב הפס וסובל מהפרעות',
        isCorrect: true,
        explanation: 'שילוב אידיאלי הוא קישור 60GHz ראשי עם גיבוי Failover של 5GHz.'
      },
      {
        id: 'iq-22-b',
        text: 'תדר 60GHz פועל רק מתחת לפני האדמה ובתוך צינורות ביוב',
        isCorrect: false,
        explanation: 'גלי רדיו אינם עוברים באדמה; נדרש קו ראייה אופטי באוויר.'
      },
      {
        id: 'iq-22-c',
        text: 'תדר 5GHz אינו חוקי במדינת ישראל ומוחרם על ידי משרד התקשורת',
        isCorrect: false,
        explanation: 'תדר 5GHz פתוח ומאושר לשימוש בהתאם למגבלות עוצמה ו-DFS.'
      },
      {
        id: 'iq-22-d',
        text: 'שני התדרים זהים לחלוטין בביצועים ובטווח',
        isCorrect: false,
        explanation: 'התנהגות הגלים שונה לחלוטין עקב אורך הגל ותכונות הבליעה באטמוספירה.'
      }
    ]
  },
  {
    id: 'iq-23',
    category: 'Smart City',
    topic: 'הארקות והגנת מתחי יתר (Surge Protection)',
    question: 'מדוע חובה להתקין מגיני ברקים (Surge Protectors) והארקה תקנית בכל כבל רשת הנכנס מארון רחוב למצלמה חיצונית על עמוד?',
    idealAnswer: 'עמודי תאורה ומצלמות ברחובות רעננה חשופים ישירות לפגיעות ברק עקיפות ופריקות מתח אלקטרוסטטיות (ESD). פגיעת ברק בקרבת מקום יוצרת גל מתח מושרה (Surge) של אלפי וולטים על גבי גידי הנחושת של כבל ה-Cat6. ללא הגנה: 1. גל המתח ינוע לאורך הכבל וישרוף מיידית את כרטיס הרשת של המצלמה ואת פורט ה-PoE במתג. 2. הפתרון התקני: התקנת מגן מתח (Ethernet Surge Protector) בשני קצוות הכבל (בצד המצלמה ובצד הארון) המחובר להארקה בעלת התנגדות נמוכה (מתחת ל-5 אוהם). המגן מכיל רכיבי GDT / TVS הפורקים את זרם היתר ישירות לאדמה תוך ננו-שניות ומצילים את הציוד.',
    keyPoints: [
      'הגנה מפני נחשולי מתח מושרים (Surges) וברקים',
      'שריפת פורטי PoE וכרטיסי רשת ללא הגנה',
      'התקנת מגיני רשת בשני קצוות הכבל וחיבור להארקה תקנית',
      'חשיבות התנגדות הארקה נמוכה לפריקה מהירה ובטוחה'
    ],
    raananaRelevance: 'מניעת נזקים של מאות אלפי שקלים לציוד עירוני בסופות חורף.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-23-a',
        text: 'פריקות מתח וברקים משרים אלפי וולטים על כבלי הנחושת וישרפו את המצלמה והמתג; מגיני ברקים פורקים את זרם היתר להארקה ומגנים על הציוד האלקטרוני',
        isCorrect: true,
        explanation: 'הארקה ומגיני מתח הם מרכיב חובה בהתקנות חוץ בעיר חכמה.'
      },
      {
        id: 'iq-23-b',
        text: 'מגן ברקים מיועד להגביר את מהירות האינטרנט מ-1G ל-10G בימי גשם',
        isCorrect: false,
        explanation: 'מגן ברקים הוא רכיב הגנה פסיבי ואינו מגביר מהירות תקשורת.'
      },
      {
        id: 'iq-23-c',
        text: 'הארקה נדרשת רק כדי למנוע יונים מלקנן על גג הארון',
        isCorrect: false,
        explanation: 'בדיחה; מדובר בבטיחות חיי אדם והגנה על ציוד מתח נמוך.'
      },
      {
        id: 'iq-23-d',
        text: 'חיבור כבל הרשת לצינור מים מפלסטיק מבטל את הצורך בהארקה',
        isCorrect: false,
        explanation: 'פלסטיק הוא חומר מבדד ואינו מוליך זרם פריקה לאדמה.'
      }
    ]
  },
  {
    id: 'iq-24',
    category: 'L1',
    topic: 'סיבים אופטיים (Single-Mode OS2 מול Multi-Mode OM3/OM4)',
    question: 'נדרש לחבר אתר במרחק 2.5 קילומטרים למרכז העירייה. באיזה סיב אופטי ובאילו מודולי SFP תבחר, ומדוע?',
    idealAnswer: 'למרחק של 2.5 קילומטרים חובה לבחור בסיב אופטי חד-אופן (Single-Mode Fiber - תקן OS2 בצבע צהוב) ובמודולי SFP תואמי 10G-LR (Long Reach) או 1000BASE-LX באורך גל 1310nm. סיב רב-אופן (Multi-Mode OM3/OM4 בצבע טורקיז/סגול) מוגבל עקב תופעת נפיצה מודאלית (Modal Dispersion) למרחק מקסימלי של 300-400 מטרים במהירות 10Gbps, ולכן אינו מסוגל פיזית לגשר על מרחק של 2.5 ק"מ. סיב Single-Mode בעל ליבה דקה (9 מיקרון) מאפשר מעבר קרן לייזר אחת בלבד ומסוגל להגיע לעשרות קילומטרים ללא ניחות מורגש.',
    keyPoints: [
      'Single-Mode (OS2, ליבה 9 מיקרון) מיועד לטווחים ארוכים (עד 10-40 ק"מ)',
      'Multi-Mode (OM3/OM4, ליבה 50 מיקרון) מוגבל ל-300-400 מטר ב-10G',
      'שימוש במודולי SFP מסוג 10G-LR או 1G-LX באורך גל 1310nm',
      'הבנת תופעת הנפיצה המודאלית בסיבי Multi-Mode'
    ],
    raananaRelevance: 'תכנון תוואי סיבים עירוניים בין מבני העירייה ברעננה.',
    difficulty: 'מתחיל',
    options: [
      {
        id: 'iq-24-a',
        text: 'סיב חד-אופן (Single-Mode OS2) עם מודולי SFP מסוג LR/LX (1310nm), מכיוון שסיב Multi-Mode מוגבל לנפיצה של עד 300-400 מטר בלבד במהירות גבוהה',
        isCorrect: true,
        explanation: 'מרחק של 2.5 ק"מ מחייב חד-אופן (Single-Mode) ללא כל פשרות.'
      },
      {
        id: 'iq-24-b',
        text: 'סיב רב-אופן Multi-Mode OM1 ישן בצבע כתום עם מודול SFP מסוג SX',
        isCorrect: false,
        explanation: 'OM1 מוגבל לכ-220 מטר בלבד ולא יפעל כלל במרחק 2.5 ק"מ.'
      },
      {
        id: 'iq-24-c',
        text: 'כבל נחושת Cat5e רגיל עם מחברי RJ45 מוזהבים',
        isCorrect: false,
        explanation: 'כבל נחושת Ethernet מוגבל לתקן של 100 מטר בלבד.'
      },
      {
        id: 'iq-24-d',
        text: 'שימוש בצינור פלסטיק עם מראות פנימיות',
        isCorrect: false,
        explanation: 'אינו קיים כתקן תקשורת אופטית מודרני.'
      }
    ]
  },
  {
    id: 'iq-25',
    category: 'L1',
    topic: 'מדידות אופטיות (Optical Power Meter & OTDR)',
    question: 'טכנאי חיבר קו סיב אופטי חדש אך הלינק מסרב לעלות. כיצד תשתמש במד הספק אופטי (Power Meter) וב-OTDR לאיתור התקלה?',
    idealAnswer: 'בדיקה שיטתית בשני שלבים: 1. שימוש ב-Optical Power Meter: מודדים את עוצמת האות האופטי (ב-dBm) המגיעה למחבר ה-LC בקצה הקו. עבור מודול SFP 10G-LR, עוצמת קליטה תקינה (Rx Power) נעה בין 0.5- dBm ל-14- dBm. אם העוצמה היא 30- dBm או שאין אור כלל, יש הנחתה חמורה או נתק. שלב 2 - שימוש ב-OTDR (Optical Time-Domain Reflectometer): המכשיר שולח פולסי אור ומנתח את ההחזרים לאורך הסיב. גרף ה-OTDR (Trace) מציג במדויק: אירועים לא מחזירים (ריתוך פגום או כיפוף יתר), אירועים מחזירים (מחברים מלוכלכים), והכי חשוב - המרחק המדויק במטרים עד לנקודת השבר או הניתוק בסיב.',
    keyPoints: [
      'מדידת עוצמת Rx ב-dBm באמצעות Optical Power Meter',
      'השוואה לטווח העוצמות המותר של ה-SFP Transceiver',
      'שימוש ב-OTDR לאיתור נקודת השבר והמרחק במטרים',
      'זיהוי הנחתות בריתוכים (Splices), כיפופים (Macro-bends) ומחברים מלוכלכים'
    ],
    raananaRelevance: 'פיקוח על קבלני פריסת סיבים אופטיים ברחבי עיריית רעננה.',
    difficulty: 'מתקדם',
    options: [
      {
        id: 'iq-25-a',
        text: 'בדיקת עוצמת Rx ב-dBm באמצעות Power Meter לאימות טווח תקין, והפעלת OTDR לשליחת פולסים ואיתור המרחק המדויק במטרים לנקודת השבר, הריתוך או הכיפוף',
        isCorrect: true,
        explanation: 'שילוב Power Meter לרמת העוצמה ו-OTDR למיפוי מיקום התקלה לאורך התוואי.'
      },
      {
        id: 'iq-25-b',
        text: 'הסתכלות ישירה בעין לתוך מחבר הסיב האופטי כדי לראות אם הלייזר דולק',
        isCorrect: false,
        explanation: 'סכנת עיוורון מיידי! קרינת לייזר אינפרא-אדומה (1310/1550nm) אינה נראית אך הורסת את הרשתית.'
      },
      {
        id: 'iq-25-c',
        text: 'טבילת קצה הסיב האופטי בכוס מים כדי לבדוק רציפות',
        isCorrect: false,
        explanation: 'יזהם ויהרוס את המחבר האופטי לחלוטין.'
      },
      {
        id: 'iq-25-d',
        text: 'החלפת שרת ה-DNS של העירייה',
        isCorrect: false,
        explanation: 'אינו קשור לתקלת שכבה פיזית בקו סיב אופטי.'
      }
    ]
  },
  {
    id: 'iq-26',
    category: 'L1',
    topic: 'תשתיות נחושת ובדיקות TDR (Cat6A & Pinout)',
    question: 'נקודת רשת של עמדת עבודה בעירייה מסנכרנת רק ב-100Mbps במקום 1Gbps, ולעיתים מתנתקת. מה הגורם הסביר וכיצד תאבחן זאת מהמתג?',
    idealAnswer: 'תקשורת Gigabit Ethernet (1000BASE-T) מעל כבלי נחושת דורשת בהכרח את כל 4 הזוגות (8 גידים) של הכבל תקינים. לעומת זאת, תקשורת 100BASE-TX דורשת רק 2 זוגות (גידים 1, 2, 3, 6). אם גיד אחד מזוגות 4/5 או 7/8 נקרע, לחוץ בצורה פגומה בשקע/פדש-פאנל, או סובל מהצלבה, המתג יבצע Auto-Negotiation וייפול למהירות 100Mbps בלבד. אבחון ישיר ממתג ה-Cisco: הרצת בדיקת TDR (Time-Domain Reflectometer) מובנית בפקודה `test cable-diagnostics tdr interface Gi1/0/10` ולאחר מכן `show cable-diagnostics tdr interface Gi1/0/10`. הפקודה תציג את הסטטוס של כל זוג (Normal, Open, Short, Crosstalk) והמרחק המדויק במטרים עד הנתק.',
    keyPoints: [
      'Gigabit (1000M) מחייב 4 זוגות מלאים; 100M דורש רק 2 זוגות',
      'נתק או לחיצה פגומה בזוגות 4/5 או 7/8 גורם ל-Downgrade ל-100Mbps',
      'בדיקת TDR מובנית ב-Cisco: test cable-diagnostics tdr',
      'איתור מצב הזוגות (Open/Short) והמרחק במטרים לכשל'
    ],
    raananaRelevance: 'פתרון בעיות כבילה יומיומיות בעמדות קצה בבנייני עירייה.',
    difficulty: 'בינוני',
    options: [
      {
        id: 'iq-26-a',
        text: 'גיגה-ביט דורש 4 זוגות תקינים (8 גידים); נתק בזוגות המשניים מפיל את המהירות ל-100M. ניתן לאבחן זאת מהמתג בפקודת cable-diagnostics tdr המציגה Open/Short ומרחק לכשל',
        isCorrect: true,
        explanation: 'הסבר הנדסי מדויק לתופעת הנפילה ל-100Mbps ושימוש בכלי ה-TDR המובנה במתגי Cisco.'
      },
      {
        id: 'iq-26-b',
        text: 'כרטיס הרשת של העמדה התמלא בווירוסים שמחקו את מהירות הגיגה',
        isCorrect: false,
        explanation: 'תקלת סנכרון פיזית (Duplex/Speed) נובעת מגידים פגומים בכבל ולא מווירוס.'
      },
      {
        id: 'iq-26-c',
        text: 'הגדרת switchport speed 10000 במתג 1G רגיל',
        isCorrect: false,
        explanation: 'פורט 1G אינו תומך במהירות 10G.'
      },
      {
        id: 'iq-26-d',
        text: 'מריחת גריז על מגעי כבל הרשת בשקע הקיר',
        isCorrect: false,
        explanation: 'גריז הוא חומר מבודד ויגרום לנתק מוחלט.'
      }
    ]
  }
];

