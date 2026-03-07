// Footer.tsx

import { MapleLeaf } from './MapleLeaf';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <MapleLeaf />
        <span>© Government of Canada · Service Canada Document Portal Demo</span>
        <span className="footer-disclaimer">
          This is a demonstration application. Not an official Government of Canada service.
        </span>
      </div>
    </footer>
  );
}