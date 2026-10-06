import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

const FAQS = [
  {
    q: 'Can I use GAMESET without paying?',
    a: 'Yes. The Free plan includes the Sensitivity Finder, the converter, the calculators, the crosshair generator and every training drill. You only need an account to save results to the cloud and follow games.',
  },
  {
    q: 'When can I upgrade?',
    a: 'Online payments are launching soon. Create a free account now and your history and followed games will carry over the moment you upgrade.',
  },
  {
    q: 'How do I cancel?',
    a: 'Anytime, from your account page. Premium features stay active until the end of the billing period, then your account goes back to Free without losing your data.',
  },
  {
    q: 'What payment methods will you accept?',
    a: 'All major cards through a secure payment provider. Your card details are never stored on our servers.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'If you are not satisfied within 7 days of your first subscription, contact hello@digitaly.games for a full refund.',
  },
];

export function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors duration-150 hover:bg-white/[0.02] focus-ring"
            >
              <span className="font-display text-base font-medium text-ink">{faq.q}</span>
              <Plus
                className={cn(
                  'h-4 w-4 shrink-0 text-ink-dim transition-transform duration-300 ease-smooth',
                  isOpen && 'rotate-45 text-accent-purple-light'
                )}
              />
            </button>
            <div className={cn('grid transition-all duration-300 ease-smooth', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-ink-muted">{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
