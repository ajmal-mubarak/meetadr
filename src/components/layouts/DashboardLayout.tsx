import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  Stethoscope,
  BarChart3,
  LogOut,
  UserCheck,
  ClipboardList,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  portalType?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  badge,
  actions,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'patient') {
      return [
        { name: 'Overview', path: '/patient/dashboard', icon: LayoutDashboard },
        { name: 'My Bookings', path: '/patient/bookings', icon: Calendar },
        { name: 'Find Doctors', path: '/doctors', icon: Stethoscope },
        { name: 'Hospitals & Clinics', path: '/hospitals', icon: Building2 },
      ];
    }

    if (user.role === 'doctor') {
      return [
        { name: 'Doctor Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
        { name: 'Weekly Schedule', path: '/doctor/schedule', icon: Calendar },
        { name: 'Patient Directory', path: '/doctor/patients', icon: Users },
        { name: 'Find Providers', path: '/search', icon: Stethoscope },
      ];
    }

    if (user.role === 'hospital') {
      return [
        { name: 'Hospital Overview', path: '/hospital/dashboard', icon: LayoutDashboard },
        { name: 'Doctors Roster', path: '/hospital/doctors', icon: Stethoscope },
        { name: 'Departments', path: '/hospital/departments', icon: Building2 },
        { name: 'Facility Settings', path: '/hospital/settings', icon: Users },
      ];
    }

    if (user.role === 'admin') {
      return [
        { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Doctors Verification', path: '/admin/doctors', icon: Stethoscope },
        { name: 'Providers Directory', path: '/admin/providers', icon: Building2 },
        { name: 'Bookings Registry', path: '/admin/bookings', icon: Calendar },
        { name: 'Patient Waitlist', path: '/admin/waitlist', icon: ClipboardList },
        { name: 'Provider Requests', path: '/admin/requests', icon: UserCheck },
        { name: 'Analytical Reports', path: '/admin/reports', icon: BarChart3 },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1E293B] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E5E7EB] shrink-0 flex flex-col">
        {/* User Card */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-base border border-blue-100 shadow-sm">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#1E293B] truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="capitalize text-[10px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-200 px-2 py-0.5 rounded-full">
                {user?.role} Portal
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#64748B] hover:bg-[#FAF9F6] hover:text-[#1E293B]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom sign out */}
        <div className="p-3 border-t border-[#E5E7EB]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Bar */}
          {title && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">{title}</h1>
                  {badge && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                      {badge}
                    </span>
                  )}
                </div>
                {subtitle && <p className="text-xs text-[#64748B] mt-1">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}

          {/* Children Container */}
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
