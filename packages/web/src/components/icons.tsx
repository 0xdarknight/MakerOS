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

export const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6"/>
    <path d="M5 8L7 10L11 6"/>
  </svg>
);

export const CircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6"/>
  </svg>
);

export const AlertCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6"/>
    <path d="M8 5v3"/>
    <circle cx="8" cy="11" r="0.5" fill="currentColor"/>
  </svg>
);

export const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 8h10M10 5l3 3-3 3"/>
  </svg>
);

export const Terminal = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="12" height="10" rx="1"/>
    <path d="M5 6l2 2-2 2M8 10h3"/>
  </svg>
);

export const Activity = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 8h2l2-4 4 8 2-4h2"/>
  </svg>
);

export const FileText = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6L9 2z"/>
    <path d="M9 2v4h4M5 9h6M5 11h6"/>
  </svg>
);

export const Play = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 3l10 5-10 5V3z"/>
  </svg>
);

export const Settings = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="2"/>
    <path d="M8 2v1M8 13v1M2 8h1M13 8h1M4.5 4.5l.7.7M10.8 10.8l.7.7M10.8 4.5l-.7.7M4.5 10.8l-.7.7"/>
  </svg>
);

export const HelpCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6"/>
    <path d="M6 6a2 2 0 014 1c0 1-1 1.5-2 2v.5"/>
    <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
  </svg>
);

export const Zap = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M9 2L3 9h4l-1 5 6-7H8l1-5z"/>
  </svg>
);

export const Database = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="8" cy="4" rx="5" ry="2"/>
    <path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4"/>
    <path d="M3 8c0 1.1 2.2 2 5 2s5-.9 5-2"/>
  </svg>
);

export const Figma = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <circle cx="10" cy="8" r="2"/>
    <circle cx="6" cy="4" r="2"/>
    <path d="M6 6a2 2 0 100 4h2V6H6z"/>
    <circle cx="6" cy="12" r="2"/>
  </svg>
);

export const Cloud = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 10a3 3 0 00-1-5.8A4 4 0 104 10h8z"/>
  </svg>
);
