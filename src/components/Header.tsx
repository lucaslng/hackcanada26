// Header.tsx

import canadianFlag from '../../assets/canadian_flag.png';
import { LANGUAGE_OPTIONS, type Language, type UIStrings } from '../constants/i18n';

export type Theme = 'light' | 'dark';
export type PortalView = 'canadian-user' | 'admin-reviewer';

interface HeaderProps {
  onHome: () => void;
  onNavigate: (sectionId: string) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  t: UIStrings;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  view: PortalView;
  onViewChange: (view: PortalView) => void;
}

export function Header({
  onHome,
  onNavigate,
  language,
  onLanguageChange,
  t,
  theme,
  onThemeChange,
  view,
  onViewChange,
}: HeaderProps) {
  const themeOptions: { value: Theme; icon: string; label: string }[] = [
    { value: 'light', icon: 'light_mode', label: t.themeLight },
    { value: 'dark', icon: 'dark_mode', label: t.themeDark },
  ];

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'services', label: t.nav.services },
    { id: 'information', label: t.nav.information },
    { id: 'contact', label: t.nav.contact },
    { id: 'support', label: t.nav.support },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="wordmark" onClick={onHome} aria-label={t.goHomeAria}>
          <span className="flag-bar">
            <img src={canadianFlag} alt="" className="flag-image" />
          </span>
          <span className="wordmark-text">
            <span className="wordmark-canada">Service Canada</span>
            <span className="wordmark-service">
              {t.portalLabel}
            </span>
          </span>
        </button>

        <nav className="header-nav" aria-label={t.primaryNavigationAria}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)}>
              {item.label}
            </button>
          ))}

          {/* ── Language switch ── */}
          <div className="language-switch">
            <span className="material-symbols-outlined" aria-hidden="true">language</span>
            <select
              id="language-select"
              className="language-select"
              aria-label={t.languageSwitcherAria}
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </nav>

        {/* ── Theme toggle ── */}
        <div
          className="theme-toggle-group"
          role="group"
          aria-label={t.colourSchemeAria}
        >
          {themeOptions.map(({ value, icon, label }) => (
            <button
              key={value}
              id={`theme-btn-${value}`}
              className={`theme-toggle-btn${theme === value ? ' active' : ''}`}
              onClick={() => onThemeChange(value)}
              aria-pressed={theme === value}
              title={label}
              aria-label={label}
            >
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
        </div>

        <div className="view-toggle-group" role="group" aria-label="Portal view">
          <button
            className={`view-toggle-btn${view === 'canadian-user' ? ' active' : ''}`}
            onClick={() => onViewChange('canadian-user')}
            aria-pressed={view === 'canadian-user'}
          >
            Canadian User
          </button>
          <button
            className={`view-toggle-btn${view === 'admin-reviewer' ? ' active' : ''}`}
            onClick={() => onViewChange('admin-reviewer')}
            aria-pressed={view === 'admin-reviewer'}
          >
            Admin Reviewer
          </button>
        </div>
      </div>
    </header>
  );
}
