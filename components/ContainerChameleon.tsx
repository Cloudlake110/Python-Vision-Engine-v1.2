import React, { useState, useEffect } from 'react';
import { Library, Grid3X3, ArrowRight, MousePointerClick, Box, Lock, List } from 'lucide-react';
import { ViewMode, Student } from '../types';

const RAW_DATA: Student[] = [
  { id: 0, name: 'Alice', score: 92, group: 'A' },
  { id: 1, name: 'Bob', score: 78, group: 'B' },
  { id: 2, name: 'Charlie', score: 88, group: 'A' },
];

interface Props {
  setConsole: (msg: string) => void;
}

export const ContainerChameleon: React.FC<Props> = ({ setConsole }) => {
  const [mode, setMode] = useState<ViewMode>('LIST');
  const [highlightBracket, setHighlightBracket] = useState(false);

  useEffect(() => {
    let msg = "";
    const prefix = "🤖 翻译官：";
    if(mode === 'LIST') msg = `${prefix}<span class="text-pve-green font-bold">列表 (List) []</span> 是条<b class="text-white">可变的传送带</b>。你可以随时把东西拿下来，或者放新的上去。`;
    if(mode === 'TUPLE') msg = `${prefix}<span class="text-pve-amber font-bold">元组 (Tuple) ()</span> 是个<b class="text-white">焊死的保险箱</b>。一旦创建，里面的东西就永久固定，不可修改 (Immutable)。`;
    if(mode === 'DICT') msg = `${prefix}<span class="text-pve-purple font-bold">字典 (Dict) {}</span> 是排<b class="text-white">带标签的储物柜</b>。不靠顺序，全靠唯一的标签 (Key) 来存取物品。`;
    if(mode === 'SERIES') msg = `${prefix}<span class="text-slate-300 font-bold">Series</span> 就像一把<b class="text-white">带刻度的标尺</b>。它是 DataFrame 的一列，既有顺序，又有对应的索引标签。`;
    if(mode === 'DATAFRAME') msg = `${prefix}<span class="text-blue-400 font-bold">DataFrame</span> 是个<b class="text-white">二维表格</b>。由多个 Series 并排拼接而成，就像 Excel 表格一样强大。`;
    setConsole(msg);
  }, [mode]);

  const toggleHighlight = () => {
    setHighlightBracket(true);
    setTimeout(() => setHighlightBracket(false), 1000);
  };

  const getBracketText = () => {
      switch(mode) {
          case 'LIST': return '[0]';
          case 'TUPLE': return '[0]'; // Access uses [], def uses ()
          case 'DICT': return "['key']";
          case 'SERIES': return ".iloc[0]";
          case 'DATAFRAME': return ".loc[row, col]";
      }
  }

  return (
    <div className="flex flex-col h-full space-y-6 p-4">
      {/* Header & Controls - Scrollable on mobile */}
      <div className="flex flex-col gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2 text-pve-green">
          <Library /> Level 3: 容器变形记 (Container Chameleon)
        </h2>
        
        <div className="flex bg-slate-900 p-1 rounded-lg overflow-x-auto no-scrollbar gap-1">
          <button onClick={() => setMode('LIST')} className={`flex-shrink-0 px-3 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm transition-all ${mode === 'LIST' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}>
            <ArrowRight size={14} /> List []
          </button>
          <button onClick={() => setMode('TUPLE')} className={`flex-shrink-0 px-3 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm transition-all ${mode === 'TUPLE' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}>
            <Lock size={14} /> Tuple ()
          </button>
          <button onClick={() => setMode('DICT')} className={`flex-shrink-0 px-3 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm transition-all ${mode === 'DICT' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}>
            <Library size={14} /> Dict {'{}'}
          </button>
           <button onClick={() => setMode('SERIES')} className={`flex-shrink-0 px-3 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm transition-all ${mode === 'SERIES' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}>
            <List size={14} /> Series
          </button>
          <button onClick={() => setMode('DATAFRAME')} className={`flex-shrink-0 px-3 py-2 rounded-md flex items-center gap-2 text-xs md:text-sm transition-all ${mode === 'DATAFRAME' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}>
            <Grid3X3 size={14} /> DataFrame
          </button>
        </div>
      </div>

      {/* Code Interaction Zone */}
      <div className="bg-slate-950 p-4 rounded-lg font-mono text-center border border-slate-700 flex justify-center items-center gap-2">
        <span className="text-slate-400">container</span>
        <span 
          onClick={toggleHighlight}
          className={`cursor-pointer px-1 rounded transition-all duration-300 hover:bg-slate-800 hover:text-white ${highlightBracket ? 'text-pve-green scale-150 font-bold bg-white/10' : 'text-pve-green'}`}
        >
          {getBracketText()}
        </span>
        <span className="text-xs text-slate-500 flex items-center gap-1 ml-4 animate-bounce"><MousePointerClick size={12}/> 点击 (Click)</span>
      </div>

      {/* Main Stage */}
      <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center p-8">
        
        {/* LIST VIEW */}
        {mode === 'LIST' && (
          <div className="flex gap-4 overflow-x-auto w-full items-center justify-center p-4">
            <div className="absolute left-0 top-1/2 w-full h-4 bg-slate-900 -z-0 -translate-y-1/2 border-y border-slate-700"></div>
            {RAW_DATA.map((item, idx) => (
              <div key={item.id} className={`relative z-10 transition-all duration-500 ${highlightBracket && idx === 0 ? 'scale-110 -translate-y-4' : ''}`}>
                <div className={`bg-slate-600 text-[10px] px-2 py-1 rounded-t-md w-max mx-auto border-b border-slate-900`}>index: {idx}</div>
                <div className={`bg-slate-200 text-slate-900 p-4 rounded-b-md shadow-lg w-28 h-28 flex flex-col justify-center items-center gap-1 border-b-4 ${highlightBracket && idx === 0 ? 'border-pve-green' : 'border-slate-400'}`}>
                  <Box className="text-slate-400 mb-1" size={20}/>
                  <span className="font-bold">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TUPLE VIEW */}
        {mode === 'TUPLE' && (
          <div className="flex gap-1 items-center justify-center p-6 bg-slate-400/10 rounded-full border-4 border-slate-500 border-double">
             <div className="absolute -top-3 bg-slate-500 text-white px-2 py-0.5 text-xs rounded font-bold uppercase tracking-wider flex gap-1"><Lock size={12}/> Immutable</div>
             {RAW_DATA.map((item, idx) => (
                <div key={item.id} className={`w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex flex-col items-center justify-center text-white shadow-inner border border-slate-300 transition-all ${highlightBracket && idx === 0 ? 'scale-110 brightness-125' : ''}`}>
                    <span className="text-xs text-slate-300 mb-1">{idx}</span>
                    <span className="font-bold font-mono">{item.name}</span>
                </div>
             ))}
          </div>
        )}

        {/* DICT VIEW */}
        {mode === 'DICT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {RAW_DATA.map((item) => (
              <div key={item.id} className={`flex items-center gap-0 rounded-lg overflow-hidden border transition-all duration-500 ${highlightBracket ? 'border-pve-purple' : 'border-slate-600'}`}>
                <div className={`w-24 bg-slate-900 p-4 flex flex-col items-center justify-center border-r border-slate-700 ${highlightBracket ? 'text-pve-purple font-bold' : 'text-slate-500'}`}>
                  <div className="w-12 h-2 bg-slate-700 rounded-full mb-2 shadow-inner"></div>
                  <span className="font-mono text-xs">"{item.id}_key"</span>
                </div>
                <div className="flex-1 bg-slate-700/50 p-4 flex justify-between items-center h-full">
                  <span className="text-slate-200 font-bold">{item.name}</span>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Score: {item.score}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SERIES VIEW */}
        {mode === 'SERIES' && (
          <div className={`flex flex-col w-48 transition-all duration-500 ${highlightBracket ? 'scale-105' : ''}`}>
             <div className="bg-slate-700 text-slate-300 p-2 text-center text-xs border border-slate-600 rounded-t">Index (Axis 0)</div>
             {RAW_DATA.map((item, idx) => (
                 <div key={item.id} className="flex border-x border-b border-slate-600 last:rounded-b bg-slate-800">
                     <div className="w-12 p-3 bg-slate-900 border-r border-slate-600 font-mono text-xs text-slate-500 flex items-center justify-center">{idx}</div>
                     <div className={`flex-1 p-3 text-center font-mono font-bold ${highlightBracket && idx === 0 ? 'bg-pve-blue text-white' : 'text-slate-200'}`}>{item.score}</div>
                 </div>
             ))}
             <div className="mt-2 text-center text-xs text-slate-500">dtype: int64</div>
          </div>
        )}

        {/* DATAFRAME VIEW */}
        {mode === 'DATAFRAME' && (
          <div className={`relative bg-slate-900 rounded-lg p-6 border transition-all duration-500 ${highlightBracket ? 'border-pve-blue rotate-1 scale-105' : 'border-slate-600'}`}>
            <div className="absolute -top-3 left-6 bg-slate-800 px-2 text-xs text-slate-400 border border-slate-600 rounded">Column Axis (Series)</div>
            <div className="absolute top-10 -left-8 -rotate-90 bg-slate-800 px-2 text-xs text-slate-400 border border-slate-600 rounded">Row Axis (Index)</div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-pve-blue font-mono text-sm border-b border-slate-700">
                  <th className="p-2 border-r border-slate-700 w-10"></th>
                  <th className={`p-2 border-r border-slate-700`}>name</th>
                  <th className="p-2 border-r border-slate-700">score</th>
                  <th className="p-2">group</th>
                </tr>
              </thead>
              <tbody>
                {RAW_DATA.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30">
                    <td className={`p-2 border-r border-slate-700 font-mono text-slate-500 text-xs text-center ${highlightBracket ? 'text-pve-blue font-bold' : ''}`}>{idx}</td>
                    <td className={`p-2 border-r border-slate-700 font-medium ${highlightBracket ? 'bg-pve-blue/10' : 'text-slate-300'}`}>{item.name}</td>
                    <td className="p-2 border-r border-slate-700 text-slate-400">{item.score}</td>
                    <td className="p-2 text-slate-400">{item.group}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
