export type Category = 'Todos' | 'IA Generativa' | 'Diseño' | 'Multimedia' | 'VR/AR' | 'Simulaciones' | 'Impresión 3D' | 'Educación' | 'Menores y TIC' | 'Herramientas TIC' | 'Banco de Recursos';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  categories: Category[];
  tags: string[];
  imageUrl: string;
  featured?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}