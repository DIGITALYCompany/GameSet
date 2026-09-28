import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { LandingPage } from '@/pages/LandingPage';
import { SensitivityPage } from '@/pages/SensitivityPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ToolsPage } from '@/pages/ToolsPage';
import { AuthPage } from '@/pages/AuthPage';
import { AccountPage } from '@/pages/AccountPage';
import { AboutPage } from '@/pages/AboutPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '@/pages/TermsOfServicePage';
import { EdpiCalculatorPage } from '@/pages/tools/EdpiCalculatorPage';
import { Cm360CalculatorPage } from '@/pages/tools/Cm360CalculatorPage';
import { SensitivityConverterPage } from '@/pages/tools/SensitivityConverterPage';
import { CrosshairGeneratorPage } from '@/pages/tools/CrosshairGeneratorPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <LandingPage />
            </Layout>
          } />
          <Route path="/sensitivity" element={<SensitivityPage />} />
          <Route path="/tools" element={
            <Layout>
              <ToolsPage />
            </Layout>
          } />
          <Route path="/tools/edpi-calculator" element={
            <Layout>
              <EdpiCalculatorPage />
            </Layout>
          } />
          <Route path="/tools/cm360-calculator" element={
            <Layout>
              <Cm360CalculatorPage />
            </Layout>
          } />
          <Route path="/tools/sensitivity-converter" element={
            <Layout>
              <SensitivityConverterPage />
            </Layout>
          } />
          <Route path="/tools/crosshair-generator" element={
            <Layout>
              <CrosshairGeneratorPage />
            </Layout>
          } />
          <Route path="/history" element={
            <Layout>
              <HistoryPage />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <SettingsPage />
            </Layout>
          } />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={
            <Layout>
              <AboutPage />
            </Layout>
          } />
          <Route path="/privacy" element={
            <Layout>
              <PrivacyPolicyPage />
            </Layout>
          } />
          <Route path="/terms" element={
            <Layout>
              <TermsOfServicePage />
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
