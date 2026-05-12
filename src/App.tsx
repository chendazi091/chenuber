import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, AlertCircle, TrendingDown, TrendingUp, Hash, History } from 'lucide-react';

type GameStatus = 'playing' | 'won' | 'empty';

export default function App() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [secret, setSecret] = useState(0);
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState<number[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [message, setMessage] = useState('猜一個數字！');
  const [shake, setShake] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const initGame = () => {
    const randomSecret = Math.floor(Math.random() * 98) + 2; // 2 to 99
    setSecret(randomSecret);
    setMin(1);
    setMax(100);
    setGuess('');
    setHistory([]);
    setStatus('playing');
    setMessage('遊戲開始！範圍是 1 到 100');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const num = parseInt(guess);
    
    if (isNaN(num) || num <= min || num >= max) {
      setMessage(`請輸入範圍內 (${min} ~ ${max}) 的數字！`);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setHistory([num, ...history]);

    if (num === secret) {
      setStatus('won');
      setMessage(`恭喜！答案就是 ${num}`);
    } else if (num < secret) {
      setMin(num);
      setMessage(`太小了！範圍縮小為 ${num} ~ ${max}`);
      setGuess('');
    } else {
      setMax(num);
      setMessage(`太大了！範圍縮小為 ${min} ~ ${num}`);
      setGuess('');
    }
    
    inputRef.current?.focus();
  };

  const handleQuickInput = (val: string) => {
    if (status !== 'playing') return;
    setGuess(prev => prev + val);
  };

  const clearInput = () => setGuess('');

  return (
    <div id="game-container" className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100">
      <div id="game-card" className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        
        {/* Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              終極密碼
            </h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-mono">Ultimate Guess</p>
          </div>

          {/* Display Range */}
          <div className="w-full flex items-center justify-between gap-4 py-6 border-y border-slate-800/50">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 uppercase font-bold mb-1">MIN</span>
              <span className="text-4xl font-mono font-bold text-blue-400">{min}</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner"
                >
                  {status === 'won' ? (
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <Hash className="w-8 h-8 text-slate-400 animate-pulse" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 uppercase font-bold mb-1">MAX</span>
              <span className="text-4xl font-mono font-bold text-purple-400">{max}</span>
            </div>
          </div>

          {/* Feedback Message */}
          <motion.div 
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            className={`text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === 'won' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800/50 text-slate-300'
            }`}
          >
            {message}
          </motion.div>

          {/* Input Area */}
          <div className="w-full space-y-4">
            {status === 'playing' ? (
              <form onSubmit={handleGuess} className="space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    autoFocus
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="輸入數字..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-2xl font-mono text-center focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 appearance-none"
                  />
                  {guess && (
                    <button 
                      type="button"
                      onClick={clearInput}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <button
                  id="submit-guess"
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  確認猜測
                </button>
              </form>
            ) : (
              <button
                id="play-again"
                onClick={initGame}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> 再玩一次
              </button>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="w-full">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-3">
                <History className="w-3 h-3" />
                <span>歷史紀錄</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={`${h}-${i}`}
                    className="px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-xs font-mono text-slate-400"
                  >
                    {h}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-slate-600 text-xs flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> 縮小範圍，找到隱藏的終極密碼
      </p>
    </div>
  );
}
