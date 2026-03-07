// App.tsx

import { useState } from 'react';
import { AdvancedImage, placeholder, lazyload } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { auto } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';
import { cld } from './cloudinary/config';
import { UploadWidget } from './cloudinary/UploadWidget';
import type { CloudinaryUploadResult } from './cloudinary/UploadWidget';
import './App.css';

type ServiceId =
  | 'employment-insurance'
  | 'cpp'
  | 'old-age-security'
  | 'sin'
  | 'child-benefit'
  | 'passport';

interface RequiredDoc {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

interface Service {
  id: ServiceId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  processingTime: string;
  description: string;
  docs: RequiredDoc[];
}

interface UploadedFile {
  docId: string;
  docLabel: string;
  publicId: string;
  secureUrl: string;
}

const SERVICES: Service[] = [
  {
    id: 'employment-insurance',
    title: 'Employment Insurance',
    subtitle: 'EI Benefits',
    icon: '💼',
    color: '#0E4D92',
    processingTime: '28 days',
    description:
      'Apply for Employment Insurance benefits if you have lost your job through no fault of your own, or if you are unable to work due to illness, injury, or pregnancy.',
    docs: [
      { id: 'roe', label: 'Record of Employment (ROE)', description: 'Issued by your employer — all ROEs from the past 52 weeks', required: true },
      { id: 'photo-id', label: 'Government-Issued Photo ID', description: 'Valid passport, driver\'s licence, or PR card', required: true },
      { id: 'sin-doc', label: 'Social Insurance Number (SIN)', description: 'SIN card or letter from Service Canada confirming your SIN', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque or bank account details for payment', required: false },
    ],
  },
  {
    id: 'cpp',
    title: 'Canada Pension Plan',
    subtitle: 'CPP Retirement Pension',
    icon: '🏦',
    color: '#2D6A4F',
    processingTime: '6–12 weeks',
    description:
      'Apply for your CPP retirement pension, disability benefits, or survivor benefits. The amount you receive is based on your contributions and the age you start your pension.',
    docs: [
      { id: 'photo-id', label: 'Government-Issued Photo ID', description: 'Passport, driver\'s licence, or PR card', required: true },
      { id: 'sin-doc', label: 'Social Insurance Number (SIN)', description: 'Required to access your contribution history', required: true },
      { id: 'birth-cert', label: 'Proof of Date of Birth', description: 'Birth certificate, baptismal record, or passport', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque for payment processing', required: false },
    ],
  },
  {
    id: 'old-age-security',
    title: 'Old Age Security',
    subtitle: 'OAS Pension',
    icon: '🌿',
    color: '#6B3FA0',
    processingTime: '6 months',
    description:
      'Old Age Security is a monthly payment available to Canadians 65 years of age and older. You may also apply for the Guaranteed Income Supplement if you have a low income.',
    docs: [
      { id: 'photo-id', label: 'Government-Issued Photo ID', description: 'Passport, driver\'s licence, or PR card', required: true },
      { id: 'birth-cert', label: 'Proof of Age', description: 'Birth certificate or passport showing date of birth', required: true },
      { id: 'residency', label: 'Proof of Canadian Residency', description: 'Documents showing years lived in Canada (tax returns, utility bills)', required: true },
      { id: 'banking', label: 'Direct Deposit Information', description: 'Void cheque or banking details', required: false },
    ],
  },
  {
    id: 'sin',
    title: 'Social Insurance Number',
    subtitle: 'New SIN Application',
    icon: '🪪',
    color: '#B5451B',
    processingTime: '20 business days',
    description:
      'Apply for a Social Insurance Number (SIN), which you need to work in Canada or to receive government benefits and services. Canadian citizens, permanent residents, and temporary residents may apply.',
    docs: [
      { id: 'primary-id', label: 'Primary Identity Document', description: 'Canadian birth certificate, Canadian passport, or Certificate of Canadian Citizenship', required: true },
      { id: 'immigration', label: 'Immigration Document (if applicable)', description: 'Permanent Resident card, Study/Work permit, or Confirmation of PR', required: false },
      { id: 'address-proof', label: 'Proof of Canadian Address', description: 'Utility bill, bank statement, or government correspondence dated within 12 months', required: true },
    ],
  },
  {
    id: 'child-benefit',
    title: 'Canada Child Benefit',
    subtitle: 'CCB Application',
    icon: '👶',
    color: '#C8962A',
    processingTime: '8 weeks',
    description:
      'The Canada Child Benefit is a tax-free monthly payment made to eligible families to help with the cost of raising children under 18 years of age.',
    docs: [
      { id: 'child-birth-cert', label: 'Child\'s Birth Certificate', description: 'Official provincial/territorial birth certificate for each child', required: true },
      { id: 'parent-id', label: 'Parent/Guardian Photo ID', description: 'Passport or driver\'s licence for the primary caregiver', required: true },
      { id: 'custody', label: 'Custody Documents (if applicable)', description: 'Court order or written agreement if sharing custody', required: false },
      { id: 'residency', label: 'Proof of Residency', description: 'Documents confirming you live in Canada (lease, utility bill)', required: true },
    ],
  },
  {
    id: 'passport',
    title: 'Passport Application',
    subtitle: 'Adult & Child Passports',
    icon: '✈️',
    color: '#C8102E',
    processingTime: '10–15 business days',
    description:
      'Apply for a Canadian passport for travel abroad. Adults may apply for a 5-year or 10-year passport. Children under 16 receive a 5-year passport.',
    docs: [
      { id: 'citizenship', label: 'Proof of Canadian Citizenship', description: 'Birth certificate or Certificate of Canadian Citizenship (not a passport)', required: true },
      { id: 'photo-id', label: 'Government-Issued Photo ID', description: 'Driver\'s licence or provincial/territorial ID card', required: true },
      { id: 'passport-photos', label: 'Passport Photos (2 copies)', description: 'Two identical 50×70 mm colour photos taken within the last 6 months', required: true },
      { id: 'guarantor', label: 'Guarantor Declaration', description: 'Signed form from a Canadian citizen who has known you for 2+ years', required: true },
      { id: 'old-passport', label: 'Most Recent Passport (if renewing)', description: 'Previous Canadian passport if you are renewing', required: false },
    ],
  },
];

type View = 'home' | 'service' | 'confirmation';

function MapleLeaf() {
  return (
    <svg className="maple-leaf" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path d="M50 5 L57 32 L85 30 L68 48 L78 75 L50 60 L22 75 L32 48 L15 30 L43 32 Z" />
    </svg>
  );
}

function Header({ onHome }: { onHome: () => void }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="wordmark" onClick={onHome} aria-label="Go to home page">
          <span className="flag-bar">
            <MapleLeaf />
          </span>
          <span className="wordmark-text">
            <span className="wordmark-canada">Canada</span>
            <span className="wordmark-service">Service Canada — Document Portal</span>
          </span>
        </button>
        <nav className="header-nav">
          <a href="https://www.canada.ca/en/services/benefits.html" target="_blank" rel="noreferrer">Benefits</a>
          <a href="https://www.canada.ca/en.html" target="_blank" rel="noreferrer">Canada.ca</a>
        </nav>
      </div>
    </header>
  );
}

function HeroSection({ onSelect }: { onSelect: (id: ServiceId) => void }) {
  return (
    <div className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Service Canada Online</p>
        <h1 className="hero-title">Submit Your Documents<br /><em>From Home</em></h1>
        <p className="hero-body">
          Skip the trip to your local Service Canada Centre. Upload your documents securely for the
          service you need — we'll process your application and contact you by mail or phone.
        </p>
        <div className="hero-cta">
          <a href="#services" className="btn-primary">Choose a Service</a>
          <a href="https://www.canada.ca/en/employment-social-development/corporate/contact/sin.html" target="_blank" rel="noreferrer" className="btn-ghost">Find a Centre Near You ↗</a>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="hero-card-stack">
          {SERVICES.slice(0, 3).map((s, i) => (
            <button key={s.id} className="hero-mini-card" style={{ '--card-color': s.color, '--card-index': i } as React.CSSProperties} onClick={() => onSelect(s.id)}>
              <span className="hero-mini-icon">{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceGrid({ onSelect }: { onSelect: (id: ServiceId) => void }) {
  return (
    <section id="services" className="service-grid-section">
      <div className="section-header">
        <h2>Available Services</h2>
        <p>Select the service you need to begin uploading your documents.</p>
      </div>
      <div className="service-grid">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            className="service-card"
            style={{ '--service-color': service.color } as React.CSSProperties}
            onClick={() => onSelect(service.id)}
          >
            <div className="service-card-icon">{service.icon}</div>
            <div className="service-card-body">
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-subtitle">{service.subtitle}</p>
              <div className="service-card-meta">
                <span className="service-card-time">⏱ {service.processingTime}</span>
                <span className="service-card-docs">{service.docs.filter(d => d.required).length} required docs</span>
              </div>
            </div>
            <span className="service-card-arrow">→</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ServiceView({
  service,
  onBack,
  onSubmit,
}: {
  service: Service;
  onBack: () => void;
  onSubmit: (files: UploadedFile[]) => void;
}) {
  const [uploads, setUploads] = useState<Record<string, UploadedFile>>({});
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const requiredDocIds = service.docs.filter((d) => d.required).map((d) => d.id);
  const uploadedIds = Object.keys(uploads);
  const requiredUploaded = requiredDocIds.every((id) => uploadedIds.includes(id));

  const handleUploadSuccess = (result: CloudinaryUploadResult, docId: string, docLabel: string) => {
    setUploads((prev) => ({
      ...prev,
      [docId]: { docId, docLabel, publicId: result.public_id, secureUrl: result.secure_url },
    }));
    setActiveDoc(null);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(Object.values(uploads));
    }, 1200);
  };

  const completedCount = uploadedIds.length;
  const totalCount = service.docs.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="service-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Services
      </button>

      <div className="service-view-header" style={{ '--service-color': service.color } as React.CSSProperties}>
        <div className="service-view-icon">{service.icon}</div>
        <div>
          <p className="service-view-eyebrow">{service.subtitle}</p>
          <h1 className="service-view-title">{service.title}</h1>
          <p className="service-view-desc">{service.description}</p>
        </div>
        <div className="service-view-meta">
          <div className="meta-pill">⏱ Processing time: {service.processingTime}</div>
        </div>
      </div>

      <div className="service-view-body">
        <div className="upload-col">
          <div className="progress-bar-wrap">
            <div className="progress-label">
              <span>{completedCount} of {totalCount} documents uploaded</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%`, '--service-color': service.color } as React.CSSProperties} />
            </div>
          </div>

          <div className="doc-list">
            {service.docs.map((doc) => {
              const uploaded = uploads[doc.id];
              const isActive = activeDoc === doc.id;
              const uploadedImage = uploaded ? cld.image(uploaded.publicId).resize(fill().width(300).height(200)).delivery(format(auto())).delivery(quality(autoQuality())) : null;

              return (
                <div key={doc.id} className={`doc-item ${uploaded ? 'uploaded' : ''} ${isActive ? 'active' : ''}`}>
                  <div className="doc-item-header">
                    <div className="doc-check">{uploaded ? '✓' : doc.required ? '●' : '○'}</div>
                    <div className="doc-info">
                      <div className="doc-label">
                        {doc.label}
                        {doc.required && <span className="required-badge">Required</span>}
                      </div>
                      <div className="doc-description">{doc.description}</div>
                    </div>
                    {uploaded ? (
                      <button className="doc-replace-btn" onClick={() => setActiveDoc(isActive ? null : doc.id)}>
                        {isActive ? 'Cancel' : 'Replace'}
                      </button>
                    ) : (
                      <button className="doc-upload-btn" style={{ '--service-color': service.color } as React.CSSProperties} onClick={() => setActiveDoc(isActive ? null : doc.id)}>
                        {isActive ? 'Cancel' : '+ Upload'}
                      </button>
                    )}
                  </div>

                  {uploaded && !isActive && uploadedImage && (
                    <div className="doc-preview">
                      <AdvancedImage
                        cldImg={uploadedImage}
                        plugins={[placeholder({ mode: 'blur' }), lazyload()]}
                        alt={doc.label}
                        className="doc-preview-img"
                      />
                      <span className="doc-preview-label">✓ Uploaded</span>
                    </div>
                  )}

                  {isActive && (
                    <div className="doc-upload-panel">
                      <UploadWidget
                        onUploadSuccess={(result) => handleUploadSuccess(result, doc.id, doc.label)}
                        onUploadError={(err) => alert(`Upload failed: ${err.message}`)}
                        buttonText={`Upload ${doc.label}`}
                      />
                      <p className="upload-hint">Accepted: JPEG, PNG, PDF, HEIC — Max 10 MB per file</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="service-sidebar">
          <div className="sidebar-card">
            <h3>Before You Submit</h3>
            <ul className="checklist">
              <li>All documents must be legible and unobstructed</li>
              <li>Photos must show all four corners of the document</li>
              <li>Files must be under 10 MB each</li>
              <li>Accepted formats: JPEG, PNG, PDF, HEIC</li>
            </ul>
          </div>
          <div className="sidebar-card sidebar-card--privacy">
            <h3>🔒 Privacy Notice</h3>
            <p>Your documents are collected under the authority of the <em>Department of Employment and Social Development Act</em> and are protected under the <em>Privacy Act</em>. Documents are encrypted in transit and at rest.</p>
          </div>
          <div className="sidebar-card">
            <h3>Need Help?</h3>
            <p>Call <strong>1-800-O-Canada</strong> (1-800-622-6232) Monday–Friday, 8am–8pm local time.</p>
          </div>
        </aside>
      </div>

      <div className="submit-bar">
        {!requiredUploaded && (
          <p className="submit-warning">⚠ Please upload all required documents before submitting.</p>
        )}
        <button
          className="btn-submit"
          style={{ '--service-color': service.color } as React.CSSProperties}
          disabled={!requiredUploaded || submitting}
          onClick={handleSubmit}
        >
          {submitting ? (
            <span className="submitting-dots">Submitting<span>.</span><span>.</span><span>.</span></span>
          ) : (
            'Submit Application →'
          )}
        </button>
      </div>
    </div>
  );
}

function ConfirmationView({
  service,
  files,
  onHome,
}: {
  service: Service;
  files: UploadedFile[];
  onHome: () => void;
}) {
  const refNumber = `SC-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="confirmation-view">
      <div className="confirmation-card">
        <div className="confirmation-icon" style={{ '--service-color': service.color } as React.CSSProperties}>
          ✓
        </div>
        <h1 className="confirmation-title">Application Submitted</h1>
        <p className="confirmation-subtitle">
          Your documents for <strong>{service.title}</strong> have been received.
        </p>
        <div className="confirmation-ref">
          <span className="ref-label">Reference Number</span>
          <span className="ref-number">{refNumber}</span>
          <span className="ref-note">Keep this number for your records.</span>
        </div>

        <div className="confirmation-docs">
          <h3>Documents Received ({files.length})</h3>
          <ul>
            {files.map((f) => (
              <li key={f.docId}>
                <span className="conf-check">✓</span> {f.docLabel}
              </li>
            ))}
          </ul>
        </div>

        <div className="confirmation-next">
          <h3>What Happens Next?</h3>
          <ol>
            <li>A Service Canada officer will review your documents within <strong>{service.processingTime}</strong>.</li>
            <li>You will be contacted by mail or phone if additional information is needed.</li>
            <li>You can check the status of your application by calling <strong>1-800-622-6232</strong> with your reference number.</li>
          </ol>
        </div>

        <button className="btn-home" onClick={onHome}>
          Return to Services
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submittedFiles, setSubmittedFiles] = useState<UploadedFile[]>([]);

  const handleSelectService = (id: ServiceId) => {
    const svc = SERVICES.find((s) => s.id === id)!;
    setSelectedService(svc);
    setView('service');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (files: UploadedFile[]) => {
    setSubmittedFiles(files);
    setView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    setView('home');
    setSelectedService(null);
    setSubmittedFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header onHome={handleHome} />
      <main className="main">
        {view === 'home' && (
          <>
            <HeroSection onSelect={handleSelectService} />
            <ServiceGrid onSelect={handleSelectService} />
            <footer className="site-footer">
              <div className="footer-inner">
                <MapleLeaf />
                <span>© Government of Canada · Service Canada Document Portal Demo</span>
                <span className="footer-disclaimer">This is a demonstration application. Not an official Government of Canada service.</span>
              </div>
            </footer>
          </>
        )}
        {view === 'service' && selectedService && (
          <ServiceView service={selectedService} onBack={handleHome} onSubmit={handleSubmit} />
        )}
        {view === 'confirmation' && selectedService && (
          <ConfirmationView service={selectedService} files={submittedFiles} onHome={handleHome} />
        )}
      </main>
    </div>
  );
}