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