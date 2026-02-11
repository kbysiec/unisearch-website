import Image from 'next/image';
import { ASSETS, APP_NAME } from '@/src/config/brand';
import { cn } from '@/lib/cn';

interface PhoneMockProps {
  className?: string;
  priority?: boolean;
}

export function PhoneMock({ className, priority = false }: PhoneMockProps) {
  return (
    <div
      className={cn(
        'group relative mx-auto w-[280px] max-w-full sm:w-[320px] lg:w-[360px]',
        'motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out',
        'motion-safe:hover:-translate-y-2 motion-safe:hover:rotate-1',
        className
      )}
    >
      <div className="absolute -inset-4 rounded-[48px] bg-gradient-to-br from-primary-200/40 via-white/10 to-primary-400/20 blur-2xl" />
      <div className="relative rounded-[40px] border border-gray-700 bg-gray-700 p-3 shadow-2xl shadow-primary-500/20">
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[32px] border border-gray-700 bg-gray-900">
          <Image
            src={ASSETS.screenshot}
            alt={`${APP_NAME} app screenshot`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 70vw, 360px"
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-3 h-2 w-24 -translate-x-1/2 rounded-full bg-black/50" />
      </div>
    </div>
  );
}
