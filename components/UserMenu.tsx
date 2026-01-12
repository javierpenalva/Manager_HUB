import React, { useState } from 'react';
import { LogIn, LogOut, User as UserIcon, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const { user, signIn, signOut, isAuthenticating } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <button 
        onClick={signIn}
        disabled={isAuthenticating}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-md text-sm disabled:opacity-70"
      >
        {isAuthenticating ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
        <span>{isAuthenticating ? 'Conectando...' : 'Acceso Docente'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-indigo-100 hover:border-indigo-300 pl-2 pr-4 py-1.5 rounded-full transition-all shadow-sm"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-indigo-200" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <UserIcon size={18} />
          </div>
        )}
        <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate hidden sm:block">
          {user.displayName || 'Docente'}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 flex flex-col gap-1">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-xs text-slate-500 font-medium">Docente Identificado</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
            </div>
            
            <div className="px-3 py-2 flex items-center gap-2 text-emerald-600 text-[10px] font-bold bg-emerald-50 rounded-lg uppercase tracking-wider">
                <ShieldCheck size={14} />
                Editor Activo
            </div>

            <button 
              onClick={() => { signOut(); setIsOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left mt-1"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;