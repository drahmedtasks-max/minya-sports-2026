import React, { useState } from 'react';
import { AlertCircle, X, Send, ShieldAlert, Phone, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface EmergencyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSubmitReport: (report: any) => void;
}

export const EmergencyReportModal: React.FC<EmergencyReportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitReport,
}) => {
  const [incidentType, setIncidentType] = useState('kit_clash');
  const [court, setCourt] = useState('الصالة المغطاة الرئيسية');
  const [sport, setSport] = useState('خماسي كرة القدم');
  const [details, setDetails] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      incidentType,
      court,
      sport,
      details,
      reporter: currentUser.name,
      university: currentUser.university,
      timestamp: 'الآن',
    });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 text-slate-800">
        <div className="bg-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-300" />
            <div>
              <h4 className="font-bold text-sm sm:text-base">
                بلاغ طوارئ ميداني عاجل (غرفة العمليات الرياضية)
              </h4>
              <p className="text-xs text-red-200">إشعار فوري لمسؤولي جامعة المنيا لاتخاذ إجراء فوري</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-red-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h5 className="font-bold text-base text-slate-900">تم إرسال البلاغ بنجاح!</h5>
            <p className="text-xs text-slate-600">
              تم إشعار مسؤولي النشاط الرياضي الميداني (د/ يسري خلاف ود/ أحمد بسيوني) وجارٍ التدخل
              الميداني الفوري.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">نوع البلاغ الميداني:</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-red-500 font-medium"
              >
                <option value="kit_clash">تعارض ألوان الزي الرسمي بين الفريقين</option>
                <option value="referee_absence">تأخر أو غياب أحد الحكام المعتمدين</option>
                <option value="bus_delay">تعطل أو تأخر حافلة نقل الفريق للصالات</option>
                <option value="medical_aid">طلب تدخل طبي / إسعاف عاجل في أرض الملعب</option>
                <option value="pitch_issue">مشكلة فنية في أرضية الملعب أو الشباك</option>
                <option value="other">حالة طارئة أخرى</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">المسابقة:</label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800"
                >
                  <option value="خماسي كرة القدم">خماسي كرة القدم</option>
                  <option value="الكرة الطائرة">الكرة الطائرة</option>
                  <option value="كرة السلة">كرة السلة</option>
                  <option value="ألعاب القوى">ألعاب القوى</option>
                  <option value="تنس الطاولة">تنس الطاولة</option>
                  <option value="رياضة البادل">رياضة البادل</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">الملعب / الموقع:</label>
                <input
                  type="text"
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">وصف الموقف الميداني:</label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="اكتب باختصار أسماء الفرق والوضع الحالي للملعب..."
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-[11px] text-red-900">
              📞 <strong>للحالات الحرجة جداً:</strong> يمكنك الاتصال المباشر بغرفة العمليات:
              <span className="font-mono font-bold mr-1">01007232345</span> أو{' '}
              <span className="font-mono font-bold">01024360930</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition"
              >
                <Send className="w-4 h-4 rotate-180" />
                <span>إرسال البلاغ فوراً</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
