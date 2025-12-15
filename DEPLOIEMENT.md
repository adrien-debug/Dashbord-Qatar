# 🚀 Guide de Déploiement - Dashboard Hearst Qatar

## Déploiement sur Vercel

### Option 1 : Déploiement via GitHub (Recommandé)

1. **Connectez votre compte GitHub à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Sign Up" ou "Log In"
   - Choisissez "Continue with GitHub"

2. **Importez votre repository**
   - Cliquez sur "Add New Project"
   - Sélectionnez votre repository : `adrien-debug/Dashbord-Qatar`
   - Cliquez sur "Import"

3. **Configuration du projet**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Variables d'environnement (optionnel)**
   ```
   NODE_ENV=production
   ```

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes
   - Votre site sera disponible sur : `https://dashbord-qatar.vercel.app`

### Option 2 : Déploiement via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard"
vercel

# Déploiement en production
vercel --prod
```

---

## Déploiement sur Netlify

### Via GitHub

1. Allez sur [netlify.com](https://netlify.com)
2. "New site from Git"
3. Choisissez GitHub et sélectionnez `Dashbord-Qatar`
4. Configuration :
   ```
   Build command: npm run build
   Publish directory: .next
   ```
5. Cliquez sur "Deploy site"

---

## Déploiement sur un VPS (Ubuntu/Debian)

### Prérequis

```bash
# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PM2
sudo npm install -g pm2
```

### Déploiement

```bash
# Cloner le repository
git clone https://github.com/adrien-debug/Dashbord-Qatar.git
cd Dashbord-Qatar

# Installer les dépendances
npm install

# Build de production
npm run build

# Démarrer avec PM2
pm2 start npm --name "qatar-dashboard" -- start

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:1111;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Déploiement Docker

### Créer Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 1111

CMD ["npm", "start"]
```

### Build et Run

```bash
# Build l'image
docker build -t qatar-dashboard .

# Run le container
docker run -d -p 1111:1111 --name qatar-dashboard qatar-dashboard
```

---

## Variables d'Environnement

Créez un fichier `.env.local` :

```env
# API Configuration (si nécessaire)
NEXT_PUBLIC_API_URL=https://api.example.com

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Environment
NODE_ENV=production
```

---

## Vérification Post-Déploiement

### Checklist

- [ ] Le site se charge correctement
- [ ] Toutes les pages sont accessibles (/, /mining-dashboard, /infrastructure)
- [ ] Les charts s'affichent correctement
- [ ] La sidebar fonctionne (collapse/expand)
- [ ] Le design responsive fonctionne sur mobile
- [ ] Pas d'erreurs dans la console du navigateur

### Tests

```bash
# Test de build local
npm run build
npm start

# Ouvrir http://localhost:1111
```

---

## Domaine Personnalisé

### Sur Vercel

1. Allez dans "Settings" > "Domains"
2. Ajoutez votre domaine : `dashboard.hearst-qatar.com`
3. Configurez les DNS selon les instructions Vercel

### Configuration DNS

```
Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com
```

---

## Monitoring et Logs

### Vercel

- Logs disponibles dans le dashboard Vercel
- Analytics intégré
- Monitoring des performances

### PM2 (VPS)

```bash
# Voir les logs
pm2 logs qatar-dashboard

# Monitoring
pm2 monit

# Redémarrer
pm2 restart qatar-dashboard
```

---

## Mises à Jour

### Déploiement Automatique (Vercel/Netlify)

Chaque push sur la branche `main` déclenche automatiquement un nouveau déploiement.

### Mise à jour manuelle (VPS)

```bash
cd Dashbord-Qatar
git pull origin main
npm install
npm run build
pm2 restart qatar-dashboard
```

---

## Troubleshooting

### Erreur 404

- Vérifiez que `vercel.json` est présent
- Vérifiez que le build s'est terminé avec succès
- Vérifiez les logs de déploiement

### Build Failed

```bash
# Nettoyer et rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Performance

- Activez la compression gzip
- Utilisez un CDN pour les assets statiques
- Configurez le cache HTTP

---

## Support

Pour toute question sur le déploiement :
- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js : https://nextjs.org/docs/deployment

---

**Dernière mise à jour :** 15 Décembre 2025

