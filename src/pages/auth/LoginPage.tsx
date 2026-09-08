import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Stethoscope,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Building2,
  Shield,
  ArrowRight,
  Zap,
  CheckCircle2,
  Hospital,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  forcedRole?: UserRole;
}

// ─── Demo user cards ─────────────────────────────────────────────────────────
const DEMO_USERS: {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  title: string;
  description: string;
  accent: string;
  badge: string;
  icon: React.FC<{ className?: string }>;
  dashboard: string;
}[] = [
  {
    role: 'patient',
    name: 'Sarah Jenkins',
    email: 'patient@meetadr.demo',
    password: 'Patient@123',
    title: 'Patient',
    description: 'Book doctors, view appointments, manage prescriptions',
    accent: 'from-teal-500 to-teal-600',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: UserIcon,
    dashboard: '/patient/dashboard',
  },
  {
    role: 'doctor',
    name: 'Dr. Sarah Chen',
    email: 'doctor@meetadr.demo',
    password: 'Doctor@123',
    title: 'Doctor / Physician',
    description: 'Manage queue, patient records and schedules',
    accent: 'from-sky-500 to-sky-600',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Stethoscope,
    dashboard: '/doctor/dashboard',
  },
  {
    role: 'hospital',
    name: 'CMC Hospital Admin',
    email: 'hospital@meetadr.demo',
    password: 'Hospital@123',
    title: 'Hospital / Clinic Owner',
    description: 'Manage departments, doctors, bookings and reports',
    accent: 'from-indigo-500 to-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Hospital,
    dashboard: '/hospital/dashboard',
  },
  {
    role: 'admin',
    name: 'MeetAdr Admin',
    email: 'admin@meetadr.demo',
    password: 'Admin@123',
    title: 'Platform Admin',
    description: 'Full platform control — users, providers, analytics',
    accent: 'from-slate-700 to-slate-800',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: Shield,
    dashboard: '/admin/dashboard',
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({ forcedRole }) => {
  const { login, register, quickLoginAs } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<UserRole>(forcedRole || 'patient');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('patient@meetadr.demo');
  const [password, setPassword] = useState<string>('Patient@123');
  const [fullName, setFullName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quickLoading, setQuickLoading] = useState<UserRole | null>(null);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  const handleSelectRoleTab = (role: UserRole) => {
    setActiveTab(role);
    setIsRegisterMode(false);
    const demo = DEMO_USERS.find((u) => u.role === role)!;
    setEmail(demo.email);
    setPassword(demo.password);
  };

  const redirectAfterLogin = (role: UserRole) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/login') { navigate(from, { replace: true }); return; }
    if (role === 'patient') navigate('/patient/dashboard');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'hospital') navigate('/hospital/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegisterMode) {
        if (!fullName.trim() || !mobile.trim()) {
          showToast('Please enter your full name and mobile number.', 'error');
          return;
        }
        const newUser = await register(fullName, email, password, mobile, activeTab);
        showToast(`Account created! Welcome, ${newUser.name}.`, 'success');
        redirectAfterLogin(newUser.role);
      } else {
        const loggedUser = await login(email, password);
        showToast(`Signed in as ${loggedUser.name}.`, 'success');
        redirectAfterLogin(loggedUser.role);
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed. Check credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // One-click demo login
  const handleQuickEnter = async (role: UserRole) => {
    setQuickLoading(role);
    try {
      await quickLoginAs(role);
      const demo = DEMO_USERS.find((u) => u.role === role)!;
      showToast(`Entered as ${demo.name} (${demo.title})`, 'success');
      navigate(demo.dashboard);
    } catch (err: any) {
      showToast(err.message || 'Quick login failed.', 'error');
    } finally {
      setQuickLoading(null);
    }
  };

  const activeDemo = DEMO_USERS.find((u) => u.role === activeTab)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex items-start justify-center">
      <div className="w-full max-w-4xl">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-600/25">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-900">
              meet<span className="text-teal-600">Adr</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Demo Portal Access</h1>
          <p className="text-sm text-slate-500 mt-1">
            One-click access to all dashboards — replace with real auth when backend is ready
          </p>
        </div>

        {/* ─── DEMO QUICK ACCESS CARDS ─────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-slate-700">Quick Access — Click any card to enter dashboard</span>
            <span className="ml-auto text-xs text-slate-400 font-medium">Demo mode</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DEMO_USERS.map((demoUser) => {
              const Icon = demoUser.icon;
              const isActive = quickLoading === demoUser.role;
              return (
                <button
                  key={demoUser.role}
                  type="button"
                  onClick={() => handleQuickEnter(demoUser.role)}
                  disabled={quickLoading !== null}
                  className="group relative text-left bg-white border border-slate-200 rounded-2xl p-4 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                >
                  {/* Gradient bar at top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${demoUser.accent} rounded-t-2xl`} />

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${demoUser.accent} flex items-center justify-center text-white mb-3 shadow-sm`}>
                    {isActive ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Role badge */}
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${demoUser.badge}`}>
                    {demoUser.title}
                  </span>

                  {/* Name */}
                  <p className="text-xs font-bold text-slate-900 mb-1">{demoUser.name}</p>
                  <p className="text-[11px] text-slate-500 leading-snug">{demoUser.description}</p>

                  {/* Enter arrow */}
                  <div className="flex items-center gap-1 mt-3 text-[11px] font-bold text-teal-600 group-hover:gap-2 transition-all">
                    <span>{isActive ? 'Entering...' : 'Enter Dashboard'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── OR DIVIDER ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or sign in manually</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ─── STANDARD LOGIN FORM ────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-lg shadow-slate-900/5">

          {/* Role Tabs */}
          {!forcedRole && !isRegisterMode && (
            <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-semibold gap-1">
              {DEMO_USERS.map((du) => {
                const Icon = du.icon;
                return (
                  <button
                    key={du.role}
                    type="button"
                    onClick={() => handleSelectRoleTab(du.role)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg capitalize transition-all ${
                      activeTab === du.role
                        ? 'bg-white text-teal-700 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{du.role}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active demo credential hint */}
          <div className={`bg-gradient-to-r ${activeDemo.accent} p-0.5 rounded-xl mb-5`}>
            <div className="bg-white rounded-[10px] px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeDemo.badge} inline-block mb-1`}>
                  {activeDemo.title} Demo
                </span>
                <p className="text-xs font-mono text-slate-700">{activeDemo.email}</p>
                <p className="text-xs font-mono text-slate-500">{activeDemo.password}</p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectRoleTab(activeTab)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Auto-Fill
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Sarah Jenkins"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-teal-600 hover:text-teal-700"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>
                {isLoading
                  ? 'Authenticating...'
                  : isRegisterMode
                  ? 'Create Account'
                  : `Sign In as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Register toggle (patient only) */}
          {activeTab === 'patient' && (
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              {isRegisterMode ? (
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => { setIsRegisterMode(false); handleSelectRoleTab('patient'); }}
                    className="font-bold text-teal-600 hover:text-teal-700"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-600">
                  Don't have a patient account?{' '}
                  <button
                    onClick={() => setIsRegisterMode(true)}
                    className="font-bold text-teal-600 hover:text-teal-700"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-5">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
            ← Back to meetAdr home
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Password Recovery</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Password recovery will be available when the backend is connected. In this demo phase, use the pre-configured demo credentials shown on the login page — or click any quick-access card to enter directly.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
