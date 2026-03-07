// Header.tsx

import canadianFlag from '../../assets/canadian_flag.png';

interface HeaderProps {
  onHome: () => void;
}

export function Header({ onHome }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="wordmark" onClick={onHome} aria-label="Go to home page">
          <span className="flag-bar">
            <img src={canadianFlag} alt="" className="flag-image" />
          </span>
          <span className="wordmark-text">
            <span className="wordmark-canada">Service Canada</span>
            <span className="wordmark-service">Document Portal</span>
          </span>
        </button>
        <nav className="header-nav">
          <a href="https://www.canada.ca/en/services/benefits.html" target="_blank" rel="noreferrer">
            Benefits
          </a>
          <a href="https://www.canada.ca/en.html" target="_blank" rel="noreferrer">
            Canada.ca
          </a>
        </nav>
      </div>
    </header>
  );
}
