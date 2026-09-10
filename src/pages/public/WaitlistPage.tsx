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
    <div className="bg-[#F6F5EE] min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E5DFCD] p-8 sm:p-12 shadow-xs text-center">
        
        {/* Launching Soon Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFF3EC] border border-[#BAC7AD] text-xs font-bold text-[#6C7A5B] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#8D9B7B] animate-pulse"></span>
          <span>{t('waitlist.badge')}</span>
        </div>

        {/* Stethoscope Icon in badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#EFF3EC] border border-[#BAC7AD] text-[#8D9B7B] flex items-center justify-center mx-auto mb-6 shadow-xs">
          <Stethoscope className="w-8 h-8" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#000000] leading-tight mb-3">
          {t('waitlist.title')}
        </h1>

        <p className="text-xs sm:text-sm text-[#525252] max-w-md mx-auto leading-relaxed mb-8">
          {t('waitlist.subtitle')}
        </p>

        {isSuccess ? (
          <div className="bg-[#EFF3EC] border border-[#BAC7AD] rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-[#8D9B7B] text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#000000]">{t('waitlist.priorityList')}</h3>
            <p className="text-xs text-[#525252] leading-relaxed max-w-sm mx-auto">
              {t('waitlist.priorityDesc', { email })}
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
                setName('');
              }}
              className="mt-2 text-xs font-bold text-[#8D9B7B] hover:underline cursor-pointer"
            >
              {t('waitlist.addAnother')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left rtl:text-right">
            <div className="bg-[#F6F5EE] rounded-xl border border-[#E5DFCD] px-4 py-3 flex items-center">
              <User className="w-4 h-4 text-[#737373] mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
              <input
                type="text"
                placeholder={t('waitlist.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-xs text-[#000000] placeholder-[#737373] focus:outline-hidden"
              />
            </div>

            <div className="bg-[#F6F5EE] rounded-xl border border-[#E5DFCD] px-4 py-3 flex items-center">
              <Mail className="w-4 h-4 text-[#737373] mr-2 rtl:mr-0 rtl:ml-2 shrink-0" />
              <input
                type="email"
                required
                placeholder={t('waitlist.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs text-[#000000] placeholder-[#737373] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#8D9B7B] hover:bg-[#748263] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? t('waitlist.securingSpot') : t('waitlist.joinBtn')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <p className="text-center text-xs text-[#737373] pt-3">
              {t('waitlist.joinedCount')}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
