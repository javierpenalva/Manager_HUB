import React, { useState } from 'react';
import { Wifi, Clock, Info, Copy, Check } from 'lucide-react';

interface SessionInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const wifiPass = "aprender2024";

  const handleCopy = () => {
    navigator.clipboard.writeText(wifiPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-start">
           <div>
             <h3 className="text-xl font-bold mb-1">Información de la Sesión</h3>
             <p className="text-indigo-100 text-sm">Datos útiles para el asistente</p>
           </div>
           <Info className="text-white/30" size={48} />
        </div>
        
        <div className="p-6 space-y-6">
            {/* Wifi Card */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-4 relative overflow-hidden">
                <div className="bg-white p-2.5 rounded-lg shadow-sm text-indigo-600 z-10">
                    <Wifi size={20} />
                </div>
                <div className="flex-1 z-10">
                    <h4 className="font-semibold text-slate-800 text-sm">Conexión WiFi</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between items-center text-xs text-slate-600 border-b border-indigo-100 pb-1">
                        <span>Red:</span> 
                        <span className="font-mono font-bold text-slate-800">Aula_Formacion</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-600">
                        <span>Clave:</span> 
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-indigo-100">{wifiPass}</span>
                            <button 
                                onClick={handleCopy}
                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                title="Copiar contraseña"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                      </div>
                    </div>
                </div>
            </div>

            {/* Agenda */}
            <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4 text-xs uppercase tracking-wider text-slate-500">
                    <Clock size={14} className="text-indigo-500" /> 
                    Agenda del Día
                </h4>
                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100 before:content-['']">
                    {[
                        { time: '09:00', title: 'Bienvenida e Introducción', type: 'session' },
                        { time: '11:00', title: 'Pausa Café', type: 'break' },
                        { time: '11:30', title: 'Taller Práctico: Herramientas IA', type: 'session' },
                        { time: '13:30', title: 'Cierre y Recursos Extra', type: 'session' }
                    ].map((item, idx) => (
                        <div key={idx} className="relative pl-8 pb-6 last:pb-0 group">
                            <div className={`absolute left-0 top-1.5 h-5 w-5 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${item.type === 'break' ? 'bg-amber-300' : 'bg-indigo-500'}`} />
                            <span className="text-xs font-bold text-indigo-600 block mb-0.5">{item.time}</span>
                            <span className="text-sm font-medium text-slate-700">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-sm">
                Entendido, ir a los recursos
            </button>
        </div>
      </div>
    </div>
  );
};

export default SessionInfo;