import { LegalPage } from '@/components/legal/LegalPage';

export function AboutPage() {
  return (
    <LegalPage title="About" lastUpdated="October 3, 2026">
      <p>
        GAMESET is a gaming tools platform built by DIGITALY Games. Our mission
        is to give FPS players practical, well-designed tools to optimize their
        gameplay settings and performance.
      </p>

      <h2>Our Approach</h2>
      <p>
        We believe gaming tools should be fast, focused, and genuinely useful.
        GAMESET is not a calculator website. It is the beginning of a
        complete gaming utilities platform. We started with the Sensitivity
        Finder because finding the right sensitivity is one of the most
        impactful things a player can do for their aim.
      </p>

      <h2>What's Available Now</h2>
      <ul>
        <li>Sensitivity Finder: a progressive comparison process to find your ideal sensitivity</li>
        <li>Sensitivity Converter: carry your aim feel between games, with eDPI and cm/360 included</li>
        <li>Flick Trainer and Tracking Trainer: timed drills for the two core aim skills</li>
        <li>Reaction Time Test: measure your raw reflexes</li>
        <li>Mouse Polling Rate Test: check that your mouse reports as fast as it should</li>
        <li>Crosshair Generator: design and export custom crosshairs for any game</li>
        <li>Test history: all results saved locally on your device</li>
        <li>Cloud sync: create an account to sync results across devices</li>
        <li>Game selection: support for 8 popular FPS titles</li>
      </ul>

      <h2>What's Coming</h2>
      <ul>
        <li>More aim drills</li>
        <li>More supported games</li>
        <li>Online payments for Pro and Elite plans</li>
      </ul>

      <h2>Privacy First</h2>
      <p>
        Every core tool works without an account, and your test history is
        stored locally on your device. Creating an account is optional and
        only used to sync your results and followed games across devices. You
        can read our full{' '}
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
