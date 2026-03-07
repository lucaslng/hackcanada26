// App.tsx

import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServiceGrid } from './components/ServiceGrid';
import { ServiceView } from './components/ServiceView';
import { ConfirmationView } from './components/ConfirmationView';
import { Footer } from './components/Footer';
import { SERVICES } from './data/services';
import type { Service, ServiceId, UploadedFile, View } from './types';
import './App.css';

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
            <Footer />
          </>
        )}
        {view === 'service' && selectedService && (
          <ServiceView
            service={selectedService}
            onBack={handleHome}
            onSubmit={handleSubmit}
          />
        )}
        {view === 'confirmation' && selectedService && (
          <ConfirmationView
            service={selectedService}
            files={submittedFiles}
            onHome={handleHome}
          />
        )}
      </main>
    </div>
  );
}