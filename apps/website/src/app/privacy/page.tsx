import type { Metadata } from 'next';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How VarmanAI collects, uses, and protects your data. We scan prompts to keep you safe — we never sell your data.',
};

const LAST_UPDATED = 'June 5, 2026';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-varman-mist mb-3">
            Privacy Policy
          </h1>
          <p className="text-varman-fog text-sm mb-12">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-10 text-varman-fog leading-relaxed">
            <p>
              VarmanAI (&ldquo;VarmanAI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) provides
              software that scans the messages you send to AI assistants such as ChatGPT, Gemini, and Claude to
              block prompt injection, harmful content, and accidental data leaks. This Privacy Policy explains what
              information we collect, how we use it, and the choices you have. We are built for India and designed to
              minimise the data we handle.
            </p>

            <Section title="1. Information We Collect">
              <p className="mb-4">We collect only what we need to provide and improve the service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="text-varman-mist font-medium">Account information.</span> When you create an
                  account, we collect your email address and authentication identifiers managed by our sign-in
                  provider.
                </li>
                <li>
                  <span className="text-varman-mist font-medium">Prompt content for scanning.</span> To detect
                  threats, the text of a prompt is analysed at the moment you send it. Wherever possible this scan
                  runs locally in your browser. When server-side scanning is required, the text is processed transiently
                  and is not used to train models or sold to anyone.
                </li>
                <li>
                  <span className="text-varman-mist font-medium">Usage and scan metadata.</span> We record metadata
                  such as the number of scans, the verdict (safe, suspicious, blocked), threat category, detected
                  language, and timestamps. This powers your dashboard, usage limits, and billing.
                </li>
                <li>
                  <span className="text-varman-mist font-medium">Technical data.</span> Basic technical information
                  such as browser type, extension version, and approximate region, used for security and
                  troubleshooting.
                </li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Information">
              <ul className="list-disc pl-6 space-y-2">
                <li>To scan prompts and block prompt injection, harmful content, and data leaks.</li>
                <li>To provide your dashboard, analytics, and account history.</li>
                <li>To enforce plan limits, process subscriptions, and prevent abuse.</li>
                <li>To maintain the security, reliability, and performance of the service.</li>
                <li>To respond to your support requests and communicate important updates.</li>
              </ul>
            </Section>

            <Section title="3. What We Do Not Do">
              <ul className="list-disc pl-6 space-y-2">
                <li>We do not sell your personal data or prompt content.</li>
                <li>We do not use your prompt content to train AI models.</li>
                <li>We do not show third-party advertising.</li>
                <li>We do not retain full prompt text longer than needed to return a scan result, unless you
                  explicitly enable history.</li>
              </ul>
            </Section>

            <Section title="4. Data Retention">
              <p>
                Account and usage metadata are retained for as long as your account is active. Prompt text used for
                scanning is processed transiently and discarded after a verdict is returned, unless you turn on local
                history, in which case it stays on your device. You can delete your account and associated data at any
                time from your dashboard or by contacting us.
              </p>
            </Section>

            <Section title="5. Data Sharing">
              <p className="mb-4">
                We share data only with service providers who help us operate VarmanAI, under contracts that require
                them to protect your data. These may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication and identity providers.</li>
                <li>Cloud hosting and infrastructure providers.</li>
                <li>Payment processors for subscription billing.</li>
              </ul>
              <p className="mt-4">
                We may also disclose information if required by law or to protect the rights, safety, and security of
                our users and the service.
              </p>
            </Section>

            <Section title="6. Security">
              <p>
                We use encryption in transit, access controls, and the principle of least privilege to protect your
                data. No method of transmission or storage is completely secure, but we work continuously to safeguard
                your information.
              </p>
            </Section>

            <Section title="7. Your Rights">
              <p>
                Depending on your location, you may have the right to access, correct, export, or delete your personal
                data, and to object to or restrict certain processing. To exercise these rights, contact us using the
                details below and we will respond within a reasonable time.
              </p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>
                VarmanAI is not directed to children under 13, and we do not knowingly collect personal data from
                them. If you believe a child has provided us data, please contact us so we can remove it.
              </p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. When we make material changes, we will update the
                &ldquo;Last updated&rdquo; date above and, where appropriate, notify you in the product.
              </p>
            </Section>

            <Section title="10. Contact Us">
              <p>
                If you have questions about this Privacy Policy or your data, reach out via our{' '}
                <a href="/contact" className="text-varman-cyan hover:underline">
                  contact page
                </a>{' '}
                or email us at{' '}
                <a href="mailto:jit.vivek@gmail.com" className="text-varman-cyan hover:underline">
                  jit.vivek@gmail.com
                </a>{' '}
                or{' '}
                <a href="mailto:vivekkumar@resee.app" className="text-varman-cyan hover:underline">
                  vivekkumar@resee.app
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-varman-mist mb-4">{title}</h2>
      {children}
    </div>
  );
}
