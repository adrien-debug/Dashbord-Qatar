# 📋 INSTRUCTIONS POUR L'ASSISTANT SUIVANT

## 🎯 CONTEXTE

L'utilisateur a demandé de séparer son projet en 2 :

1. **Hearst Qatar Dashboard** (Port 1111) - 3 pages pour le Qatar ✅ CRÉÉ
2. **Hearst 3D Configurator** (Port 3333) - Tout le reste ⏳ À MODIFIER

---

## ✅ CE QUI A ÉTÉ FAIT

### Nouveau Projet Créé
**Emplacement:** `/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard/`

**Contenu:**
- ✅ 3 pages Qatar (index, mining-dashboard, infrastructure)
- ✅ Composants charts (7 fichiers)
- ✅ Composants dashboard (4 fichiers)
- ✅ Données mock (mining, infrastructure)
- ✅ Utilitaire formatNumber
- ✅ Configuration complète (package.json, next.config, etc.)
- ✅ Dépendances installées (142 packages)
- ✅ README complet
- ✅ Port 1111 configuré

**Status:** ✅ Prêt pour test - **AUCUNE MODIFICATION À FAIRE ICI**

---

## ⏳ CE QUI RESTE À FAIRE

### Une fois que l'utilisateur a testé et validé le nouveau projet

**IMPORTANT:** N'effectuer ces modifications que si l'utilisateur dit explicitement :
- "C'est bon, ça marche"
- "Validé"
- "Tu peux modifier l'ancien projet maintenant"
- Ou toute confirmation similaire

---

## 🔧 MODIFICATIONS À FAIRE SUR L'ANCIEN PROJET

**Emplacement:** `/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/`

### Étape 1 : Supprimer les 3 pages Qatar

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar"

# Supprimer dashboard.tsx (qui était l'Executive Overview)
rm pages/dashboard.tsx

# Supprimer mining-dashboard.tsx
rm pages/mining-dashboard.tsx

# Supprimer infrastructure.tsx
rm pages/infrastructure.tsx
```

### Étape 2 : Modifier package.json

Changer le port par défaut de 1111 à 3333 :

**Fichier:** `/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/package.json`

```json
{
  "scripts": {
    "dev": "next dev -p 3333 -H localhost",  // ← Changer de 1111 à 3333
    "dev:3333": "node server-3333.js",
    "dev:gallery": "node server-gallery.js",
    // ... reste inchangé
  }
}
```

### Étape 3 : Créer un README pour le configurateur

**Fichier:** `/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/README_CONFIGURATEUR.md`

Contenu :
```markdown
# 🏗️ Hearst 3D Configurator

Système modulaire 3D pour la conception d'infrastructures de mining Bitcoin - 5MW à 200MW

## 🚀 Démarrage

\`\`\`bash
npm run dev
\`\`\`

Serveur accessible sur : **http://localhost:3333**

## 📊 Pages Disponibles

- `/` - Wizard de création de projet
- `/gallery` - Galerie de modèles 3D
- `/environment` - Environnement 3D
- `/configurator` - Configurateur
- Et 35+ autres pages...

## 📝 Note

Les dashboards Qatar ont été déplacés vers un projet séparé :
**Hearst Qatar Dashboard** (Port 1111)
```

### Étape 4 : Mettre à jour la documentation

**Fichier:** `/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/README.md`

Ajouter en haut :
```markdown
# ⚠️ ATTENTION

Les dashboards institutionnels pour le Qatar ont été déplacés vers un projet séparé :

**Hearst Qatar Dashboard**
- Emplacement : `/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard/`
- Port : 1111
- Pages : Executive Overview, Mining Dashboard, Infrastructure Monitoring

Ce projet contient uniquement le **configurateur 3D** et les **outils de modélisation**.
```

### Étape 5 : Optionnel - Nettoyer les composants non utilisés

Si les composants dashboard ne sont plus utilisés ailleurs :

```bash
# Vérifier d'abord s'ils sont utilisés
grep -r "components/dashboard" pages/

# Si aucun résultat, les supprimer
rm -rf components/dashboard/

# Vérifier les données mock
grep -r "mock-mining\|mock-infrastructure" pages/

# Si non utilisés, les supprimer
rm lib/mock-mining.ts
rm lib/mock-infrastructure.ts
```

### Étape 6 : Tester l'ancien projet modifié

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar"
npm run dev
```

Vérifier :
- ✅ Serveur démarre sur port 3333
- ✅ Page d'accueil (wizard) fonctionne
- ✅ Galerie fonctionne
- ✅ Environnement 3D fonctionne
- ✅ Pas d'erreurs 404 pour les pages supprimées

---

## 📊 RÉSUMÉ DES 2 PROJETS

### Hearst Qatar Dashboard (Port 1111)
```
/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard/
├── 3 pages Qatar
├── Composants charts
├── Composants dashboard
├── Données mock
└── Configuration minimale
```

**Commande:** `npm run dev` → http://localhost:1111

### Hearst 3D Configurator (Port 3333)
```
/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/
├── 36+ pages (sans les 3 Qatar)
├── Composants 3D
├── Wizard
├── Galerie
├── Éditeur 3D
└── Configuration complète
```

**Commande:** `npm run dev` → http://localhost:3333

---

## ⚠️ POINTS D'ATTENTION

### Ne PAS faire avant validation utilisateur
- ❌ Ne pas supprimer les pages Qatar de l'ancien projet
- ❌ Ne pas modifier le package.json de l'ancien projet
- ❌ Ne pas toucher aux fichiers de l'ancien projet

### Faire SEULEMENT après validation
- ✅ Attendre confirmation explicite de l'utilisateur
- ✅ Suivre les étapes ci-dessus dans l'ordre
- ✅ Tester après chaque modification
- ✅ Garder des backups si nécessaire

---

## 🔄 ROLLBACK EN CAS DE PROBLÈME

Si quelque chose ne va pas après modifications :

### Option 1 : Restaurer les pages
Recopier les pages depuis le nouveau projet :
```bash
cp "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard/pages/index.tsx" \
   "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/pages/dashboard.tsx"

cp "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard/pages/mining-dashboard.tsx" \
   "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/pages/"

cp "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard/pages/infrastructure.tsx" \
   "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar/pages/"
```

### Option 2 : Restaurer le package.json
Remettre le port à 1111 :
```json
"dev": "next dev -p 1111 -H localhost"
```

---

## 📝 CHECKLIST FINALE

Avant de dire "C'est terminé" à l'utilisateur :

- [ ] Nouveau projet testé et validé par l'utilisateur
- [ ] 3 pages supprimées de l'ancien projet
- [ ] Port 3333 configuré dans l'ancien projet
- [ ] Documentation mise à jour
- [ ] Ancien projet testé sur port 3333
- [ ] Aucune erreur dans les 2 projets
- [ ] Les 2 projets peuvent tourner en parallèle

---

## 🎯 OBJECTIF FINAL

**2 projets indépendants qui fonctionnent en parallèle :**

1. **Qatar Dashboard** (1111) - Dashboards institutionnels
2. **3D Configurator** (3333) - Système modulaire 3D

Chacun avec :
- ✅ Son propre port
- ✅ Ses propres pages
- ✅ Ses propres dépendances
- ✅ Sa propre documentation
- ✅ Aucune interférence

---

## 💡 CONSEILS

1. **Toujours demander confirmation** avant de modifier l'ancien projet
2. **Tester chaque étape** avant de passer à la suivante
3. **Garder les backups** des fichiers importants
4. **Documenter** toutes les modifications
5. **Communiquer clairement** avec l'utilisateur

---

**Bonne chance ! 🚀**

---

**Date:** 15 Décembre 2024  
**Status:** ✅ Nouveau projet créé, en attente de validation

