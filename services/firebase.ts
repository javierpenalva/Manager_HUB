import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { Resource } from '../types';

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyC6A-rQphmoLi9GdFw3SXO3WLzSuGhQzYY",
  authDomain: "recursos-docentes-79893.firebaseapp.com",
  projectId: "recursos-docentes-79893",
  storageBucket: "recursos-docentes-79893.firebasestorage.app",
  messagingSenderId: "400823860950",
  appId: "1:400823860950:web:e7adc94072fdadb48f1377"
};

const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "TU_API_KEY_AQUI";

let app;
let auth: any;
let db: any;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Error inicializando Firebase:", error);
  }
}

// --- MODO DEMO / INVITADO ---
export const forceMockLogin = () => {
  const mockUser = {
    uid: 'mock-user-demo',
    displayName: 'Docente Invitado',
    email: 'invitado@formacion.edu',
    photoURL: 'https://ui-avatars.com/api/?name=Docente+Invitado&background=6366f1&color=fff'
  };
  localStorage.setItem('mockUser', JSON.stringify(mockUser));
  window.location.reload();
};

export const loginWithGoogle = async () => {
  if (!auth) throw new Error("Firebase_Not_Initialized");
  const provider = new GoogleAuthProvider();
  // Forzamos la selección de cuenta para evitar que el navegador use una sesión vieja bloqueada
  provider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithPopup(auth, provider);
};

export const logout = async () => {
  localStorage.removeItem('mockUser');
  if (auth) await firebaseSignOut(auth);
  window.location.reload();
};

export const subscribeToAuthChanges = (callback: (user: any | null) => void) => {
  const stored = localStorage.getItem('mockUser');
  if (stored) {
    callback(JSON.parse(stored));
    return () => {};
  }
  if (auth) return onAuthStateChanged(auth, callback);
  callback(null);
  return () => {};
};

// --- BASE DE DATOS ---
export const subscribeToResources = (callback: (resources: Resource[]) => void) => {
  const loadLocal = () => {
    const stored = localStorage.getItem('edtech-resources');
    import('../data').then(m => callback(stored ? JSON.parse(stored) : m.resources));
  };

  if (!db) {
    loadLocal();
    return () => {};
  }

  const q = query(collection(db, 'resources'), orderBy('title'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[];
    callback(data.length > 0 ? data : []);
  }, (err) => {
    console.warn("Firestore inaccesible, usando local", err);
    loadLocal();
  });
};

export const addResourceToDB = async (resource: Omit<Resource, 'id'>) => {
  if (!db || localStorage.getItem('mockUser')) {
    const stored = localStorage.getItem('edtech-resources');
    const data = await import('../data');
    const current = stored ? JSON.parse(stored) : data.resources;
    const updated = [{ ...resource, id: Date.now().toString() }, ...current];
    localStorage.setItem('edtech-resources', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return;
  }
  await addDoc(collection(db, 'resources'), resource);
};

export const updateResourceInDB = async (id: string, resource: Partial<Resource>) => {
  if (!db || localStorage.getItem('mockUser')) {
    const stored = localStorage.getItem('edtech-resources');
    if (stored) {
      const current = JSON.parse(stored) as Resource[];
      const updated = current.map(r => r.id === id ? { ...r, ...resource } : r);
      localStorage.setItem('edtech-resources', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
    return;
  }
  const docRef = doc(db, 'resources', id);
  await updateDoc(docRef, resource);
};

export const deleteResourceFromDB = async (id: string) => {
  if (!db || localStorage.getItem('mockUser')) {
    const stored = localStorage.getItem('edtech-resources');
    const data = await import('../data');
    const current = stored ? JSON.parse(stored) : data.resources;
    localStorage.setItem('edtech-resources', JSON.stringify(current.filter((r: any) => r.id !== id)));
    window.dispatchEvent(new Event('storage'));
    return;
  }
  await deleteDoc(doc(db, 'resources', id));
};

export const isFirebaseReady = isConfigured && !!auth;