import React from 'react';
import { Terminal, MessageSquare } from 'lucide-react';

interface ConsoleBarProps {
  message: string;
}

export const ConsoleBar: React.FC<ConsoleBarProps> = ({ message }) => {
  return (
    <div className="bg-slate-950 border-t border-slate-800 p-4 shrink-0 flex items-center gap-4 transition-all duration-300">
      <div className="bg-slate-800 p-2 rounded text-pve-green animate-pulse">
        <Terminal size={20} />
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
          <MessageSquare size={10} /> 翻译官 (Interpreter Output)
        </div>
        <div 
            className="font-mono text-slate-200 text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: message || "系统就绪，等待指令... (System Ready)" }}
        />
      </div>
    </div>
  );
};
