import { GoogleGenAI } from '@google/genai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();

    if (!prompt && (!history || history.length === 0)) {
      return new Response(
        JSON.stringify({ error: 'חסר תוכן לשאילתה' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const warningText = 'שימו לב: מפתח GEMINI_API_KEY אינו מוגדר כרגע. אנא הגדר אותו בהגדרות המערכת כדי להפעיל את היועץ החכם.';
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(warningText));
          controller.close();
        },
      });
      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
        },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
אתה "יועץ בכיר לתקשורת ורשתות ומומחה עיריית רעננה".
תפקידך להכשיר וללמד מ-0 מועמדים לתפקיד "איש/ת תקשורת ורשתות רמה ב' - עיריית רעננה (משרה 7274)".
התפקיד כולל:
- תפעול ותחזוקה שוטפת של מערך התקשורת העירוני בסביבה רחבת אתרים (מעל 80 אתרים, בתי ספר, פארקים, מרכזים קהילתיים).
- תשתיות תקשורת קוויות (סיבים אופטיים Single/Multi Mode, כבלי Cat6A, מתגים אקטיביים L2/L3 של Cisco/Aruba, ארונות תקשורת 19" והזנות PoE/PoE++).
- תשתיות אלחוטיות (Wi-Fi 6, בקרים WLC, קישורי רדיו Point-to-Point בתדרי 5GHz/60GHz).
- מערכות שו״ב ומוניטורינג (PRTG, Zabbix, SNMP v2c/v3, ספי התראה, יומני Syslog).
- מערך האינטרנט העירוני, ISP Peering, ניתוב, NAT/PAT, שירותי DHCP ו-DNS.
- פרויקטי עיר חכמה (Smart City): מצלמות ביטחון ו-LPR (זיהוי לוחיות רישוי), בקרת רמזורים, חיישני IoT ומתגים תעשייתיים מוקשחים (Outdoor).
- אבטחת מידע והקשחה: Port Security, 802.1X NAC, חומות אש Fortinet/Check Point, הפרדת VLANs, VPN.
- מרכזיות IP (VoIP): פרוטוקול SIP, RTP, SIP Trunks, שרידות מוקד החירום 106, הגדרות איכות שמע QoS / DSCP EF.
- מתודולוגיית איתור תקלות מורכבות ברמה ב' בשטח, עבודה עצמאית עם כלי CLI, וניהול ספקים (בזק, סלקום, HOT, קבלני סיבים) בהתאם להסכמי SLA.

ענה תמיד בעברית רהוטה, מקצועית, מעודדת וברורה.
אם המשתמש מתחיל מ-0, הסבר לו במונחים פשוטים אך מדויקים טכנית.
ספק דוגמאות מוחשיות מעיריית רעננה (רחוב אחוזה, פארק רעננה, בית יד לבנים, מוקד 106, תיכון אוסטרובסקי ועוד).
כלול פקודות CLI אמיתיות (Cisco/Aruba/Linux) במידת הצורך בתוך בלוקי קוד.
היה מנטור מקצועי, יסודי ומוביל!
`;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        if (msg.content && msg.content.trim()) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          });
        }
      }
    }

    if (prompt) {
      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error('Stream processing error:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'שגיאה בתקשורת עם שרת ה-AI',
        details: error?.message || 'אנא נסה שוב בעוד מספר רגעים.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }
}
