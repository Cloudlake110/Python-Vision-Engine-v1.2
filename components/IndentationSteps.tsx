import React, { useState, useEffect } from 'react';
import { Layers, CornerDownRight } from 'lucide-react';
import { IndentLine } from '../types';

const CODE_LINES: IndentLine[] = [
  { id: 1, indent: 0, code: "def process_data(data):", type: 'control', explanation: "Level 0: 顶层定义 (The Roof)" },
  { id: 2, indent: 1, code: "clean_data = []", type: 'action', explanation: "Level 1: 函数内部 (First Floor)" },
  { id: 3, indent: 1, code: "for item in data:", type: 'control', explanation: "Level 1: 开启循环 (Corridor)" },
  { id: 4, indent: 2, code: "if item > 0:", type: 'control', explanation: "Level 2: 循环内部判断 (Room)" },
  { id: 5, indent: 3, code: "clean_data.append(item)", type: 'action', explanation: "Level 3: 最深层执行 (Basement)" },
  { id: 6, indent: 1, code: "return clean_data", type: 'action', explanation: "Level 1: 退出循环，回到函数层" },
];

interface Props {
  setConsole: (msg: string) => void;
}

export const IndentationSteps: React.FC<Props> = ({ setConsole }) => {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  useEffect(() => {
    setConsole("Level 4: 缩进阶梯 (Indentation Steps)。缩进越深，代表层级越低，受上一级管辖。");
  }, []);

  const handleHover = (line: IndentLine) => {
    setHoveredLine(line.id);
    setConsole(line.explanation);
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-4">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2 text-pve-blue mb-2">
          <Layers /> Level 4: 缩进阶梯 (Indentation Steps)
        </h2>
        <p className="text-slate-400 text-sm">
          Python 依靠缩进来判断代码的“归属”。视觉上，我们将缩进渲染为“向下的台阶”。
        </p>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-0 perspective-[1000px]">
        
        {CODE_LINES.map((line, index) => {
          const isHovered = hoveredLine === line.id;
          // Calculate depth visuals
          const depthStyle = {
            marginLeft: `${line.indent * 40}px`,
            backgroundColor: `rgba(30, 41, 59, ${1 - line.indent * 0.15})`, // bg-slate-800 gets darker
            transform: isHovered ? 'scale(1.02) translateZ(10px)' : 'none',
            zIndex: 10 - index,
          };

          return (
            <div 
              key={line.id}
              onMouseEnter={() => handleHover(line)}
              onMouseLeave={() => setHoveredLine(null)}
              className={`
                relative p-4 rounded-r-lg border-l-4 transition-all duration-300 cursor-pointer shadow-lg
                ${isHovered ? 'border-pve-blue shadow-[0_5px_15px_rgba(0,0,0,0.5)]' : 'border-slate-600'}
              `}
              style={{
                ...depthStyle,
                // Creating visual "step" look
                marginTop: '-8px', 
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 20px rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex items-center gap-3">
                {line.indent > 0 && <CornerDownRight className="text-slate-600" size={16} />}
                <span className={`font-mono text-lg ${line.type === 'control' ? 'text-pve-purple font-bold' : 'text-slate-300'}`}>
                  {line.code}
                </span>
              </div>
              
              {/* Step Label (Only visible on hover or large screens) */}
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded bg-black/30 text-slate-500 uppercase tracking-widest ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-50'}`}>
                Indent: {line.indent * 4} spaces
              </div>
            </div>
          );
        })}

        <div className="mt-8 text-center text-slate-500 italic text-sm">
          注意看阴影的变化：深层代码像是“嵌”在浅层代码下面的。
        </div>

      </div>
    </div>
  );
};