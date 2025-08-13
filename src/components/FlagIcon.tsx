interface FlagIconProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FlagIcon = ({ countryCode, size = 'md', className = '' }: FlagIconProps) => {
  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-5 h-4', 
    lg: 'w-6 h-5'
  };

  const flagUrl = `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img 
        src={flagUrl}
        alt={`Flag of ${countryCode}`}
        className={`${sizeClasses[size]} rounded-sm object-cover border border-slate-600/30 shadow-sm`}
        onError={(e) => {
          // Fallback to a generic flag icon if the image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML = `
            <div class="${sizeClasses[size]} bg-slate-600/50 rounded-sm border border-slate-600/30 flex items-center justify-center">
              <span class="text-xs text-slate-300 font-mono">${countryCode.toUpperCase()}</span>
            </div>
          `;
        }}
        loading="lazy"
      />
    </div>
  );
};