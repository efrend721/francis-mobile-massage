import React from 'react';

interface BotanicalProps {
  className?: string;
  variant?: 'branch-left' | 'branch-right' | 'corner-left' | 'corner-right' | 'card-accent' | 'divider' | 'garland-left' | 'garland-right';
}

export const BotanicalDecor: React.FC<BotanicalProps> = ({ className = '', variant = 'branch-left' }) => {
  // Common definitions for realistic gradients, shadows, and leaf veins
  const renderDefs = () => (
    <defs>
      {/* Primary Eucalyptus Leaf Gradient */}
      <linearGradient id="eucalyptusLeaf1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7DA695" />
        <stop offset="50%" stopColor="#5A7E70" />
        <stop offset="100%" stopColor="#3B5D50" />
      </linearGradient>

      {/* Secondary Soft Leaf Gradient */}
      <linearGradient id="eucalyptusLeaf2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8FB7A7" />
        <stop offset="60%" stopColor="#699081" />
        <stop offset="100%" stopColor="#45685B" />
      </linearGradient>

      {/* Stem Wood/Bark Gradient */}
      <linearGradient id="eucalyptusStem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8E7860" />
        <stop offset="50%" stopColor="#6B5945" />
        <stop offset="100%" stopColor="#4D3F30" />
      </linearGradient>

      {/* Soft Leaf Shadow for 3D realism */}
      <filter id="leafShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#1A2D24" floodOpacity="0.18" />
      </filter>
    </defs>
  );

  // Variant 1: Lush Left Branch
  if (variant === 'branch-left' || variant === 'corner-left') {
    return (
      <svg className={`pointer-events-none select-none ${className}`} viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {renderDefs()}
        <g filter="url(#leafShadow)">
          {/* Main Organic Stem */}
          <path d="M-10 10 C 60 40, 110 110, 160 270" stroke="url(#eucalyptusStem)" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 70 C 80 80, 120 115, 145 150" stroke="url(#eucalyptusStem)" strokeWidth="2" strokeLinecap="round" />
          <path d="M85 130 C 120 135, 150 160, 175 190" stroke="url(#eucalyptusStem)" strokeWidth="1.8" strokeLinecap="round" />

          {/* Realistic Eucalyptus Leaves (Rounded with delicate points & subtle central vein) */}
          {/* Leaf 1 */}
          <path d="M35 55 C 20 25, 60 10, 80 35 C 95 60, 55 75, 35 55 Z" fill="url(#eucalyptusLeaf1)" />
          <path d="M45 50 Q 60 38 72 32" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          {/* Leaf 2 */}
          <path d="M70 45 C 90 20, 130 30, 125 60 C 120 85, 80 80, 70 45 Z" fill="url(#eucalyptusLeaf2)" />
          <path d="M78 52 Q 98 48 115 50" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          {/* Leaf 3 */}
          <path d="M90 95 C 75 70, 115 55, 135 75 C 150 95, 120 120, 90 95 Z" fill="url(#eucalyptusLeaf1)" />
          <path d="M98 90 Q 112 80 126 76" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          {/* Leaf 4 */}
          <path d="M125 105 C 145 80, 185 95, 180 125 C 170 150, 130 140, 125 105 Z" fill="url(#eucalyptusLeaf2)" />
          <path d="M132 112 Q 152 108 170 115" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          {/* Leaf 5 */}
          <path d="M115 155 C 100 130, 140 115, 160 135 C 175 155, 145 180, 115 155 Z" fill="url(#eucalyptusLeaf1)" />
          <path d="M122 150 Q 138 140 152 136" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          {/* Leaf 6 */}
          <path d="M150 175 C 170 150, 205 165, 200 195 C 190 220, 155 210, 150 175 Z" fill="url(#eucalyptusLeaf2)" />
          <path d="M158 182 Q 176 178 190 185" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          {/* Leaf 7 (Bud / Small tip) */}
          <path d="M145 235 C 135 215, 165 200, 180 215 C 190 230, 165 250, 145 235 Z" fill="url(#eucalyptusLeaf1)" />
        </g>
      </svg>
    );
  }

  // Variant 2: Lush Right Branch
  if (variant === 'branch-right' || variant === 'corner-right') {
    return (
      <svg className={`pointer-events-none select-none ${className}`} viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {renderDefs()}
        <g filter="url(#leafShadow)">
          {/* Main Organic Stem */}
          <path d="M230 10 C 160 40, 110 110, 60 270" stroke="url(#eucalyptusStem)" strokeWidth="3" strokeLinecap="round" />
          <path d="M180 70 C 140 80, 100 115, 75 150" stroke="url(#eucalyptusStem)" strokeWidth="2" strokeLinecap="round" />
          <path d="M135 130 C 100 135, 70 160, 45 190" stroke="url(#eucalyptusStem)" strokeWidth="1.8" strokeLinecap="round" />

          {/* Leaves */}
          <path d="M185 55 C 200 25, 160 10, 140 35 C 125 60, 165 75, 185 55 Z" fill="url(#eucalyptusLeaf1)" />
          <path d="M175 50 Q 160 38 148 32" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          <path d="M150 45 C 130 20, 90 30, 95 60 C 100 85, 140 80, 150 45 Z" fill="url(#eucalyptusLeaf2)" />
          <path d="M142 52 Q 122 48 105 50" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          <path d="M130 95 C 145 70, 105 55, 85 75 C 70 95, 100 120, 130 95 Z" fill="url(#eucalyptusLeaf1)" />
          <path d="M122 90 Q 108 80 94 76" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          <path d="M95 105 C 75 80, 35 95, 40 125 C 50 150, 90 140, 95 105 Z" fill="url(#eucalyptusLeaf2)" />
          <path d="M88 112 Q 68 108 50 115" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          <path d="M105 155 C 120 130, 80 115, 60 135 C 45 155, 75 180, 105 155 Z" fill="url(#eucalyptusLeaf1)" />
          <path d="M98 150 Q 82 140 68 136" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          <path d="M70 175 C 50 150, 15 165, 20 195 C 30 220, 65 210, 70 175 Z" fill="url(#eucalyptusLeaf2)" />
          <path d="M62 182 Q 44 178 30 185" stroke="#99C2B1" strokeWidth="0.8" opacity="0.6" />

          <path d="M75 235 C 85 215, 55 200, 40 215 C 30 230, 55 250, 75 235 Z" fill="url(#eucalyptusLeaf1)" />
        </g>
      </svg>
    );
  }

  // Variant 3: Card Accent Sprig
  if (variant === 'card-accent') {
    return (
      <svg className={`pointer-events-none select-none ${className}`} viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {renderDefs()}
        <g filter="url(#leafShadow)">
          <path d="M10 80 Q 45 55 75 15" stroke="url(#eucalyptusStem)" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 60 C 15 45, 35 25, 50 40 C 60 52, 42 68, 30 60 Z" fill="url(#eucalyptusLeaf1)" />
          <path d="M52 40 C 45 20, 70 10, 80 25 C 85 40, 65 50, 52 40 Z" fill="url(#eucalyptusLeaf2)" />
          <path d="M68 20 C 65 8, 80 5, 85 15 C 88 22, 75 28, 68 20 Z" fill="url(#eucalyptusLeaf1)" />
        </g>
      </svg>
    );
  }

  // Variant 4: Section Divider with Realistic Leaves & Gold Center
  if (variant === 'divider') {
    return (
      <div className={`flex items-center justify-center gap-3 my-4 ${className}`} aria-hidden="true">
        <div className="h-px w-16 sm:w-24 bg-linear-to-r from-transparent to-oak" />
        <svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          {renderDefs()}
          <g filter="url(#leafShadow)">
            <path d="M18 14 Q 8 8 2 12 C 4 20 12 18 18 14 Z" fill="url(#eucalyptusLeaf1)" />
            <path d="M18 14 Q 28 8 34 12 C 32 20 24 18 18 14 Z" fill="url(#eucalyptusLeaf2)" />
            <circle cx="18" cy="14" r="3.5" fill="#C7B198" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        </svg>
        <div className="h-px w-16 sm:w-24 bg-linear-to-l from-transparent to-oak" />
      </div>
    );
  }

  // Variant 5: Full Lateral Garland (for left and right page edges)
  return (
    <svg className={`pointer-events-none select-none ${className}`} viewBox="0 0 140 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {renderDefs()}
      <g filter="url(#leafShadow)">
        {/* Wavy Vine Downward */}
        <path d="M20 0 Q 60 150 20 300 Q 60 450 20 600" stroke="url(#eucalyptusStem)" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Pairs of Leaves down the vine */}
        <path d="M30 60 C 10 40, 45 20, 65 40 C 75 55, 45 75, 30 60 Z" fill="url(#eucalyptusLeaf1)" />
        <path d="M35 120 C 55 100, 90 110, 85 135 C 75 155, 45 145, 35 120 Z" fill="url(#eucalyptusLeaf2)" />
        <path d="M42 200 C 20 180, 55 160, 75 180 C 85 195, 55 215, 42 200 Z" fill="url(#eucalyptusLeaf1)" />
        <path d="M30 280 C 50 260, 85 270, 80 295 C 70 315, 40 305, 30 280 Z" fill="url(#eucalyptusLeaf2)" />
        <path d="M38 370 C 15 350, 50 330, 70 350 C 80 365, 50 385, 38 370 Z" fill="url(#eucalyptusLeaf1)" />
        <path d="M32 450 C 52 430, 88 440, 82 465 C 72 485, 42 475, 32 450 Z" fill="url(#eucalyptusLeaf2)" />
        <path d="M35 530 C 15 510, 50 490, 70 510 C 80 525, 50 545, 35 530 Z" fill="url(#eucalyptusLeaf1)" />
      </g>
    </svg>
  );
};
