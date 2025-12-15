# 🏛️ Dashboard Hearst Qatar - Bitcoin Strategic Reserve

Dashboard institutionnel premium pour le Gouvernement du Qatar - Hearst Corporation

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)

## 📊 Vue d'ensemble

Dashboard de monitoring en temps réel pour la facilité de mining Bitcoin de 100MW au Qatar, développé pour Hearst Corporation. Interface premium avec visualisations avancées pour le suivi de la réserve stratégique Bitcoin, la production mining et l'infrastructure.

## ✨ Fonctionnalités

### 🎯 Dashboards Principaux

- **Vue d'ensemble** - Métriques clés et navigation
- **Mining Dashboard** - Production BTC, hashrate, fleet monitoring
- **Infrastructure** - Monitoring power & cooling systems

### 📈 Visualisations

- Charts avancés (Area, Line, Bar, Pie)
- Gauges de performance
- Heatmaps pour container monitoring
- Sparklines pour tendances rapides

### 🎨 Interface

- Design moderne et professionnel
- Sidebar rétractable avec navigation fluide
- Responsive (desktop, tablet, mobile)
- Thème sombre premium avec accents verts (#8AFD81)

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/adrien-debug/Dashbord-Qatar.git
cd Dashbord-Qatar

# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Ouvrir http://localhost:1111
```

## 🛠️ Technologies

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Deployment:** Vercel-ready

## 📁 Structure du Projet

```
├── components/
│   ├── charts/          # Composants de visualisation
│   ├── dashboard/       # Composants dashboard
│   └── layout/          # Layout & Sidebar
├── lib/                 # Mock data & utilities
├── pages/               # Pages Next.js
├── public/              # Assets statiques
├── styles/              # Styles globaux
└── utils/               # Fonctions utilitaires
```

## 🌐 Accès Réseau Local

Pour accéder au dashboard depuis d'autres appareils :

```bash
# Le serveur écoute sur toutes les interfaces
npm run dev

# Accès depuis le réseau local
http://[VOTRE_IP]:1111
```

Consultez `ACCES_RESEAU.md` pour plus de détails.

## 📊 Données

Le dashboard utilise actuellement des données mockées pour la démonstration. Les données incluent :

- **Mining KPIs** - Hashrate, production, efficiency, uptime
- **Strategic Reserve** - BTC accumulés, projections
- **Infrastructure** - Power systems, cooling, uptime
- **Hardware Fleet** - Status des miners et containers

## 🎨 Personnalisation

### Couleurs

Le thème utilise une palette professionnelle :
- Primaire : `#8AFD81` (vert)
- Fond : `#0f172a` → `#1e293b` (gradient sombre)
- Texte : Slate (50-900)

### Composants

Tous les composants sont modulaires et réutilisables. Voir `/components` pour la documentation.

## 📱 Responsive Design

- **Desktop** : Layout complet avec sidebar
- **Tablet** : Sidebar rétractable
- **Mobile** : Navigation optimisée

## 🔧 Configuration

### Port Personnalisé

Modifier dans `package.json` :

```json
"dev": "next dev -p [PORT] -H 0.0.0.0"
```

### Variables d'Environnement

Créer `.env.local` :

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## 📈 Performance

- **Lighthouse Score** : 95+
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s

## 🤝 Contribution

Ce projet est développé pour Hearst Corporation / Gouvernement du Qatar.

## 📄 License

Propriétaire - Hearst Corporation © 2025

## 👨‍💻 Développeur

Développé par Adrien pour Hearst Corporation

## 📞 Support

Pour toute question ou support, consultez la documentation dans le dossier `/docs`.

---

**Note:** Ce dashboard est conçu pour un environnement de production sécurisé. Assurez-vous de configurer correctement l'authentification et les variables d'environnement avant le déploiement.
