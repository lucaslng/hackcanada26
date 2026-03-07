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
          Online Document Submission Portal
        </h1>
        <p className="hero-body">
          Submit required documents securely for participating Service Canada programs. Complete
          identity verification and upload supporting forms in one guided process.
        </p>
        <div className="hero-cta">
          <a href="#services" className="btn-primary">
            Select a Service
          </a>
          <a
            href="https://offices.service.canada.ca/en/Search"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            Find a Service Centre
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
