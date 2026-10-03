// import { cn } from '@/utils/cn';

// interface LogoProps {
//   size?: 'sm' | 'md' | 'lg';
//   showWordmark?: boolean;
//   className?: string;
// }

// const sizes = {
//   sm: { mark: 'h-7 w-7', text: 'text-lg' },
//   md: { mark: 'h-8 w-8', text: 'text-xl' },
//   lg: { mark: 'h-10 w-10', text: 'text-2xl' },
// };

// /**
//  * GAMESET logo — an angular geometric "G" symbol paired with the wordmark.
//  * Flat design, no effects.
//  */
// export function Logo({ size = 'md', showWordmark = true, className }: LogoProps) {
//   const s = sizes[size];
//   return (
//     <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
//       <svg
//         viewBox="0 0 32 32"
//         className={s.mark}
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         aria-hidden="true"
//       >
//         <rect width="32" height="32" rx="6" fill="#8E3BFF" />
//         <path
//           d="M22 10.5C20.5 9 18.4 8 16 8C11.6 8 8 11.6 8 16C8 20.4 11.6 24 16 24C19.3 24 22.1 22 23.4 19.2H16V15.5H27C27 15.5 27 16 27 16.5C27 22.3 22.1 27 16 27C9.9 27 5 22.1 5 16C5 9.9 9.9 5 16 5C19.2 5 22.1 6.3 24.2 8.4L22 10.5Z"
//           fill="#08080B"
//         />
//       </svg>
//       {showWordmark && (
//         <span className={cn('font-display font-bold tracking-tight text-ink', s.text)}>
//           GAMESET
//         </span>
//       )}
//     </span>
//   );
// }





import { cn } from '@/utils/cn';
import logoSrc from '@/assets/LogoV1 GameSet.png'; // see note below

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-5 sm:h-6 md:h-7',
  md: 'h-6 sm:h-7 md:h-8 lg:h-9',
  lg: 'h-8 sm:h-9 md:h-10 lg:h-12',
};

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center select-none shrink-0', className)}>
      <img
        src={logoSrc}
        alt="GAMESET"
        className={cn('w-auto object-contain block', sizes[size])}
        draggable={false}
      />
    </span>
  );
}