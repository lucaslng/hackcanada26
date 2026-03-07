// HomePage.tsx

import { RevealSection } from '../ui/RevealSection';
import { Button } from '../ui/Button';
import { RENEWAL_OPTIONS, type RenewalOption } from '../../data/renewalOptions';
import { getServiceText, type UIStrings, type Language } from '../../constants/i18n';

interface HomePageProps {
  t: UIStrings;
  language: Language;
  onStartService: (optionId: string) => void;
  onNavigate: (sectionId: string) => void;
}

function getServiceCopy(option: RenewalOption, language: Language) {
  return getServiceText(option.id, language) ?? { title: option.title, description: option.description };
}

export function HomePage({ t, language, onStartService, onNavigate }: HomePageProps) {
  return (
    <div className="gov-home-wrap">
      {/* ── Hero ── */}
      <RevealSection className="gov-home-hero" id="home">
        <p className="gov-eyebrow">{t.heroEyebrow}</p>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroBody}</p>
        <div className="hero-actions">
          <Button onClick={() => onNavigate('services')}>{t.startService}</Button>
          <Button variant="secondary" onClick={() => onNavigate('information')}>
            {t.learnMore}
          </Button>
        </div>
      </RevealSection>

      {/* ── Services ── */}
      <RevealSection className="gov-home-section" id="services">
        <div className="section-title-row">
          <h2>{t.supportedServices}</h2>
          <p>{t.supportedServicesBody}</p>
        </div>
        <div className="service-list-grid">
          {RENEWAL_OPTIONS.map((option) => {
            const copy = getServiceCopy(option, language);
            return (
              <article key={option.id} className="service-list-card">
                <div className="service-card-icon">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {option.icon}
                  </span>
                </div>
                <h3>{copy.title}</h3>
                <p>{copy.description}</p>
                <Button
                  onClick={() => onStartService(option.id)}
                  disabled={!option.available}
                  fullWidth
                >
                  {option.available ? t.startService : t.comingSoon}
                </Button>
              </article>
            );
          })}
        </div>
      </RevealSection>

      {/* ── How It Works ── */}
      <RevealSection className="gov-home-section" id="information">
        <div className="section-title-row">
          <h2>{t.howItWorks}</h2>
          <p>{t.howItWorksBody}</p>
        </div>
        <div className="how-grid">
          <div className="how-step">
            <span className="material-symbols-outlined" aria-hidden="true">cloud_upload</span>
            <h3>{t.uploadDocuments}</h3>
            <p>{t.uploadDocumentsBody}</p>
          </div>
          <div className="how-step">
            <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
            <h3>{t.verifyIdentity}</h3>
            <p>{t.verifyIdentityBody}</p>
          </div>
          <div className="how-step">
            <span className="material-symbols-outlined" aria-hidden="true">queue_play_next</span>
            <h3>{t.skipLine}</h3>
            <p>{t.skipLineBody}</p>
          </div>
        </div>
      </RevealSection>

      {/* ── Security ── */}
      <RevealSection className="gov-home-section" id="security-privacy">
        <div className="section-title-row">
          <h2>{t.securityPrivacy}</h2>
          <p>{t.securityPrivacyBody}</p>
        </div>
        <div className="security-grid">
          <div className="security-item">
            <span className="material-symbols-outlined" aria-hidden="true">lock</span>
            <div>
              <h3>{t.secureUploads}</h3>
              <p>{t.secureUploadsBody}</p>
            </div>
          </div>
          <div className="security-item">
            <span className="material-symbols-outlined" aria-hidden="true">manage_search</span>
            <div>
              <h3>{t.identityVerification}</h3>
              <p>{t.identityVerificationBody}</p>
            </div>
          </div>
          <div className="security-item">
            <span className="material-symbols-outlined" aria-hidden="true">encrypted</span>
            <div>
              <h3>{t.encryptedProcessing}</h3>
              <p>{t.encryptedProcessingBody}</p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── Contact ── */}
      <RevealSection className="gov-home-section" id="contact">
        <div className="section-title-row">
          <h2>{t.contactUs}</h2>
          <p>{t.contactUsBody}</p>
        </div>
        <div className="support-grid">
          <p>{t.phone}: <strong>1-800-622-6232</strong></p>
          <p>{t.email}: <strong>service-support@gov.example</strong></p>
          <p>{t.hours}: <strong>{t.hoursValue}</strong></p>
        </div>
      </RevealSection>

      {/* ── Support ── */}
      <RevealSection className="gov-home-section" id="support">
        <div className="section-title-row">
          <h2>{t.helpSupport}</h2>
          <p>{t.helpSupportBody}</p>
        </div>
        <ul className="checklist">
          <li>{t.help1}</li>
          <li>{t.help2}</li>
          <li>{t.help3}</li>
        </ul>
      </RevealSection>
    </div>
  );
}
