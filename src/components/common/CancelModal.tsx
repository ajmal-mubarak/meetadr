import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancelModalProps {
  isOpen: boolean;
  appointmentId: string;
  doctorName: string;
  date: string;
  time: string;
  onClose: () => void;
  onConfirm: (reason: string, note?: string) => Promise<void>;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  appointmentId,
  doctorName,
  date,
  time,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState<string>('Unforeseen Event');
  const [otherNote, setOtherNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason === 'Others' && !otherNote.trim()) {
      setError('Please provide a brief reason for cancellation.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onConfirm(reason, reason === 'Others' ? otherNote : undefined);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div
        id="cancel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="p-2 bg-rose-50 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id="cancel-modal-title" className="font-semibold text-slate-900 text-lg">
              Cancel Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 text-sm text-slate-600">
          <p className="mb-3">
            Are you sure you want to cancel your appointment with{' '}
            <strong className="text-slate-900 font-semibold">{doctorName}</strong> on{' '}
            <strong className="text-slate-900 font-semibold">{date}</strong> at{' '}
            <strong className="text-slate-900 font-semibold">{time}</strong>?
          </p>
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            Booking ID: <code className="font-mono text-slate-700">{appointmentId}</code>. If this
            was done in error, you will need to re-book a fresh time slot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Reason for Cancellation <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2">
              {['Unforeseen Event', 'Wrongly Scheduled', 'Others'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                    reason === option
                      ? 'border-blue-600 bg-blue-50/50 text-blue-950'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancel_reason"
                    value={option}
                    checked={reason === option}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {reason === 'Others' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Please specify <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={otherNote}
                onChange={(e) => setOtherNote(e.target.value)}
                placeholder="Explain the reason for cancellation..."
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
              />
            </div>
          )}

          {error && <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
