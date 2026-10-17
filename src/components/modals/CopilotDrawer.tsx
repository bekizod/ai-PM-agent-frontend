'use client';

import React, { useEffect, useRef } from 'react';
import { X, Sparkles, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string; followUps?: string[] }>;
  input: string;
  setInput: (v: string) => void;
  onSend: (prompt?: string) => Promise<void>;
  loading: boolean;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  onSend,
  loading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-[#0f172a] border-l border-slate-800 h-full flex flex-col p-5 shadow-2xl animate-fade-in text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">SprintOps Copilot</h2>
              <p className="text-[10px] text-slate-400">Autonomous Technical Product Manager</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1.5 custom-scrollbar">
          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            const rawContent = m.content || (m as any).reply || (m as any).answer || '';

            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl transition-all ${
                  isUser
                    ? 'bg-indigo-600 text-white ml-8 shadow-sm shadow-indigo-600/20'
                    : 'bg-[#090d16] border border-slate-800 text-slate-200 mr-2 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 opacity-80 text-[10px] font-semibold">
                  {isUser ? (
                    <>
                      <User className="w-3 h-3 text-indigo-200" />
                      <span>You</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-indigo-400" />
                      <span className="text-indigo-400">AI TPM Copilot</span>
                    </>
                  )}
                </div>

                {isUser ? (
                  <p className="leading-relaxed whitespace-pre-wrap text-xs">{rawContent}</p>
                ) : (
                  <div className="prose prose-invert prose-xs max-w-none text-slate-200 text-xs space-y-2 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-sm font-bold text-white mt-1 mb-1" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xs font-bold text-white mt-1 mb-1" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xs font-semibold text-indigo-300 mt-1 mb-1 flex items-center gap-1" {...props} />,
                        p: ({ node, ...props }) => <p className="text-xs text-slate-300 leading-relaxed mb-1.5" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs my-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-xs my-1" {...props} />,
                        li: ({ node, ...props }) => <li className="text-xs text-slate-300 leading-normal" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                        code: ({ node, ...props }) => (
                          <code className="px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300 font-mono text-[10px]" {...props} />
                        ),
                      }}
                    >
                      {rawContent || 'No response generated.'}
                    </ReactMarkdown>
                  </div>
                )}

                {m.followUps && m.followUps.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5 pt-2 border-t border-slate-800/80">
                    {m.followUps.map((fu, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSend(fu)}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500 hover:bg-indigo-950/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        {fu}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 text-slate-400 text-xs flex items-center gap-2.5 mr-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <div className="flex flex-col">
                <span className="font-medium text-slate-300">Consulting telemetry & sprint state...</span>
                <span className="text-[10px] text-slate-500">Analyzing team allocation, open P0 issues, and release readiness</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && !loading) onSend();
          }}
          className="pt-3 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sprint velocity, unassigned P0s, or blockers..."
            className="flex-1 bg-[#090d16] border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
