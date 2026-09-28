import { Layout } from '@/components/layout/Layout';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-ink-dim">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-8 [&_p]:text-ink-muted [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:text-accent-purple [&_a]:underline [&_a]:decoration-accent-purple/40 [&_a:hover]:decoration-accent-purple">
          {children}
        </div>
      </div>
    </Layout>
  );
}
