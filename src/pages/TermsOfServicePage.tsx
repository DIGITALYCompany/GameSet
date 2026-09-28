import { LegalPage } from '@/components/legal/LegalPage';

export function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="September 28, 2026">
      <p>
        These Terms of Service ("Terms") govern your use of GAMESET (the
        "Service"), operated by DIGITALY Games ("we", "us", or "our"). By
        accessing or using the Service, you agree to be bound by these Terms.
      </p>

      <h2>Acceptance of Terms</h2>
      <p>
        By using the Service, you confirm that you have read, understood, and
        agree to be bound by these Terms. If you do not agree with any part of
        these Terms, you should not use the Service.
      </p>

      <h2>Description of Service</h2>
      <p>
        GAMESET is a gaming tools platform that currently provides a Sensitivity
        Finder for FPS players. Additional tools and features may be added over
        time. The Service is provided as a beta product and may be updated,
        modified, or discontinued at any time without notice.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 13 years old to use the Service. By using the
        Service, you represent and warrant that you meet this age requirement
        and are legally able to enter into a binding agreement.
      </p>

      <h2>Use of the Service</h2>
      <p>You agree to use the Service only for lawful purposes. You agree not to:</p>
      <ul>
        <li>Use the Service in any way that violates applicable laws or regulations</li>
        <li>Attempt to disrupt, overload, or gain unauthorized access to the Service</li>
        <li>Use automated scripts or bots to interact with the Service in a manner that degrades performance</li>
        <li>Reproduce, copy, or distribute any part of the Service without permission</li>
      </ul>

      <h2>Your Data</h2>
      <p>
        Your test results, preferences, and settings are stored locally on your
        device. You are responsible for managing your own data. We are not
        liable for any loss of data stored in your browser's local storage.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        The Service, including its design, branding, and content, is the
        intellectual property of DIGITALY Games. Game names and trademarks
        referenced in the Service are the property of their respective owners
        and are used for identification purposes only. DIGITALY Games is not
        affiliated with or endorsed by any game publisher.
      </p>

      <h2>Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as is" and "as available" without warranties
        of any kind, either express or implied. We do not guarantee that the
        Service will be error-free, uninterrupted, or that sensitivity
        recommendations will improve your gameplay. Your use of the Service is
        at your own risk.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, DIGITALY Games shall not be
        liable for any indirect, incidental, special, or consequential damages
        arising from your use of or inability to use the Service.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Changes will be posted on
        this page with an updated revision date. Continued use of the Service
        after changes are posted constitutes your acceptance of the revised
        Terms.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time,
        without notice or liability, for any reason. Since your data is stored
        locally, termination of access does not result in deletion of your
        data — you control that through your browser.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about these Terms, you can contact us at{' '}
        <a href="mailto:legal@digitaly.games">legal@digitaly.games</a>.
      </p>
    </LegalPage>
  );
}
