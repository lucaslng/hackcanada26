// App.tsx

import { useState } from 'react';
import { Header } from './components/Header';
import type { PortalView } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/wizard/HomePage';
import { WizardShell } from './components/wizard/WizardShell';
import { AdminReviewerPanel } from './components/admin/AdminReviewerPanel';
import { useTheme } from './hooks/useTheme';
import { useWizard } from './hooks/useWizard';
import { getServiceText, getUIStrings } from './constants/i18n';
import type { Language } from './constants/i18n';
import { RENEWAL_OPTIONS } from './data/renewalOptions';
import './App.css';

export default function App() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<PortalView>('canadian-user');
  const [started, setStarted] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const t = getUIStrings(language);
  const { state, actions, reset } = useWizard(selectedOptionId, language);

  const selectedOption = RENEWAL_OPTIONS.find((o) => o.id === selectedOptionId) ?? null;
  const serviceTitle = selectedOption
    ? (getServiceText(selectedOption.id, language)?.title ?? selectedOption.title)
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
    setView('canadian-user');
    setStarted(false);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const changeView = (nextView: PortalView) => {
    setView(nextView);
    if (nextView === 'canadian-user') return;
    setStarted(false);
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
        view={view}
        onViewChange={changeView}
      />
      <main className="main">
        {view === 'admin-reviewer' ? (
          <AdminReviewerPanel />
        ) : (
          <>
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
          </>
        )}
        <Footer t={t} />
      </main>
    </div>
  );
}
