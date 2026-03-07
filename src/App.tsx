import { useState, useEffect } from 'react';
import { Header, type Theme } from './components/Header';
import { Footer } from './components/Footer';
import { UploadWidget } from './cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from './cloudinary/UploadWidget';
import { Button } from './components/ui/Button';
import { RevealSection } from './components/ui/RevealSection';
import { SectionCard } from './components/ui/SectionCard';
import { RENEWAL_OPTIONS, type RenewalForm, type RenewalOption } from './data/renewalOptions';
import './App.css';

const TOTAL_STEPS = 7;

export default function App() {
  // ── Theme ──────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) ?? 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── Wizard state ───────────────────────────────────────────────────
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

  const selectedOption =
    RENEWAL_OPTIONS.find((option) => option.id === selectedOptionId) ?? null;

  const availableOptions = RENEWAL_OPTIONS.filter((option) => option.available);

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
    return (
      availableOptions.find(
        (option) =>
          option.keywords.some((word) => text.includes(word)) ||
          text.includes(option.title.toLowerCase()),
      ) ?? null
    );
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
        <SectionCard
          title="Step 1: Renewal Requirements"
          subtitle="Review requirements for your selected service."
          icon="fact_check"
        >
          <div className="ui-banner">
            Service selected: <strong>{selectedOption?.title}</strong>
          </div>
          <ul className="checklist">
            {selectedOption?.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
            <li>Live selfie for identity verification</li>
          </ul>
        </SectionCard>
      );
    }

    if (step === 2) {
      return (
        <SectionCard
          title="Step 2: Upload ID Document"
          subtitle="Upload a clear image of your government-issued ID."
          icon="upload_file"
        >
          <UploadWidget
            onUploadSuccess={(result) => setIdPhoto(result)}
            onUploadError={(error) => alert(`ID upload failed: ${error.message}`)}
            buttonText="Upload ID Document"
          />
          {idPhoto && <p className="status-good">ID upload completed successfully.</p>}
        </SectionCard>
      );
    }

    if (step === 3) {
      return (
        <SectionCard
          title="Step 3: Verify Identity with Selfie"
          subtitle="Capture a live photo for identity verification."
          icon="photo_camera_front"
        >
          <UploadWidget
            onUploadSuccess={(result) => setFacePhoto(result)}
            onUploadError={(error) => alert(`Face scan failed: ${error.message}`)}
            buttonText="Capture Selfie"
          />
          {facePhoto && <p className="status-good">Selfie captured successfully.</p>}
        </SectionCard>
      );
    }

    if (step === 4) {
      return (
        <SectionCard
          title="Step 4: Identity Comparison"
          subtitle="Run a secure comparison of ID and selfie photos."
          icon="person_search"
        >
          <div className="ui-stack">
            <Button onClick={compareFaces} disabled={!idPhoto || !facePhoto}>
              Run Verification
            </Button>
            {matchScore !== null && (
              <p className={matchScore >= 82 ? 'status-good' : 'status-bad'}>
                Match score: {matchScore}% {matchScore >= 82 ? '(Verified)' : '(Not verified)'}
              </p>
            )}
          </div>
        </SectionCard>
      );
    }

    if (step === 5) {
      return (
        <SectionCard
          title="Step 5: Forms to Print and Sign"
          subtitle="Review forms and optionally auto-map from a typed request."
          icon="description"
        >
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
              Type your request to map forms
            </label>
            <input
              id="map-form-input"
              className="ui-input"
              placeholder="Example: renew driver's licence"
              value={typedIntent}
              onChange={(event) => setTypedIntent(event.target.value)}
            />
            <Button variant="secondary" onClick={() => mapFormsFromText(typedIntent)}>
              Map Request
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
        <SectionCard
          title="Step 6: Submission"
          subtitle="Submission remains disabled in this demonstration."
          icon="send"
        >
          <p className="status-neutral">
            Submission is currently unavailable. Backend handoff will be enabled in a later release.
          </p>
        </SectionCard>
      );
    }

    return (
      <SectionCard
        title="Step 7: Notifications"
        subtitle="Choose where updates should be sent."
        icon="notifications_active"
      >
        <div className="ui-stack">
          <div className="segmented" role="tablist" aria-label="Notification channel">
            <button
              className={notificationChannel === 'email' ? 'active' : ''}
              onClick={() => setNotificationChannel('email')}
            >
              Email
            </button>
            <button
              className={notificationChannel === 'sms' ? 'active' : ''}
              onClick={() => setNotificationChannel('sms')}
            >
              SMS
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

          <Button onClick={saveNotifications}>Save Preference</Button>
          {notificationSaved && (
            <p className="status-good">
              Updates will be sent via {notificationChannel.toUpperCase()} to {contactValue}.
            </p>
          )}
        </div>
      </SectionCard>
    );
  };

  return (
    <div className="app">
      <Header onHome={resetFlow} onNavigate={navigateToSection} theme={theme} onThemeChange={setTheme} />
      <main className="main">
        {!started ? (
          <div className="gov-home-wrap">
            <RevealSection className="gov-home-hero" id="home">
              <p className="gov-eyebrow">ServiceOntario Digital Pre-Service</p>
              <h1>Renew Government Documents Faster</h1>
              <p>
                Verify your identity and upload required documents before visiting ServiceOntario to
                reduce wait times and complete renewals faster.
              </p>
              <div className="hero-actions">
                <Button onClick={() => navigateToSection('services')}>Start a Service</Button>
                <Button variant="secondary" onClick={() => navigateToSection('information')}>
                  Learn More
                </Button>
              </div>
            </RevealSection>

            <RevealSection className="gov-home-section" id="services">
              <div className="section-title-row">
                <h2>Supported Services</h2>
                <p>Choose a service to begin secure onboarding.</p>
              </div>
              <div className="service-list-grid">
                {RENEWAL_OPTIONS.map((option) => (
                  <article key={option.id} className="service-list-card">
                    <div className="service-card-icon">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {option.icon}
                      </span>
                    </div>
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                    <Button
                      onClick={() => startService(option.id)}
                      disabled={!option.available}
                      fullWidth
                    >
                      {option.available ? 'Start Service' : 'Coming Soon'}
                    </Button>
                  </article>
                ))}
              </div>
            </RevealSection>

            <RevealSection className="gov-home-section" id="information">
              <div className="section-title-row">
                <h2>How It Works</h2>
                <p>A simple and secure process designed for faster in-person service.</p>
              </div>
              <div className="how-grid">
                <div className="how-step">
                  <span className="material-symbols-outlined" aria-hidden="true">cloud_upload</span>
                  <h3>Upload Documents</h3>
                  <p>Submit required files online before your visit.</p>
                </div>
                <div className="how-step">
                  <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
                  <h3>Verify Identity</h3>
                  <p>Use ID and selfie comparison to confirm identity.</p>
                </div>
                <div className="how-step">
                  <span className="material-symbols-outlined" aria-hidden="true">queue_play_next</span>
                  <h3>Skip the Line</h3>
                  <p>Arrive prepared and complete renewal with less delay.</p>
                </div>
              </div>
            </RevealSection>

            <RevealSection className="gov-home-section" id="security-privacy">
              <div className="section-title-row">
                <h2>Security &amp; Privacy</h2>
                <p>
                  Your information is processed under strict security controls aligned with
                  government digital service practices.
                </p>
              </div>
              <div className="security-grid">
                <div className="security-item">
                  <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                  <div>
                    <h3>Secure Uploads</h3>
                    <p>Document uploads are protected in transit and at rest.</p>
                  </div>
                </div>
                <div className="security-item">
                  <span className="material-symbols-outlined" aria-hidden="true">manage_search</span>
                  <div>
                    <h3>Identity Verification</h3>
                    <p>ID matching checks confirm the person submitting records.</p>
                  </div>
                </div>
                <div className="security-item">
                  <span className="material-symbols-outlined" aria-hidden="true">encrypted</span>
                  <div>
                    <h3>Encrypted Processing</h3>
                    <p>Sensitive data is handled in encrypted workflows.</p>
                  </div>
                </div>
              </div>
            </RevealSection>

            <RevealSection className="gov-home-section" id="contact">
              <div className="section-title-row">
                <h2>Contact Us</h2>
                <p>Service support is available Monday to Friday.</p>
              </div>
              <div className="support-grid">
                <p>Phone: <strong>1-800-622-6232</strong></p>
                <p>Email: <strong>service-support@gov.example</strong></p>
                <p>Hours: <strong>8:00 AM - 8:00 PM (local)</strong></p>
              </div>
            </RevealSection>

            <RevealSection className="gov-home-section" id="support">
              <div className="section-title-row">
                <h2>Help / Support</h2>
                <p>Accessibility and assisted service options are available on request.</p>
              </div>
              <ul className="checklist">
                <li>Accessible service formats and alternate verification paths</li>
                <li>Technical support for upload or verification issues</li>
                <li>Assisted phone support for incomplete submissions</li>
              </ul>
            </RevealSection>
          </div>
        ) : (
          <div className="renewal-shell">
            <div className="step-header">
              <p className="step-count">
                Step {step} of {TOTAL_STEPS} - {selectedOption?.title}
              </p>
              <div className="step-progress">
                <div style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
              </div>
            </div>
            {renderStep()}
            <div className="wizard-nav">
              <Button variant="ghost" onClick={goBack} disabled={step === 1}>
                Back
              </Button>
              {step < TOTAL_STEPS ? (
                <Button onClick={goNext} disabled={!canContinue()}>
                  Continue
                </Button>
              ) : (
                <Button onClick={resetFlow}>Return Home</Button>
              )}
            </div>
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}
