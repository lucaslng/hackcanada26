// Footer.tsx

interface FooterProps {
  language: 'en' | 'fr';
}

export function Footer({ language }: FooterProps) {
  const isFr = language === 'fr';
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span>{isFr ? 'Portail de renouvellement Service Canada' : 'Service Canada Renewal Portal'}</span>
        </div>

        <div className="footer-columns">
          <div>
            <h4>{isFr ? 'Services' : 'Services'}</h4>
            <a href="#services">{isFr ? 'Renouvellement de passeport' : 'Passport Renewal'}</a>
            <a href="#services">{isFr ? 'Permis de conduire' : "Driver's Licence"}</a>
            <a href="#services">{isFr ? 'Carte santé' : 'Health Card'}</a>
            <a href="#services">{isFr ? 'Mises à jour NAS' : 'SIN Updates'}</a>
          </div>
          <div>
            <h4>{isFr ? 'Ressources' : 'Resources'}</h4>
            <a href="#information">{isFr ? 'Fonctionnement' : 'How It Works'}</a>
            <a href="#security-privacy">{isFr ? 'Sécurité et confidentialité' : 'Security & Privacy'}</a>
            <a href="#support">{isFr ? 'Accessibilité' : 'Accessibility'}</a>
          </div>
          <div>
            <h4>{isFr ? 'Contact et aide' : 'Contact & Support'}</h4>
            <a href="#contact">{isFr ? 'Contact' : 'Contact Us'}</a>
            <a href="#support">{isFr ? "Centre d'aide" : 'Help Centre'}</a>
            <a href="#support">{isFr ? 'Support technique' : 'Technical Support'}</a>
          </div>
        </div>

        <div className="footer-legal">
          <span>{isFr ? '© Gouvernement du Canada, 2026' : '© Government of Canada, 2026'}</span>
          <span>{isFr ? 'Conditions et confidentialité' : 'Terms and Privacy'}</span>
          <span>
            {isFr
              ? "Cette application est une démonstration et n'est pas un service officiel en production."
              : 'This is a demonstration application and not an official production service.'}
          </span>
        </div>
      </div>
    </footer>
  );
}
