import React from 'react';

interface PlaceholderImageProps {
  text: string;
  width?: number;
  height?: number;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export function PlaceholderImage({
  text,
  width = 512,
  height = 512,
  bgColor = '#1DA1F2',
  textColor = '#ffffff',
  className = '',
}: PlaceholderImageProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
      }}
    >
      <span style={{ color: textColor, fontSize: Math.min(width, height) / 4, fontWeight: 'bold' }}>
        {text}
      </span>
    </div>
  );
}
