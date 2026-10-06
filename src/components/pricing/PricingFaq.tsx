import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

const FAQS = [
  { q: 'Can I use GAMESET without paying?', a: 'Yes. The sensitivity tools, calculators, crosshair generator and training drills are available for free. You can start without a payment card.' },
  { q: 'Is Premium available now?', a: 'Not yet. Premium and online payments are in development. You can use the free tools and create your account today.' },
  { q: 'Are the dashboard numbers my results?', a: 'No. The preview uses illustrative data to show the planned experience. The progress dashboard, setup comparisons and personalized routines are not available yet.' },
  { q: 'What is planned for Premium?', a: 'A progress dashboard, before-and-after setup comparisons, personalized training routines, multiple setups per game and weekly reports. These features are in development; the final offer will be confirmed at launch.' },
  { q: 'How much will Premium cost?', a: 'Premium will cost $0.99 per month at launch. Creating a free account today does not start a subscription or charge you.' },
];

export function PricingFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q}>
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={`premium-faq-${i}`} className="focus-ring flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]">
              <span className="font-display text-base font-medium text-ink">{faq.q}</span>
              <Plus className={cn('h-4 w-4 shrink-0 text-ink-dim transition-transform duration-300 motion-reduce:transition-none', isOpen && 'rotate-45 text-amber-200')} />
            </button>
            <div id={`premium-faq-${i}`} aria-hidden={!isOpen} className={cn('grid transition-all duration-300 motion-reduce:transition-none', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden"><p className="px-6 pb-5 text-sm leading-relaxed text-ink-muted">{faq.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
