import { motion } from 'framer-motion';

export default function MacbookLid({
  lidAngle,
  screenPower,
  uiOpacity,
  uiTranslateY,
  children
}) {
  return (
    <motion.div
      style={{
        rotateX: lidAngle,
        transformOrigin: 'bottom center',
      }}
      className="absolute bottom-full left-0 w-full h-full preserve-3d z-20"
    >
      {/* 1. FRONT FACE: Screen Bezel & Active Display (Faces user when open, faces keyboard when closed) */}
      <div
        className="absolute inset-0 w-full h-full bg-[#0b0c0e] rounded-[2.2rem] p-3 md:p-4 border border-[#23242a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col justify-between backface-hidden select-none overflow-hidden"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* Rubber gasket border trim */}
        <div className="absolute inset-1.5 border border-white/5 rounded-[1.8rem] pointer-events-none z-50" />

        {/* Top Bezel: FaceTime HD Webcam & Green LED Indicator */}
        <div className="relative w-full h-5 flex items-center justify-center shrink-0 z-50">
          <div className="flex items-center gap-2 bg-[#050506] px-3 py-0.5 rounded-full border border-white/5 shadow-inner">
            {/* Green indicator LED (glows when screen powers on) */}
            <motion.div
              style={{ opacity: screenPower }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
            />
            {/* Camera lens */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#121318] border border-blue-900/40 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-400/60" />
            </div>
          </div>
        </div>

        {/* Active Glass Display Area */}
        <div className="relative w-full flex-1 rounded-[1.3rem] overflow-hidden bg-black border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex flex-col">

          {/* Wallpaper & Screen Glow (Powers on smoothly) */}
          <motion.div
            style={{ opacity: screenPower }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-purple-950 to-slate-950 transition-colors"
          >
            {/* macOS Sonoma style abstract atmospheric light spheres */}
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-fuchsia-500/30 to-purple-600/10 blur-[80px]" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-600/30 to-cyan-500/10 blur-[80px]" />
          </motion.div>

          {/* Interactive UI Content (Fades in with upward slide) */}
          <motion.div
            style={{
              opacity: uiOpacity,
              y: uiTranslateY,
            }}
            className="relative z-10 w-full h-full overflow-hidden flex flex-col"
          >
            {children}
          </motion.div>

          {/* Realistic Diagonal Screen Glare & Glass Sheen */}
          <div className="screen-glare absolute inset-0 pointer-events-none z-40 opacity-70" />
        </div>

        {/* Bottom Bezel: MacBook Pro Typography */}
        <div className="relative w-full h-5 flex items-center justify-center shrink-0 z-50">
          <span className="text-[10px] md:text-[11px] font-medium tracking-widest text-neutral-400/80 font-sans uppercase">
            MacBook Pro
          </span>
        </div>
      </div>

      {/* 2. BACK FACE: Anodized Midnight Aluminum Shell & Reflective Apple Logo (Faces UP when closed at -165deg) */}
      <div
        className="absolute inset-0 w-full h-full bg-aluminum-lid-outer rounded-[2.2rem] border border-blue-400/20 flex items-center justify-center backface-hidden select-none"
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Brushed metal sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-300/15 to-transparent opacity-60 rounded-[2.2rem] pointer-events-none" />

        {/* Apple Logo Silhouette (Midnight dark steel mirror gloss finish) */}
        <div className="relative z-10 w-16 md:w-20 h-16 md:h-20 flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity">
          <svg
            viewBox="0 0 170 170"
            className="w-full h-full fill-current text-[#13161f] drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)] filter contrast-125"
          >
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.13-1.9-14.34-6.08-3.69-3.03-7.64-7.85-11.85-14.44-6.53-10.15-11.63-20.94-15.3-32.36-3.67-11.42-5.5-22.36-5.5-32.83 0-14.12 3.52-25.96 10.57-35.54 7.05-9.57 16.29-14.47 27.73-14.69 5.43 0 11.09 1.34 16.98 4.02 5.89 2.68 9.55 4.07 10.98 4.18 1.1 0 4.88-1.52 11.35-4.56 6.47-3.04 12.06-4.45 16.77-4.24 13.62 1.09 23.95 6.47 31 16.14-12.08 7.4-18.04 17.65-17.88 30.75.16 10.66 4.1 19.33 11.83 26.01 4.54 3.92 10.02 6.58 16.44 7.98-2.07 6.09-4.82 12.51-8.25 19.26zm-32.55-102.5c0-6.96 2.52-13.75 7.57-20.37 5.05-6.62 11.45-10.94 19.2-12.96.44 6.75-1.74 13.88-6.53 21.39-4.79 7.51-11.38 11.87-19.78 13.08-.3-3.81-.46-4.19-.46-1.14z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
