// App.tsx

import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServiceGrid } from './components/ServiceGrid';
import { ServiceView } from './components/ServiceView';
import { ConfirmationView } from './components/ConfirmationView';
import { Footer } from './components/Footer';
import { SERVICES } from './data/services';
import type { Service, ServiceId, UploadedFile, View } from './types';
import './App.css';

interface SubmissionResult {
  files: UploadedFile[];
  referenceNumber: string;
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const handleSelectService = (id: ServiceId) => {
    const svc = SERVICES.find((s) => s.id === id)!;
    setSelectedService(svc);
    setView('service');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (files: UploadedFile[], referenceNumber: string) => {
    setSubmissionResult({ files, referenceNumber });
    setView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    setView('home');
    setSelectedService(null);
    setSubmissionResult(null);
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
            <Footer />
          </>
        )}

        {view === 'service' && selectedService && (
          <ErrorBoundary>
            <ServiceView
              service={selectedService}
              onBack={handleHome}
              onSubmit={handleSubmit}
            />
          </ErrorBoundary>
        )}

        {view === 'confirmation' && selectedService && submissionResult && (
          <ConfirmationView
            service={selectedService}
            files={submissionResult.files}
            referenceNumber={submissionResult.referenceNumber}
            onHome={handleHome}
          />
        )}
      </main>
    </div>
  );
}