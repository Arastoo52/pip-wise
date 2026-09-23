import { motion } from 'framer-motion';

const KEYBOARD_ROWS = [
  // Row 1: Function row
  [
    { label: 'esc', width: 'w-10' },
    { label: 'F1', width: 'flex-1' }, { label: 'F2', width: 'flex-1' }, { label: 'F3', width: 'flex-1' },
    { label: 'F4', width: 'flex-1' }, { label: 'F5', width: 'flex-1' }, { label: 'F6', width: 'flex-1' },
    { label: 'F7', width: 'flex-1' }, { label: 'F8', width: 'flex-1' }, { label: 'F9', width: 'flex-1' },
    { label: 'F10', width: 'flex-1' }, { label: 'F11', width: 'flex-1' }, { label: 'F12', width: 'flex-1' },
    { label: '⏻', width: 'w-8 bg-[#1a1b1e] text-red-400' }
  ],
  // Row 2: Numbers
  [
    { label: '~', width: 'w-8' },
    { label: '1', width: 'flex-1' }, { label: '2', width: 'flex-1' }, { label: '3', width: 'flex-1' },
    { label: '4', width: 'flex-1' }, { label: '5', width: 'flex-1' }, { label: '6', width: 'flex-1' },
    { label: '7', width: 'flex-1' }, { label: '8', width: 'flex-1' }, { label: '9', width: 'flex-1' },
    { label: '0', width: 'flex-1' }, { label: '-', width: 'flex-1' }, { label: '=', width: 'flex-1' },
    { label: 'delete', width: 'w-14 text-right pr-2' }
  ],
  // Row 3: QWERTY top
  [
    { label: 'tab', width: 'w-12 text-left pl-2' },
    { label: 'Q', width: 'flex-1' }, { label: 'W', width: 'flex-1' }, { label: 'E', width: 'flex-1' },
    { label: 'R', width: 'flex-1' }, { label: 'T', width: 'flex-1' }, { label: 'Y', width: 'flex-1' },
    { label: 'U', width: 'flex-1' }, { label: 'I', width: 'flex-1' }, { label: 'O', width: 'flex-1' },
    { label: 'P', width: 'flex-1' }, { label: '[', width: 'flex-1' }, { label: ']', width: 'flex-1' },
    { label: '\\', width: 'w-10' }
  ],
  // Row 4: Home row
  [
    { label: 'caps lock', width: 'w-14 text-left pl-2' },
    { label: 'A', width: 'flex-1' }, { label: 'S', width: 'flex-1' }, { label: 'D', width: 'flex-1' },
    { label: 'F', width: 'flex-1' }, { label: 'G', width: 'flex-1' }, { label: 'H', width: 'flex-1' },
    { label: 'J', width: 'flex-1' }, { label: 'K', width: 'flex-1' }, { label: 'L', width: 'flex-1' },
    { label: ';', width: 'flex-1' }, { label: "'", width: 'flex-1' },
    { label: 'return', width: 'w-16 text-right pr-2 bg-blue-600/20 text-blue-300 border-blue-500/30' }
  ],
  // Row 5: Bottom row
  [
    { label: 'shift', width: 'w-18 text-left pl-2' },
    { label: 'Z', width: 'flex-1' }, { label: 'X', width: 'flex-1' }, { label: 'C', width: 'flex-1' },
    { label: 'V', width: 'flex-1' }, { label: 'B', width: 'flex-1' }, { label: 'N', width: 'flex-1' },
    { label: 'M', width: 'flex-1' }, { label: ',', width: 'flex-1' }, { label: '.', width: 'flex-1' },
    { label: '/', width: 'flex-1' },
    { label: 'shift', width: 'w-20 text-right pr-2' }
  ],
  // Row 6: Modifiers & Space
  [
    { label: 'fn', width: 'w-9' }, { label: '⌃', width: 'w-9' },
    { label: '⌥', width: 'w-10' }, { label: '⌘', width: 'w-12 text-left pl-1.5' },
    { label: '', width: 'flex-[4] bg-[#2a2b2f]' }, // Spacebar
    { label: '⌘', width: 'w-12 text-right pr-1.5' }, { label: '⌥', width: 'w-10' },
    { label: '◀', width: 'w-9' },
    { label: '▲▼', width: 'w-9 text-[7px] leading-tight flex flex-col justify-center' },
    { label: '▶', width: 'w-9' }
  ]
];

export default function MacbookBase({ trackpadGlow, keyboardGlow }) {
  return (
    <div className="relative w-full h-full bg-aluminum-chassis rounded-[2.2rem] p-5 sm:p-6 md:p-8 flex flex-col justify-between border-t border-slate-500/30 overflow-visible select-none">

      {/* Subtle aluminum brushed reflection highlights */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent opacity-50 pointer-events-none rounded-[2.2rem]" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-blue-400/20 pointer-events-none" />

      {/* Top Section: Keyboard Well + Side Speakers */}
      <div className="relative w-full flex items-center justify-between gap-3 md:gap-6 z-10">

        {/* Left Speaker Grille */}
        <div className="hidden sm:flex flex-col gap-1 w-8 md:w-12 h-[220px] justify-center opacity-60">
          <div className="w-full h-full bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:3px_3px] rounded-md border border-black/10 shadow-inner" />
        </div>

        {/* Recessed Keyboard Well */}
        <div className="flex-1 bg-aluminum-key-well rounded-2xl p-2 sm:p-3 md:p-3.5 shadow-[inset_0_3px_8px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.2)] border border-black/40 relative overflow-hidden">
          {/* Keyboard Well Apple Intelligence Glow (Turns on AFTER trackpad glow fades!) */}
          <motion.div
            style={{ opacity: keyboardGlow }}
            className="absolute top-0 inset-x-2 h-24 pointer-events-none z-30 flex flex-col items-center justify-start"
          >
            {/* 1. Sharp bright core neon beam line right across top function keys */}
            <div className="w-full h-[3px] bg-gradient-to-r from-[#00d2ff] via-[#b066ff] via-50%-[#ff4d88] to-[#ffad1f] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)] opacity-100" />
            {/* 2. Medium intense neon glow over keys */}
            <div className="absolute top-0 w-full h-6 bg-gradient-to-r from-[#00d2ff] via-[#b066ff] via-50%-[#ff4d88] to-[#ffad1f] blur-md opacity-90" />
            {/* 3. Soft atmospheric bloom spilling across keyboard keys */}
            <div className="absolute top-0 w-full h-20 bg-gradient-to-r from-[#0088ff] via-[#b066ff] via-50%-[#ff4d88] to-[#ff6600] blur-xl opacity-80" />
          </motion.div>
          <div className="flex flex-col gap-1 sm:gap-1.5 w-full">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-1 sm:gap-1.5 w-full">
                {row.map((key, keyIndex) => (
                  <div
                    key={keyIndex}
                    className={`bg-apple-keycap h-6 sm:h-7 md:h-8 ${key.width} rounded-[5px] border border-white/10 flex items-center justify-center text-[8px] sm:text-[9px] md:text-[10px] text-white/80 font-medium tracking-tight shadow-[0_1.5px_2px_rgba(0,0,0,0.9),inset_0_1px_0.5px_rgba(255,255,255,0.15)] transition-all hover:bg-[#323338] hover:text-white cursor-pointer`}
                  >
                    <span>{key.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Speaker Grille */}
        <div className="hidden sm:flex flex-col gap-1 w-8 md:w-12 h-[220px] justify-center opacity-60">
          <div className="w-full h-full bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:3px_3px] rounded-md border border-black/10 shadow-inner" />
        </div>
      </div>

      {/* Bottom Section: Glass Trackpad & Lip Notch (With Apple Intelligence Keynote Front Gap Glow!) */}
      <div className="relative w-full flex flex-col items-center justify-end mt-4 md:mt-6 z-30">

        {/* Apple Intelligence Trackpad Glow (Intensifies as lid lifts slightly, then disappears!) */}
        <motion.div
          style={{ opacity: trackpadGlow }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-[86%] sm:w-[88%] md:w-[88%] h-36 pointer-events-none z-40 flex flex-col items-center justify-center"
        >
          {/* 1. Sharp bright laser core beam right across front trackpad lip */}
          <div className="w-[85%] h-[3px] bg-gradient-to-r from-[#00d2ff] via-[#b066ff] via-50%-[#ff4d88] to-[#ffad1f] rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] opacity-100" />
          {/* 2. Medium intense neon glow across trackpad */}
          <div className="absolute top-12 w-[90%] h-8 bg-gradient-to-r from-[#00d2ff] via-[#b066ff] via-50%-[#ff4d88] to-[#ffad1f] blur-md opacity-95" />
          {/* 3. Soft atmospheric bloom filling the trackpad area ("trackpad hota hai us saare mai ya gradient ho") */}
          <div className="absolute top-4 w-full h-24 bg-gradient-to-r from-[#0088ff] via-[#b066ff] via-50%-[#ff4d88] to-[#ff6600] blur-xl opacity-90" />
          {/* 4. Outward Front Radiating Glow (Radiates out over front lip toward viewer, kept narrow so no light spills left or right!) */}
          <div className="absolute -bottom-8 w-[95%] h-28 bg-gradient-to-r from-[#00d2ff]/80 via-[#ff4d88]/80 to-[#ffad1f]/80 blur-2xl opacity-95" />
        </motion.div>

        {/* Large Glass Trackpad */}
        <div className="w-[45%] sm:w-[42%] md:w-[38%] h-[80px] sm:h-[95px] md:h-[115px] bg-trackpad rounded-xl border border-black/20 shadow-[inset_0_1px_4px_rgba(0,0,0,0.2),0_1px_1px_rgba(255,255,255,0.7)] transition-all hover:border-black/30 cursor-pointer flex items-center justify-center group relative z-10">
          <div className="w-12 h-1 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Front Opening Lip Notch */}
        <div className="absolute -bottom-5 md:-bottom-8 left-1/2 -translate-x-1/2 w-16 md:w-24 h-3 md:h-4 bg-[#2f3544] rounded-t-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border-t border-black/30 z-20" />
      </div>
    </div>
  );
}
