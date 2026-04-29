import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Use refs for values needed cleanly inside the game loop interval
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const gameLoopRef = useRef<number | null>(null);

  // Key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling with arrows
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;

      const currentD = directionRef.current;

      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentD.y !== 1) nextDirectionRef.current = {x: 0, y: -1}; break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentD.y !== -1) nextDirectionRef.current = {x: 0, y: 1}; break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentD.x !== 1) nextDirectionRef.current = {x: -1, y: 0}; break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentD.x !== -1) nextDirectionRef.current = {x: 1, y: 0}; break;
        case ' ': // space to pause/start
          if (!hasStarted) {
             setHasStarted(true);
          } else {
             setIsPaused(p => !p); 
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    generateFood(INITIAL_SNAKE);
  };

  const generateFood = (currentSnake: {x: number, y: number}[]) => {
    let newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    while(currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    }
    setFood(newFood);
    foodRef.current = newFood;
  };

  const moveSnake = useCallback(() => {
    const currentSnake = [...snakeRef.current];
    const head = currentSnake[0];
    const currentDir = nextDirectionRef.current;
    
    // Sync direction states
    directionRef.current = currentDir;
    setDirection(currentDir); 

    const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

    // Wall Collision Check
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setGameOver(true);
      return;
    }
    
    // Self Collision Check
    if (currentSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      setGameOver(true);
      return;
    }

    currentSnake.unshift(newHead);

    const foodPos = foodRef.current;
    if (newHead.x === foodPos.x && newHead.y === foodPos.y) {
      // Ate food
      setScore(s => {
         const newScore = s + 10;
         setHighScore(prev => Math.max(prev, newScore));
         return newScore;
      });
      generateFood(currentSnake);
    } else {
      // Didn't eat, pop tail
      currentSnake.pop();
    }

    setSnake(currentSnake);
    snakeRef.current = currentSnake;
  }, []);

  // Main Loop
  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;
    
    // Decrease interval as score goes up, base is 130ms, floors at 60ms
    const speed = Math.max(60, 130 - Math.floor(score / 50) * 5);
    
    gameLoopRef.current = window.setInterval(moveSnake, speed);
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, isPaused, hasStarted, moveSnake, score]);

  return (
    <div className="flex flex-col items-center w-full max-w-[500px]">
      
      {/* Score Header */}
      <div className="w-full flex justify-between items-center mb-6 bg-slate-900/60 p-4 border-b border-cyan-500/40 rounded-t-xl shadow-[0_4px_15px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col">
          <span className="text-cyan-500 text-xs font-mono uppercase tracking-widest font-bold">Score</span>
          <span className="text-white text-3xl font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] tracking-tighter">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="flex items-center gap-1 text-fuchsia-500 text-xs font-mono uppercase tracking-widest font-bold">
            <Trophy className="w-3 h-3" /> Best
          </span>
          <span className="text-white text-xl font-bold tracking-tighter opacity-80">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative w-full aspect-square bg-slate-950 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] rounded-b-xl rounded-t-sm overflow-hidden p-1">
        <div 
          className="w-full relative h-full grid gap-[1px]" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {[...Array(GRID_SIZE)].map((_, y) => 
            [...Array(GRID_SIZE)].map((_, x) => {
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              let cellClass = "bg-slate-900/50 rounded-[1px]"; // empty style
              if (isHead) {
                cellClass = "bg-cyan-300 shadow-[0_0_8px_#67e8f9] rounded-sm z-10 relative";
              } else if (isBody) {
                cellClass = "bg-cyan-500 opacity-80 rounded-sm";
              } else if (isFood) {
                cellClass = "bg-fuchsia-500 shadow-[0_0_12px_#d946ef] rounded-full animate-pulse z-10 relative";
              }

              return <div key={`${x}-${y}`} className={cellClass} />;
            })
          )}
        </div>

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <h2 className="text-cyan-400 text-2xl font-bold mb-4 uppercase tracking-widest animate-pulse">Ready</h2>
            <button 
              onClick={() => setHasStarted(true)}
              className="px-6 py-3 bg-cyan-500/20 w-fit text-cyan-300 border border-cyan-500 rounded font-mono uppercase hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            >
              Start System [Space]
            </button>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <h2 className="text-yellow-400 text-3xl font-bold tracking-widest uppercase mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">Paused</h2>
            <p className="text-slate-300 font-mono text-sm">Press Space to Resume</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md border border-fuchsia-500 rounded-b-xl rounded-t-sm shadow-[inset_0_0_50px_rgba(217,70,239,0.3)]">
            <h2 className="text-fuchsia-500 text-4xl font-black mb-2 uppercase tracking-tight drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]">System Failure</h2>
            <p className="text-slate-300 font-mono text-2xl lg:text-3xl mb-8 uppercase tracking-[0.2em] glitch-text">Final Score: <span className="text-cyan-400 font-black drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">{score}</span></p>
            
            <button 
              onClick={resetGame}
              className="group flex flex-col items-center gap-2"
            >
              <div className="p-4 bg-cyan-500 text-black rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:bg-cyan-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.9)] transition-all">
                <RotateCcw className="w-8 h-8" />
              </div>
              <span className="text-cyan-400 font-mono uppercase text-2xl lg:text-3xl font-black tracking-[0.2em] mt-2 group-hover:text-cyan-300 glitch-text drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">PLAY</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
