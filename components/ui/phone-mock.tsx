'use client';

import { cn } from "@/lib/cn";
import { APP_NAME, ASSETS } from "@/src/config/brand";
import Image from "next/image";
import { useState } from "react";

interface PhoneMockProps {
  className?: string;
  priority?: boolean;
}

export function PhoneMock({ className, priority = false }: PhoneMockProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative mx-auto w-[280px] max-w-full sm:w-[320px] lg:w-[360px]",
        className,
      )}
      style={{
        perspective: '1000px',
        animation: 'float 4.5s ease-in-out infinite',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div className="absolute -inset-8 rounded-[56px] bg-gradient-to-br from-primary-400/30 via-primary-200/20 to-primary-500/30 opacity-60 blur-3xl" />

      {/* Phone container with 3D transform */}
      <div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? 'rotateY(0deg) rotateX(0deg)'
            : 'rotateY(-8deg) rotateX(2deg)',
          transition: 'transform 700ms ease-out',
        }}
      >
        {/* Phone frame - outer metallic bezel */}
        <div className="relative rounded-[44px] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-[4px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_10px_25px_-8px_rgba(0,0,0,0.6)]">
          {/* Metallic frame shine */}
          <div className="pointer-events-none absolute inset-0 rounded-[44px] bg-gradient-to-br from-white/[0.15] via-transparent via-50% to-black/30" />
          
          {/* Inner frame shadow for depth */}
          <div className="absolute inset-0 rounded-[44px] shadow-[inset_0_2px_12px_rgba(0,0,0,0.5),inset_0_-1px_4px_rgba(255,255,255,0.05)]" />

          {/* Phone body - black bezel around screen */}
          <div className="relative rounded-[40px] bg-black p-[6px] sm:p-[2.5px]">
            {/* Side buttons with realistic depth */}
            <div className="pointer-events-none absolute -left-[3px] top-[80px] h-8 w-[3px] rounded-l-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-[inset_1px_0_2px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.4)]" />
            <div className="pointer-events-none absolute -left-[3px] top-[130px] h-12 w-[3px] rounded-l-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-[inset_1px_0_2px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.4)]" />
            <div className="pointer-events-none absolute -left-[3px] top-[190px] h-12 w-[3px] rounded-l-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-[inset_1px_0_2px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.4)]" />
            <div className="pointer-events-none absolute -right-[3px] top-[120px] h-16 w-[3px] rounded-r-full bg-gradient-to-l from-gray-900 to-gray-800 shadow-[inset_-1px_0_2px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.4)]" />

            {/* Screen with glass effect - matches exact image aspect ratio */}
            <div className="relative aspect-[3171/6144] w-full overflow-hidden rounded-[34px] sm:rounded-[37px] bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.5)]">
              {/* Light mode screenshot */}
              <Image
                src={ASSETS.screenshot}
                alt={`${APP_NAME} app screenshot`}
                fill
                className="object-cover dark:hidden"
                sizes="(max-width: 768px) 280px, 360px"
                priority={priority}
              />
              {/* Dark mode screenshot */}
              <Image
                src="/assets/phone_screen_dark.png"
                alt={`${APP_NAME} app screenshot`}
                fill
                className="hidden object-cover dark:block"
                sizes="(max-width: 768px) 280px, 360px"
                priority={priority}
              />
              {/* Realistic glass screen overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent via-40% to-black/10" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
              {/* Screen edge shadow */}
              <div className="pointer-events-none absolute inset-0 rounded-[37px] shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]" />
            </div>

            {/* Camera hole punch - centered and slightly lower */}
            <div className="pointer-events-none absolute left-1/2 top-[10px] -translate-x-1/2 z-20">
              <div className="relative h-[11px] w-[11px] rounded-full bg-black shadow-[0_2px_5px_rgba(0,0,0,0.8),inset_0_0_2px_rgba(0,0,0,0.6)]">
                {/* Camera lens */}
                <div className="absolute left-1/2 top-1/2 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900">
                  <div className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-950/70" />
                  {/* Lens reflection */}
                  <div className="absolute left-[2px] top-[2px] h-[2px] w-[2px] rounded-full bg-white/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
