# 🌐 Accès Réseau Local - Dashboard Hearst Qatar

## 📍 Adresses de Connexion

### Pour vous connecter depuis un autre ordinateur sur le même réseau :

**Adresse principale :**
```
http://3.3.3.3:1111
```

**Adresses alternatives :**
- Local (sur cet ordinateur) : `http://localhost:1111`
- Réseau : `http://3.3.3.3:1111`

---

## 🔧 Configuration Actuelle

- **Port** : 1111
- **Adresse IP locale** : 3.3.3.3
- **Réseau** : 3.3.3.0/24
- **Serveur** : Next.js 14.2.35
- **Mode** : Développement (Hot Reload activé)

---

## 📱 Instructions de Connexion

### Depuis un autre ordinateur :

1. **Vérifiez que vous êtes sur le même réseau WiFi/Ethernet**
   - Les deux ordinateurs doivent être connectés au même réseau local

2. **Ouvrez votre navigateur web** (Chrome, Firefox, Safari, Edge)

3. **Entrez l'adresse suivante dans la barre d'URL :**
   ```
   http://3.3.3.3:1111
   ```

4. **Appuyez sur Entrée**
   - Le dashboard devrait s'afficher immédiatement

---

## 📱 Accès depuis Mobile (iPhone/iPad/Android)

1. Connectez votre téléphone/tablette au **même réseau WiFi**
2. Ouvrez Safari (iOS) ou Chrome (Android)
3. Entrez : `http://3.3.3.3:1111`
4. Le dashboard s'affichera en version responsive

---

## 🔥 Pare-feu (Firewall)

Si la connexion ne fonctionne pas, vérifiez que le port 1111 est autorisé :

### Sur macOS :
```bash
# Vérifier le pare-feu
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Autoriser les connexions entrantes (si nécessaire)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
```

---

## 🔍 Dépannage

### Si la connexion échoue :

1. **Vérifiez que le serveur est démarré**
   ```bash
   # Depuis le terminal, dans le dossier du projet :
   npm run dev
   ```

2. **Vérifiez votre adresse IP actuelle**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Si l'adresse a changé, utilisez la nouvelle adresse affichée.

3. **Testez depuis cet ordinateur d'abord**
   - Ouvrez : `http://localhost:1111`
   - Si ça fonctionne, le problème vient du réseau

4. **Vérifiez que les deux appareils sont sur le même réseau**
   - Même WiFi ou même réseau Ethernet
   - Pas de VPN actif qui isole les connexions

---

## 🚀 Démarrage Rapide

### Pour démarrer le serveur :
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Hearst Qatar Dashboard"
npm run dev
```

### Pour arrêter le serveur :
- Appuyez sur `Ctrl + C` dans le terminal

---

## 📊 Pages Disponibles

Une fois connecté, vous pouvez accéder à :

- **Vue d'ensemble** : `http://3.3.3.3:1111/`
- **Mining Dashboard** : `http://3.3.3.3:1111/mining-dashboard`
- **Infrastructure** : `http://3.3.3.3:1111/infrastructure`

---

## ⚠️ Notes Importantes

1. **Sécurité** : Cette configuration est pour le développement local uniquement
2. **Réseau** : L'adresse IP peut changer si vous changez de réseau WiFi
3. **Performance** : Mode développement - rechargement automatique des modifications
4. **Connexions** : Plusieurs utilisateurs peuvent se connecter simultanément

---

## 🔄 Si l'adresse IP change

L'adresse IP locale peut changer. Pour obtenir la nouvelle adresse :

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Utilisez l'adresse affichée (format : `inet XXX.XXX.XXX.XXX`) avec le port 1111.

---

**Dernière mise à jour** : 15 Décembre 2025
**Serveur configuré sur** : 0.0.0.0:1111 (accepte toutes les connexions réseau)

