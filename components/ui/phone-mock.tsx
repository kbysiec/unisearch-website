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
        {/* Phone frame */}
        <div className="relative rounded-[44px] bg-gradient-to-br from-gray-800 to-gray-900 p-[3px] shadow-2xl shadow-black/40">
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 rounded-[44px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]" />

          {/* Phone body */}
          <div className="relative rounded-[42px] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-2">
            {/* Side buttons */}
            <div className="pointer-events-none absolute -left-[2px] top-[80px] h-8 w-[3px] rounded-l-sm bg-gray-700" />
            <div className="pointer-events-none absolute -left-[2px] top-[130px] h-12 w-[3px] rounded-l-sm bg-gray-700" />
            <div className="pointer-events-none absolute -left-[2px] top-[190px] h-12 w-[3px] rounded-l-sm bg-gray-700" />
            <div className="pointer-events-none absolute -right-[2px] top-[120px] h-16 w-[3px] rounded-r-sm bg-gray-700" />

            {/* Screen */}
            <div className="relative aspect-[3171/6144] w-full overflow-hidden rounded-[34px] bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
              <Image
                src={ASSETS.screenshot}
                alt={`${APP_NAME} app screenshot`}
                fill
                className=""
                sizes="(max-width: 768px) 280px, 360px"
                priority={priority}
              />
              {/* Screen overlay for realism */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/20" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent" />
            </div>

            {/* Camera teardrop notch */}
            <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2">
              <div className="relative h-[18px] w-[18px] rounded-full bg-black shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                {/* Camera lens */}
                <div className="absolute left-1/2 top-1/2 h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900 shadow-[inset_0_0_3px_rgba(0,0,0,0.5)]">
                  <div className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-950" />
                  {/* Lens reflection */}
                  <div className="absolute left-[3px] top-[3px] h-[3px] w-[3px] rounded-full bg-white/40" />
                </div>
              </div>
            </div>

            {/* Screen reflection */}
            <div className="pointer-events-none absolute left-4 top-12 h-32 w-12 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-20 blur-2xl" />
          </div>

          {/* Frame highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-[44px] bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-50" />
        </div>
      </div>
    </div>
  );
}
