import React, { useState, useEffect } from 'react';
import { Tag, AlertCircle, CheckCircle2, Box } from 'lucide-react';
import { VariableLabel, DataBlock } from '../types';

interface Props {
  setConsole: (msg: string) => void;
}

const INITIAL_LABELS: VariableLabel[] = [
  { id: 'l1', name: 'score', expectedType: 'number' },
  { id: 'l2', name: 'names_list', expectedType: 'list' },
  { id: 'l3', name: 'df_data', expectedType: 'dataframe' },
];

const INITIAL_BLOCKS: DataBlock[] = [
  { id: 'b1', type: 'dataframe', value: 'Grid Table', assignedLabelId: null },
  { id: 'b2', type: 'number', value: '98', assignedLabelId: null },
  { id: 'b3', type: 'list', value: '["A", "B"]', assignedLabelId: null },
];

export const VariableLabels: React.FC<Props> = ({ setConsole }) => {
  const [labels, setLabels] = useState(INITIAL_LABELS);
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [errorBlockId, setErrorBlockId] = useState<string | null>(null);

  useEffect(() => {
    setConsole("Level 1: 变量标签墙。请将左侧的【变量名标签】贴到右侧正确的【数据实体】上。");
  }, []);

  const handleBlockClick = (blockId: string) => {
    if (!selectedLabelId) return;

    const label = labels.find(l => l.id === selectedLabelId);
    const block = blocks.find(b => b.id === blockId);

    if (!label || !block) return;

    // Validation Logic
    if (label.expectedType !== block.type) {
      // Error
      setErrorBlockId(blockId);
      setConsole(`⚠️ 错误! 变量名 '${label.name}' 期望的是 ${label.expectedType} 类型，但你贴到了 ${block.type} 上。数据无家可归！`);
      setTimeout(() => setErrorBlockId(null), 800);
    } else {
      // Success
      setBlocks(prev => prev.map(b => 
        b.id === blockId ? { ...b, assignedLabelId: selectedLabelId } : b
      ));
      setLabels(prev => prev.filter(l => l.id !== selectedLabelId));
      setSelectedLabelId(null);
      setConsole(`✅ 成功! 变量 '${label.name}' 现在指向了内存中的 ${block.type} 数据。`);
    }
  };

  return (
    <div className="flex h-full gap-8 p-4">
      {/* Label Wall (Left) */}
      <div className="w-1/3 bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col gap-4 shadow-inner">
        <h3 className="text-pve-amber font-bold flex items-center gap-2 mb-4">
          <Tag size={20} /> 变量名标签堆 (Labels)
        </h3>
        <div className="flex flex-wrap gap-4 content-start">
          {labels.length === 0 && <div className="text-slate-500 italic">空空如也 (Empty)</div>}
          {labels.map(label => (
            <button
              key={label.id}
              onClick={() => setSelectedLabelId(label.id)}
              className={`
                px-4 py-2 rounded-lg font-mono text-lg font-bold border-2 transition-all duration-200 transform hover:scale-110
                ${selectedLabelId === label.id 
                  ? 'bg-pve-amber text-slate-900 border-white shadow-[0_0_15px_rgba(245,158,11,0.5)] rotate-3' 
                  : 'bg-slate-700 text-pve-amber border-pve-amber border-dashed'}
              `}
            >
              {label.name}
            </button>
          ))}
        </div>
        <div className="mt-auto text-slate-400 text-sm">
          Tip: 点击标签选中，然后点击右侧对应的数据块。
        </div>
      </div>

      {/* Data Blocks (Right) */}
      <div className="flex-1 grid grid-cols-1 gap-6 content-center">
        {blocks.map(block => {
          const isAssigned = !!block.assignedLabelId;
          const assignedLabel = INITIAL_LABELS.find(l => l.id === block.assignedLabelId);
          const isError = errorBlockId === block.id;

          return (
            <div
              key={block.id}
              onClick={() => !isAssigned && handleBlockClick(block.id)}
              className={`
                relative h-32 rounded-xl flex items-center justify-center transition-all duration-300
                ${isError ? 'bg-pve-red/20 border-pve-red border-4 animate-shake' : 'bg-slate-800 border-2 border-slate-600'}
                ${!isAssigned && selectedLabelId ? 'cursor-pointer hover:border-white hover:bg-slate-700' : ''}
              `}
            >
              {/* Sticker/Label Visual */}
              {isAssigned && (
                <div className="absolute -top-3 left-4 bg-pve-amber text-slate-900 px-3 py-1 font-mono font-bold rounded shadow-lg transform -rotate-2 flex items-center gap-2 z-10">
                   <Tag size={14}/> {assignedLabel?.name}
                </div>
              )}

              {/* Data Representation */}
              <div className="flex flex-col items-center gap-2">
                <div className={`text-3xl font-bold ${isAssigned ? 'text-white' : 'text-slate-500'}`}>
                  {block.type === 'number' && <span className="font-mono">{block.value}</span>}
                  {block.type === 'list' && (
                    <div className="flex gap-1">
                      <div className="w-10 h-10 bg-slate-600 rounded flex items-center justify-center text-xs">"A"</div>
                      <div className="w-10 h-10 bg-slate-600 rounded flex items-center justify-center text-xs">"B"</div>
                    </div>
                  )}
                  {block.type === 'dataframe' && (
                     <div className="grid grid-cols-2 gap-1 opacity-50">
                        <div className="w-8 h-4 bg-slate-500"></div><div className="w-8 h-4 bg-slate-500"></div>
                        <div className="w-8 h-4 bg-slate-500"></div><div className="w-8 h-4 bg-slate-500"></div>
                     </div>
                  )}
                </div>
                <div className="text-xs uppercase tracking-widest text-slate-500">{block.type} Object</div>
              </div>

              {/* Connection Status */}
              <div className="absolute right-4 top-4">
                 {isAssigned 
                    ? <CheckCircle2 className="text-pve-green" /> 
                    : <AlertCircle className="text-slate-600" />
                 }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};