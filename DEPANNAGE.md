# 🔧 Guide de Dépannage - Connexion Réseau

## ✅ Vérifications Effectuées

Le serveur fonctionne correctement :
- ✓ Serveur démarré sur le port 1111
- ✓ Répond en local (http://localhost:1111)
- ✓ Répond via IP réseau (http://3.3.3.3:1111)
- ✓ Configuration Next.js correcte (0.0.0.0)

---

## 🔍 Problèmes Possibles

### 1. **Pare-feu macOS** (Le plus probable)

Le pare-feu de votre Mac peut bloquer les connexions entrantes.

#### Solution A - Via l'interface graphique :
1. Ouvrez **Préférences Système** > **Sécurité et confidentialité**
2. Cliquez sur l'onglet **Pare-feu**
3. Cliquez sur le cadenas 🔒 pour déverrouiller
4. Cliquez sur **Options du pare-feu**
5. Décochez **"Bloquer toutes les connexions entrantes"**
6. Ou ajoutez **Node** à la liste des applications autorisées

#### Solution B - Désactiver temporairement :
1. **Préférences Système** > **Sécurité et confidentialité** > **Pare-feu**
2. Cliquez sur **Désactiver le pare-feu** (temporairement pour tester)
3. Testez la connexion depuis l'autre appareil
4. Réactivez le pare-feu après

---

### 2. **Réseau Différent**

Les deux appareils doivent être sur le **même réseau WiFi**.

#### Vérification :
- Sur votre Mac : `ifconfig | grep "inet "`
- Sur l'autre appareil : Vérifiez l'IP dans les paramètres WiFi
- Les IPs doivent commencer pareil (ex: `192.168.1.xxx`)

---

### 3. **Antivirus / VPN**

Un antivirus ou VPN peut bloquer les connexions.

#### Solution :
- Désactivez temporairement votre VPN
- Désactivez temporairement l'antivirus
- Testez la connexion

---

### 4. **Routeur / Box Internet**

Certains routeurs isolent les appareils (mode "isolation AP").

#### Solution :
- Vérifiez les paramètres de votre routeur
- Désactivez "AP Isolation" ou "Client Isolation"
- Redémarrez le routeur si nécessaire

---

## 🧪 Tests de Diagnostic

### Test 1 : Ping depuis l'autre appareil

Sur l'autre ordinateur (Windows/Mac/Linux), ouvrez un terminal :

```bash
# Sur Windows (CMD)
ping 3.3.3.3

# Sur Mac/Linux
ping -c 4 3.3.3.3
```

**Résultat attendu :** Réponses positives
**Si ça échoue :** Problème réseau ou pare-feu

---

### Test 2 : Telnet sur le port

Sur l'autre ordinateur :

```bash
# Sur Mac/Linux
telnet 3.3.3.3 1111

# Sur Windows (PowerShell)
Test-NetConnection -ComputerName 3.3.3.3 -Port 1111
```

**Résultat attendu :** Connexion établie
**Si ça échoue :** Le pare-feu bloque le port 1111

---

### Test 3 : Depuis votre Mac

Testez depuis votre propre Mac avec l'IP réseau :

```bash
curl http://3.3.3.3:1111
```

**Résultat attendu :** Code HTML du dashboard
**Si ça marche :** Le problème vient de l'autre appareil ou du réseau

---

## 📱 Test Simple avec votre Téléphone

1. Connectez votre téléphone au **même WiFi**
2. Ouvrez Safari (iOS) ou Chrome (Android)
3. Désactivez les **données mobiles** (pour être sûr d'utiliser le WiFi)
4. Tapez : `http://3.3.3.3:1111`

**Si ça ne marche pas sur le téléphone non plus :**
→ C'est probablement le pare-feu de votre Mac

---

## 🔥 Solution Rapide - Pare-feu

### Méthode la plus simple :

1. Ouvrez **Préférences Système**
2. Cliquez sur **Partage**
3. Cochez **"Partage Internet"** (même si vous ne l'utilisez pas)
4. Décochez-le immédiatement
5. Cela réinitialise souvent les règles du pare-feu

---

## 📊 Commandes de Diagnostic

Exécutez ces commandes sur votre Mac :

```bash
# Vérifier que le serveur écoute sur toutes les interfaces
lsof -i :1111

# Vérifier votre IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Tester localement
curl -I http://localhost:1111

# Tester via IP réseau
curl -I http://3.3.3.3:1111
```

---

## ✅ Checklist Complète

- [ ] Le serveur est démarré (`npm run dev`)
- [ ] Même réseau WiFi sur les deux appareils
- [ ] Pare-feu macOS configuré (applications autorisées)
- [ ] Pas de VPN actif
- [ ] L'adresse IP est correcte (3.3.3.3)
- [ ] Le port 1111 n'est pas bloqué
- [ ] Le navigateur de l'autre appareil fonctionne

---

## 🆘 Si Rien ne Marche

### Option 1 : Utiliser un autre port

Modifiez `package.json` :
```json
"dev": "next dev -p 3000 -H 0.0.0.0"
```

Puis utilisez : `http://3.3.3.3:3000`

### Option 2 : Partage d'écran

Utilisez le partage d'écran macOS au lieu de l'accès réseau :
- **Préférences Système** > **Partage** > **Partage d'écran**

### Option 3 : Tunnel ngrok

Installez ngrok pour créer un tunnel public :
```bash
brew install ngrok
ngrok http 1111
```

---

## 📞 Besoin d'Aide ?

Si le problème persiste, vérifiez :
1. Les logs du serveur (terminal où tourne `npm run dev`)
2. La console du navigateur (F12) sur l'autre appareil
3. Les paramètres réseau de votre routeur

---

**Dernière mise à jour :** 15 Décembre 2025

