interface FlagIconProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FlagIcon = ({ countryCode, size = 'md', className = '' }: FlagIconProps) => {
  const flagEmojis: Record<string, string> = {
    'us': '🇺🇸', // United States
    'cn': '🇨🇳', // China
    'jp': '🇯🇵', // Japan
    'kr': '🇰🇷', // South Korea
    'es': '🇪🇸', // Spain
    'fr': '🇫🇷', // France
    'de': '🇩🇪', // Germany
    'it': '🇮🇹', // Italy
    'br': '🇧🇷', // Brazil
    'pt': '🇵🇹', // Portugal
    'ru': '🇷🇺', // Russia
    'sa': '🇸🇦', // Saudi Arabia
    'ae': '🇦🇪', // UAE
    'in': '🇮🇳', // India
    'th': '🇹🇭', // Thailand
    'vn': '🇻🇳', // Vietnam
    'tr': '🇹🇷', // Turkey
    'nl': '🇳🇱', // Netherlands
    'mx': '🇲🇽', // Mexico
    'ca': '🇨🇦', // Canada
    'au': '🇦🇺', // Australia
    'gb': '🇬🇧', // United Kingdom
  };

  const sizeClasses = {
    sm: 'text-sm w-4 h-4',
    md: 'text-base w-5 h-5', 
    lg: 'text-lg w-6 h-6'
  };

  const flag = flagEmojis[countryCode.toLowerCase()] || '🏳️';

  return (
    <span 
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      role="img"
      aria-label={`Flag of ${countryCode}`}
      style={{
        fontFamily: '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
        textRendering: 'optimizeLegibility',
        filter: 'brightness(1.1) contrast(1.1)',
        textShadow: '0 0.5px 1px rgba(0,0,0,0.1)'
      }}
    >
      {flag}
    </span>
  );
};