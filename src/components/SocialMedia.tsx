import React from 'react';

interface SocialMediaProps {
  variant?: 'default' | 'floating' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({
  variant = 'default',
  size = 'md',
  showLabels = false,
  orientation = 'horizontal',
  className = ''
}) => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/p/Rino-Properties-61568133758317/',
      icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
      color: 'hover:text-pink-600'
    },
    {
      name: 'LinkedIn',
      url: 'https://ae.linkedin.com/company/rino-invest-properties',
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      color: 'hover:text-blue-700'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc',
      icon: 'M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2.04h-3.445v16.592a2.972 2.972 0 01-2.968 2.968 2.972 2.972 0 01-2.968-2.968A2.972 2.972 0 019.406 15.7a2.972 2.972 0 012.968 2.968c0 .398-.077.777-.216 1.124v.001-.001c-.139-.347-.216-.726-.216-1.124a2.972 2.972 0 00-2.968-2.968 2.972 2.972 0 00-2.968 2.968c0 1.647 1.321 2.968 2.968 2.968a2.972 2.972 0 002.968-2.968V9.58a6.769 6.769 0 003.77 1.146V7.283a4.79 4.79 0 01-3.77-1.146 4.795 4.795 0 013.77-4.245v3.445z',
      color: 'hover:text-gray-900'
    }
  ];

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-xs',
      gap: 'gap-2'
    },
    md: {
      button: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-sm',
      gap: 'gap-3'
    },
    lg: {
      button: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-base',
      gap: 'gap-4'
    }
  };

  // Variant configurations
  const variantConfig = {
    default: {
      container: 'bg-white border border-gray-200',
      button: 'text-gray-600 hover:text-white border-gray-200',
      hoverBg: 'hover:bg-current'
    },
    floating: {
      container: 'bg-white/90 backdrop-blur-sm shadow-lg',
      button: 'text-gray-700 hover:text-white',
      hoverBg: 'hover:bg-current hover:shadow-lg'
    },
    dark: {
      container: 'bg-gray-900',
      button: 'text-gray-400 hover:text-white',
      hoverBg: 'hover:bg-current'
    },
    light: {
      container: 'bg-transparent',
      button: 'text-white hover:text-gray-900 border-white/20',
      hoverBg: 'hover:bg-white'
    }
  };

  const config = sizeConfig[size];
  const style = variantConfig[variant];
  const containerDirection = orientation === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={`flex ${containerDirection} ${config.gap} ${className}`}>
      {socialLinks.map((social) => (
        <div key={social.name} className="relative group">
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              relative flex items-center justify-center
              ${config.button} ${style.button} 
              transition-all duration-300 transform hover:scale-110
              ${style.hoverBg} ${style.container}
              ${showLabels && orientation === 'horizontal' ? 'pr-3' : ''}
            `}
            aria-label={`Visit our ${social.name} page`}
          >
            <svg 
              className={`${config.icon} transition-colors duration-300`} 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d={social.icon} />
            </svg>
            
            {showLabels && (
              <span className={`ml-2 font-medium ${config.text} transition-colors duration-300`}>
                {social.name}
              </span>
            )}
          </a>
          
          {/* Tooltip for non-labeled versions */}
          {!showLabels && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {social.name}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SocialMedia;
