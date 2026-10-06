import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/AuthProvider';
import { WorkspaceProvider } from '@/hooks/WorkspaceProvider';
import { Layout } from '@/components/layout/Layout';
const EdpiCalculatorPage = lazy(() => import('@/pages/tools/EdpiCalculatorPage').then((module) => ({ default: module.EdpiCalculatorPage })));
const Cm360CalculatorPage = lazy(() => import('@/pages/tools/Cm360CalculatorPage').then((module) => ({ default: module.Cm360CalculatorPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const SetupPage = lazy(() => import('@/pages/SetupPage').then((module) => ({ default: module.SetupPage })));
const LandingPage = lazy(() => import('@/pages/LandingPage').then((module) => ({ default: module.LandingPage })));
const SensitivityPage = lazy(() => import('@/pages/SensitivityPage').then((module) => ({ default: module.SensitivityPage })));
const HistoryPage = lazy(() => import('@/pages/HistoryPage').then((module) => ({ default: module.HistoryPage })));
const ToolsPage = lazy(() => import('@/pages/ToolsPage').then((module) => ({ default: module.ToolsPage })));
const GamesPage = lazy(() => import('@/pages/GamesPage').then((module) => ({ default: module.GamesPage })));
const GamePage = lazy(() => import('@/pages/GamePage').then((module) => ({ default: module.GamePage })));
const AccountPage = lazy(() => import('@/pages/AccountPage').then((module) => ({ default: module.AccountPage })));
const PricingPage = lazy(() => import('@/pages/PricingPage').then((module) => ({ default: module.PricingPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage').then((module) => ({ default: module.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage').then((module) => ({ default: module.TermsOfServicePage })));
const SensitivityConverterPage = lazy(() => import('@/pages/tools/SensitivityConverterPage').then((module) => ({ default: module.SensitivityConverterPage })));
const CrosshairGeneratorPage = lazy(() => import('@/pages/tools/CrosshairGeneratorPage').then((module) => ({ default: module.CrosshairGeneratorPage })));
const AimTrainerPage = lazy(() => import('@/pages/tools/AimTrainerPage').then((module) => ({ default: module.AimTrainerPage })));
const TrackingTrainerPage = lazy(() => import('@/pages/tools/TrackingTrainerPage').then((module) => ({ default: module.TrackingTrainerPage })));
const ReactionTimeTestPage = lazy(() => import('@/pages/tools/ReactionTimeTestPage').then((module) => ({ default: module.ReactionTimeTestPage })));
const PollingRateTestPage = lazy(() => import('@/pages/tools/PollingRateTestPage').then((module) => ({ default: module.PollingRateTestPage })));

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
      <BrowserRouter>
        <Suspense fallback={<div role="status" className="flex min-h-screen items-center justify-center bg-base-bg text-ink-muted">Loading GameSet...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sensitivity" element={<SensitivityPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/edpi-calculator" element={<Layout><EdpiCalculatorPage /></Layout>} />
          <Route path="/tools/cm360-calculator" element={<Layout><Cm360CalculatorPage /></Layout>} />
          <Route path="/tools/sensitivity-converter" element={<SensitivityConverterPage />} />
          <Route path="/tools/crosshair-generator" element={<CrosshairGeneratorPage />} />
          <Route path="/tools/aim-trainer" element={<AimTrainerPage />} />
          <Route path="/tools/tracking-trainer" element={<TrackingTrainerPage />} />
          <Route path="/tools/reaction-time-test" element={<ReactionTimeTestPage />} />
          <Route path="/tools/polling-rate-test" element={<PollingRateTestPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:slug" element={<GamePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
