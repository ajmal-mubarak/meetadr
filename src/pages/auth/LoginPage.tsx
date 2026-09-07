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
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  forcedRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ forcedRole }) => {
  const { login, register, isAuthenticated, user } = useAuth();
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
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  // Quick fill helper
  const handleSelectRoleTab = (role: UserRole) => {
    setActiveTab(role);
    setIsRegisterMode(false);
    if (role === 'patient') {
      setEmail('patient@meetadr.demo');
      setPassword('Patient@123');
    } else if (role === 'doctor') {
      setEmail('doctor@meetadr.demo');
      setPassword('Doctor@123');
    } else if (role === 'hospital') {
      setEmail('hospital@meetadr.demo');
      setPassword('Hospital@123');
    } else if (role === 'admin') {
      setEmail('admin@meetadr.demo');
      setPassword('Admin@123');
    }
  };

  const redirectAfterLogin = (role: UserRole) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }
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
          setIsLoading(false);
          return;
        }
        const newUser = await register(fullName, email, password, mobile, activeTab);
        showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');
        redirectAfterLogin(newUser.role);
      } else {
        const loggedUser = await login(email, password);
        showToast(`Signed in as ${loggedUser.name} (${loggedUser.role}).`, 'success');
        redirectAfterLogin(loggedUser.role);
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed. Please verify credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-blue-900/5">
        {/* Brand header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Meet<span className="text-blue-600">Adr</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">
            {isRegisterMode ? 'Create Patient Account' : 'Portal Sign In'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access appointments, schedules, and clinical records.
          </p>
        </div>

        {/* Role tabs (when not forced) */}
        {!forcedRole && !isRegisterMode && (
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 text-xs font-semibold">
            {(['patient', 'doctor', 'hospital', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSelectRoleTab(role)}
                className={`flex-1 py-1.5 rounded-lg capitalize transition-all ${
                  activeTab === role
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* Demo Credential Helper Box */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 mb-6 text-xs text-blue-900">
          <div className="flex items-center justify-between mb-1">
            <strong className="font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Demo Credentials ({activeTab}):
            </strong>
            <button
              type="button"
              onClick={() => handleSelectRoleTab(activeTab)}
              className="text-[11px] font-bold text-blue-700 hover:underline"
            >
              Fill Credentials
            </button>
          </div>
          <p className="text-[11px] text-blue-800 font-mono">
            Email: {email}
            <br />
            Password: {password}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Password
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700"
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
                className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>
              {isLoading
                ? 'Authenticating...'
                : isRegisterMode
                ? 'Create Account'
                : `Sign In as ${activeTab.toUpperCase()}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Register & Login for Patient */}
        {activeTab === 'patient' && (
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            {isRegisterMode ? (
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsRegisterMode(false);
                    handleSelectRoleTab('patient');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Don't have a patient account?{' '}
                <button
                  onClick={() => setIsRegisterMode(true)}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Password Recovery</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Password recovery will be available when the backend is connected. In this demo phase, you can use the pre-configured demo credentials or reset sample data from the top banner.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
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
