// Header.tsx

import canadianFlag from '../../assets/canadian_flag.png';

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
}

export function Header({
  onHome,
  onNavigate,
  language,
  onLanguageChange,
  labels,
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
            <span className="wordmark-canada">{language === 'fr' ? 'Canada' : 'Canada'}</span>
            <span className="wordmark-service">
              {language === 'fr' ? 'Service Canada - Portail de renouvellement' : 'Service Canada - Renewal Portal'}
            </span>
          </span>
        </button>

        <nav className="header-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)}>
              {item.label}
            </button>
          ))}

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
      </div>
    </header>
  );
}
