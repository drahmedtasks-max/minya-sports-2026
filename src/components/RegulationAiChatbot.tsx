import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, Minimize2, Maximize2, AlertTriangle, ArrowUpRight, Phone, MessageSquare, Check, RefreshCw, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  source?: string;
  canEscalate?: boolean;
}

interface RegulationAiChatbotProps {
  currentUser: UserProfile;
  onTicketCreated?: () => void;
}

export const RegulationAiChatbot: React.FC<RegulationAiChatbotProps> = ({
  currentUser,
  onTicketCreated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateSubject, setEscalateSubject] = useState('');
  const [escalateDetails, setEscalateDetails] = useState('');
  const [escalateSport, setEscalateSport] = useState('عام');
  const [escalateOfficial, setEscalateOfficial] = useState<'basiouny' | 'khalaf'>('basiouny');
  const [escalateResult, setEscalateResult] = useState<{
    ticketNumber: string;
    whatsappUrl: string;
    assignedName: string;
  } | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `مرحباً بك! أنا المستشار الذكي للائحة النشاط الرياضي بأسبوع شباب الجامعات الـ 14 - جامعة المنيا 🏛️\n\nأنا مدرب على اللائحة التنظيمية المعتمدة بجميع بنودها (خماسي القدم، الطائرة، السلة، ألعاب القوى، تنس الطاولة، البادل، الشروط الـ 16 العامة، مهلة الطعون، ونظام الجزاءات).\n\nكيف يمكنني مساعدتك اليوم؟`,
      time: 'الآن',
      canEscalate: false,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'ما هي مهلة ورسوم تقديم الطعن الرسمي؟',
    'ما هي عقوبة التأخر 15 دقيقة عن المباراة؟',
    'كيف يتم فض التعادل في خماسي كرة القدم؟',
    'ما هو الحد الأقصى لقوام وفد الجامعة وتوزيعه؟',
    'ما هي الإجراءات عند تعارض ألوان الزي الميداني؟',
    'ما هي شروط مسابقة البادل ونظام النقطة الذهبية؟',
  ];

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'عذراً، لم أتمكن من معالجة الطلب حالياً.',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        canEscalate: true,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      const fallbackReply: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `طبقاً للائحة المنظمة لأسبوع شباب الجامعات الـ 14:\n- مهلة الطعن: 60 دقيقة برسم 1000 ج.م.\n- عقوبة التأخر: 15 دقيقة تعني الانسحاب الفوري.\n- نصاب أي مسابقة: 5 جامعات على الأقل.\n\nإذا واجهت مشكلة ميدانية طارئة، يمكنك النقر على زر "تصعيد المشكلة للجنة المنظمة" أدناه للتواصل الفوري عبر الواتساب مع مسؤولي جامعة المنيا.`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        canEscalate: true,
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const openEscalationModal = (contextText?: string) => {
    setEscalateSubject(contextText ? `استفسار وبلاغ: ${contextText.slice(0, 40)}...` : 'بلاغ ميداني عاجل');
    setEscalateDetails(contextText || '');
    setEscalateResult(null);
    setShowEscalateModal(true);
  };

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/escalate-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          university: currentUser.university,
          requesterName: currentUser.name,
          requesterPhone: currentUser.phone || '010XXXXXXXX',
          sport: escalateSport,
          subject: escalateSubject,
          description: escalateDetails,
          priority: 'urgent',
          targetOfficial: escalateOfficial,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEscalateResult({
          ticketNumber: data.ticket.ticketNumber,
          whatsappUrl: data.whatsappUrl,
          assignedName: data.assignedOfficial.name,
        });

        // Add confirmation message to chat
        const confirmMsg: Message = {
          id: `esc-${Date.now()}`,
          sender: 'bot',
          text: `🚨 تم تصعيد طلبك بنجاح وإنشاء تذكرة رسمية برقم (${data.ticket.ticketNumber})، وإحالتها إلى: ${data.assignedOfficial.name}.\n\nيمكنك الآن الضغط على زر الواتساب لإرسال الإشعار الميداني المعتمد مباشرة.`,
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          canEscalate: false,
        };
        setMessages((prev) => [...prev, confirmMsg]);

        if (onTicketCreated) {
          onTicketCreated();
        }
      }
    } catch (error) {
      alert('تعذر تصعيد التذكرة حالياً، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-white/60 transition-all hover:scale-105 active:scale-95 group"
          title="المستشار الذكي للائحة الرياضية"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white animate-pulse"></span>
          </div>
          <span className="text-xs sm:text-sm font-black">اسأل المساعد الذكي للائحة</span>
          <span className="bg-slate-950/15 text-[10px] px-2 py-0.5 rounded-full font-bold">
            Gemini AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed left-4 sm:left-6 z-40 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized
              ? 'bottom-6 w-72 h-14'
              : 'bottom-4 sm:bottom-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm">مستشار اللائحة الذكي</h4>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/40">
                    مباشر
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">أسبوع شباب الجامعات الـ 14 - جامعة المنيا</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                title={isMinimized ? 'تكبير' : 'تصغير'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Actions Bar */}
              <div className="bg-amber-50/70 p-2 border-b border-amber-200/60 flex items-center justify-between text-[11px] px-3">
                <span className="text-amber-900 font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>دعم مباشر للنزاعات الميدانية</span>
                </span>
                <button
                  onClick={() => openEscalationModal()}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-2 py-0.8 rounded-lg text-[10px] flex items-center gap-1 transition"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>تصعيد تذكرة عاجلة</span>
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-bl-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-br-xs shadow-xs'
                      }`}
                    >
                      {msg.text}

                      {/* Escalation Button inside bot response if dispute or complex */}
                      {msg.sender === 'bot' && msg.canEscalate && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => openEscalationModal(msg.text)}
                            className="text-[10px] font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                          >
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            <span>تصعيد للجنة المنظمة (واتساب)</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span>جارٍ البحث في نصوص اللائحة بواسطة Gemini AI...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 rounded-xl px-2.5 py-1 font-medium transition shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اطرح سؤالك حول اللائحة أو أعداد الوفد..."
                  className="flex-1 bg-slate-100 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 p-2.5 rounded-xl transition shrink-0"
                  title="إرسال"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Escalation to Urgent Ticket Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-red-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    تصعيد بلاغ رسمي للجنة المنظمة (جامعة المنيا)
                  </h4>
                  <p className="text-xs text-red-200">
                    إنشاء تذكرة إلكترونية عاجلة وإحالتها فوراً إلى مسؤولي النشاط الرياضي
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEscalateModal(false)}
                className="p-1 text-red-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {escalateResult ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-base">تم إنشاء التذكرة بنجاح!</h5>
                  <p className="text-xs text-slate-600 mt-1">
                    رقم التذكرة:{' '}
                    <span className="font-mono font-bold text-red-600 text-sm">
                      {escalateResult.ticketNumber}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    المسؤول المتابع: {escalateResult.assignedName}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
                  اضغط على الزر أدناه لفتح تطبيق الواتساب فوراً وإرسال الرسالة المجهزة مسبقاً إلى
                  المسؤول المباشر:
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={escalateResult.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>إرسال عبر الواتساب فوراً للمسؤول</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setShowEscalateModal(false)}
                    className="w-full py-2.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                  >
                    إغلاق والعودة للدليل
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEscalateSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الجهة الموجه إليها:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEscalateOfficial('basiouny')}
                      className={`p-2.5 rounded-xl border text-right transition ${
                        escalateOfficial === 'basiouny'
                          ? 'border-red-500 bg-red-50/50 font-bold text-red-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <p className="font-bold text-xs">د/ أحمد بسيوني حسن</p>
                      <p className="text-[10px] text-slate-500">مدير الإدارة العامة</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEscalateOfficial('khalaf')}
                      className={`p-2.5 rounded-xl border text-right transition ${
                        escalateOfficial === 'khalaf'
                          ? 'border-red-500 bg-red-50/50 font-bold text-red-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <p className="font-bold text-xs">د/ يسري خلاف عبد الباقي</p>
                      <p className="text-[10px] text-slate-500">مسؤول النشاط الميداني</p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">الجامعة مقدمة البلاغ:</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.university}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-slate-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">المسابقة الرياضية:</label>
                    <select
                      value={escalateSport}
                      onChange={(e) => setEscalateSport(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800"
                    >
                      <option value="عام">مسائل إدارية عامة</option>
                      <option value="خماسي كرة القدم">خماسي كرة القدم</option>
                      <option value="الكرة الطائرة">الكرة الطائرة</option>
                      <option value="كرة السلة">كرة السلة</option>
                      <option value="ألعاب القوى">ألعاب القوى</option>
                      <option value="تنس الطاولة">تنس الطاولة</option>
                      <option value="رياضة البادل">رياضة البادل</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">عنوان البلاغ أو الطعن:</label>
                  <input
                    type="text"
                    required
                    value={escalateSubject}
                    onChange={(e) => setEscalateSubject(e.target.value)}
                    placeholder="مثال: تعارض ألوان الزي / تأخر حكم اللقاء / اعتراض فني"
                    className="w-full border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">تفاصيل الواقعة الميدانية:</label>
                  <textarea
                    rows={3}
                    required
                    value={escalateDetails}
                    onChange={(e) => setEscalateDetails(e.target.value)}
                    placeholder="اشرح الواقعة بدقة مع ذكر أسماء الفرق ورقم الملعب والتوقيت..."
                    className="w-full border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowEscalateModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 rotate-180" />
                    )}
                    <span>إنشاء التذكرة وتصعيد البلاغ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
