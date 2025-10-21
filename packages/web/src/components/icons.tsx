export const PlayIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 3l10 5-10 5V3z" />
  </svg>
);

export const FrameIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="12" height="12" rx="1" />
  </svg>
);

export const ComponentIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2L12 6L8 10L4 6L8 2Z" />
    <path d="M8 10L12 14L8 18L4 14L8 10Z" opacity="0.6" />
  </svg>
);

export const LayersIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 5L8 2L14 5L8 8L2 5Z" />
    <path d="M2 8L8 11L14 8" />
    <path d="M2 11L8 14L14 11" />
  </svg>
);

export const ChevronRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

export const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="7" cy="7" r="4" />
    <path d="M11 11L14 14" />
  </svg>
);

export const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 8L6 11L13 4" />
  </svg>
);

export const AlertIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm1 9H7V7h2v4zm0-5H7V4h2v2z"/>
  </svg>
);

export const SpinnerIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="28" strokeDashoffset="14" opacity="0.3"/>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="28" strokeDashoffset="14" className="animate-spin" style={{transformOrigin: 'center'}}/>
  </svg>
);

export const PluginIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 2v3H3v6h2v3h2v-3h2V8h2V5h-2V2H7v3H5V2z"/>
  </svg>
);

export const AutoLayoutIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="5" height="12" rx="0.5"/>
    <rect x="9" y="2" width="5" height="5" rx="0.5"/>
    <rect x="9" y="9" width="5" height="5" rx="0.5"/>
  </svg>
);

export const MakerOSLogo = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="url(#gradient)"/>
    <path d="M7 8l5 4-5 4V8z" fill="white" opacity="0.9"/>
    <circle cx="17" cy="12" r="2" fill="white" opacity="0.7"/>
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0%" stopColor="#18A0FB"/>
        <stop offset="100%" stopColor="#7B61FF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const ADKIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2L2 5v6l6 3 6-3V5L8 2z" opacity="0.3"/>
    <path d="M8 8L2 5l6-3 6 3-6 3z"/>
    <path d="M8 8v6"/>
  </svg>
);
