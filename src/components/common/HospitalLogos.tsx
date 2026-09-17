import React from 'react';

interface LogoProps {
  className?: string;
}

export const CmcLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="CMC Hospital Dubai">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#007B8A" strokeWidth="1.5" />
    <path d="M20 10v20M10 20h20" stroke="#00A3B4" strokeWidth="3" strokeLinecap="round" />
    <circle cx="20" cy="20" r="3.5" fill="#FFFFFF" />
    <text x="46" y="21" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" letterSpacing="0.5">CMC</text>
    <text x="84" y="21" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="12" fill="#00A3B4" letterSpacing="1">DUBAI</text>
    <text x="46" y="32" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="600" fontSize="7.5" fill="#94A3B8" letterSpacing="1.2">CLEMENCEAU MEDICAL</text>
  </svg>
);

export const AlZahraLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 170 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Al Zahra Hospital Dubai">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#10B981" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="9" stroke="#10B981" strokeWidth="1.5" fill="none" />
    <path d="M20 13c0 3.866-3.134 7-7 7 3.866 0 7 3.134 7 7 0-3.866 3.134-7 7-7-3.866 0-7-3.134-7-7z" fill="#34D399" />
    <circle cx="20" cy="20" r="2" fill="#F59E0B" />
    <text x="46" y="20" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="800" fontSize="13" fill="#FFFFFF" letterSpacing="0.8">AL ZAHRA</text>
    <text x="46" y="31" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="600" fontSize="7.5" fill="#34D399" letterSpacing="1.5">HOSPITAL DUBAI</text>
  </svg>
);

export const EmiratesHospitalLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 165 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Emirates Hospitals Group">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#E11D48" strokeWidth="1.5" />
    <path d="M14 16l6-5 6 5v8c0 4-6 7-6 7s-6-3-6-7v-8z" fill="#E11D48" opacity="0.25" stroke="#E11D48" strokeWidth="1.5" />
    <path d="M20 16v8M16 20h8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <text x="46" y="20" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="13.5" fill="#FFFFFF" letterSpacing="1">EMIRATES</text>
    <text x="46" y="31" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="7.5" fill="#FDA4AF" letterSpacing="1.2">HOSPITALS GROUP</text>
  </svg>
);

export const AlNoorLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Al Noor Royal Hospital">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#F59E0B" strokeWidth="1.5" />
    <path d="M20 11l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="#F59E0B" />
    <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
    <text x="46" y="20" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="13.5" fill="#FFFFFF" letterSpacing="0.8">AL NOOR</text>
    <text x="46" y="31" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="7.5" fill="#FBBF24" letterSpacing="1.2">ROYAL HOSPITAL</text>
  </svg>
);

export const CityCareLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="CityCare Hospital">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#0284C7" strokeWidth="1.5" />
    <rect x="17" y="11" width="6" height="18" rx="2" fill="#0284C7" />
    <rect x="11" y="17" width="18" height="6" rx="2" fill="#0284C7" />
    <path d="M12 20h4l2-3 3 6 2-3h5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="46" y="20" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="13.5" fill="#FFFFFF" letterSpacing="0.5">CITYCARE</text>
    <text x="46" y="31" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="7.5" fill="#38BDF8" letterSpacing="1.2">SPECIALTY HOSPITAL</text>
  </svg>
);

export const MarinaGatewayLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 165 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Marina Gateway Hospital">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#0EA5E9" strokeWidth="1.5" />
    <path d="M13 25c3-6 7-12 11-14v14H13z" fill="#0EA5E9" opacity="0.3" />
    <path d="M14 26c4-1 8-1 12 0M20 13v13" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
    <circle cx="20" cy="13" r="2.5" fill="#38BDF8" />
    <text x="46" y="20" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="13.5" fill="#FFFFFF" letterSpacing="0.8">MARINA</text>
    <text x="46" y="31" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="7.5" fill="#7DD3FC" letterSpacing="1.2">GATEWAY HOSPITAL</text>
  </svg>
);

export const CapitalHealthLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 165 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Capital Health General Hospital">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#8B5CF6" strokeWidth="1.5" />
    <path d="M20 11l8 4.5v9L20 29l-8-4.5v-9L20 11z" stroke="#8B5CF6" strokeWidth="1.5" fill="none" />
    <path d="M20 16v8M16 20h8" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
    <text x="46" y="20" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="0.8">CAPITAL</text>
    <text x="46" y="31" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="7.5" fill="#C4B5FD" letterSpacing="1.2">HEALTH GENERAL</text>
  </svg>
);

export const GulfCentralLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 165 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Gulf Central Specialty Hospital">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#14B8A6" strokeWidth="1.5" />
    <path d="M15 15a8 8 0 0 1 10 0M15 25a8 8 0 0 0 10 0" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="20" r="3" fill="#2DD4BF" />
    <text x="46" y="20" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="12.5" fill="#FFFFFF" letterSpacing="0.5">GULF CENTRAL</text>
    <text x="46" y="31" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="7.5" fill="#5EEAD4" letterSpacing="1.2">SPECIALTY HOSPITAL</text>
  </svg>
);

export const SharjahHospitalLogo: React.FC<LogoProps> = ({ className = 'h-9 w-auto' }) => (
  <svg viewBox="0 0 175 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Sharjah University Teaching Hospital">
    <rect x="2" y="2" width="36" height="36" rx="10" fill="#0C1A22" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="8" stroke="#D97706" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
    <path d="M20 14l1.5 4 4.5.5-3.5 3 1 4.5-3.5-2.5-3.5 2.5 1-4.5-3.5-3 4.5-.5L20 14z" fill="#FBBF24" />
    <text x="46" y="20" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="900" fontSize="13.5" fill="#FFFFFF" letterSpacing="0.8">SHARJAH</text>
    <text x="46" y="31" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="700" fontSize="7.5" fill="#FCD34D" letterSpacing="1.2">UNIVERSITY HOSPITAL</text>
  </svg>
);

export const HospitalBrandLogo: React.FC<{ hospitalId: string; className?: string }> = ({ hospitalId, className = 'h-9 w-auto' }) => {
  switch (hospitalId) {
    case 'hosp_cmc':
      return <CmcLogo className={className} />;
    case 'hosp_1':
      return <CityCareLogo className={className} />;
    case 'hosp_2':
      return <EmiratesHospitalLogo className={className} />;
    case 'hosp_3':
      return <AlNoorLogo className={className} />;
    case 'hosp_4':
      return <GulfCentralLogo className={className} />;
    case 'hosp_5':
      return <MarinaGatewayLogo className={className} />;
    case 'hosp_6':
      return <CapitalHealthLogo className={className} />;
    case 'hosp_7':
      return <AlZahraLogo className={className} />;
    case 'hosp_8':
      return <SharjahHospitalLogo className={className} />;
    default:
      return <CmcLogo className={className} />;
  }
};
