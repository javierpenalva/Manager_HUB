# Resource Hub Docente

Una plataforma moderna para que el profesorado comparta, descubra y organice recursos educativos (Webs, IAs, herramientas), con un asistente pedagógico integrado.

## Características

- **Catálogo Visual**: Tarjetas interactivas con filtrado por categorías.
- **Asistente IA**: Chatbot integrado con Gemini para recomendar herramientas.
- **Modo Invitado**: Funcionalidad completa sin necesidad de login (usa LocalStorage).
- **Autenticación Docente**: Integración con Google (Firebase) para persistencia en la nube.

## Configuración para GitHub Pages

Este proyecto está configurado para desplegarse automáticamente mediante GitHub Actions.

1. Ve a la pestaña **Settings** de tu repositorio.
2. Entra en **Secrets and variables** > **Actions**.
3. Pulsa "New repository secret".
4. Nombre: `VITE_GEMINI_API_KEY`.
5. Valor: Tu clave de API de Google AI Studio.

Cada vez que hagas un cambio en el código, la web se actualizará sola en unos minutos.

## Tecnologías

- React + Vite
- Tailwind CSS
- Firebase (Auth & Firestore)
- Google Gemini API
