import React from 'react';
import { ExternalLink, Star, Trash2 } from 'lucide-react';
import { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
  isEditing?: boolean;
  onDelete?: (id: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, isEditing, onDelete }) => {
  return (
    <div className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col h-full ${isEditing ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl'}`}>
      
      {/* Edit Mode Actions */}
      {isEditing && onDelete && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            onDelete(resource.id);
          }}
          className="absolute top-3 left-3 z-30 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
          title="Eliminar recurso"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Featured Badge */}
      {resource.featured && (
        <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow-sm">
          <Star size={12} fill="currentColor" />
          Destacado
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
        <img 
          src={resource.imageUrl} 
          alt={resource.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-3 left-3 z-20">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-indigo-900 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
            {resource.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {resource.title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map(tag => (
            <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        {/* Action */}
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => isEditing && e.preventDefault()}
          className={`mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-medium transition-all duration-300 group/btn ${
            isEditing 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-50 text-slate-700 hover:bg-indigo-600 hover:text-white'
          }`}
        >
          <span>{isEditing ? 'Modo Edición' : 'Acceder al recurso'}</span>
          {!isEditing && <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />}
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;