import React, { useState, useEffect } from 'react';
import { GitCommit, XCircle, Edit3, Filter, Plus, ArrowUpDown, Calculator, Table, ListFilter } from 'lucide-react';
import { ChainStep } from '../types';

type Scenario = 'CLEANING' | 'ANALYTICS';

interface DataRow {
  id: number;
  name: string;
  score: number | null;
  // Scenario specific
  group?: string; 
  isValid?: boolean; // For Cleaning
}

const CLEANING_DATA: DataRow[] = [
  { id: 1, name: 'Alice', score: 95, isValid: true },
  { id: 2, name: 'Bob', score: null, isValid: false },
  { id: 3, name: 'Charlie', score: 82, isValid: true },
  { id: 4, name: 'David', score: null, isValid: false },
  { id: 5, name: 'Eve', score: 88, isValid: true },
];

const ANALYTICS_DATA: DataRow[] = [
  { id: 101, name: 'Frank', score: 75, group: 'A' },
  { id: 102, name: 'Grace', score: 92, group: 'B' },
  { id: 103, name: 'Heidi', score: 88, group: 'A' },
  { id: 104, name: 'Ivan', score: 60, group: 'C' },
  { id: 105, name: 'Judy', score: 95, group: 'B' },
];

interface Props {
  setConsole: (msg: string) => void;
}

export const ChainInterpreter: React.FC<Props> = ({ setConsole }) => {
  const [scenario, setScenario] = useState<Scenario>('CLEANING');
  const [step, setStep] = useState<ChainStep>(0);

  // Reset step when scenario changes
  useEffect(() => {
    setStep(0);
  }, [scenario]);
  
  // --- Data Processing Logic ---
  const getDisplayData = () => {
    const sourceData = scenario === 'CLEANING' ? CLEANING_DATA : ANALYTICS_DATA;
    
    // For sorting (Step 3 of Analytics), we need a sorted copy
    if (scenario === 'ANALYTICS' && step === 3) {
      // Sort by score descending
      return [...sourceData].sort((a, b) => (b.score || 0) - (a.score || 0));
    }
    
    return sourceData;
  };

  const isRowVisible = (row: DataRow) => {
    if (scenario === 'CLEANING') {
      // Step 1+: Hide invalid rows (dropna)
      if (step >= 1 && !row.isValid) return false;
    }
    if (scenario === 'ANALYTICS') {
      // Step 1+: Hide scores < 80 (query)
      if (step >= 1 && (row.score || 0) < 80) return false;
    }
    return true;
  };

  const getSingleValue = () => {
    // Only for Cleaning Step 3
    const validScores = CLEANING_DATA.filter(r => r.isValid && r.score !== null).map(r => r.score as number);
    const sum = validScores.reduce((a, b) => a + b, 0);
    return (sum / validScores.length).toFixed(1);
  };

  // --- UI Helpers ---
  const getCurrentCode = () => {
    if (scenario === 'CLEANING') {
      switch(step) {
        case 0: return <span className="text-slate-500">data</span>;
        case 1: return <span><span className="text-slate-500">data</span><span className="text-pve-red font-bold">.dropna()</span></span>;
        case 2: return <span><span className="text-slate-500">data.dropna()</span><span className="text-pve-purple font-bold">.rename(cols=...)</span></span>;
        case 3: return <span><span className="text-slate-500">data...rename()</span><span className="text-pve-blue font-bold">.mean()</span></span>;
      }
    } else {
      switch(step) {
        case 0: return <span className="text-slate-500">df</span>;
        case 1: return <span><span className="text-slate-500">df</span><span className="text-pve-amber font-bold">.query("score >= 80")</span></span>;
        case 2: return <span><span className="text-slate-500">df...query()</span><span className="text-pve-green font-bold">.assign(grade="A")</span></span>;
        case 3: return <span><span className="text-slate-500">df...assign()</span><span className="text-pink-500 font-bold">.sort_values("score")</span></span>;
      }
    }
  };

  const getExplanation = () => {
    if (scenario === 'CLEANING') {
      switch(step) {
        case 0: return "🤖 准备就绪：加载原始数据。注意看，有些地方是空的 (<span class='text-pve-red'>NaN</span>)，那是我们要处理的脏数据。";
        case 1: return "🧹 <b>.dropna()</b>：启动吸尘器！把所有包含空值 (NaN) 的行<span class='text-pve-red font-bold'>直接丢弃</span>，只保留完整的数据。";
        case 2: return "🏷️ <b>.rename()</b>：贴换标签。把原来的列名 'score' 撕下来，换成更正式的 '<span class='text-pve-purple font-bold'>Final_Grade</span>'。";
        case 3: return "📊 <b>.mean()</b>：压缩汇总。把整张表格的数据“捏”在一起，算出一个<span class='text-pve-blue font-bold'>平均值</span>。";
      }
    } else {
      switch(step) {
        case 0: return "🤖 准备就绪：加载 DataFrame 'df'。我们来看看谁是优等生。";
        case 1: return "🔍 <b>.query()</b>：设置安检门。只有分数 <span class='text-pve-amber font-bold'>&ge; 80</span> 的数据才能通过，其他的都被拦在门外。";
        case 2: return "➕ <b>.assign()</b>：发放奖励。给通过筛选的所有人发一个新的标签 '<span class='text-pve-green font-bold'>grade = A</span>'。";
        case 3: return "📉 <b>.sort_values()</b>：重新排队。按照分数<span class='text-pink-500 font-bold'>从高到低</span> (Descending) 的顺序重新排列队伍。";
      }
    }
    return "";
  };
  
  // Sync explanation with global console
  useEffect(() => {
     setConsole(getExplanation());
  }, [step, scenario]);

  const getStepLabels = () => {
    if (scenario === 'CLEANING') return ['Raw', 'dropna()', 'rename()', 'mean()'];
    return ['Raw', 'query()', 'assign()', 'sort()'];
  };

  const getStepColor = (idx: number) => {
    const colors = scenario === 'CLEANING' 
      ? ['text-white', 'text-pve-red', 'text-pve-purple', 'text-pve-blue']
      : ['text-white', 'text-pve-amber', 'text-pve-green', 'text-pink-500'];
    return step >= idx ? colors[idx] : 'text-slate-600';
  };

  const showTable = !(scenario === 'CLEANING' && step === 3);

  return (
    <div className="flex flex-col h-full space-y-6 p-4">
      {/* Top Controller */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg z-20">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-pve-purple mb-2">
              <GitCommit /> Level 5: Chain Interpreter
            </h2>
            <div className="flex gap-2 bg-slate-900 p-1 rounded-lg inline-flex">
              <button 
                onClick={() => setScenario('CLEANING')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${scenario === 'CLEANING' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                1. Data Cleaning
              </button>
              <button 
                onClick={() => setScenario('ANALYTICS')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${scenario === 'ANALYTICS' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                2. Analytics Pipeline
              </button>
            </div>
          </div>
          
          <div className="font-mono text-sm md:text-lg bg-slate-950 px-4 py-3 rounded border border-slate-600 w-full md:w-auto min-w-[320px] text-center shadow-inner">
            {getCurrentCode()}
          </div>
        </div>

        <div className="relative pt-6 pb-2 px-2">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-700 rounded-full -z-0"></div>
          {/* Progress Bar Fill */}
          <div 
            className={`absolute top-1/2 left-0 h-2 rounded-full -z-0 transition-all duration-500 ${scenario === 'CLEANING' ? 'bg-gradient-to-r from-pve-red via-pve-purple to-pve-blue' : 'bg-gradient-to-r from-pve-amber via-pve-green to-pink-500'}`}
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>

          <input 
            type="range" 
            min="0" 
            max="3" 
            step="1" 
            value={step}
            onChange={(e) => setStep(Number(e.target.value) as ChainStep)}
            className="w-full relative z-10 cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
          />
          
          <div className="flex justify-between mt-4 text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest">
            {getStepLabels().map((label, idx) => (
              <span key={idx} className={`transition-colors duration-300 ${getStepColor(idx)}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Visualization Stage */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center p-8 perspective-[1000px]">
        
        {!showTable ? (
             // Single Number View (Cleaning Step 3)
             <div className="animate-scale-in flex flex-col items-center gap-4">
                <div className="w-48 h-48 rounded-full bg-slate-800 border-4 border-pve-blue flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                  <div className="flex flex-col items-center">
                    <Calculator className="text-pve-blue mb-2" size={32} />
                    <div className="text-5xl font-mono font-bold text-white">
                      {getSingleValue()}
                    </div>
                  </div>
                </div>
                <div className="text-pve-blue font-mono text-lg">Final_Grade (Mean)</div>
             </div>
        ) : (
          // Table View
          <div className="w-full max-w-3xl transition-all duration-500 transform">
            <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-600 shadow-2xl relative">
              
              {/* Table Header */}
              <div className={`grid ${scenario === 'ANALYTICS' && step >= 2 ? 'grid-cols-4' : 'grid-cols-3'} bg-slate-950 p-4 border-b border-slate-600 font-mono text-sm text-slate-400 transition-all duration-300`}>
                <div>ID</div>
                <div>Name</div>
                <div className={`transition-colors duration-500 flex items-center gap-2 ${scenario === 'CLEANING' && step >= 2 ? 'text-pve-purple font-bold' : ''}`}>
                  {scenario === 'CLEANING' && step >= 2 ? 'Final_Grade' : 'Score'}
                  {scenario === 'CLEANING' && step >= 2 && <Edit3 size={12}/>}
                  {scenario === 'ANALYTICS' && step >= 3 && <ArrowUpDown size={12} className="text-pink-500"/>}
                </div>
                {/* Analytics Extra Column */}
                {scenario === 'ANALYTICS' && step >= 2 && (
                  <div className="text-pve-green font-bold flex items-center gap-2 animate-fade-in">
                    Grade <Plus size={12}/>
                  </div>
                )}
              </div>

              {/* Table Rows */}
              {getDisplayData().map((row, idx) => {
                const visible = isRowVisible(row);
                const isFiltered = !visible;
                
                return (
                  <div 
                    key={row.id}
                    className={`
                      grid ${scenario === 'ANALYTICS' && step >= 2 ? 'grid-cols-4' : 'grid-cols-3'} p-4 border-b border-slate-700 transition-all duration-700 ease-in-out
                      ${isFiltered 
                        ? 'opacity-0 h-0 p-0 border-0 overflow-hidden scale-95 origin-center' 
                        : 'opacity-100 h-16 scale-100 hover:bg-slate-700/50'
                      }
                      ${scenario === 'ANALYTICS' && step === 3 && idx === 0 ? 'bg-pink-500/10' : ''} 
                    `}
                  >
                    <div className="font-mono text-slate-500 flex items-center">{row.id}</div>
                    <div className="text-slate-200 flex items-center">{row.name}</div>
                    <div className="font-mono flex items-center relative">
                      {row.score === null ? (
                        <span className="text-pve-red italic flex items-center gap-1">
                           NaN <XCircle size={14} />
                        </span>
                      ) : (
                        <span className={`${scenario === 'ANALYTICS' && row.score && row.score >= 80 ? 'text-pve-green' : 'text-slate-300'}`}>
                          {row.score}
                        </span>
                      )}
                    </div>
                    {/* Extra Column Cell */}
                    {scenario === 'ANALYTICS' && step >= 2 && (
                       <div className="font-mono text-pve-green font-bold flex items-center animate-fade-in">
                         "A"
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Visual Cues Overlays */}
            {scenario === 'CLEANING' && step === 1 && (
               <div className="absolute top-1/2 -right-16 text-pve-red animate-pulse flex flex-col items-center">
                 <XCircle size={32} />
                 <span className="text-xs mt-1 font-bold">Dropping...</span>
               </div>
            )}
            {scenario === 'ANALYTICS' && step === 1 && (
               <div className="absolute top-1/2 -right-16 text-pve-amber animate-pulse flex flex-col items-center">
                 <Filter size={32} />
                 <span className="text-xs mt-1 font-bold">Filtering...</span>
               </div>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
};
