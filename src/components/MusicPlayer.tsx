import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc3 } from 'lucide-react';

const TRACKS = [
  { 
    title: "Neural Synthesis (AI Generated)", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  },
  { 
    title: "Quantum Beats (AI)", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
  },
  { 
    title: "Cybernetic Flow (AI)", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" 
  }
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Play automatically when changing tracks IF already playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      // Small timeout to ensure audio source is loaded
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Audio play prevented:", error));
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    if (!isNaN(total)) {
      setProgress((current / total) * 100);
    }
  };

  const skipNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress((clickX / width) * 100);
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border border-fuchsia-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
      <audio 
        ref={audioRef} 
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipNext}
      />
      
      {/* Visualizer Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Disc3 className={`w-10 h-10 text-fuchsia-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            {isPlaying && (
              <span className="absolute inset-0 bg-fuchsia-400 blur-xl opacity-30 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <p className="text-fuchsia-500 text-xs font-mono font-bold tracking-widest uppercase mb-1">Now Playing</p>
            <h3 className="text-white font-semibold text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {currentTrack.title}
            </h3>
          </div>
        </div>
        <Volume2 className="w-5 h-5 text-fuchsia-400/50" />
      </div>

      {/* Progress Bar */}
      <div className="group relative">
        <div 
          className="h-3 w-full bg-slate-900/80 border border-fuchsia-500/20 rounded-full overflow-hidden cursor-pointer" 
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-fuchsia-600 to-cyan-400 shadow-[0_0_10px_rgba(217,70,239,0.8)] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <button 
          onClick={skipPrev}
          className="p-2 text-cyan-500 hover:text-cyan-400 transition-all focus:outline-none hover:scale-110 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] hover:drop-shadow-[0_0_20px_rgba(6,182,212,1)]"
        >
          <SkipBack className="w-8 h-8" fill="currentColor" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-2 text-fuchsia-500 hover:text-fuchsia-400 transition-all focus:outline-none hover:scale-110 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] hover:drop-shadow-[0_0_25px_rgba(217,70,239,1)]"
        >
          {isPlaying ? <Pause className="w-12 h-12" fill="currentColor" /> : <Play className="w-12 h-12 translate-x-1" fill="currentColor" />}
        </button>
        
        <button 
          onClick={skipNext}
          className="p-2 text-cyan-500 hover:text-cyan-400 transition-all focus:outline-none hover:scale-110 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] hover:drop-shadow-[0_0_20px_rgba(6,182,212,1)]"
        >
          <SkipForward className="w-8 h-8" fill="currentColor" />
        </button>
      </div>

    </div>
  );
}
