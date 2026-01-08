import React, { useState } from 'react';
import { Tag, Library, GitFork, Layers, Terminal, GitCommit, Eye, ToggleLeft } from 'lucide-react';
import { VariableLabels } from './components/VariableLabels';
import { ContainerChameleon } from './components/ContainerChameleon';
import { FlowSandbox } from './components/FlowSandbox';
import { IndentationSteps } from './components/IndentationSteps';
import { ChainInterpreter } from './components/ChainInterpreter';
import { BracketLens } from './components/BracketLens';
import { LogicToggles } from './components/LogicToggles';
import { ConsoleBar } from './components/ConsoleBar';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [consoleMsg, setConsoleMsg] = useState<string>("系统就绪 (System Ready)");

  const renderContent = () => {
    switch(activeTab) {
      case 0: return <BracketLens setConsole={setConsoleMsg} />;
      case 1: return <VariableLabels setConsole={setConsoleMsg} />;
      case 2: return <ContainerChameleon setConsole={setConsoleMsg} />;
      case 3: return <LogicToggles setConsole={setConsoleMsg} />;
      case 4: return <FlowSandbox setConsole={setConsoleMsg} />;
      case 5: return <IndentationSteps setConsole={setConsoleMsg} />;
      case 6: return <ChainInterpreter setConsole={setConsoleMsg} />;
      default: return <BracketLens setConsole={setConsoleMsg} />;
    }
  };

  const navItems = [
    { id: 0, label: '透视镜 (Syntax)', icon: <Eye size={18} />, color: 'hover:text-pve-blue' },
    { id: 1, label: '变量 (Vars)', icon: <Tag size={18} />, color: 'hover:text-pve-amber' },
    { id: 2, label: '容器 (Data)', icon: <Library size={18} />, color: 'hover:text-pve-green' },
    { id: 3, label: '逻辑 (Logic)', icon: <ToggleLeft size={18} />, color: 'hover:text-pve-amber' },
    { id: 4, label: '流程 (Flow)', icon: <GitFork size={18} />, color: 'hover:text-pve-red' },
    { id: 5, label: '函数 (Func)', icon: <Layers size={18} />, color: 'hover:text-pve-blue' },
    { id: 6, label: '链式 (Chain)', icon: <GitCommit size={18} />, color: 'hover:text-pve-purple' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-pve-blue selection:text-white overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 shrink-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Python Vision Engine <span className="text-xs text-slate-500 font-normal">v1.2</span></h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">物理逻辑实验室</p>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 text-sm font-medium whitespace-nowrap
                  ${activeTab === item.id 
                    ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                    : `text-slate-400 hover:bg-slate-900 ${item.color}`
                  }
                `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto gap-2 p-2 bg-slate-950 border-b border-slate-800 no-scrollbar shrink-0">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded text-xs font-bold border ${activeTab === item.id ? 'bg-slate-800 border-slate-600 text-white' : 'border-transparent text-slate-500'}`}
            >
              {item.icon}
              {item.label}
            </button>
         ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-6xl overflow-hidden flex flex-col">
        <div className="flex-1 bg-slate-900/50 rounded-t-2xl border-x border-t border-slate-800/50 backdrop-blur-sm shadow-2xl overflow-hidden relative">
          {renderContent()}
        </div>
        
        {/* Global Console Bar */}
        <div className="rounded-b-2xl overflow-hidden border-x border-b border-slate-800/50">
          <ConsoleBar message={consoleMsg} />
        </div>
      </main>
    </div>
  );
};

export default App;
