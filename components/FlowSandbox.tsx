import React, { useState, useEffect } from 'react';
import { GitFork, Repeat, Play, RefreshCw, Check, X } from 'lucide-react';

interface Props {
  setConsole: (msg: string) => void;
}

export const FlowSandbox: React.FC<Props> = ({ setConsole }) => {
  const [mode, setMode] = useState<'IF' | 'FOR'>('IF');
  const [ifCondition, setIfCondition] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [loopIndex, setLoopIndex] = useState(-1);

  // For Loop items
  const loopItems = [10, 20, 30, 40, 50];

  useEffect(() => {
    if (mode === 'IF') {
        setConsole("If/Else 分叉口：逻辑的闸机。Condition True 往左走，False 往右走。");
    } else {
        setConsole("For 循环传送带：流水线加工。每次循环只处理传送带上的【一个】数据。");
    }
  }, [mode]);

  const runIfAnimation = () => {
    if (animating) return;
    setAnimating(true);
    setConsole(ifCondition ? "判定为 True：闸门开启，进入 If 内部代码块。" : "判定为 False：被拒绝，被踢到 Else 分支。");
    setTimeout(() => setAnimating(false), 2000);
  };

  const runLoopAnimation = () => {
    if (animating) return;
    setAnimating(true);
    let current = 0;
    
    const interval = setInterval(() => {
        setLoopIndex(current);
        setConsole(`循环第 ${current + 1} 次：正在处理数据 ${loopItems[current]} ...`);
        current++;
        if (current >= loopItems.length) {
            clearInterval(interval);
            setTimeout(() => {
                setLoopIndex(-1);
                setAnimating(false);
                setConsole("循环结束 (Loop Finished)。");
            }, 1000);
        }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2 text-pve-purple">
          {mode === 'IF' ? <GitFork /> : <Repeat />} Level 3: 流程控制沙盒 (Flow Sandbox)
        </h2>
        <div className="bg-slate-900 p-1 rounded-lg flex">
             <button onClick={() => setMode('IF')} className={`px-4 py-2 rounded ${mode === 'IF' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>If / Else</button>
             <button onClick={() => setMode('FOR')} className={`px-4 py-2 rounded ${mode === 'FOR' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>For Loop</button>
        </div>
      </div>

      {/* Main Sandbox */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden p-8 flex flex-col items-center justify-center">
        
        {/* IF MODE */}
        {mode === 'IF' && (
            <div className="relative w-full max-w-lg h-80">
                {/* Code Block Visual */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 p-3 rounded border border-slate-600 z-20 flex flex-col items-center gap-2">
                    <div className="font-mono text-sm">if score &gt; 60:</div>
                    <button 
                        onClick={() => setIfCondition(!ifCondition)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${ifCondition ? 'bg-pve-green text-black' : 'bg-pve-red text-white'}`}
                    >
                        Condition: {ifCondition.toString()}
                    </button>
                    <button onClick={runIfAnimation} disabled={animating} className="mt-2 text-white bg-pve-blue rounded-full p-2 hover:bg-blue-400 disabled:opacity-50">
                        <Play size={16} fill="currentColor" />
                    </button>
                </div>

                {/* The Fork Path */}
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-2 h-24 bg-slate-700"></div>
                
                {/* Gate */}
                <div className={`absolute top-40 left-1/2 w-20 h-2 bg-white transition-transform duration-500 origin-left z-10 ${ifCondition ? 'rotate-45 bg-pve-green' : '-rotate-[135deg] bg-pve-red'} `} style={{ left: 'calc(50% - 2px)'}}></div>

                {/* Left Branch (True) */}
                <div className="absolute top-48 left-[20%] w-[30%] h-2 bg-slate-700 -rotate-12 border-b-4 border-pve-green/20"></div>
                <div className="absolute bottom-10 left-[15%] text-pve-green font-bold flex flex-col items-center">
                    <CheckCircleIcon />
                    <span>Pass</span>
                </div>

                {/* Right Branch (False) */}
                <div className="absolute top-48 right-[20%] w-[30%] h-2 bg-slate-700 rotate-12 border-b-4 border-pve-red/20"></div>
                <div className="absolute bottom-10 right-[15%] text-pve-red font-bold flex flex-col items-center">
                    <XCircleIcon />
                    <span>Fail</span>
                </div>

                {/* The Ball */}
                {animating && (
                    <div 
                        className={`absolute w-6 h-6 bg-yellow-400 rounded-full shadow-[0_0_15px_yellow] z-30 transition-all duration-[2000ms] linear`}
                        style={{
                            top: ifCondition ? '80%' : '80%',
                            left: ifCondition ? '20%' : '80%',
                            opacity: 0, // Fade out at end
                            animation: `rollDown${ifCondition ? 'Left' : 'Right'} 2s forwards`
                        }}
                    ></div>
                )}
            </div>
        )}

        {/* FOR MODE */}
        {mode === 'FOR' && (
            <div className="w-full max-w-2xl flex flex-col items-center">
                <div className="bg-slate-800 p-4 rounded border border-slate-600 font-mono mb-8 w-full text-center">
                    for i in data_list: <br/>
                    <span className="text-pve-blue ml-4">process(i)</span>
                </div>
                
                <div className="relative w-full h-32 bg-slate-800 rounded-full border-y-4 border-slate-700 overflow-hidden flex items-center px-4">
                    {/* Items on Conveyor */}
                    {loopItems.map((item, idx) => (
                        <div 
                            key={idx}
                            className={`
                                flex-shrink-0 w-20 h-20 mx-4 rounded-lg flex items-center justify-center font-bold text-xl border-2 transition-all duration-500
                                ${idx === loopIndex 
                                    ? 'bg-pve-blue text-white border-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                                    : idx < loopIndex 
                                        ? 'bg-slate-700 text-slate-500 border-slate-600 opacity-50' 
                                        : 'bg-slate-600 text-slate-300 border-slate-500'
                                }
                            `}
                        >
                            {item}
                        </div>
                    ))}
                    
                    {/* Processing Head */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-full border-x-2 border-pve-amber bg-pve-amber/5 z-20 flex flex-col justify-between py-2 items-center pointer-events-none">
                         <div className="w-full h-1 bg-pve-amber animate-pulse"></div>
                         <span className="text-xs text-pve-amber font-bold uppercase">Processing Head</span>
                         <div className="w-full h-1 bg-pve-amber animate-pulse"></div>
                    </div>
                </div>

                <button 
                    onClick={runLoopAnimation} 
                    disabled={animating}
                    className="mt-8 flex items-center gap-2 bg-pve-blue text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-all"
                >
                   {animating ? <RefreshCw className="animate-spin"/> : <Play />} 
                   Start Loop
                </button>
            </div>
        )}

        <style>{`
            @keyframes rollDownLeft {
                0% { top: 0; left: 50%; opacity: 1; }
                30% { top: 40%; left: 50%; }
                40% { top: 45%; left: 45%; }
                100% { top: 80%; left: 15%; opacity: 0; }
            }
            @keyframes rollDownRight {
                0% { top: 0; left: 50%; opacity: 1; }
                30% { top: 40%; left: 50%; }
                40% { top: 45%; left: 55%; }
                100% { top: 80%; left: 85%; opacity: 0; }
            }
        `}</style>
      </div>
    </div>
  );
};

const CheckCircleIcon = () => <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-pve-green flex items-center justify-center mb-2"><Check size={16}/></div>
const XCircleIcon = () => <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-pve-red flex items-center justify-center mb-2"><X size={16}/></div>
