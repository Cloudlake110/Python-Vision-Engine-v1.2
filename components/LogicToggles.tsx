import React, { useState, useEffect } from 'react';
import { ToggleLeft, Lightbulb, Zap, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { Student } from '../types';

const LOGIC_DATA: Student[] = [
  { id: 1, name: 'Student A', score: 45, group: 'C' },
  { id: 2, name: 'Student B', score: 92, group: 'A' },
  { id: 3, name: 'Student C', score: 67, group: 'B' },
  { id: 4, name: 'Student D', score: 88, group: 'A' },
  { id: 5, name: 'Student E', score: 30, group: 'C' },
];

interface Props {
  setConsole: (msg: string) => void;
}

export const LogicToggles: React.FC<Props> = ({ setConsole }) => {
  const [threshold, setThreshold] = useState(60);
  const [operator, setOperator] = useState<'>' | '<' | '=='>('>');

  const checkLogic = (val: number) => {
    switch (operator) {
      case '>': return val > threshold;
      case '<': return val < threshold;
      case '==': return val === threshold;
    }
  };
  
  const trueCount = LOGIC_DATA.filter(s => checkLogic(s.score)).length;

  useEffect(() => {
      setConsole(`Level 4: 逻辑开关。<b>Bool (布尔值)</b> 只有 <span class='text-pve-green'>True</span> 和 <span class='text-pve-red'>False</span>。筛选就像过筛子，条件为真的留下，假的漏掉。`);
  }, []);

  useEffect(() => {
      setConsole(`🤖 逻辑运算：<span class="font-mono">score <b class="text-pve-amber">${operator}</b> ${threshold}</span>。<br/>结果为 <span class="text-pve-green font-bold">True</span> 的行亮起。共选中 <span class="text-white font-bold">${trueCount}</span> 行。`);
  }, [threshold, operator, trueCount]);

  return (
    <div className="flex flex-col h-full space-y-6 p-4">
      {/* Header & Controls */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2 text-pve-amber mb-6">
          <ToggleLeft /> Level 4: 逻辑开关 (Logic Toggles)
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Logic Builder */}
          <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-600 shadow-inner">
            <span className="font-mono text-slate-400">mask = score</span>
            
            <div className="flex bg-slate-800 rounded p-1">
              {(['>', '<', '=='] as const).map(op => (
                <button
                  key={op}
                  onClick={() => setOperator(op)}
                  className={`px-3 py-1 font-mono font-bold rounded transition-colors ${operator === op ? 'bg-pve-amber text-slate-900' : 'text-slate-500 hover:text-white'}`}
                >
                  {op}
                </button>
              ))}
            </div>

            <input 
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-20 bg-slate-800 border border-slate-600 rounded p-1 text-center font-mono text-white focus:border-pve-amber outline-none"
            />
          </div>

          {/* Visual Explanation */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
             <div className="flex flex-col items-center">
                <CheckCircle2 size={16} className="text-pve-green mb-1"/>
                <span>True (保留)</span>
             </div>
             <div className="w-px h-8 bg-slate-600"></div>
             <div className="flex flex-col items-center">
                <XCircle size={16} className="text-pve-red mb-1"/>
                <span>False (过滤)</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 overflow-y-auto content-start p-2">
        {LOGIC_DATA.map((student) => {
          const isActive = checkLogic(student.score);
          
          return (
            <div 
              key={student.id}
              className={`
                relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-500
                ${isActive 
                  ? 'bg-slate-800 border-pve-amber shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105 z-10' 
                  : 'bg-slate-900/50 border-slate-800 opacity-40 grayscale scale-95'}
              `}
            >
              {/* Light Status */}
              <div className={`absolute -top-3 p-2 rounded-full border-2 bg-slate-900 transition-colors duration-300 ${isActive ? 'border-pve-amber text-pve-amber shadow-lg' : 'border-slate-700 text-slate-700'}`}>
                {isActive ? <Lightbulb className="fill-current" size={20} /> : <Lightbulb size={20} />}
              </div>

              {/* Data Content */}
              <div className="mt-4 text-center">
                <div className="text-3xl font-mono font-bold mb-2">{student.score}</div>
                <div className="text-sm text-slate-400">{student.name}</div>
              </div>

              {/* Boolean Badge */}
              <div className={`mt-6 px-3 py-1 rounded text-xs font-mono font-bold uppercase flex items-center gap-1 ${isActive ? 'bg-pve-green/20 text-pve-green' : 'bg-pve-red/20 text-pve-red'}`}>
                {isActive ? <CheckCircle2 size={12}/> : <XCircle size={12} />}
                {isActive ? 'True' : 'False'}
              </div>
              
              {/* Wire Connection Visual */}
              <div className={`absolute bottom-0 w-0.5 h-full -z-10 ${isActive ? 'bg-gradient-to-t from-pve-amber to-transparent opacity-50' : 'hidden'}`}></div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
        <div className="text-sm text-slate-400 flex items-center gap-2"><Filter size={16}/> Pandas Filtering Result:</div>
        <div className="font-mono text-xl font-bold text-white">
          <span className="text-pve-amber">{trueCount}</span> 
          <span className="text-slate-600 mx-2">/</span>
          {LOGIC_DATA.length} Rows Selected
        </div>
      </div>
    </div>
  );
};
