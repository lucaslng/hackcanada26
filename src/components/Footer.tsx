// Footer.tsx

import canadianFlag from '../../assets/canadian_flag.png';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={canadianFlag} alt="" className="footer-flag" />
          <span>Service Canada Renewal Portal</span>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Services</h4>
            <a href="#services">Passport Renewal</a>
            <a href="#services">Driver&apos;s Licence</a>
            <a href="#services">Health Card</a>
            <a href="#services">SIN Updates</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#information">How It Works</a>
            <a href="#security-privacy">Security &amp; Privacy</a>
            <a href="#support">Accessibility</a>
          </div>
          <div>
            <h4>Contact &amp; Support</h4>
            <a href="#contact">Contact Us</a>
            <a href="#support">Help Centre</a>
            <a href="#support">Technical Support</a>
          </div>
        </div>

        <div className="footer-legal">
          <span>© Government of Canada, 2026</span>
          <span>Terms and Privacy</span>
          <span>This is a demonstration application and not an official production service.</span>
        </div>
      </div>
    </footer>
  );
}
