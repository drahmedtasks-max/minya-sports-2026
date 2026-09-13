import React from 'react';
import { UserRole, UserProfile } from '../types';
import { USER_ROLES_CATALOG } from '../data/sportsData';
import { ShieldCheck, UserCheck, X, Crown, Building2, Wrench, Eye, CheckCircle2 } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'top_management':
        return <Crown className="w-5 h-5 text-amber-500" />;
      case 'minia_leadership':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'university_supervisor':
        return <Building2 className="w-5 h-5 text-purple-600" />;
      case 'system_admin':
        return <Wrench className="w-5 h-5 text-slate-800" />;
      case 'public_guest':
      default:
        return <Eye className="w-5 h-5 text-slate-500" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'top_management':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'minia_leadership':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'university_supervisor':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'system_admin':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'public_guest':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">تبديل الحساب والصلاحيات</h3>
              <p className="text-xs text-slate-300">
                اختر صفة الدخول لتجربة المنصة ولوحات التحكم المخصصة لكل مستوى
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-5 overflow-y-auto space-y-3">
          <p className="text-xs text-slate-500 font-medium mb-1">
            صلاحيات متعددة المستويات متوافقة مع الهيكل الإداري لأسبوع شباب الجامعات الـ 14:
          </p>

          <div className="grid gap-2.5">
            {USER_ROLES_CATALOG.map((profile) => {
              const isSelected = currentUser.id === profile.id;
              return (
                <div
                  key={profile.id}
                  onClick={() => {
                    onSelectUser(profile);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                      : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white ${profile.avatarBg}`}
                    >
                      {getRoleIcon(profile.role)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{profile.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadge(
                            profile.role
                          )}`}
                        >
                          {profile.roleTitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{profile.university}</p>
                      {profile.phone && (
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          هاتف: {profile.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="flex items-center gap-1 text-emerald-600 shrink-0 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>الحالي</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium shrink-0 pt-1">
                      اختيار
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>يمكنك التبديل بين الحسابات في أي وقت من أعلى الشاشة الرئيسية</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
