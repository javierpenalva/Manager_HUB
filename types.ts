export type Category = 'Todos' | 'IA Generativa' | 'Diseño' | 'Productividad' | 'Evaluación' | 'Multimedia';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Category;
  tags: string[];
  imageUrl: string;
  featured?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
