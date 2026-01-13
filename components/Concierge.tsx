import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Resource, ChatMessage } from '../types';
import { getGeminiRecommendations } from '../services/geminiService';

interface ConciergeProps {
  resources: Resource[];
}

const Concierge: React.FC<ConciergeProps> = ({ resources }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente pedagógico. ¿Buscas alguna herramienta específica para tu clase?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getGeminiRecommendations(input, resources);

    const modelMsg: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Función simple para renderizar texto con enlaces Markdown [Texto](URL)
  const renderMessageContent = (text: string, isUser: boolean) => {
    // Regex para capturar [texto](url)
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    
    return (
      <span className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a 
                key={i} 
                href={match[2]} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`font-bold underline decoration-2 underline-offset-2 transition-colors ${
                  isUser 
                    ? 'text-white decoration-white/50 hover:decoration-white' 
                    : 'text-indigo-600 decoration-indigo-200 hover:decoration-indigo-600'
                }`}
              >
                {match[1]}
              </a>
            );
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto bg-white rounded-2xl shadow-2xl border border-indigo-100 w-80 sm:w-96 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 translate-y-10 pointer-events-none h-0'
        }`}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={18} className="animate-pulse" />
            <span className="font-semibold">Asistente IA</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                }`}
              >
                {renderMessageContent(msg.text, msg.role === 'user')}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-200">
                <Loader2 size={16} className="animate-spin text-indigo-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pregunta sobre recursos..."
            className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-4 rounded-full shadow-xl transition-all duration-300 ${
          isOpen ? 'rotate-90 opacity-0 absolute' : 'opacity-100'
        }`}
      >
        <MessageCircle size={24} />
        <span className="font-medium hidden group-hover:block transition-all duration-300 overflow-hidden whitespace-nowrap">
          Asistente Virtual
        </span>
      </button>
    </div>
  );
};

export default Concierge;