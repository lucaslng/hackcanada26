// Footer.tsx

import type { UIStrings } from '../constants/i18n';

interface FooterProps {
  t: UIStrings;
}

export function Footer({ t }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span>{t.footerBrand}</span>
        </div>

        <div className="footer-columns">
          <div>
            <h4>{t.footerServicesTitle}</h4>
            <a href="#services">{t.footerPassportRenewal}</a>
            <a href="#services">{t.footerDriversLicense}</a>
            <a href="#services">{t.footerHealthCard}</a>
            <a href="#services">{t.footerSinUpdates}</a>
          </div>
          <div>
            <h4>{t.footerResourcesTitle}</h4>
            <a href="#information">{t.footerHowItWorks}</a>
            <a href="#security-privacy">{t.footerSecurityPrivacy}</a>
            <a href="#support">{t.footerAccessibility}</a>
          </div>
          <div>
            <h4>{t.footerContactSupportTitle}</h4>
            <a href="#contact">{t.footerContactUs}</a>
            <a href="#support">{t.footerHelpCentre}</a>
            <a href="#support">{t.footerTechnicalSupport}</a>
          </div>
        </div>

        <div className="footer-legal">
          <span>{t.footerCopyright}</span>
          <span>{t.footerTermsPrivacy}</span>
          <span>{t.footerDemoDisclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
