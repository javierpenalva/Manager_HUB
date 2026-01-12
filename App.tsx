import React, { useState, useMemo, useEffect } from 'react';
import { Search, LayoutGrid, BookOpen, Layers, Plus, Database, UploadCloud, CheckCircle } from 'lucide-react';
import { Category, Resource } from './types';
import { resources as defaultData } from './data';
import ResourceCard from './components/ResourceCard';
import Concierge from './components/Concierge';
import AddResourceModal from './components/AddResourceModal';
import UserMenu from './components/UserMenu';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { subscribeToResources, addResourceToDB, deleteResourceFromDB, isFirebaseReady } from './services/firebase';

const categories: Category[] = ['Todos', 'IA Generativa', 'Diseño', 'Productividad', 'Evaluación', 'Multimedia'];

const MainApp: React.FC = () => {
  const { isAdmin, user, signIn } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Subscribe to Realtime DB
  useEffect(() => {
    const unsubscribe = subscribeToResources((updatedResources) => {
      setResources(updatedResources);
      setIsLoadingData(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddClick = () => {
    // Abrimos el modal siempre. El modal gestionará si mostramos el formulario o el login.
    setIsModalOpen(true);
  };

  const handleAddResource = async (newResource: Omit<Resource, 'id'>) => {
    await addResourceToDB(newResource);
  };

  const handleDeleteResource = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este recurso de la base de datos?')) {
      await deleteResourceFromDB(id);
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm(`Se van a subir ${defaultData.length} recursos a tu base de datos Firebase. ¿Continuar?`)) return;

    setIsSeeding(true);
    try {
      for (const resource of defaultData) {
        const { id, ...resourceData } = resource;
        await addResourceToDB(resourceData);
      }
      alert(`¡Éxito! Se han importado los recursos.`);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al importar los datos.");
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter Logic
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = activeCategory === 'Todos' || resource.category === activeCategory;
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, resources]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 pb-20 flex flex-col">

      {/* Configuration Alert for Demo Mode */}
      {!isFirebaseReady && isAdmin && (
        <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
          <Database size={12} className="text-yellow-400" />
          <span>Modo Simulación: Edita <b>services/firebase.ts</b> con tus claves reales.</span>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        {/* Top Bar */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white/90">
            <BookOpen size={20} />
            <span className="font-bold tracking-wide">EDU.HUB</span>
          </div>
          <UserMenu />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Recursos para <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
              Formación Moderna
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100 leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Un espacio colaborativo donde el profesorado encuentra y comparte las mejores herramientas digitales.
          </p>

          {/* Main Search Bar */}
          <div className="max-w-xl mx-auto relative group animate-in fade-in zoom-in duration-500 delay-200">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-2xl p-2">
              <Search className="text-slate-400 ml-4" size={24} />
              <input
                type="text"
                placeholder="Busca por nombre, etiqueta o categoría..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-lg px-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 flex-grow w-full">

        {/* Category Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/50 overflow-x-auto max-w-full no-scrollbar">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${activeCategory === category
                      ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                    }`}
                >
                  {category === 'Todos' && <LayoutGrid size={16} />}
                  {category !== 'Todos' && <Layers size={16} />}
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Grid Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {activeCategory}
            <span className="text-sm font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
              {filteredResources.length}
            </span>
          </h2>

          <div className="flex gap-2">
            {/* Botón de Migración: Solo Admin y si está vacío */}
            {isAdmin && resources.length === 0 && (
              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
              >
                <UploadCloud size={16} />
                {isSeeding ? 'Importando...' : 'Cargar Datos Iniciales'}
              </button>
            )}

            {/* Botón Añadir: Siempre visible */}
            <button
              onClick={handleAddClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-all hover:scale-105"
            >
              <Plus size={16} />
              Añadir Recurso
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        {isLoadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white h-96 rounded-2xl animate-pulse bg-slate-200/50"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isEditing={isAdmin} // Solo los admin pueden borrar
                onDelete={handleDeleteResource}
              />
            ))}
          </div>
        )}

        {filteredResources.length === 0 && !isLoadingData && (
          <div className="text-center py-20 animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-700">No se encontraron resultados</h3>
            <p className="text-slate-500 mt-2">Prueba con otra búsqueda o categoría.</p>
            {isAdmin && resources.length === 0 && (
              <p className="text-sm text-emerald-600 mt-4 font-medium">Tip: Pulsa "Cargar Datos Iniciales" arriba para rellenar la web.</p>
            )}
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('Todos') }}
              className="mt-6 text-indigo-600 font-medium hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}

      </main>

      <footer className="mt-20 border-t border-slate-200 bg-white py-12 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-2">© 2024 Plataforma de Formación Docente.</p>
          <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
            <span>Desarrollado con React & Firebase</span>
            <span>•</span>
            <span>IA Integrada</span>
          </div>
        </div>
      </footer>

      <Concierge resources={resources} />

      <AddResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddResource}
      />

    </div>
  );
};

// Wrap App with Provider
const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;