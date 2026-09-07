import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Stethoscope,
  Building2,
  Calendar,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  Clock,
  FileText,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';

interface PatientNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'appointment' | 'prescription' | 'reminder';
}

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, quickLoginAs } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // References for outside click dismissal
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Patient notifications state
  const [notifications, setNotifications] = useState<PatientNotification[]>([
    {
      id: 'notif_1',
      title: 'Appointment Confirmed',
      description: 'Dr. Sarah Chen at CMC Hospital Dubai • Today at 10:30 AM',
      time: '15m ago',
      unread: true,
      type: 'appointment',
    },
    {
      id: 'notif_2',
      title: 'Digital Prescription Ready',
      description: 'Prescription from Dr. Tariq Al-Mansoor ready for pharmacy pickup',
      time: '2h ago',
      unread: true,
      type: 'prescription',
    },
    {
      id: 'notif_3',
      title: 'Pre-Visit Check-in Reminder',
      description: 'Please confirm your insurance card details prior to consultation',
      time: '1d ago',
      unread: false,
      type: 'reminder',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setRoleSwitcherOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Outside click handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (roleRef.current && !roleRef.current.contains(target)) {
        setRoleSwitcherOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast('Signed out successfully.', 'info');
    navigate('/');
  };

  const handleQuickSwitch = async (role: UserRole) => {
    try {
      const u = await quickLoginAs(role);
      setRoleSwitcherOpen(false);
      setMobileMenuOpen(false);
      showToast(`Switched to ${role.toUpperCase()} mode (${u.name}).`, 'success');
      if (role === 'patient') navigate('/patient/dashboard');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else if (role === 'hospital') navigate('/hospital/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Failed to switch role', 'error');
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'info');
  };

  const handlePatientBookingsClick = async () => {
    // If not authenticated or not patient, ensure patient context
    if (!isAuthenticated || user?.role !== 'patient') {
      await quickLoginAs('patient');
    }
    navigate('/patient/bookings');
  };

  const handlePatientProfileClick = async () => {
    if (!isAuthenticated || user?.role !== 'patient') {
      await quickLoginAs('patient');
    }
    navigate('/patient/profile');
  };

  // Primary navigation links requested: Home, About Us, Services, Contact, Become a Partner
  const mainNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'Become a Partner', path: '/become-a-partner' },
  ];

  // Active role details
  const activeRole = user?.role || 'patient';
  const roleDisplayNames: Record<UserRole, { label: string; badge: string; color: string }> = {
    patient: { label: 'Patient View', badge: 'Patient', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    doctor: { label: 'Doctor View', badge: 'Physician', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    hospital: { label: 'Hospital View', badge: 'Hospital', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    admin: { label: 'Admin View', badge: 'Admin', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  };

  return (
    <header
      id="main-hospital-header"
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200'
          : 'bg-white border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* ================================================================= */}
          {/* 1. BRAND LOGO - Hospital Identity Theme                          */}
          {/* ================================================================= */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-sky-700 flex items-center justify-center text-white shadow-xs shadow-sky-600/20"
            >
              <Stethoscope className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                meet<span className="text-sky-600">Adr</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mt-0.5">
                Hospital Network
              </span>
            </div>
          </Link>

          {/* ================================================================= */}
          {/* 2. MAIN NAV LINKS: Home, About Us, Services, Contact, Become Partner */}
          {/* ================================================================= */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'text-sky-700 bg-sky-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ================================================================= */}
          {/* 3. PATIENT ACTIONS & ROLE SWITCHER (Desktop)                     */}
          {/* ================================================================= */}
          <div className="hidden md:flex items-center gap-3">
            {/* PATIENT BOOKINGS BUTTON */}
            <button
              id="header-nav-patient-bookings"
              type="button"
              onClick={handlePatientBookingsClick}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg border border-sky-200 bg-sky-50/70 text-sky-800 hover:bg-sky-100 hover:border-sky-300 transition-all cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>Bookings</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-600 text-white">
                2
              </span>
            </button>

            {/* NOTIFICATION ICON WITH DROPDOWN */}
            <div className="relative" ref={notifRef}>
              <button
                id="header-nav-notification-button"
                type="button"
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  setRoleSwitcherOpen(false);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2 space-y-1">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-2.5 rounded-xl transition-colors ${
                            notif.unread ? 'bg-sky-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-snug">
                            {notif.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setNotificationsOpen(false);
                          handlePatientBookingsClick();
                        }}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View in Patient Portal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PATIENT PROFILE DROPDOWN */}
            <div className="relative" ref={profileRef}>
              <button
                id="header-nav-profile-button"
                type="button"
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setRoleSwitcherOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {user ? user.name.charAt(0) : 'P'}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {user ? user.name.split(' ')[0] : 'Profile'}
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Patient
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {user?.name || 'Sarah Jenkins'}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {user?.email || 'patient@meetadr.demo'}
                      </span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        MRN: 94821-UAE
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        type="button"
                        onClick={handlePatientProfileClick}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        <span>My Profile & Insurance</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePatientBookingsClick}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>My Bookings</span>
                      </button>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* =============================================================== */}
            {/* OPTION SWITCH TO HOSPITAL / ADMIN / DOCTOR                      */}
            {/* =============================================================== */}
            <div className="relative" ref={roleRef}>
              <button
                id="header-role-switcher-toggle"
                type="button"
                onClick={() => {
                  setRoleSwitcherOpen((prev) => !prev);
                  setNotificationsOpen(false);
                  setProfileOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  roleDisplayNames[activeRole]?.color || 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="Switch portal perspective"
              >
                <span>Switch View</span>
                <ChevronDown className="w-3 h-3 text-current" />
              </button>

              <AnimatePresence>
                {roleSwitcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Switch Portal View
                        </span>
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                          Active: {activeRole.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Instantly test and operate from any user perspective:
                      </p>
                    </div>

                    <div className="p-1 space-y-1 mt-1">
                      {/* 1. Patient Portal */}
                      <button
                        id="role-switch-patient"
                        type="button"
                        onClick={() => handleQuickSwitch('patient')}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                          activeRole === 'patient'
                            ? 'bg-sky-50/80 border-sky-300 shadow-2xs'
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">Patient Portal</span>
                              {activeRole === 'patient' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                              Book UAE doctors, see appointments
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* 2. Hospital Portal */}
                      <button
                        id="role-switch-hospital"
                        type="button"
                        onClick={() => handleQuickSwitch('hospital')}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                          activeRole === 'hospital'
                            ? 'bg-indigo-50/80 border-indigo-300 shadow-2xs'
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">Hospital Portal</span>
                              {activeRole === 'hospital' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                              Manage rosters, clinic slots & intake
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* 3. Doctor Portal */}
                      <button
                        id="role-switch-doctor"
                        type="button"
                        onClick={() => handleQuickSwitch('doctor')}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                          activeRole === 'doctor'
                            ? 'bg-teal-50/80 border-teal-300 shadow-2xs'
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">Doctor Portal</span>
                              {activeRole === 'doctor' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                              Physician queue, consultation records
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* 4. Admin Portal */}
                      <button
                        id="role-switch-admin"
                        type="button"
                        onClick={() => handleQuickSwitch('admin')}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                          activeRole === 'admin'
                            ? 'bg-slate-100 border-slate-300 shadow-2xs'
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900">Admin Portal</span>
                              {activeRole === 'admin' && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                              DHA licensing, facility verification
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* ================================================================= */}
          {/* MOBILE TOGGLE BUTTON                                             */}
          {/* ================================================================= */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE DRAWER: Comprehensive navigation & portal options              */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4"
          >
            {/* Quick Role Switch in Mobile */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Switch Perspective:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('patient')}
                  className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                    activeRole === 'patient'
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  👤 Patient
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('hospital')}
                  className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                    activeRole === 'hospital'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🏥 Hospital
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('doctor')}
                  className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                    activeRole === 'doctor'
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🩺 Doctor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSwitch('admin')}
                  className={`p-2 rounded-xl text-xs font-bold text-center border transition-all ${
                    activeRole === 'admin'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            {/* Primary Nav Links */}
            <div className="flex flex-col space-y-1">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Patient Controls in Mobile */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePatientBookingsClick();
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>My Bookings</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
                  2 Upcoming
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePatientProfileClick();
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center gap-2"
              >
                <User className="w-4 h-4 text-sky-600" />
                <span>Patient Profile & Insurance</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
