import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User as UserIcon,
  Stethoscope,
  Hospital,
  Shield,
  Zap,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  forcedRole?: UserRole;
}

const ROLES: {
  role: UserRole;
  label: string;
  icon: React.FC<{ className?: string }>;
  demoEmail: string;
  demoPassword: string;
  dashboard: string;
  ring: string;
  activeBg: string;
  activeText: string;
}[] = [
  {
    role: 'patient',
    label: 'Patient',
    icon: UserIcon,
    demoEmail: 'patient@meetadr.demo',
    demoPassword: 'Patient@123',
    dashboard: '/patient/dashboard',
    ring: 'ring-teal-500',
    activeBg: 'bg-teal-600',
    activeText: 'text-teal-600',
  },
  {
    role: 'doctor',
    label: 'Doctor',
    icon: Stethoscope,
    demoEmail: 'doctor@meetadr.demo',
    demoPassword: 'Doctor@123',
    dashboard: '/doctor/dashboard',
    ring: 'ring-sky-500',
    activeBg: 'bg-sky-600',
    activeText: 'text-sky-600',
  },
  {
    role: 'hospital',
    label: 'Hospital',
    icon: Hospital,
    demoEmail: 'hospital@meetadr.demo',
    demoPassword: 'Hospital@123',
    dashboard: '/hospital/dashboard',
    ring: 'ring-indigo-500',
    activeBg: 'bg-indigo-600',
    activeText: 'text-indigo-600',
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    demoEmail: 'admin@meetadr.demo',
    demoPassword: 'Admin@123',
    dashboard: '/admin/dashboard',
    ring: 'ring-slate-500',
    activeBg: 'bg-slate-700',
    activeText: 'text-slate-700',
  },
];

const QUICK_DEMOS: { role: UserRole; label: string; cls: string }[] = [
  { role: 'patient',  label: 'Patient',  cls: 'bg-teal-600 hover:bg-teal-700 text-white' },
  { role: 'hospital', label: 'Hospital', cls: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
  { role: 'admin',    label: 'Admin',    cls: 'bg-slate-800 hover:bg-slate-700 text-white' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ forcedRole }) => {
  const { login, quickLoginAs } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeRole, setActiveRole] = useState<UserRole>(forcedRole || 'patient');
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<UserRole | null>(null);

  const role = ROLES.find((r) => r.role === activeRole)!;

  const redirectAfterLogin = (r: UserRole) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/login') { navigate(from, { replace: true }); return; }
    const found = ROLES.find((x) => x.role === r)!;
    navigate(found.dashboard);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim() || !password.trim()) {
      showToast('Please fill in all fields.', 'error'); return;
    }
    setIsLoading(true);
    try {
      const user = await login(loginInput.trim(), password);
      showToast(`Welcome, ${user.name}!`, 'success');
      redirectAfterLogin(user.role);
    } catch (err: any) {
      showToast(err.message || 'Invalid credentials.', 'error');
    } finally { setIsLoading(false); }
  };

  const handleQuickLogin = async (r: UserRole) => {
    setQuickLoading(r);
    try {
      await quickLoginAs(r);
      const found = ROLES.find((x) => x.role === r)!;
      showToast(`Signed in as ${found.label}`, 'success');
      navigate(found.dashboard);
    } catch (err: any) {
      showToast(err.message || 'Quick login failed.', 'error');
    } finally { setQuickLoading(null); }
  };

  const autofill = () => {
    setLoginInput(role.demoEmail);
    setPassword(role.demoPassword);
    setShowPassword(true);
  };

  return (
    /* Full-page background */
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: 'radial-gradient(ellipse at 60% 0%, #ccfbf180 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, #e0f2fe60 0%, transparent 50%), #f8fafc',
      }}
    >
      {/* Subtle decorative blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[400px]"
      >
        {/* ── LOGO ── */}
        <div className="flex flex-col items-center mb-7">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-600/30 group-hover:shadow-teal-600/50 transition-shadow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              meet<span className="text-teal-600">Adr</span>
            </span>
          </Link>
          <p className="text-sm text-slate-500 mt-2.5 font-medium text-center">
            Sign in to manage your appointments
          </p>
        </div>

        {/* ── CARD ── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">

          {/* Role strip */}
          {!forcedRole && (
            <div className="grid grid-cols-4 border-b border-slate-100">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = activeRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setActiveRole(r.role)}
                    className={`flex flex-col items-center gap-1 py-3.5 text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer border-b-2 ${
                      active
                        ? `border-teal-500 text-teal-600 bg-teal-50/60`
                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                    {r.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="px-6 py-6 space-y-5">

            {/* ── Demo quick access ── */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-md bg-amber-400 flex items-center justify-center shrink-0">
                  <Zap className="w-3 h-3 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-slate-600 tracking-wide">
                  Instant Demo Access
                </span>
              </div>
              <div className="flex gap-2">
                {QUICK_DEMOS.map((dq) => (
                  <button
                    key={dq.role}
                    type="button"
                    onClick={() => handleQuickLogin(dq.role)}
                    disabled={quickLoading !== null}
                    className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm ${dq.cls}`}
                  >
                    {quickLoading === dq.role
                      ? <div className="w-3 h-3 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                      : dq.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Email / Mobile */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">
                  Email or Mobile
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {loginInput.includes('@')
                      ? <Mail className="w-4 h-4" />
                      : <Phone className="w-4 h-4" />}
                  </span>
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder={role.demoEmail}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 block">Password</label>
                  <button
                    type="button"
                    onClick={autofill}
                    className="flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-700 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Auto-fill demo
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition-all cursor-pointer group mt-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign in as {role.label}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[11px] text-slate-400 font-semibold">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={() => showToast('Google sign-in coming soon!', 'info')}
              className="w-full py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Security */}
            <div className="flex items-center justify-center gap-1.5 pb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="text-[10px] text-slate-400 font-medium">End-to-End Encrypted</span>
            </div>

          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
