// Header.tsx

import canadianFlag from '../../assets/canadian_flag.png';

export type Theme = 'light' | 'dark' | 'system';

interface HeaderProps {
  onHome: () => void;
  onNavigate: (sectionId: string) => void;
  language: 'en' | 'fr';
  onLanguageChange: (language: 'en' | 'fr') => void;
  labels: {
    home: string;
    services: string;
    information: string;
    contact: string;
    support: string;
  };
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const THEME_OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: 'light', icon: 'light_mode', label: 'Light' },
  { value: 'system', icon: 'brightness_auto', label: 'System' },
  { value: 'dark', icon: 'dark_mode', label: 'Dark' },
];

export function Header({
  onHome,
  onNavigate,
  language,
  onLanguageChange,
  labels,
  theme,
  onThemeChange,
}: HeaderProps) {
  const navItems = [
    { id: 'home', label: labels.home },
    { id: 'services', label: labels.services },
    { id: 'information', label: labels.information },
    { id: 'contact', label: labels.contact },
    { id: 'support', label: labels.support },
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
            <span className="wordmark-service">
              {language === 'fr' ? 'Portail de renouvellement' : 'Renewal Portal'}
            </span>
          </span>
        </button>

        <nav className="header-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)}>
              {item.label}
            </button>
          ))}

          {/* ── Language switch ── */}
          <div className="language-switch" role="group" aria-label="Language switcher">
            <span className="material-symbols-outlined" aria-hidden="true">language</span>
            <button
              className={language === 'en' ? 'active' : ''}
              onClick={() => onLanguageChange('en')}
              aria-pressed={language === 'en'}
            >
              EN
            </button>
            <span className="lang-sep">|</span>
            <button
              className={language === 'fr' ? 'active' : ''}
              onClick={() => onLanguageChange('fr')}
              aria-pressed={language === 'fr'}
            >
              FR
            </button>
          </div>
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
