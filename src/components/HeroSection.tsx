// HeroSection.tsx

import { SERVICES } from '../data/services';
import type { ServiceId } from '../types';

interface HeroSectionProps {
  onSelect: (id: ServiceId) => void;
}

export function HeroSection({ onSelect }: HeroSectionProps) {
  return (
    <div className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Service Canada Online</p>
        <h1 className="hero-title">
          Submit Your Documents
          <br />
          <em>From Home</em>
        </h1>
        <p className="hero-body">
          Skip the trip to your local Service Canada Centre. Upload your documents securely for the
          service you need — we'll process your application and contact you by mail or phone.
        </p>
        <div className="hero-cta">
          <a href="#services" className="btn-primary">
            Choose a Service
          </a>
          <a
            href="https://offices.service.canada.ca/en/Search"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            Find a Centre Near You ↗
          </a>
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="hero-card-stack">
          {SERVICES.slice(0, 3).map((s, i) => (
            <button
              key={s.id}
              className="hero-mini-card"
              style={{ '--card-color': s.color, '--card-index': i } as React.CSSProperties}
              onClick={() => onSelect(s.id)}
            >
              <span className="hero-mini-icon">{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}