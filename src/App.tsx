import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layouts/Header';
import { Footer } from './components/layouts/Footer';
import { ProtectedRoute } from './components/layouts/ProtectedRoute';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { PatientLayout } from './components/layouts/PatientLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { SearchPage } from './pages/public/SearchPage';
import { DoctorList } from './pages/public/DoctorList';
import { DoctorDetails } from './pages/public/DoctorDetails';
import { HospitalList } from './pages/public/HospitalList';
import { HospitalDetails } from './pages/public/HospitalDetails';
import { ClinicList } from './pages/public/ClinicList';
import { ClinicDetails } from './pages/public/ClinicDetails';
import { WaitlistPage } from './pages/public/WaitlistPage';
import { JoinProviderPage } from './pages/public/JoinProviderPage';
import {
  AboutPage,
  ServicesPage,
  PartnersPage,
  ContactPage,
  FaqPage,
  HelpPage,
  PrivacyPage,
  TermsPage,
  AccessibilityPage,
  CareersPage,
  ReferPage,
} from './pages/public/StaticPages';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

// Booking Page
import { BookingPage } from './pages/booking/BookingPage';

// Patient Portal
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientBookings } from './pages/patient/PatientBookings';
import { PatientProfile } from './pages/patient/PatientProfile';

// Doctor Portal
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { DoctorPatients } from './pages/doctor/DoctorPatients';

// Hospital Portal
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { HospitalDoctors } from './pages/hospital/HospitalDoctors';
import { HospitalDepartments } from './pages/hospital/HospitalDepartments';
import { HospitalSettings } from './pages/hospital/HospitalSettings';

// Admin Portal
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDoctors } from './pages/admin/AdminDoctors';
import { AdminProviders } from './pages/admin/AdminProviders';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminWaitlist } from './pages/admin/AdminWaitlist';
import { AdminRequests } from './pages/admin/AdminRequests';
import { AdminReports } from './pages/admin/AdminReports';

// Public Layout Wrapper with Header and Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900 font-sans">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC & MARKETING ROUTES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
              <Route path="/hospitals" element={<HospitalList />} />
              <Route path="/hospitals/:id" element={<HospitalDetails />} />
              <Route path="/clinics" element={<ClinicList />} />
              <Route path="/clinics/:id" element={<ClinicDetails />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
              <Route path="/join" element={<JoinProviderPage />} />
              <Route path="/become-a-partner" element={<JoinProviderPage />} />
              <Route path="/provider-register" element={<JoinProviderPage />} />

              {/* Informational & Legal */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/refer" element={<ReferPage />} />

              {/* Booking Flow */}
              <Route path="/book" element={<BookingPage />} />
              <Route path="/book/doctor/:doctorId" element={<BookingPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/patient/login" element={<LoginPage forcedRole="patient" />} />
              <Route path="/doctor/login" element={<LoginPage forcedRole="doctor" />} />
              <Route path="/hospital/login" element={<LoginPage forcedRole="hospital" />} />
              <Route path="/admin/login" element={<LoginPage forcedRole="admin" />} />
            </Route>

            {/* PATIENT PORTAL */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/patient/dashboard" replace />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="bookings" element={<PatientBookings />} />
            </Route>

            {/* DOCTOR PORTAL */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DashboardLayout portalType="doctor" />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/doctor/dashboard" replace />} />
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="schedule" element={<DoctorSchedule />} />
              <Route path="patients" element={<DoctorPatients />} />
            </Route>

            {/* HOSPITAL / CLINIC PORTAL */}
            <Route
              path="/hospital"
              element={
                <ProtectedRoute allowedRoles={['hospital']}>
                  <DashboardLayout portalType="hospital" />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/hospital/dashboard" replace />} />
              <Route path="dashboard" element={<HospitalDashboard />} />
              <Route path="doctors" element={<HospitalDoctors />} />
              <Route path="departments" element={<HospitalDepartments />} />
              <Route path="settings" element={<HospitalSettings />} />
            </Route>

            {/* ADMIN PORTAL */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout portalType="admin" />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="waitlist" element={<AdminWaitlist />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
