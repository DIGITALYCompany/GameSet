import { LegalPage } from '@/components/legal/LegalPage';

export function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="September 28, 2026">
      <p>
        This Privacy Policy describes how DIGITALY Games ("we", "us", or "our")
        handles information when you use GAMESET (the "Service"). By using the
        Service, you agree to the practices described in this policy.
      </p>

      <h2>Information We Collect</h2>
      <p>
        GAMESET is designed to work primarily with data stored locally in your
        browser. The following information stays on your device unless you
        explicitly choose to share it:
      </p>
      <ul>
        <li>Sensitivity test results and history</li>
        <li>Selected game and user preferences</li>
        <li>Settings such as default rounds and display preferences</li>
      </ul>
      <p>
        We do not require you to create an account or provide personal
        information such as your name or email address to use the core features
        of the Service.
      </p>

      <h2>Local Storage</h2>
      <p>
        The Service uses your browser's local storage to save test history,
        preferences, and settings. This data never leaves your device. You can
        clear all local data at any time from the Settings page or through your
        browser's site data controls.
      </p>

      <h2>Analytics</h2>
      <p>
        We do not currently use third-party analytics or tracking services. If
        this changes in the future, we will update this Privacy Policy and
        provide clear notice within the Service.
      </p>

      <h2>Cookies</h2>
      <p>
        The Service does not use cookies for tracking or advertising purposes.
        Local storage is used solely to persist your preferences and test data
        between sessions.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        The Service may reference or link to third-party websites or services.
        We are not responsible for the privacy practices or content of those
        external services. We encourage you to review their privacy policies.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        The Service is not directed at children under the age of 13. We do not
        knowingly collect personal information from children. If you believe a
        child has provided information to us, please contact us so we can take
        appropriate action.
      </p>

      <h2>Data Retention</h2>
      <p>
        Because your data is stored locally on your device, you have full
        control over its retention. Clearing your browser data or using the
        "Clear Local Data" option in Settings will permanently remove all
        stored information.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated revision date. We encourage you to
        review this page periodically.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions or concerns about this Privacy Policy, you can
        contact us at{' '}
        <a href="mailto:legal@digitaly.games">legal@digitaly.games</a>.
      </p>
    </LegalPage>
  );
}
