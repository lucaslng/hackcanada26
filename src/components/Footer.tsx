// Footer.tsx

import canadianFlag from '../../assets/canadian_flag.png';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <img src={canadianFlag} alt="" className="footer-flag" />
        <span>© Government of Canada · Service Canada Document Portal Demo</span>
        <span className="footer-disclaimer">
          This is a demonstration application. Not an official Government of Canada service.
        </span>
      </div>
    </footer>
  );
}
