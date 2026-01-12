import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon, Lock, LogIn, AlertCircle, Loader2, Ghost } from 'lucide-react';
import { Category, Resource } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (resource: Omit<Resource, 'id'>) => void;
}

const categories: Category[] = ['IA Generativa', 'Diseño', 'Productividad', 'Evaluación', 'Multimedia'];

const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { user, signIn, isAuthenticating, error, enterDemoMode } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: 'IA Generativa' as Category,
    tags: '',
    imageUrl: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    const finalImage = formData.imageUrl || `https://picsum.photos/400/200?random=${Math.random()}`;

    onAdd({
      title: formData.title,
      description: formData.description,
      url: formData.url,
      category: formData.category,
      tags: tagsArray,
      imageUrl: finalImage,
      featured: false
    });
    
    setFormData({ title: '', description: '', url: '', category: 'IA Generativa', tags: '', imageUrl: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Plus size={18} className="text-indigo-600" />
            Nuevo Recurso
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} />
          </button>
        </div>

        {!user ? (
          <div className="p-8 text-center">
            <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600 w-16 h-16 flex items-center justify-center mx-auto">
              {isAuthenticating ? <Loader2 className="animate-spin" size={32} /> : <Lock size={32} />}
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Acceso Docente</h4>
            <p className="text-slate-500 mb-6 text-sm">Para añadir recursos debes identificarte.</p>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-2 text-left">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={signIn}
                disabled={isAuthenticating}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
              >
                {isAuthenticating ? 'Conectando...' : 'Entrar con Google'}
                {!isAuthenticating && <LogIn size={18} />}
              </button>
              
              <button 
                onClick={enterDemoMode}
                className="flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-medium py-2 transition-colors"
              >
                <Ghost size={16} />
                Usar Modo Invitado (Sin Google)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
              <input required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nombre de la web" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Enlace</label>
                <input required type="url" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none" placeholder="https://..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})}/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
              <textarea required rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none" placeholder="¿Para qué sirve?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Etiquetas</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none" placeholder="IA, Juegos, Gratis..." value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})}/>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 rounded-xl font-bold">Cancelar</button>
              <button type="submit" className="flex-1 px-4 py-3 text-white bg-indigo-600 rounded-xl font-bold shadow-lg">Guardar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddResourceModal;