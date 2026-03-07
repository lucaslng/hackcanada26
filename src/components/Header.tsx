// Header.tsx

import canadianFlag from '../../assets/canadian_flag.png';

export type Theme = 'light' | 'dark' | 'system';

interface HeaderProps {
  onHome: () => void;
  onNavigate: (sectionId: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const THEME_OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: 'light', icon: 'light_mode', label: 'Light' },
  { value: 'system', icon: 'brightness_auto', label: 'System' },
  { value: 'dark', icon: 'dark_mode', label: 'Dark' },
];

export function Header({ onHome, onNavigate, theme, onThemeChange }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'information', label: 'Information' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'support', label: 'Help / Support' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="wordmark" onClick={onHome} aria-label="Go to home page">
          <span className="flag-bar">
            <img src={canadianFlag} alt="" className="flag-image" />
          </span>
          <span className="wordmark-text">
            <span className="wordmark-canada">Service Canada</span>
            <span className="wordmark-service">Renewal Portal</span>
          </span>
        </button>

        <nav className="header-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* ── Theme toggle ── */}
        <div
          className="theme-toggle-group"
          role="group"
          aria-label="Colour scheme"
        >
          {THEME_OPTIONS.map(({ value, icon, label }) => (
            <button
              key={value}
              id={`theme-btn-${value}`}
              className={`theme-toggle-btn${theme === value ? ' active' : ''}`}
              onClick={() => onThemeChange(value)}
              aria-pressed={theme === value}
              title={label}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
