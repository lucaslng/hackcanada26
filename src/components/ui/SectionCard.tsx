import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
}

export function SectionCard({ title, subtitle, icon, children }: SectionCardProps) {
  return (
    <section className="ui-card">
      <div className="ui-card__head">
        <h2>
          {icon && <span className="material-symbols-outlined ui-card__icon" aria-hidden="true">{icon}</span>}
          <span>{title}</span>
        </h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
