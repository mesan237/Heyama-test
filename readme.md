# Heyama — Test technique

 une app qui permet de créer, lister et supprimer des objets avec une image. Le tout en temps réel entre le web et le mobile.

---

## Stack

- **API** : NestJS + MongoDB (Atlas)
- **Web** : Next.js + shadcn/ui
- **Stockage images** : Cloudflare R2
- **Temps réel** : Socket.IO

---

## Lancer le projet

### Prérequis

- Node.js 18+
- Un compte MongoDB Atlas
- Un bucket Cloudflare R2

### Variables d'environnement

Copie le fichier d'exemple et remplis les valeurs :

```bash
cp api/.env.example api/.env
```

```env
MONGODB_URI=mongodb+srv://...
S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET_NAME=heyama
S3_PUBLIC_URL=https://pub-xxx.r2.dev
PORT=3001
```

### Démarrage

```bash
# API
cd api && npm install && npm run start:dev

# Web
cd client && npm install && npm run dev
```

L'API tourne sur `http://localhost:3001` et le web sur `http://localhost:3000`.

---

## Endpoints API

| Méthode | Route | Description |
|---|---|---|
| GET | `/objects` | Liste tous les objets |
| GET | `/objects/:id` | Récupère un objet |
| POST | `/objects` | Crée un objet (multipart/form-data) |
| DELETE | `/objects/:id` | Supprime un objet |

---

## Tests

```bash
cd api && npm run test
```

---

## Structure du projet

```
heyama/
├── api/        → NestJS (REST API + Socket.IO)
├── client/     → Next.js (web app)
```

---

## Notes

- Le web est complet
- Tourne en local
- Les images sont stockées sur Cloudflare R2 (compatible S3, pas Amazon)