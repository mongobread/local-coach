"use client";

import { useChat, Message } from "ai/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-8 bg-zinc-950 text-zinc-50">
      <div className="w-full max-w-2xl flex flex-col h-[80vh] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-zinc-800/50 border-b border-zinc-800">
          <h1 className="text-lg font-semibold text-emerald-400">Local AI Health Assistant</h1>
          <p className="text-xs text-zinc-400">Connected to local Qwen model & SQLite</p>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-zinc-500 mt-12 text-sm">
              Try saying: <span className="text-zinc-300">&quot;Log weight 91.8kg&quot;</span> or <span className="text-zinc-300">&quot;Ate a sugar-free meal&quot;</span>
            </div>
          )}
          {/* ✅ Type assigned to 'm' below to clear the strict typescript error */}
          {messages.map((m: Message) => (
            <div
              key={m.id}
              className={`flex flex-col p-3 rounded-lg max-w-[85%] ${
                m.role === "user"
                  ? "bg-emerald-600 ml-auto text-white"
                  : "bg-zinc-800 mr-auto text-zinc-100 border border-zinc-700"
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-1">
                {m.role === "user" ? "You" : "Coach"}
              </span>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex gap-2">
          <input
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 placeholder-zinc-500"
            value={input}
            placeholder="Type an update..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-medium text-sm px-5 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}