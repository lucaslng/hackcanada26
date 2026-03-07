import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadWidget } from './cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from './cloudinary/UploadWidget';
import { Button } from './components/ui/Button';
import { RevealSection } from './components/ui/RevealSection';
import { SectionCard } from './components/ui/SectionCard';
import { RENEWAL_OPTIONS, type RenewalForm, type RenewalOption } from './data/renewalOptions';
import './App.css';

type Language = 'en' | 'fr';
const TOTAL_STEPS = 7;

const UI = {
  en: {
    nav: { home: 'Home', services: 'Services', information: 'Information', contact: 'Contact Us', support: 'Help / Support' },
    heroEyebrow: 'Service Ontario Digital Pre-Service',
    heroTitle: 'Renew Government Documents Faster',
    heroBody:
      'Verify your identity and upload required documents before visiting ServiceOntario to reduce wait times and complete renewals faster.',
    startService: 'Start Service',
    learnMore: 'Learn More',
    supportedServices: 'Supported Services',
    supportedServicesBody: 'Choose a service to begin secure onboarding.',
    comingSoon: 'Coming Soon',
    howItWorks: 'How It Works',
    howItWorksBody: 'A simple and secure process designed for faster in-person service.',
    uploadDocuments: 'Upload Documents',
    uploadDocumentsBody: 'Submit required files online before your visit.',
    verifyIdentity: 'Verify Identity',
    verifyIdentityBody: 'Use ID and selfie comparison to confirm identity.',
    skipLine: 'Skip the Line',
    skipLineBody: 'Arrive prepared and complete renewal with less delay.',
    securityPrivacy: 'Security & Privacy',
    securityPrivacyBody:
      'Your information is processed under strict security controls aligned with government digital service practices.',
    secureUploads: 'Secure Uploads',
    secureUploadsBody: 'Document uploads are protected in transit and at rest.',
    identityVerification: 'Identity Verification',
    identityVerificationBody: 'ID matching checks confirm the person submitting records.',
    encryptedProcessing: 'Encrypted Processing',
    encryptedProcessingBody: 'Sensitive data is handled in encrypted workflows.',
    contactUs: 'Contact Us',
    contactUsBody: 'Service support is available Monday to Friday.',
    helpSupport: 'Help / Support',
    helpSupportBody: 'Accessibility and assisted service options are available on request.',
    help1: 'Accessible service formats and alternate verification paths',
    help2: 'Technical support for upload or verification issues',
    help3: 'Assisted phone support for incomplete submissions',
    phone: 'Phone',
    email: 'Email',
    hours: 'Hours',
    step1Title: 'Step 1: Renewal Requirements',
    step1Subtitle: 'Review requirements for your selected service.',
    selectedService: 'Service selected',
    selfieRequirement: 'Live selfie for identity verification',
    step2Title: 'Step 2: Upload ID Document',
    step2Subtitle: 'Upload a clear image of your government-issued ID.',
    uploadIdBtn: 'Upload ID Document',
    uploadIdSuccess: 'ID upload completed successfully.',
    step3Title: 'Step 3: Verify Identity with Selfie',
    step3Subtitle: 'Capture a live photo for identity verification.',
    uploadSelfieBtn: 'Capture Selfie',
    uploadSelfieSuccess: 'Selfie captured successfully.',
    step4Title: 'Step 4: Identity Comparison',
    step4Subtitle: 'Run a secure comparison of ID and selfie photos.',
    runVerification: 'Run Verification',
    verified: 'Verified',
    notVerified: 'Not verified',
    step5Title: 'Step 5: Forms to Print and Sign',
    step5Subtitle: 'Review forms and optionally auto-map from a typed request.',
    mapFormsLabel: 'Type your request to map forms',
    mapFormsPlaceholder: "Example: renew driver's licence",
    mapRequestBtn: 'Map Request',
    step6Title: 'Step 6: Submission',
    step6Subtitle: 'Submission remains disabled in this demonstration.',
    submissionNotice:
      'Submission is currently unavailable. Backend handoff will be enabled in a later release.',
    step7Title: 'Step 7: Notifications',
    step7Subtitle: 'Choose where updates should be sent.',
    savePreference: 'Save Preference',
    updatesSent: 'Updates will be sent via',
    emailLabel: 'Email',
    smsLabel: 'SMS',
    to: 'to',
    back: 'Previous',
    continue: 'Continue',
    exitSetup: 'Exit',
    returnHome: 'Return Home',
    stepOf: 'Step',
    of: 'of',
  },
  fr: {
    nav: { home: 'Accueil', services: 'Services', information: 'Information', contact: 'Contact', support: 'Aide' },
    heroEyebrow: 'Préservice numérique ServiceOntario',
    heroTitle: 'Renouvelez vos documents gouvernementaux plus rapidement',
    heroBody:
      'Vérifiez votre identité et téléversez vos documents avant votre visite à ServiceOntario afin de réduire l’attente.',
    startService: 'Commencer',
    learnMore: 'En savoir plus',
    supportedServices: 'Services offerts',
    supportedServicesBody: 'Choisissez un service pour commencer l’inscription sécurisée.',
    comingSoon: 'Bientôt disponible',
    howItWorks: 'Fonctionnement',
    howItWorksBody: 'Un processus simple et sécuritaire pour accélérer le service en personne.',
    uploadDocuments: 'Téléverser les documents',
    uploadDocumentsBody: 'Soumettez les fichiers requis avant votre visite.',
    verifyIdentity: 'Vérifier l’identité',
    verifyIdentityBody: 'Comparez la photo d’identité et le selfie pour confirmer votre identité.',
    skipLine: 'Réduire l’attente',
    skipLineBody: 'Arrivez préparé et terminez votre renouvellement plus vite.',
    securityPrivacy: 'Sécurité et confidentialité',
    securityPrivacyBody:
      'Vos renseignements sont traités selon des contrôles de sécurité stricts conformes aux services numériques gouvernementaux.',
    secureUploads: 'Téléversements sécurisés',
    secureUploadsBody: 'Les documents sont protégés en transit et au repos.',
    identityVerification: "Vérification d'identité",
    identityVerificationBody: 'Les contrôles de correspondance confirment la personne soumettant les documents.',
    encryptedProcessing: 'Traitement chiffré',
    encryptedProcessingBody: 'Les données sensibles sont traitées dans des flux chiffrés.',
    contactUs: 'Contact',
    contactUsBody: 'Le soutien est offert du lundi au vendredi.',
    helpSupport: 'Aide',
    helpSupportBody: 'Des options accessibles et de soutien assisté sont offertes sur demande.',
    help1: 'Formats accessibles et parcours de vérification alternatifs',
    help2: 'Soutien technique pour téléversement ou vérification',
    help3: 'Aide téléphonique pour les soumissions incomplètes',
    phone: 'Téléphone',
    email: 'Courriel',
    hours: 'Heures',
    step1Title: 'Étape 1 : Exigences de renouvellement',
    step1Subtitle: 'Passez en revue les exigences pour le service choisi.',
    selectedService: 'Service choisi',
    selfieRequirement: 'Selfie en direct pour la vérification d’identité',
    step2Title: "Étape 2 : Téléverser la pièce d'identité",
    step2Subtitle: "Téléversez une image claire d'une pièce d'identité gouvernementale.",
    uploadIdBtn: "Téléverser la pièce d'identité",
    uploadIdSuccess: 'Téléversement de la pièce réussi.',
    step3Title: "Étape 3 : Vérifier l'identité avec un selfie",
    step3Subtitle: 'Capturez une photo en direct pour la vérification.',
    uploadSelfieBtn: 'Capturer le selfie',
    uploadSelfieSuccess: 'Selfie capturé avec succès.',
    step4Title: "Étape 4 : Comparaison d'identité",
    step4Subtitle: 'Lancez une comparaison sécurisée des photos.',
    runVerification: 'Lancer la vérification',
    verified: 'Vérifié',
    notVerified: 'Non vérifié',
    step5Title: 'Étape 5 : Formulaires à imprimer et signer',
    step5Subtitle: 'Consultez les formulaires et associez-les à partir du texte saisi.',
    mapFormsLabel: 'Saisissez votre demande pour associer les formulaires',
    mapFormsPlaceholder: 'Exemple : renouveler le permis de conduire',
    mapRequestBtn: 'Associer la demande',
    step6Title: 'Étape 6 : Soumission',
    step6Subtitle: 'La soumission demeure désactivée dans cette démonstration.',
    submissionNotice:
      'La soumission est actuellement indisponible. Le transfert au backend sera activé ultérieurement.',
    step7Title: 'Étape 7 : Notifications',
    step7Subtitle: 'Choisissez où recevoir les mises à jour.',
    savePreference: 'Enregistrer',
    updatesSent: 'Les mises à jour seront envoyées par',
    emailLabel: 'Courriel',
    smsLabel: 'SMS',
    to: 'à',
    back: 'Précédent',
    continue: 'Continuer',
    exitSetup: 'Quitter la configuration',
    returnHome: "Retour à l'accueil",
    stepOf: 'Étape',
    of: 'sur',
  },
} as const;

const SERVICE_TEXT: Record<string, { en: { title: string; description: string }; fr: { title: string; description: string } }> = {
  passport: {
    en: { title: 'Passport Renewal', description: 'Renew an adult or child Canadian passport.' },
    fr: { title: 'Renouvellement de passeport', description: 'Renouvelez un passeport canadien adulte ou enfant.' },
  },
  'drivers-license': {
    en: { title: "Driver's Licence Renewal", description: "Renew an expiring driver's licence." },
    fr: { title: 'Renouvellement du permis de conduire', description: 'Renouvelez un permis de conduire expirant.' },
  },
  'health-card': {
    en: { title: 'Health Card Renewal', description: 'Renew your provincial health card coverage.' },
    fr: { title: 'Renouvellement de la carte santé', description: 'Renouvelez votre couverture de carte santé provinciale.' },
  },
  sin: {
    en: { title: 'SIN Record Update / Renewal', description: 'Update or renew SIN records for eligibility checks.' },
    fr: { title: 'Mise à jour / renouvellement du NAS', description: "Mettez à jour ou renouvelez les dossiers du NAS." },
  },
  'address-change': {
    en: { title: 'Address Change', description: 'Update your address on government records and service files.' },
    fr: { title: "Changement d'adresse", description: "Mettez à jour votre adresse dans les dossiers gouvernementaux." },
  },
  'birth-certificate': {
    en: { title: 'Birth Certificate', description: 'Request a new birth certificate or replacement copy.' },
    fr: { title: 'Certificat de naissance', description: 'Demandez un nouveau certificat de naissance ou un remplacement.' },
  },
  'pr-card': {
    en: { title: 'PR Card', description: 'Renew or replace your permanent resident card.' },
    fr: { title: 'Carte RP', description: 'Renouvelez ou remplacez votre carte de résident permanent.' },
  },
  'name-change': {
    en: { title: 'Name Change', description: 'Submit forms for legal name change records.' },
    fr: { title: 'Changement de nom', description: 'Soumettez les formulaires pour un changement de nom légal.' },
  },
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [typedIntent, setTypedIntent] = useState('');
  const [mappedForms, setMappedForms] = useState<RenewalForm[]>([]);
  const [idPhoto, setIdPhoto] = useState<CloudinaryUploadResult | null>(null);
  const [facePhoto, setFacePhoto] = useState<CloudinaryUploadResult | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [notificationChannel, setNotificationChannel] = useState<'email' | 'sms'>('email');
  const [contactValue, setContactValue] = useState('');
  const [notificationSaved, setNotificationSaved] = useState(false);

  const t = UI[language];
  const selectedOption = RENEWAL_OPTIONS.find((option) => option.id === selectedOptionId) ?? null;
  const availableOptions = RENEWAL_OPTIONS.filter((option) => option.available);

  const getServiceCopy = (option: RenewalOption) => SERVICE_TEXT[option.id]?.[language] ?? { title: option.title, description: option.description };

  const clearWizardState = () => {
    setStep(1);
    setTypedIntent('');
    setMappedForms([]);
    setIdPhoto(null);
    setFacePhoto(null);
    setMatchScore(null);
    setNotificationChannel('email');
    setContactValue('');
    setNotificationSaved(false);
  };

  const resetFlow = () => {
    setStarted(false);
    setSelectedOptionId(null);
    clearWizardState();
  };

  const startService = (optionId: string) => {
    setSelectedOptionId(optionId);
    clearWizardState();
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSection = (sectionId: string) => {
    setStarted(false);
    window.setTimeout(() => {
      const node = document.getElementById(sectionId);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const canContinue = () => {
    if (step === 1) return Boolean(selectedOptionId);
    if (step === 2) return Boolean(idPhoto);
    if (step === 3) return Boolean(facePhoto);
    if (step === 4) return Boolean(matchScore && matchScore >= 82);
    if (step === 5) return Boolean(selectedOptionId);
    if (step === 6) return true;
    if (step === 7) return Boolean(contactValue.trim());
    return false;
  };

  const goNext = () => {
    if (step < TOTAL_STEPS && canContinue()) setStep((prev) => prev + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const matchIntentToOption = (raw: string): RenewalOption | null => {
    const text = raw.toLowerCase().trim();
    if (!text) return null;
    return availableOptions.find(
      (option) =>
        option.keywords.some((word) => text.includes(word)) ||
        text.includes(option.title.toLowerCase()),
    ) ?? null;
  };

  const mapFormsFromText = (raw: string) => {
    const option = matchIntentToOption(raw) ?? selectedOption;
    setMappedForms(option ? option.forms : []);
  };

  const compareFaces = () => {
    if (!idPhoto || !facePhoto) return;
    const fingerprint = `${idPhoto.public_id}:${facePhoto.public_id}`;
    const checksum = [...fingerprint].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const score = 70 + (checksum % 30);
    setMatchScore(score);
  };

  const saveNotifications = () => {
    if (!contactValue.trim()) return;
    setNotificationSaved(true);
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <SectionCard title={t.step1Title} subtitle={t.step1Subtitle} icon="fact_check">
          <div className="ui-banner">
            {t.selectedService}: <strong>{selectedOption ? getServiceCopy(selectedOption).title : ''}</strong>
          </div>
          <ul className="checklist">
            {selectedOption?.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
            <li>{t.selfieRequirement}</li>
          </ul>
        </SectionCard>
      );
    }

    if (step === 2) {
      return (
        <SectionCard title={t.step2Title} subtitle={t.step2Subtitle} icon="upload_file">
          <UploadWidget
            onUploadSuccess={(result) => setIdPhoto(result)}
            onUploadError={(error) => alert(`ID upload failed: ${error.message}`)}
            buttonText={t.uploadIdBtn}
          />
          {idPhoto && <p className="status-good">{t.uploadIdSuccess}</p>}
        </SectionCard>
      );
    }

    if (step === 3) {
      return (
        <SectionCard title={t.step3Title} subtitle={t.step3Subtitle} icon="photo_camera_front">
          <UploadWidget
            onUploadSuccess={(result) => setFacePhoto(result)}
            onUploadError={(error) => alert(`Face scan failed: ${error.message}`)}
            buttonText={t.uploadSelfieBtn}
          />
          {facePhoto && <p className="status-good">{t.uploadSelfieSuccess}</p>}
        </SectionCard>
      );
    }

    if (step === 4) {
      return (
        <SectionCard title={t.step4Title} subtitle={t.step4Subtitle} icon="person_search">
          <div className="ui-stack">
            <Button onClick={compareFaces} disabled={!idPhoto || !facePhoto}>
              {t.runVerification}
            </Button>
            {matchScore !== null && (
              <p className={matchScore >= 82 ? 'status-good' : 'status-bad'}>
                Match score: {matchScore}% {matchScore >= 82 ? `(${t.verified})` : `(${t.notVerified})`}
              </p>
            )}
          </div>
        </SectionCard>
      );
    }

    if (step === 5) {
      return (
        <SectionCard title={t.step5Title} subtitle={t.step5Subtitle} icon="description">
          <ul className="form-list">
            {selectedOption?.forms.map((form) => (
              <li key={form.id}>
                <span>{form.id}</span>
                <span>{form.label}</span>
              </li>
            ))}
          </ul>
          <div className="ui-stack">
            <label className="ui-label" htmlFor="map-form-input">
              {t.mapFormsLabel}
            </label>
            <input
              id="map-form-input"
              className="ui-input"
              placeholder={t.mapFormsPlaceholder}
              value={typedIntent}
              onChange={(event) => setTypedIntent(event.target.value)}
            />
            <Button variant="secondary" onClick={() => mapFormsFromText(typedIntent)}>
              {t.mapRequestBtn}
            </Button>
            {mappedForms.length > 0 && (
              <ul className="form-list">
                {mappedForms.map((form) => (
                  <li key={`mapped-${form.id}`}>
                    <span>{form.id}</span>
                    <span>{form.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionCard>
      );
    }

    if (step === 6) {
      return (
        <SectionCard title={t.step6Title} subtitle={t.step6Subtitle} icon="send">
          <p className="status-neutral">{t.submissionNotice}</p>
        </SectionCard>
      );
    }

    return (
      <SectionCard title={t.step7Title} subtitle={t.step7Subtitle} icon="notifications_active">
        <div className="ui-stack">
          <div className="segmented" role="tablist" aria-label="Notification channel">
            <button
              className={notificationChannel === 'email' ? 'active' : ''}
              onClick={() => setNotificationChannel('email')}
            >
              {t.emailLabel}
            </button>
            <button
              className={notificationChannel === 'sms' ? 'active' : ''}
              onClick={() => setNotificationChannel('sms')}
            >
              {t.smsLabel}
            </button>
          </div>

          <input
            className="ui-input"
            placeholder={notificationChannel === 'email' ? 'you@example.com' : '+1 416 555 1212'}
            value={contactValue}
            onChange={(event) => {
              setContactValue(event.target.value);
              setNotificationSaved(false);
            }}
          />

          <Button onClick={saveNotifications}>{t.savePreference}</Button>
          {notificationSaved && (
            <p className="status-good">
              {t.updatesSent} {notificationChannel.toUpperCase()} {t.to} {contactValue}.
            </p>
          )}
        </div>
      </SectionCard>
    );
  };

  return (
    <div className="app">
      <Header
        onHome={resetFlow}
        onNavigate={navigateToSection}
        language={language}
        onLanguageChange={setLanguage}
        labels={t.nav}
      />
      <main className="main">
        {!started ? (
          <div className="gov-home-wrap">
            <RevealSection className="gov-home-hero" id="home">
              <p className="gov-eyebrow">{t.heroEyebrow}</p>
              <h1>{t.heroTitle}</h1>
              <p>{t.heroBody}</p>
              <div className="hero-actions">
                <Button onClick={() => navigateToSection('services')}>{t.startService}</Button>
                <Button variant="secondary" onClick={() => navigateToSection('information')}>
                  {t.learnMore}
                </Button>
              </div>
            </RevealSection>

            <RevealSection className="gov-home-section" id="services">
              <div className="section-title-row">
                <h2>{t.supportedServices}</h2>
                <p>{t.supportedServicesBody}</p>
              </div>
              <div className="service-list-grid">
                {RENEWAL_OPTIONS.map((option) => {
                  const copy = getServiceCopy(option);
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
                        onClick={() => startService(option.id)}
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

            <RevealSection className="gov-home-section" id="contact">
              <div className="section-title-row">
                <h2>{t.contactUs}</h2>
                <p>{t.contactUsBody}</p>
              </div>
              <div className="support-grid">
                <p>{t.phone}: <strong>1-800-622-6232</strong></p>
                <p>{t.email}: <strong>service-support@gov.example</strong></p>
                <p>{t.hours}: <strong>8:00 AM - 8:00 PM (local)</strong></p>
              </div>
            </RevealSection>

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
        ) : (
          <div className="renewal-shell">
            <div className="step-header">
              <p className="step-count">
                {t.stepOf} {step} {t.of} {TOTAL_STEPS} - {selectedOption ? getServiceCopy(selectedOption).title : ''}
              </p>
              <div className="step-progress">
                <div style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
              </div>
            </div>
            {renderStep()}
            <div className="wizard-nav">
              <div className="wizard-nav-left">
                <Button variant="ghost" onClick={goBack} disabled={step === 1}>
                  {t.back}
                </Button>
                <Button variant="ghost" onClick={resetFlow}>
                  {t.exitSetup}
                </Button>
              </div>
              {step < TOTAL_STEPS ? (
                <Button onClick={goNext} disabled={!canContinue()}>
                  {t.continue}
                </Button>
              ) : (
                <Button onClick={resetFlow}>{t.returnHome}</Button>
              )}
            </div>
          </div>
        )}
        <Footer language={language} />
      </main>
    </div>
  );
}
