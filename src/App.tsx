import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden flex flex-col items-center justify-center py-12 px-4 md:px-8 selection:bg-fuchsia-500/30 selection:text-white">
      {/* Immersive Cyberpunk Grid Background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)
          `, 
          backgroundSize: '50px 50px',
          backgroundPosition: 'center center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-black to-black" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col gap-10">
        
        {/* Header / Title */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-3 mb-2 opacity-80 border border-fuchsia-500/30 bg-fuchsia-950/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.2)]">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest font-bold">OS Version 9.4.1</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-400 to-fuchsia-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] tracking-tight uppercase text-center w-full relative">
            Neon <br className="md:hidden" /> Synthesis
          </h1>
        </div>

        {/* Main Interface */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start justify-center w-full">
          
          {/* Left Column: Snake Node */}
          <div className="w-full flex justify-center lg:justify-end flex-1">
            <SnakeGame />
          </div>
          
          {/* Right Column: Audio & Dashboard */}
          <div className="w-full flex-1 max-w-[500px] flex flex-col gap-8 mt-2">
            
            {/* Music Player */}
            <MusicPlayer />
            
            {/* Tutorial / Terminal Block */}
            <div className="w-full border border-fuchsia-500/20 bg-slate-900/50 backdrop-blur-xl p-5 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               <div className="flex items-center gap-2 mb-4 border-b border-fuchsia-500/20 pb-3">
                 <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_theme(colors.red.500)]" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_theme(colors.yellow.500)]" />
                 <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_theme(colors.green.500)]" />
                 <span className="ml-2 text-fuchsia-400 text-xs font-mono font-bold tracking-widest uppercase">System_Logs.txt</span>
               </div>
               
               <ul className="text-slate-300 font-mono text-sm leading-relaxed space-y-2">
                 <li className="flex gap-2">
                   <span className="text-cyan-400 opacity-70">01</span>
                   <span>Use <span className="text-cyan-400 font-bold">W A S D</span> or <span className="text-cyan-400 font-bold">ARROWS</span> to redirect data flow (snake).</span>
                 </li>
                 <li className="flex gap-2">
                   <span className="text-cyan-400 opacity-70">02</span>
                   <span>Press <span className="text-fuchsia-400 font-bold">SPACE</span> to pause operational loop.</span>
                 </li>
                 <li className="flex gap-2">
                   <span className="text-cyan-400 opacity-70">03</span>
                   <span>Consume pink data packets to increase array length and score.</span>
                 </li>
                 <li className="flex gap-2">
                   <span className="text-cyan-400 opacity-70">04</span>
                   <span className="text-fuchsia-400">Sync audio module prior to starting routine for maximum override capability.</span>
                 </li>
               </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
