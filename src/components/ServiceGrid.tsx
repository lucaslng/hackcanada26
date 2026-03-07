// ServiceGrid.tsx

import { SERVICES } from '../data/services';
import type { ServiceId } from '../types';

interface ServiceGridProps {
  onSelect: (id: ServiceId) => void;
}

export function ServiceGrid({ onSelect }: ServiceGridProps) {
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
                <span className="service-card-docs">
                  {service.docs.filter((d) => d.required).length} required docs
                </span>
              </div>
            </div>
            <span className="service-card-arrow">→</span>
          </button>
        ))}
      </div>
    </section>
  );
}