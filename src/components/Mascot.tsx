import React from 'react';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  size = 'md',
  className = '',
  animate = false,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    '2xl': 'w-52 h-52',
  };

  const containerSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${containerSize} ${
        animate ? 'animate-bounce-slow' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          {/* Main 3D Brain Gradient (Purple on left to Cyan-Blue on right) */}
          <linearGradient id="brainBodyGrad" x1="40" y1="60" x2="260" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="30%" stopColor="#9333EA" />
            <stop offset="65%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Brain Shadow Gradient */}
          <radialGradient id="brainShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Graduation Cap Dark Navy Gradient */}
          <linearGradient id="capNavy" x1="120" y1="10" x2="220" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>

          {/* Book Blue Cover Gradient */}
          <linearGradient id="bookCover" x1="180" y1="170" x2="250" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Pencil Yellow Gradient */}
          <linearGradient id="pencilGrad" x1="40" y1="130" x2="60" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="dropShadowSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* --- FLOOR SHADOW --- */}
        <ellipse cx="150" cy="275" rx="75" ry="10" fill="url(#brainShadow)" />

        {/* --- LEGS & SNEAKERS --- */}
        {/* Left Leg */}
        <path d="M125 210 Q120 238 110 252" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" fill="none" />
        {/* Right Leg */}
        <path d="M175 210 Q180 238 190 252" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" fill="none" />

        {/* Left Shoe (Dark Navy Sneaker with White Sole) */}
        <g id="LeftShoe">
          <ellipse cx="102" cy="264" rx="20" ry="11" fill="#0F172A" />
          {/* Shoe Top Overlay */}
          <path d="M90 258 Q102 250 118 258 Q118 266 90 266 Z" fill="#1E3A8A" />
          {/* Laces */}
          <line x1="98" y1="256" x2="108" y2="256" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="97" y1="260" x2="109" y2="260" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* White Rubber Sole */}
          <rect x="83" y="263" width="38" height="7" rx="3.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
        </g>

        {/* Right Shoe */}
        <g id="RightShoe">
          <ellipse cx="198" cy="264" rx="20" ry="11" fill="#0F172A" />
          <path d="M182 258 Q198 250 210 258 Q210 266 182 266 Z" fill="#1E3A8A" />
          <line x1="191" y1="256" x2="201" y2="256" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="190" y1="260" x2="202" y2="260" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="179" y="263" width="38" height="7" rx="3.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
        </g>

        {/* --- MAIN BRAIN CHARACTER BODY (3D Form matching Reference Image) --- */}
        <g id="BrainBody" filter="url(#dropShadowSoft)">
          {/* Outer Brain Mass */}
          <path
            d="M 150 65 
               C 90 50, 45 90, 52 135 
               C 42 165, 65 200, 105 210 
               C 130 216, 170 216, 195 210 
               C 235 200, 258 165, 248 135 
               C 255 90, 210 50, 150 65 Z"
            fill="url(#brainBodyGrad)"
          />

          {/* 3D Brain Sulci & Lobes (Light Curved Details on Left & Right) */}
          {/* Top Left Lobe Highlights */}
          <path d="M 85 95 C 65 105, 68 135, 88 140 C 105 145, 115 125, 100 105 Z" fill="#FFFFFF" opacity="0.18" />
          <path d="M 115 75 C 95 80, 98 102, 120 108 C 138 112, 142 90, 128 78 Z" fill="#FFFFFF" opacity="0.2" />

          {/* Center Brain Hemisphere Divide */}
          <path d="M 150 65 Q 148 110 150 145" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" />

          {/* Right Lobe 3D Texture Curves */}
          <path d="M 185 85 C 205 92, 215 115, 200 130" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.3" />
          <path d="M 195 125 C 220 135, 225 165, 205 180" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.3" />
          <path d="M 75 145 C 55 160, 60 185, 85 190" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.3" />
        </g>

        {/* --- NEURAL CIRCUIT CONSTELLATIONS (RIGHT SIDE OF BRAIN) --- */}
        <g id="NeuralConstellations" filter="url(#cyanGlow)">
          {/* Network Lines */}
          <path d="M 175 90 L 195 105 L 215 95 L 230 115 L 210 138 L 225 160 L 200 175" stroke="#67E8F9" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.95" />
          <path d="M 195 105 L 180 125 L 195 145 L 210 138" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M 180 125 L 160 135 L 168 162 M 195 145 L 182 170" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />

          {/* Glowing Synapse Nodes (Dots) */}
          <circle cx="175" cy="90" r="4" fill="#FFFFFF" />
          <circle cx="195" cy="105" r="4.5" fill="#67E8F9" />
          <circle cx="215" cy="95" r="3.5" fill="#FFFFFF" />
          <circle cx="230" cy="115" r="4.5" fill="#67E8F9" />
          <circle cx="210" cy="138" r="4" fill="#FFFFFF" />
          <circle cx="225" cy="160" r="4.5" fill="#67E8F9" />
          <circle cx="200" cy="175" r="3.5" fill="#FFFFFF" />
          <circle cx="180" cy="125" r="4" fill="#67E8F9" />
          <circle cx="195" cy="145" r="4" fill="#FFFFFF" />
          <circle cx="160" cy="135" r="3.5" fill="#67E8F9" />
          <circle cx="168" cy="162" r="3" fill="#FFFFFF" />
          <circle cx="182" cy="170" r="3.5" fill="#67E8F9" />
        </g>

        {/* --- LEFT HAND HOLDING YELLOW PENCIL --- */}
        <g id="LeftHandPencil">
          {/* Arm */}
          <path d="M 72 155 Q 45 150 48 128" stroke="#3B82F6" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Yellow Pencil */}
          <g transform="translate(38, 70) rotate(-10)">
            {/* Pencil Shaft */}
            <rect x="8" y="20" width="10" height="42" fill="url(#pencilGrad)" rx="2" />
            {/* Pencil Silver Collar */}
            <rect x="8" y="58" width="10" height="5" fill="#CBD5E1" />
            {/* Pink Eraser */}
            <rect x="8" y="63" width="10" height="7" rx="2" fill="#F43F5E" />
            {/* Wooden Tip */}
            <polygon points="8,20 18,20 13,8" fill="#FDE68A" />
            {/* Graphite Lead Tip */}
            <polygon points="11,13 15,13 13,8" fill="#1E293B" />
          </g>

          {/* White Glove Hand */}
          <circle cx="48" cy="128" r="11" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="42" cy="124" r="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
        </g>

        {/* --- RIGHT HAND HOLDING BLUE BOOK --- */}
        <g id="RightHandBook">
          {/* Arm */}
          <path d="M 225 155 Q 248 165 242 190" stroke="#2563EB" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Textbook / Caderno com Logotipo da IA */}
          <g transform="translate(208, 158) rotate(12)">
            {/* Book Body Cover */}
            <rect x="0" y="0" width="42" height="54" rx="6" fill="url(#bookCover)" stroke="#38BDF8" strokeWidth="2" />
            {/* White Pages Edge */}
            <rect x="36" y="4" width="5" height="46" fill="#F8FAFC" rx="1" />
            {/* Book Spine Highlight */}
            <rect x="2" y="0" width="6" height="54" rx="2" fill="#1E40AF" />

            {/* Glowing Brain Logo on Book Cover */}
            <path
              d="M 21 20 
                 C 14 17, 8 22, 10 28 
                 C 8 32, 12 38, 18 38 
                 C 24 38, 28 32, 26 28 
                 C 28 22, 22 17, 21 20 Z"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
              filter="url(#cyanGlow)"
            />
            <path d="M 21 20 L 21 38" stroke="#38BDF8" strokeWidth="1.5" opacity="0.8" />
            <circle cx="16" cy="26" r="1.5" fill="#67E8F9" />
            <circle cx="26" cy="26" r="1.5" fill="#67E8F9" />
          </g>

          {/* White Glove Holding Book */}
          <circle cx="236" cy="198" r="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="242" cy="194" r="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
        </g>

        {/* --- FACE: BIG CUTE EYES, RETRO GLASSES & SMILE --- */}
        {/* Eyebrows */}
        <path d="M 100 102 Q 115 94 130 102" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M 170 102 Q 185 94 200 102" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Thick Round Black Glasses */}
        <g id="Glasses">
          {/* Glasses Bridge */}
          <path d="M 136 120 Q 150 114 164 120" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" fill="none" />

          {/* Left Lens Frame */}
          <circle cx="112" cy="124" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="6.5" />
          {/* Right Lens Frame */}
          <circle cx="188" cy="124" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="6.5" />

          {/* Left Pupil (Big cute expressive black eye) */}
          <circle cx="115" cy="124" r="14" fill="#0F172A" />
          {/* Pupil Glint Reflections */}
          <circle cx="110" cy="118" r="5" fill="#FFFFFF" />
          <circle cx="120" cy="128" r="2.5" fill="#FFFFFF" />

          {/* Right Pupil */}
          <circle cx="185" cy="124" r="14" fill="#0F172A" />
          <circle cx="180" cy="118" r="5" fill="#FFFFFF" />
          <circle cx="190" cy="128" r="2.5" fill="#FFFFFF" />

          {/* Glasses Glass Shine Arc */}
          <path d="M 94 108 Q 112 102 124 108" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M 170 108 Q 188 102 200 108" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>

        {/* Happy Smile Mouth */}
        <g id="Mouth">
          <path d="M 128 156 Q 150 178 172 156 Z" fill="#0F172A" />
          {/* Pink Tongue */}
          <path d="M 138 166 Q 150 178 162 166 Q 150 160 138 166 Z" fill="#F43F5E" />
        </g>

        {/* --- GRADUATION CAP (CAPELO) --- */}
        <g id="CapeloGraduationCap" filter="url(#dropShadowSoft)">
          {/* Cap Crown Base (Under mortarboard) */}
          <path d="M 112 55 Q 150 42 188 55 L 180 72 Q 150 62 120 72 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />

          {/* Diamond Mortarboard Top Board */}
          <polygon
            points="150,12 240,40 150,68 60,40"
            fill="url(#capNavy)"
            stroke="#38BDF8"
            strokeWidth="2.5"
          />

          {/* Golden Center Button */}
          <circle cx="150" cy="40" r="6" fill="#F59E0B" />
          <circle cx="150" cy="40" r="2.5" fill="#FEF08A" />

          {/* Purple Tassel (Pingente Roxo caindo para a direita) */}
          <path d="M 150 40 Q 200 36 218 68" stroke="#A855F7" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Tassel Golden Ring */}
          <circle cx="218" cy="70" r="3.5" fill="#F59E0B" />
          {/* Tassel Fringe Brush */}
          <polygon points="214,73 222,73 225,95 211,95" fill="#9333EA" />
        </g>
      </svg>
    </div>
  );
};
