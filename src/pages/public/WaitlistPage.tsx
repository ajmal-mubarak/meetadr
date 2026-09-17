import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, ArrowRight, Mail, User } from 'lucide-react';
import { waitlistService } from '../../services/waitlistService';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n';

export const WaitlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast(t('forms.invalidEmail'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await waitlistService.joinWaitlist(email, name);
      setIsSuccess(true);
      showToast(t('waitlist.priorityList'), 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to join waitlist.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#081217] min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="max-w-xl w-full bg-[#0C1A22] rounded-3xl border border-slate-800 p-8 sm:p-12 text-center relative z-10">
        
        {/* Launching Soon Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#081217] border border-slate-800 text-xs font-semibold text-slate-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span>{t('waitlist.badge')}</span>
        </div>

        {/* Stethoscope Icon in badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#081217] border border-slate-800 text-slate-200 flex items-center justify-center mx-auto mb-6">
          <Stethoscope className="w-8 h-8" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-3">
          {t('waitlist.title')}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
          {t('waitlist.subtitle')}
        </p>

        {isSuccess ? (
          <div className="bg-[#081217] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">{t('waitlist.priorityList')}</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              {t('waitlist.priorityDesc', { email })}
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
                setName('');
              }}
              className="mt-2 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              {t('waitlist.addAnother')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left rtl:text-right">
            <div className="bg-[#081217] rounded-xl border border-slate-800 px-4 py-3 flex items-center focus-within:border-slate-500 transition-colors">
              <User className="w-4 h-4 text-slate-400 mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
              <input
                type="text"
                placeholder={t('waitlist.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="bg-[#081217] rounded-xl border border-slate-800 px-4 py-3 flex items-center focus-within:border-slate-500 transition-colors">
              <Mail className="w-4 h-4 text-slate-400 mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
              <input
                type="email"
                required
                placeholder={t('waitlist.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#007B8A] hover:bg-[#00606B] text-white text-xs font-bold rounded-xl transition-all border border-[#005F6B] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? t('waitlist.securingSpot') : t('waitlist.joinBtn')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <p className="text-center text-xs text-slate-500 pt-3">
              {t('waitlist.joinedCount')}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
