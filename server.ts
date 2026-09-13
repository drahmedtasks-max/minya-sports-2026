import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store initialized with defaults
let systemData = {
  matches: [
    {
      id: 'm-101',
      sportId: 'futsal',
      sportName: 'خماسي كرة القدم',
      round: 'دور المجموعات - الجولة الأولى',
      teamA: 'جامعة المنيا (المضيفة)',
      teamB: 'جامعة أسيوط',
      scoreA: 3,
      scoreB: 2,
      status: 'live',
      court: 'الصالة المغطاة الرئيسية (الملعب 1)',
      time: '11:00 ص',
      date: 'اليوم',
      notes: 'الشوط الثاني - متبقي 4 دقائق',
    },
    {
      id: 'm-102',
      sportId: 'volleyball',
      sportName: 'الكرة الطائرة',
      round: 'دور المجموعات - الجولة الأولى',
      teamA: 'جامعة القاهرة',
      teamB: 'جامعة حلوان',
      scoreA: 2,
      scoreB: 1,
      status: 'live',
      court: 'صالة الأنشطة الرياضية (الملعب ب)',
      time: '11:30 ص',
      date: 'اليوم',
      notes: 'الشوط الفاصل الثالث (12 - 10)',
    },
    {
      id: 'm-103',
      sportId: 'basketball',
      sportName: 'كرة السلة',
      round: 'دور الثمانية',
      teamA: 'جامعة الإسكندرية',
      teamB: 'جامعة عين شمس',
      scoreA: 58,
      scoreB: 54,
      status: 'finished',
      court: 'مجمع الصالات الرياضية 2',
      time: '09:00 ص',
      date: 'اليوم',
      notes: 'انتهت بفوز جامعة الإسكندرية',
    },
    {
      id: 'm-104',
      sportId: 'padel',
      sportName: 'رياضة البادل',
      round: 'الدور الأول (زوجي طلبة)',
      teamA: 'جامعة المنيا (المضيفة)',
      teamB: 'جامعة المنصورة',
      scoreA: null,
      scoreB: null,
      status: 'upcoming',
      court: 'ملاعب البادل المفتوحة (الملعب 1)',
      time: '01:00 م',
      date: 'اليوم',
      notes: 'فترة الإحماء 5 دقائق قبل الانطلاق',
    },
    {
      id: 'm-105',
      sportId: 'table-tennis',
      sportName: 'تنس الطاولة',
      round: 'فردي طلبة - ربع النهائي',
      teamA: 'جامعة بنها',
      teamB: 'جامعة الزقازيق',
      scoreA: 2,
      scoreB: 2,
      status: 'live',
      court: 'صالة تنس الطاولة بالمركز الأولمبي',
      time: '11:45 ص',
      date: 'اليوم',
      notes: 'الشوط الحاسم (8 - 8)',
    },
  ],
  protests: [
    {
      id: 'pr-1',
      protestNumber: 'PROTEST-2026-001',
      university: 'جامعة أسيوط',
      opponentUniversity: 'جامعة المنيا',
      sport: 'خماسي كرة القدم',
      supervisorName: 'ك/ محمود العسقلاني',
      supervisorPhone: '01123456789',
      feePaid: true,
      status: 'pending',
      submittedAt: 'اليوم - 10:45 ص (خلال 35 دقيقة من نهاية المباراة)',
      details: 'اعتراض شكلي على أهلية مشاركة اللاعب رقم 7 للاشتباه في قيده بمرحلة الدراسات العليا، مع إرفاق إيصال سداد رسم الطعن (1000 ج.م).',
      decisionNotes: 'قيد مراجعة شهادات القيد وبطاقات الاشتراك الميدانية بمعرفة اللجنة الفنية المنظمة.',
    },
    {
      id: 'pr-2',
      protestNumber: 'PROTEST-2026-002',
      university: 'جامعة حلوان',
      opponentUniversity: 'جامعة الإسكندرية',
      sport: 'كرة السلة',
      supervisorName: 'د/ شريف عبد الرحمن',
      supervisorPhone: '01099887766',
      feePaid: true,
      status: 'rejected',
      submittedAt: 'أمس - 03:15 م',
      details: 'اعتراض على قرار حكم اللقاء في الثواني الأخيرة باحتساب خطأ فني شخصي.',
      decisionNotes: 'تم رفض الطعن استناداً للمادة ثانياً/3 من اللائحة: حظر الاعتراض على القرارات الفنية للحكام، ولا يُرد الرسم المسدد.',
    },
  ],
  tickets: [
    {
      id: 't-101',
      ticketNumber: 'TCK-8812',
      university: 'جامعة القاهرة',
      requesterName: 'ك/ إبراهيم عبد السلام (مشرف الوفد)',
      requesterPhone: '01011223344',
      sport: 'الكرة الطائرة',
      subject: 'طلب عاجل: تعارض ألوان الزي الرسمي لمباراة اليوم',
      description: 'الفريقان يرتديان الزي الأبيض المخطط بالأزرق، ونطلب إخطار الفريق المذكور ثانياً بالجدول بارتداء الزي البديل تطبيقاً للبند 10 من الشروط العامة.',
      priority: 'urgent',
      status: 'action_taken',
      createdAt: 'اليوم - 09:20 ص',
      assignedTo: 'د/ يسري خلاف عبد الباقي',
      resolutionNotes: 'تم إخطار مشرف جامعة حلوان رسمياً وتغيير الزي للون الكحلي الاحتياطي قبل انطلاق اللقاء.',
    },
    {
      id: 't-102',
      ticketNumber: 'TCK-8813',
      university: 'جامعة عين شمس',
      requesterName: 'د/ هاني عبد الفتاح (مدير النشاط)',
      requesterPhone: '01233445566',
      sport: 'تنس الطاولة',
      subject: 'استفسار واعتذار لتأخر وصول حافلة الفريق نصف ساعة',
      description: 'تعطلت الحافلة على الطريق الزراعي، ونلتمس تأخير موعد اللقاء 20 دقيقة لتجنب تطبيق قاعدة الـ 15 دقيقة والانسحاب الإجباري.',
      priority: 'urgent',
      status: 'under_review',
      createdAt: 'اليوم - 11:10 ص',
      assignedTo: 'د/ أحمد بسيوني حسن',
      resolutionNotes: 'جارٍ التواصل مع مشرف الصالة وحكام اللقاء لترحيل موعد المباراة مع الحفاظ على جدول المنافسات.',
    },
  ],
  broadcasts: [
    {
      id: 'bc-1',
      title: 'تنبيه عاجل لكافة الوفود المشاركة بشأن المؤتمر الفني للبادل والتنس',
      content: 'تؤكد اللجنة المنظمة أن حضور مندوب الجامعة المعتمد للمؤتمر الفني والقرعة إلزامي، والتخلف يحرم الجامعة من إدراجها بالجدول طبقاً للائحة صفحة 7.',
      type: 'warning',
      timestamp: 'منذ ساعتين',
      author: 'د/ أحمد بسيوني حسن - مدير الإدارة العامة للنشاط الرياضي',
      active: true,
    },
    {
      id: 'bc-2',
      title: 'تعديل ملعب منافسات خماسي كرة القدم للطالبات',
      content: 'نظراً لإجراء صيانة عاجلة بأرضية الملعب (2)، تقرر نقل مباريات الجولة الثانية لصالة الأنشطة المجاورة بدءاً من الساعة 02:00 ظهراً.',
      type: 'urgent',
      timestamp: 'منذ 45 دقيقة',
      author: 'د/ يسري خلاف - مسؤول النشاط الميداني',
      active: true,
    },
  ],
  branding: {
    universityName: 'جامعة المنيا',
    departmentName: 'الإدارة العامة لرعاية الطلاب - إدارة النشاط الرياضي',
    editionTitle: 'أسبوع شباب الجامعات والمعاهد العليا الرابع عشر',
    sloganText: 'من قلب الصعيد .. نبدع',
    jubileeText: 'شعار اليوبيل الذهبي (1976 - 2026)',
    universityLogoUrl: '',
    tournamentLogoUrl: '',
    ministryLogoUrl: '',
    primaryColorTheme: 'gold',
    customAccentHex: '#f59e0b',
    headerStyle: 'gold_obsidian',
    cardRadius: 'large',
    showSecondaryEmblem: true,
    watermarkEnabled: true,
    lastUpdatedBy: 'المصمم الفني',
    lastUpdatedAt: 'الافتراضي',
  },
};

// System instruction for the Gemini AI Sports Regulation Expert
const REGULATION_SYSTEM_INSTRUCTION = `
أنت المساعد الذكي الرسمي والمستشار القانوني للنشاط الرياضي في "أسبوع شباب الجامعات والمعاهد العليا الرابع عشر - جامعة المنيا 2026" (شعار اليوبيل الذهبي 1976-2026، "من قلب الصعيد .. نبدع").
أنت مدرب وملم بكل تفاصيل اللائحة المعتمدة رسمياً الصادرة عن الإدارة العامة لرعاية الطلاب (إدارة النشاط الرياضي بجامعة المنيا) بقيادة د/ أحمد بسيوني حسن (مدير الإدارة العامة - 01007232345) ود/ يسري خلاف عبد الباقي (مسؤول النشاط الميداني - 01024360930).

القواعد والبيانات الأساسية التي تحتكم إليها بدقة مطلقة:
1. قوام الوفد الإجمالي: الحد الأقصى 61 مشاركاً (35 طلبة، 16 طالبات، 10 جهاز فني وإداري: 1 مدير إدارة + 4 مدربين + 5 مشرفين).
2. الألعاب الست المعتمدة:
   - خماسي كرة القدم (طلبة 8 + طالبات 8 = 16): شوطان (10 دقائق لكل شوط)، نقاط 3/1/0، كسر التعادل (المواجهة المباشرة -> فارق الأهداف -> الأهداف المسجلة -> القرعة). النهائي خروج مغلوب ثم 3 ضربات ترجيح. ترقيم من 1 إلى 8.
   - الكرة الطائرة (طلبة فقط 9 لاعبين، يتضمنهم ليبرو اختياري): 3 أشواط (25، 25، 15)، نقاط 3/1/0، كسر التعادل (أشواط له ÷ أشواط عليه، ثم نقاط له ÷ نقاط عليه، ثم القرعة).
   - كرة السلة (طلبة فقط 8 لاعبين): نقاط 2/1/0، الترقيم 1-99، كسر التعادل بطرح الإصابات والأهداف (له - عليه).
   - تنس الطاولة (2 طلبة + 2 طالبات = 4): فردي وزوجي، 11 نقطة للشوط، إلزامية حضور المؤتمر الفني السابق للبطولة.
   - ألعاب القوى (6 طلبة + 6 طالبات = 12): سباقين وتتابع كحد أقصى للطالب، صعود أفضل 8 أزمنة، مسابقات: 100م، 200م، دفع جلة، رمي رمح، قذف قرص، وثب طويل، تتابع مختلط (2 طالب + 2 طالبة).
   - رياضة البادل (2 طلبة - زوجي): إحماء 5 دقائق إلزامي، نقطة ذهبية Star Point عند التعادل 40/40. الأدوار الأولى مجموعة من 6 أشواط، والنهائية مجموعتين.
3. أهم الشروط والجزاءات:
   - النصاب القانوني لتنظيم أي لعبة: 5 جامعات على الأقل.
   - زمن التأخير القاتل: 15 دقيقة ويعتبر الفريق منسحباً ومهزوماً بصفر نقطة.
   - مهلة تقديم الطعن الرسمي: 60 دقيقة فقط من صافرة النهاية، برسم 1000 جنيه مصري لا يرد إلا في حال قبول الطعن، ويقدم كتابياً لمشرف المباراة من مشرف الفريق المعتمد حصراً.
   - حظر طلاب الدراسات العليا وحظر الازدواج الرياضي (لعبة واحدة فقط للطالب).
   - تشابه ألوان الزي: الفريق المذكور ثانياً بالجدول يلتزم بتغيير زيه.
   - الاعتراض على قرارات الحكام محظور نهائياً.

أسلوب الرد:
- تحدث بلغة عربية فصحى واضحة، مهنية، واثقة، ومباشرة مع ذكر رقم المادة أو الصفحة عند اللزوم.
- إذا كان السؤال يعبر عن نزاع ميداني حاد، غياب حكم، مشكلة تأخير، أو رغبة في تقديم طعن، أجب بالقاعدة الرسمية وانصح المستخدم أو اعرض عليه فوراً "تصعيد المشكلة كتذكرة عاجلة" للجنة المنظمة (د/ أحمد بسيوني أو د/ يسري خلاف).
`;

// Helper for intelligent fallback response if Gemini key is not configured
function generateRuleBasedAnswer(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('طعن') || p.includes('اعتراض') || p.includes('احتجاج') || p.includes('1000')) {
    return `طبقاً للمادة رابعاً (الطعون والاحتجاجات) باللائحة:
- يجب تقديم الطعن كتابةً لمشرف المباراة المعتمد خلال 60 دقيقة (ساعة واحدة) فقط من نهاية اللقاء.
- يُسدد رسم طعن قدره 1000 جنيه مصري بإيصال رسمي، ولا يُرد الرسم إلا في حال قبول الطعن شكلاً وموضوعاً.
- يُشترط أن يقدم الطعن حصراً من مشرف الفريق المعتمد رسمياً لدى اللجنة المنظمة مصحوباً بالأدلة الثبوتية.`;
  }
  if (p.includes('تأخر') || p.includes('15') || p.includes('انسحاب')) {
    return `طبقاً للمادة ثالثاً/3 (الجزاءات):
- يعتبر الفريق الذي يتأخر عن الموعد المحدد لبدء المباراة بربع ساعة (15 دقيقة) منسحباً فوراً.
- يحتسب الفريق المتأخر مهزوماً بنتيجة المباراة القانونية بصفر نقطة. وفي حال تكرار التخلف عن مباراتين في البطولة تُلغى نتائجه ونقاطه بالكامل.`;
  }
  if (p.includes('وفد') || p.includes('عدد') || p.includes('61') || p.includes('قوام')) {
    return `طبقاً لجدول الأعداد وقوام الوفد المعتمد رسمياً (صفحة 8):
- السقف الإجمالي الأقصى للوفد الرياضي: 61 فرداً.
- الطلبة: 35 طالباً كحد أقصى موزعين (8 قدم، 9 طائرة، 8 سلة، 2 طاولة، 6 قوى، 2 بادل).
- الطالبات: 16 طالبة كحد أقصى (8 قدم، 2 طاولة، 6 قوى).
- الجهاز الفني والإداري: 10 أفراد (1 مدير إدارة + 4 مدربين + 5 مشرفين).`;
  }
  if (p.includes('زي') || p.includes('فانلة') || p.includes('ألوان') || p.includes('تشابه')) {
    return `طبقاً للبند 10 من الشروط العامة:
- تلتزم الجامعات بالألوان المخصصة لها وفقاً لكتيب الاتحاد الرياضي للجامعات.
- في حال حدوث تشابه أو تعارض في ألوان الزي الرسمي داخل الملعب، تلتزم الجامعة المذكورة ثانياً في جدول المباريات بتغيير زيها فوراً للزي البديل.`;
  }
  if (p.includes('حكم') || p.includes('غياب') || p.includes('اعتراض')) {
    return `طبقاً للبند ثانياً (التحكيم):
- لا يجوز نهائياً للاعبين أو المدربين أو هيئة الإشراف الاعتراض على القرارات التحكيمية أثناء المباراة.
- في حالة تخلف أو غياب أحد الحكام، يقوم مندوب الجامعة المنظمة بتدبير حكم بديل بعد الاتفاق الرسمي عليه وموافقة مشرفي الفريقين كتابةً وتوقيعهما على محضر رسمي بذلك.`;
  }
  if (p.includes('بادل') || p.includes('star point')) {
    return `شروط مسابقة البادل (صفحة 7):
- تقام بنظام الزوجي طلبة فقط (2 لاعبين).
- فترة إحماء إلزامية 5 دقائق قبل بدء المباراة.
- عند التعادل 40/40 (Deuce) تطبق قاعدة النقطة الذهبية (Star Point) للحسم المباشر دون ميزة.
- الأدوار الأولى من مجموعة واحدة (6 أشواط)، والأدوار النهائية من مجموعتين.`;
  }
  return `مرحباً بك في المستشار الذكي للائحة أسبوع شباب الجامعات الـ 14 بجامعة المنيا.
تتضمن اللائحة المعتمدة ضوابط الألعاب الست: خماسي القدم، الطائرة، السلة، ألعاب القوى، تنس الطاولة، والبادل، مع تحديد سقف الوفد بـ 61 مشاركاً، ومهلة الطعن 60 دقيقة برسم 1000 ج.م، وقاعدة تأخير 15 دقيقة. يمكنك سؤالي عن أي مادة أو استفسار وسأجيبك فوراً بنص اللائحة.`;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chatbot Endpoint (Gemini API with fallback)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        // Construct contents
        const prompt = `${REGULATION_SYSTEM_INSTRUCTION}\n\nسؤال المستخدم:\n${message}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const replyText = response.text || generateRuleBasedAnswer(message);
        res.json({ reply: replyText, source: 'gemini' });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to rule engine:', geminiError?.message);
        const fallbackReply = generateRuleBasedAnswer(message);
        res.json({ reply: fallbackReply, source: 'fallback_engine' });
        return;
      }
    } else {
      // Fallback
      const fallbackReply = generateRuleBasedAnswer(message);
      res.json({ reply: fallbackReply, source: 'local_engine' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Escalate Ticket Endpoint
app.post('/api/escalate-ticket', (req, res) => {
  try {
    const { university, requesterName, requesterPhone, sport, subject, description, priority, targetOfficial } = req.body;
    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    const official = targetOfficial === 'khalaf'
      ? { name: 'د/ يسري خلاف عبد الباقي', phone: '01024360930', wa: '201024360930' }
      : { name: 'د/ أحمد بسيوني حسن', phone: '01007232345', wa: '201007232345' };

    const newTicket = {
      id: `t-${Date.now()}`,
      ticketNumber: ticketId,
      university: university || 'وفد غير محدد',
      requesterName: requesterName || 'مشرف معتمد',
      requesterPhone: requesterPhone || 'غير مسجل',
      sport: sport || 'عام',
      subject: subject || 'بلاغ ميداني عاجل',
      description: description || 'تفاصيل الواقعة الميدانية',
      priority: (priority as 'urgent' | 'high' | 'normal') || 'urgent',
      status: 'under_review' as const,
      createdAt: 'الآن',
      assignedTo: official.name,
      resolutionNotes: 'تم تصعيد التذكرة تلقائياً من المنصة الذكية وجارٍ اتخاذ الإجراء.',
    };

    systemData.tickets.unshift(newTicket);

    const waText = encodeURIComponent(
      `*بلاغ عاجل - أسبوع شباب الجامعات الـ 14 (جامعة المنيا)*\n` +
      `رقم التذكرة: ${ticketId}\n` +
      `الجامعة: ${newTicket.university}\n` +
      `المقدم: ${newTicket.requesterName} (${newTicket.requesterPhone})\n` +
      `المسابقة: ${newTicket.sport}\n` +
      `الموضوع: ${newTicket.subject}\n` +
      `التفاصيل: ${newTicket.description}\n` +
      `يرجى التوجيه والتدخل العاجل.`
    );

    const whatsappUrl = `https://wa.me/${official.wa}?text=${waText}`;

    res.json({
      success: true,
      ticket: newTicket,
      whatsappUrl,
      assignedOfficial: official,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// System State Endpoints
app.get('/api/system-state', (req, res) => {
  res.json(systemData);
});

// Matches update & delete
app.post('/api/matches', (req, res) => {
  const match = req.body;
  if (!match.id) {
    match.id = `m-${Date.now()}`;
    systemData.matches.unshift(match);
  } else {
    const idx = systemData.matches.findIndex((m) => m.id === match.id);
    if (idx >= 0) {
      systemData.matches[idx] = { ...systemData.matches[idx], ...match };
    } else {
      systemData.matches.unshift(match);
    }
  }
  res.json({ success: true, matches: systemData.matches });
});

app.delete('/api/matches/:id', (req, res) => {
  const { id } = req.params;
  systemData.matches = systemData.matches.filter((m) => m.id !== id);
  res.json({ success: true, matches: systemData.matches });
});

// Protests submit/update
app.post('/api/protests', (req, res) => {
  const protest = req.body;
  if (!protest.id) {
    protest.id = `pr-${Date.now()}`;
    protest.protestNumber = `PROTEST-2026-${String(systemData.protests.length + 1).padStart(3, '0')}`;
    protest.submittedAt = 'الآن (ضمن المهلة)';
    systemData.protests.unshift(protest);
  } else {
    const idx = systemData.protests.findIndex((p) => p.id === protest.id);
    if (idx >= 0) {
      systemData.protests[idx] = { ...systemData.protests[idx], ...protest };
    }
  }
  res.json({ success: true, protests: systemData.protests });
});

// Tickets update
app.post('/api/tickets', (req, res) => {
  const ticket = req.body;
  const idx = systemData.tickets.findIndex((t) => t.id === ticket.id);
  if (idx >= 0) {
    systemData.tickets[idx] = { ...systemData.tickets[idx], ...ticket };
    res.json({ success: true, tickets: systemData.tickets });
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

// Broadcasts send
app.post('/api/broadcasts', (req, res) => {
  const alert = req.body;
  const newAlert = {
    id: `bc-${Date.now()}`,
    title: alert.title,
    content: alert.content,
    type: alert.type || 'info',
    timestamp: 'الآن',
    author: alert.author || 'إدارة النشاط الرياضي - جامعة المنيا',
    active: true,
  };
  systemData.broadcasts.unshift(newAlert);
  res.json({ success: true, broadcasts: systemData.broadcasts });
});

// Branding & Theme Configuration Endpoints
app.get('/api/branding', (req, res) => {
  res.json({ success: true, branding: systemData.branding, ...systemData.branding });
});

app.post('/api/branding', (req, res) => {
  try {
    const payload = req.body.branding || req.body;
    const updated = {
      ...systemData.branding,
      ...payload,
      lastUpdatedAt: new Date().toLocaleTimeString('ar-EG'),
    };
    systemData.branding = updated;
    res.json({ success: true, branding: systemData.branding, ...systemData.branding });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Direct portal routes
app.get('/portal', (req, res) => {
  res.redirect('/standalone_minia_portal.html');
});
app.get('/minia-portal', (req, res) => {
  res.redirect('/minia_portal.html');
});

// -------------------------------------------------------------
// Vite Server Integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
