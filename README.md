# README.md
# BlogifyAI

BlogifyAI est une application web qui convertit des vidéos YouTube, podcasts et textes en articles optimisés pour le SEO en utilisant GPT-4 et Whisper API.

## Installation
1. Clonez ce dépôt :
   ```sh
   git clone https://github.com/votre-repo/blogifyai.git
   cd blogifyai
   ```
2. Démarrez avec Docker :
   ```sh
   docker-compose up --build
   ```

## Technologies utilisées
- **Frontend :** Next.js, Tailwind CSS
- **Backend :** FastAPI, Python
- **Base de données :** PostgreSQL
- **IA :** OpenAI GPT-4, Whisper API

## Fonctionnalités
- Transcription de vidéos/audio avec Whisper
- Génération d’articles SEO avec GPT-4
- Publication automatique sur WordPress/Medium

## Variables d’environnement
Créer un fichier `.env` avec :
```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgres://user:password@localhost/blogifyai
WORDPRESS_URL=https://yourwordpresssite.com/wp-json/wp/v2/posts
WORDPRESS_USER=your_wp_username
WORDPRESS_PASSWORD=your_wp_password
```
