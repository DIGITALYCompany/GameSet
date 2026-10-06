import officialLogo from '@/assets/LogoV1 GameSet.png';
import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-[160px] sm:w-[180px]',
  md: 'w-[200px]',
  lg: 'w-[260px]',
};

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <img
      src={officialLogo}
      alt="GAMESET"
      width={1525}
      height={181}
      draggable={false}
      className={cn('block h-auto max-w-full shrink-0 select-none object-contain', sizes[size], className)}
    />
  );
}
