import React, { useState, useMemo, useEffect } from 'react';
import { PlayCircle, LayoutGrid, Map, Parentheses, Braces, Brackets, MousePointerClick, Quote } from 'lucide-react';
import { BracketToken } from '../types';

// Updated to match the user's complex example exactly
const SAMPLE_CODE = 'result = api_call( "user_data" )[0][ { "id": 101, "meta": ( 2024, "Q1" ) } ]';

interface Props {
  setConsole: (msg: string) => void;
}

interface AnalysisData {
    title: string;      // e.g. "执行：函数调用"
    syntax: string;     // e.g. "Function Call ()"
    desc: string;       // Technical explanation for the card
    metaphor: string;   // e.g. "启动按钮"
    color: string;      // Tailswind color class
    icon: React.ReactNode;
}

export const BracketLens: React.FC<Props> = ({ setConsole }) => {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    setConsole("Level 1: 括号透视镜。请将鼠标悬停在代码中的括号上，听听【翻译官】是如何【实时解说】当前代码逻辑的。");
  }, []);

  // --- 1. Parser Logic ---
  const tokens = useMemo(() => {
    const result: BracketToken[] = [];
    const stack: { char: string; index: number; depth: number }[] = [];
    let currentDepth = 0; // 0 is root
    let buffer = '';

    const flushBuffer = () => {
      if (buffer) {
         if (buffer.trim()) {
             result.push({
              id: `content-${result.length}-${Date.now()}`,
              char: '',
              depth: currentDepth,
              partnerId: null,
              type: 'content',
              content: buffer
            });
         }
        buffer = '';
      }
    };

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if (['(', '[', '{'].includes(char)) {
        flushBuffer();
        const id = `open-${i}`;
        const nextDepth = currentDepth + 1; 
        
        result.push({ id, char, depth: nextDepth, partnerId: null, type: 'bracket' });
        stack.push({ char, index: result.length - 1, depth: nextDepth });
        currentDepth = nextDepth;

      } else if ([')', ']', '}'].includes(char)) {
        flushBuffer();
        const id = `close-${i}`;
        const partner = stack.pop();
        
        const token: BracketToken = {
          id, char, depth: currentDepth,
          partnerId: partner ? result[partner.index].id : null,
          type: 'bracket'
        };

        if (partner) result[partner.index].partnerId = id;
        result.push(token);
        
        currentDepth = Math.max(0, currentDepth - 1);
      } else {
        buffer += char;
      }
    }
    flushBuffer();
    return result;
  }, [code]);

  // --- 2. Styles ---
  const getBracketColor = (char: string) => {
    if (char === '(' || char === ')') return 'text-pve-amber';
    if (char === '[' || char === ']') return 'text-pve-green';
    if (char === '{' || char === '}') return 'text-pve-purple';
    return 'text-slate-300';
  };

  const getBracketBg = (char: string, isActive: boolean) => {
    if (!isActive) return 'bg-transparent';
    if (char === '(' || char === ')') return 'bg-pve-amber/20 shadow-[0_0_20px_rgba(245,158,11,0.6)]';
    if (char === '[' || char === ']') return 'bg-pve-green/20 shadow-[0_0_20px_rgba(34,197,94,0.6)]';
    if (char === '{' || char === '}') return 'bg-pve-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.6)]';
    return '';
  };

  // --- 3. DYNAMIC Interpretation Logic (The Soul) ---
  const interpretToken = (token: BracketToken) => {
    if (token.type !== 'bracket') {
        setAnalysis(null);
        return;
    }
    
    // 1. Identify Context
    const tokenIndex = tokens.findIndex(t => t.id === token.id);
    const prevToken = tokenIndex > 0 ? tokens[tokenIndex - 1] : null;
    const isOpening = ['(', '[', '{'].includes(token.char);
    
    // 2. Extract Content (The "Meat")
    let innerContent = "...";
    let rawInner = "";
    
    // Helper to find partner and content
    let partnerId = token.partnerId;
    if (!partnerId) {
       // if current is closing, partner is opening (which we need to find to get content range)
       // Simplified: we rely on token.partnerId which is populated for both by parser
    }

    if (token.partnerId) {
        const partnerIdx = tokens.findIndex(t => t.id === token.partnerId);
        if (partnerIdx > -1) {
            // Determine start and end indices for slice
            const start = isOpening ? tokenIndex + 1 : partnerIdx + 1;
            const end = isOpening ? partnerIdx : tokenIndex;
            
            if (end > start) {
                rawInner = tokens.slice(start, end).map(t => t.content || t.char).join("").trim();
                innerContent = rawInner;
                if (innerContent.length > 20) innerContent = innerContent.substring(0, 18) + "...";
                if (innerContent.length === 0) innerContent = "空 (Empty)";
            } else {
                innerContent = "空 (Empty)";
            }
        }
    }

    // 3. Extract Function Name / List Name (The "Subject")
    const prevText = prevToken?.type === 'content' ? prevToken.content?.trim() : null;
    const subjectName = prevText && prevText.match(/[\w_]+$/) ? prevText.match(/[\w_]+$/)?.[0] : "匿名对象";


    let data: AnalysisData = {
        title: "未知", syntax: "Unknown", desc: "...", metaphor: "...", color: "text-slate-500", icon: <Quote />
    };
    let story = "";

    // --- LOGIC TREE & STORY GENERATION ---
    
    // === ROUND () ===
    if (token.char === '(' || token.char === ')') {
        const isFuncCall = prevToken && prevToken.type === 'content' && prevToken.content?.trim().match(/[\w_]$/);
        
        if (isFuncCall) {
            data = {
                title: "执行 & 组合",
                syntax: `Function Call: ${subjectName}()`,
                desc: `命令程序去【执行】名为 ${subjectName} 的功能，并传入参数。`,
                metaphor: "启动机器的按钮",
                color: "text-pve-amber",
                icon: <PlayCircle size={24} />
            };
            story = `🤖 翻译官：【指令启动！】正在呼叫 <span class="text-pve-amber font-bold">${subjectName}</span> 指挥部。我们把原材料 "<span class="text-slate-200">${innerContent}</span>" 投进机器，坐等它吐出结果。`;
        } else if (rawInner.includes(',')) {
            data = {
                title: "不可变序列",
                syntax: "Tuple (元组)",
                desc: "将多个数据【打包】固定在一起，一旦创建就不能修改。",
                metaphor: "焊死的金属包裹",
                color: "text-pve-amber",
                icon: <Parentheses size={24} />
            };
            story = `🤖 翻译官：【永久封存】这是一份发往未来的档案。里面封装了 <span class="text-slate-200">${innerContent}</span>。一旦加上这对圆括号，就像灌了水泥一样，谁也别想再改里面的内容。`;
        } else {
             data = {
                title: "优先级",
                syntax: "Priority (优先计算)",
                desc: "改变运算的顺序，强制程序【优先处理】括号里面的内容。",
                metaphor: "VIP 通道",
                color: "text-pve-amber",
                icon: <Parentheses size={24} />
            };
            story = `🤖 翻译官：【VIP 插队】不管外面的算式多复杂，必须先算出 <span class="text-pve-amber font-bold">( ${innerContent} )</span> 的结果。它是全场的焦点，拥有最高解释权。`;
        }
    }
    
    // === SQUARE [] ===
    else if (token.char === '[' || token.char === ']') {
        // Indexing if preceded by ID, closing bracket, or string literal
        const isIndexing = prevToken && (
            (prevToken.type === 'content' && (prevToken.content?.trim().match(/[\w_]$/) || prevToken.content?.trim().endsWith('"') || prevToken.content?.trim().endsWith("'"))) || 
            (prevToken.type === 'bracket' && [')', ']', '}'].includes(prevToken.char))
        );

        if (isIndexing) {
            data = {
                title: "定位 & 索引",
                syntax: `Indexing [${innerContent}]`,
                desc: `从前面的数据容器中，精准【抓取】特定位置的元素。`,
                metaphor: "按号码开信箱",
                color: "text-pve-green",
                icon: <LayoutGrid size={24} />
            };
            story = `🤖 翻译官：【精准抓取】目标锁定！拿着号码牌 <span class="text-pve-green font-bold">[ ${innerContent} ]</span>，去前面的数据柜子里取货。只要这一个，其他的不要。`;
        } else {
            // Is it a Slice? [0:5]
            if (rawInner.includes(':')) {
                 data = {
                    title: "切片 (Slice)",
                    syntax: `List Slicing [${innerContent}]`,
                    desc: "像切面包一样，从列表中切出一部分数据。",
                    metaphor: "切一段香肠",
                    color: "text-pve-green",
                    icon: <Brackets size={24} />
                };
                story = `🤖 翻译官：【批量切割】刀法精准！我们要把列表中 <span class="text-pve-green font-bold">[ ${innerContent} ]</span> 这一段范围的数据单独切出来，拿走去做别的事。`;
            } else {
                data = {
                    title: "可变容器",
                    syntax: "List (列表)",
                    desc: "创建一个【有序】的容器，可以随时添加、删除或修改。",
                    metaphor: "贴标签的抽屉",
                    color: "text-pve-green",
                    icon: <Brackets size={24} />
                };
                story = `🤖 翻译官：【铺设货架】正在组装一个名为 List 的货架。目前上面摆放了 <span class="text-slate-200">${innerContent}</span>。它很灵活，随时欢迎新货物上架。`;
            }
        }
    }
    
    // === CURLY {} ===
    else if (token.char === '{' || token.char === '}') {
        if (rawInner.includes(':')) {
            data = {
                title: "映射 & 查找",
                syntax: "Dictionary (字典)",
                desc: "建立【键值对 (Key-Value)】的关联。",
                metaphor: "查字典的索引页",
                color: "text-pve-purple",
                icon: <Map size={24} />
            };
            // Try to extract a key for the story
            const firstKey = rawInner.split(':')[0]?.trim() || "key";
            story = `🤖 翻译官：【编写目录】我们在构建一个查询系统。只要你喊一声 "<span class="text-pve-purple font-bold">${firstKey}</span>" (Key)，我就能立刻把对应的数据 (Value) 找给你。`;
        } else {
            data = {
                title: "无序集合 / 格式化",
                syntax: "Set / F-String",
                desc: "定义一组【唯一】的元素，或在字符串中占位。",
                metaphor: "去重摇奖袋",
                color: "text-pve-purple",
                icon: <Braces size={24} />
            };
            story = `🤖 翻译官：【去重过滤】这里是一个独特的领域。所有的重复元素都会被踢出去，剩下的元素 <span class="text-slate-200">${innerContent}</span> 在袋子里也是乱序滚动的。`;
        }
    }

    setAnalysis(data);
    setConsole(story); // Now utilizing the HTML-safe story string (will need rendering support or strip tags if simple text)
  };

  const handleHover = (token: BracketToken) => {
    if (token.type !== 'bracket') return;
    setHoveredId(token.id);
    interpretToken(token);
  };

  const isHighlighted = (token: BracketToken) => {
    if (!hoveredId) return false;
    if (token.id === hoveredId) return true;
    const hoveredToken = tokens.find(t => t.id === hoveredId);
    if (hoveredToken && hoveredToken.partnerId === token.id) return true;
    if (hoveredToken && token.partnerId === hoveredId) return true;
    if (hoveredToken && hoveredToken.partnerId) {
        const start = tokens.findIndex(t => t.id === (isOpening(hoveredToken) ? hoveredToken.id : hoveredToken.partnerId));
        const end = tokens.findIndex(t => t.id === (isOpening(hoveredToken) ? hoveredToken.partnerId : hoveredToken.id));
        const current = tokens.findIndex(t => t.id === token.id);
        return current > start && current < end;
    }
    return false;
  };

  const isOpening = (t: BracketToken) => ['(', '[', '{'].includes(t.char);

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      {/* 1. Core Concept Cards - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
         <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center gap-3">
            <div className="bg-pve-amber/10 p-2 rounded text-pve-amber"><PlayCircle size={20}/></div>
            <div><div className="text-pve-amber font-bold text-sm">() 动作/组合</div><div className="text-slate-500 text-xs">执行函数 · 元组打包</div></div>
         </div>
         <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center gap-3">
            <div className="bg-pve-green/10 p-2 rounded text-pve-green"><LayoutGrid size={20}/></div>
            <div><div className="text-pve-green font-bold text-sm">[] 定位/存储</div><div className="text-slate-500 text-xs">索引取值 · 列表容器</div></div>
         </div>
         <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center gap-3">
            <div className="bg-pve-purple/10 p-2 rounded text-pve-purple"><Map size={20}/></div>
            <div><div className="text-pve-purple font-bold text-sm">{'{}'} 映射/唯一</div><div className="text-slate-500 text-xs">字典查找 · 无序集合</div></div>
         </div>
      </div>

      {/* 2. Visualization Stage */}
      <div className="flex-1 bg-slate-900 rounded-lg p-4 md:p-8 flex flex-col items-center justify-center border border-slate-700 relative overflow-hidden shadow-inner min-h-[200px]">
          <div className="relative text-2xl md:text-4xl font-mono tracking-wider flex flex-wrap justify-center items-center gap-y-4 leading-relaxed max-w-5xl z-10 select-none">
            {tokens.map((token) => {
              const active = isHighlighted(token);
              const colorClass = token.type === 'bracket' ? getBracketColor(token.char) : 'text-slate-400';
              const bgClass = token.type === 'bracket' ? getBracketBg(token.char, active) : (active ? 'text-slate-200' : '');
              
              return (
                <span
                  key={token.id}
                  onMouseEnter={() => handleHover(token)}
                  onMouseLeave={() => { setHoveredId(null); setAnalysis(null); setConsole("...等待探索..."); }}
                  className={`
                    relative transition-all duration-200 cursor-pointer px-0.5 rounded
                    ${colorClass} ${bgClass}
                    ${active && token.type === 'bracket' ? 'scale-125 font-bold z-20 -translate-y-1' : ''}
                    ${token.type === 'content' ? 'font-sans hover:text-white' : ''}
                  `}
                >
                   {/* Depth Badge */}
                   {token.type === 'bracket' && active && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] bg-slate-700 text-slate-300 px-1 rounded opacity-0 animate-fade-in-up" style={{opacity: 1}}>
                        L{token.depth}
                      </span>
                   )}
                   {/* Content */}
                   {token.type === 'content' && (token.content?.includes('"') || token.content?.includes("'")) 
                        ? <span className="text-emerald-400 font-serif italic">{token.content}</span> 
                        : token.type === 'content' && token.content?.match(/^\d+$/)
                            ? <span className="text-blue-400">{token.content}</span>
                            : token.char || token.content
                   }
                </span>
              );
            })}
          </div>
          
          <div className="absolute bottom-2 left-0 w-full text-center text-[10px] text-slate-600">
             提示：L1, L2 代表嵌套层级 (Depth)，就像剥洋葱一样，程序是从最里面的层级开始计算的。
          </div>
      </div>

      {/* 3. Analysis Panel (Visual Card for Technical Explanation) */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-0 overflow-hidden min-h-[100px]">
        {analysis ? (
             <div className="flex flex-row h-full animate-fade-in-up">
                <div className={`w-1.5 ${analysis.color.replace('text-', 'bg-')}`}></div>
                <div className="p-4 flex-1 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className={`p-3 rounded-full bg-slate-900 border border-slate-700 ${analysis.color} shrink-0`}>
                        {analysis.icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-lg font-bold ${analysis.color}`}>{analysis.title}</h4>
                            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700 font-mono">{analysis.syntax}</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{analysis.desc}</p>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                             <Quote size={12} /> 形象比喻：<span className="text-slate-400 font-bold">{analysis.metaphor}</span>
                        </div>
                    </div>
                </div>
             </div>
        ) : (
             <div className="h-full flex flex-col items-center justify-center p-6 text-slate-600 gap-2">
                 <MousePointerClick size={24} className="animate-bounce opacity-50"/>
                 <span className="text-sm">鼠标悬停在上方代码的括号上，查看详细语法解析</span>
             </div>
        )}
      </div>

      {/* 4. Input Area */}
      <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
        <label className="text-xs uppercase text-slate-500 font-bold whitespace-nowrap">代码 Input:</label>
        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-slate-900 text-slate-300 px-3 py-2 rounded border border-slate-600 focus:border-pve-blue focus:outline-none font-mono text-sm"
          placeholder="Paste python code here..."
        />
      </div>
    </div>
  );
};
