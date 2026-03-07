// Header.tsx

import { MapleLeaf } from './MapleLeaf';
import { CanadianFlag } from './CanadianFlag';

interface HeaderProps {
  onHome: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Header({ onHome, onNavigate }: HeaderProps) {
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
            <MapleLeaf />
          </span>
          <span className="wordmark-text">
            <span className="wordmark-canada">Canada</span>
            <span className="wordmark-service">Service Canada - Renewal Portal</span>
          </span>
        </button>

        <nav className="header-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-flag-wrap">
          <CanadianFlag />
        </div>
      </div>
    </header>
  );
}
