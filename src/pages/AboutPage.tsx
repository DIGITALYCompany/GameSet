import { LegalPage } from '@/components/legal/LegalPage';

export function AboutPage() {
  return (
    <LegalPage title="About" lastUpdated="September 28, 2026">
      <p>
        GAMESET is a gaming tools platform built by DIGITALY Games. Our mission
        is to give FPS players practical, well-designed tools to optimize their
        gameplay settings and performance.
      </p>

      <h2>Our Approach</h2>
      <p>
        We believe gaming tools should be fast, focused, and genuinely useful.
        GAMESET is not a calculator website — it is the beginning of a
        complete gaming utilities platform. We started with the Sensitivity
        Finder because finding the right sensitivity is one of the most
        impactful things a player can do for their aim.
      </p>

      <h2>What's Available Now</h2>
      <ul>
        <li>Sensitivity Finder — a progressive comparison process to find your ideal sensitivity</li>
        <li>Test history — all results saved locally on your device</li>
        <li>Game selection — support for 8 popular FPS titles</li>
      </ul>

      <h2>What's Coming</h2>
      <ul>
        <li>Aim Trainer</li>
        <li>Sensitivity Converter</li>
        <li>eDPI Calculator</li>
        <li>cm/360 Calculator</li>
        <li>FPS Benchmark</li>
        <li>Input Latency Test</li>
        <li>Crosshair Generator</li>
        <li>Player Profile and Statistics</li>
      </ul>

      <h2>Privacy First</h2>
      <p>
        GAMESET stores your data locally on your device. We do not require an
        account, and we do not collect personal information for the core
        features. You can read our full{' '}
        <a href="/privacy">Privacy Policy</a> for details.
      </p>

      <h2>Legal</h2>
      <p>
        GAMESET is a product of DIGITALY Games. Game names and trademarks
        referenced in the Service are the property of their respective owners
        and are used for identification purposes only. DIGITALY Games is not
        affiliated with or endorsed by any game publisher.
      </p>
      <p>
        Please review our <a href="/terms">Terms of Service</a> for the full
        legal agreement governing your use of the Service.
      </p>

      <h2>Contact</h2>
      <p>
        You can reach us at{' '}
        <a href="mailto:hello@digitaly.games">hello@digitaly.games</a>.
      </p>
    </LegalPage>
  );
}
