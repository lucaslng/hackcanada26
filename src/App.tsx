// App.tsx

import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/wizard/HomePage';
import { WizardShell } from './components/wizard/WizardShell';
import { useTheme } from './hooks/useTheme';
import { useWizard } from './hooks/useWizard';
import { UI, SERVICE_TEXT } from './constants/i18n';
import type { Language } from './constants/i18n';
import { RENEWAL_OPTIONS } from './data/renewalOptions';
import './App.css';

export default function App() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>('en');
  const [started, setStarted] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const t = UI[language];
  const { state, actions, reset } = useWizard(selectedOptionId, language);

  const selectedOption = RENEWAL_OPTIONS.find((o) => o.id === selectedOptionId) ?? null;
  const serviceTitle = selectedOption
    ? (SERVICE_TEXT[selectedOption.id]?.[language]?.title ?? selectedOption.title)
    : '';

  const startService = (optionId: string) => {
    setSelectedOptionId(optionId);
    reset();
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFlow = () => {
    setStarted(false);
    setSelectedOptionId(null);
    reset();
  };

  const navigateToSection = (sectionId: string) => {
    setStarted(false);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <div className="app">
      <Header
        onHome={resetFlow}
        onNavigate={navigateToSection}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        theme={theme}
        onThemeChange={setTheme}
      />
      <main className="main">
        {started ? (
          <WizardShell
            t={t}
            state={state}
            actions={actions}
            serviceTitle={serviceTitle}
            language={language}
            onExit={resetFlow}
          />
        ) : (
          <HomePage
            t={t}
            language={language}
            onStartService={startService}
            onNavigate={navigateToSection}
          />
        )}
        <Footer language={language} />
      </main>
    </div>
  );
}
