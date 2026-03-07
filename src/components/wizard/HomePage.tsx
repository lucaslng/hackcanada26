// HomePage.tsx

import { RevealSection } from '../ui/RevealSection';
import { Button } from '../ui/Button';
import { useMemo, useState } from 'react';
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

type ServiceCategory = {
  id: string;
  title: string;
  serviceIds: string[];
};

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'identity-travel',
    title: 'Identity & Travel',
    serviceIds: ['passport', 'pr-card'],
  },
  {
    id: 'health-licensing',
    title: 'Health & Licensing',
    serviceIds: ['drivers-license', 'health-card', 'sin'],
  },
  {
    id: 'personal-records',
    title: 'Personal Records',
    serviceIds: ['address-change', 'birth-certificate', 'name-change'],
  },
];

export function HomePage({ t, language, onStartService, onNavigate }: HomePageProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(RENEWAL_OPTIONS[0]?.id ?? '');

  const selectedOption = useMemo(
    () => RENEWAL_OPTIONS.find((option) => option.id === selectedServiceId) ?? RENEWAL_OPTIONS[0] ?? null,
    [selectedServiceId],
  );

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
        <div className="service-selector-layout">
          <div className="service-selector-panel" aria-label={t.supportedServices}>
            {SERVICE_CATEGORIES.map((category) => (
              <section key={category.id} className="service-category">
                <h3>{category.title}</h3>
                <ul className="service-compact-list">
                  {category.serviceIds.map((serviceId) => {
                    const option = RENEWAL_OPTIONS.find((item) => item.id === serviceId);
                    if (!option) return null;
                    const copy = getServiceCopy(option, language);
                    const isSelected = selectedOption?.id === option.id;

                    return (
                      <li key={option.id}>
                        <button
                          type="button"
                          className={`service-compact-row ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => setSelectedServiceId(option.id)}
                        >
                          <span className="service-compact-row__icon material-symbols-outlined" aria-hidden="true">
                            {option.icon}
                          </span>
                          <span className="service-compact-row__title">{copy.title}</span>
                          <span className={`service-status-pill ${option.available ? 'is-active' : 'is-soon'}`}>
                            {option.available ? t.startService : t.comingSoon}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          {selectedOption && (
            <aside className="service-detail-panel" aria-live="polite">
              <div className="service-card-icon">
                <span className="material-symbols-outlined" aria-hidden="true">
                  {selectedOption.icon}
                </span>
              </div>
              <p className="service-detail-label">{t.selectedService}</p>
              <h3>{getServiceCopy(selectedOption, language).title}</h3>
              <p>{getServiceCopy(selectedOption, language).description}</p>
              <div className={`service-detail-status ${selectedOption.available ? 'is-active' : 'is-soon'}`}>
                {selectedOption.available ? 'Active' : t.comingSoon}
              </div>
              <Button
                onClick={() => onStartService(selectedOption.id)}
                disabled={!selectedOption.available}
                fullWidth
              >
                {selectedOption.available ? t.startService : t.comingSoon}
              </Button>
            </aside>
          )}
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
