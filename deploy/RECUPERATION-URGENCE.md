# 🚨 Guide de Récupération d'Urgence - VPS

## Situation actuelle
Vous avez perdu l'accès à votre VPS et vos applications ne fonctionnent plus.

## 🔍 Étape 1: Diagnostic

Exécutez le script de diagnostic pour identifier les problèmes:

```powershell
.\deploy\diagnostic-vps.ps1
```

Ce script va vérifier:
- ✅ Si SSH est installé sur Windows
- ✅ Si le VPS répond au ping
- ✅ Si le port SSH est ouvert
- ✅ Si votre clé SSH existe et fonctionne
- ✅ L'état des services sur le VPS (PM2, Nginx, etc.)

## 🔑 Étape 2: Restaurer l'accès SSH

### Option A: Si vous n'avez pas de clé SSH

1. **Générez une clé SSH:**
   ```powershell
   .\deploy\fix-ssh-connection.ps1
   ```

2. **Copiez la clé sur le VPS:**
   
   **Méthode 1 (Recommandée): Via le panneau OVH**
   - Connectez-vous au panneau OVH: https://www.ovh.com/manager/
   - Allez dans **VPS** > Votre serveur
   - Cliquez sur **Console VNC** ou **Console SSH**
   - Connectez-vous directement depuis le panneau
   - Sur le VPS, exécutez:
     ```bash
     mkdir -p ~/.ssh
     chmod 700 ~/.ssh
     nano ~/.ssh/authorized_keys
     ```
   - Collez votre clé publique (affichée par le script)
   - Sauvegardez: `Ctrl+O`, `Entrée`, `Ctrl+X`
   - Exécutez: `chmod 600 ~/.ssh/authorized_keys`

   **Méthode 2: Script automatique (si vous avez un autre accès)**
   ```powershell
   .\deploy\copy-ssh-key.ps1
   ```

### Option B: Si vous avez déjà une clé SSH

Testez la connexion:
```powershell
ssh -i "$env:USERPROFILE\.ssh\id_ed25519_vps" ubuntu@51.75.160.211
```

Si ça ne fonctionne pas, suivez l'Option A.

## 🔧 Étape 3: Restaurer l'application

Une fois l'accès SSH restauré, exécutez le script de restauration:

```powershell
.\deploy\restore-vps.ps1
```

Ce script va automatiquement:
- ✅ Vérifier/installer Node.js, PM2, Nginx
- ✅ Arrêter les anciennes instances PM2
- ✅ Configurer le répertoire de l'application
- ✅ Installer les dépendances et builder l'application
- ✅ Configurer Nginx
- ✅ Démarrer l'application avec PM2
- ✅ Vérifier que tout fonctionne

## 🛠️ Étape 4: Vérification manuelle (si nécessaire)

Si le script automatique ne fonctionne pas, connectez-vous manuellement:

```powershell
ssh -i "$env:USERPROFILE\.ssh\id_ed25519_vps" ubuntu@51.75.160.211
```

Puis exécutez ces commandes sur le VPS:

```bash
# 1. Vérifier l'état de PM2
pm2 list
pm2 logs demo-fencing-vane --lines 50

# 2. Vérifier Nginx
sudo systemctl status nginx
sudo nginx -t

# 3. Vérifier l'application
curl http://localhost:3000

# 4. Si l'application ne fonctionne pas, redémarrer
cd /var/www/demo-fencing-vane
npm install --production
npm run build
pm2 restart demo-fencing-vane

# 5. Si PM2 n'est pas configuré
pm2 start npm --name "demo-fencing-vane" -- start
pm2 save
pm2 startup
```

## 📋 Checklist de récupération

- [ ] Diagnostic exécuté (`.\deploy\diagnostic-vps.ps1`)
- [ ] Clé SSH générée et configurée
- [ ] Connexion SSH testée et fonctionnelle
- [ ] Script de restauration exécuté (`.\deploy\restore-vps.ps1`)
- [ ] Application accessible sur http://escrimetalents.anis-mairi.com
- [ ] PM2 fonctionne (`pm2 list` sur le VPS)
- [ ] Nginx fonctionne (`sudo systemctl status nginx` sur le VPS)

## 🆘 Si rien ne fonctionne

1. **Réinitialisez le mot de passe via le panneau OVH**
   - Panneau OVH > VPS > Votre serveur > Réinitialiser le mot de passe

2. **Utilisez la console VNC du panneau OVH**
   - Accès direct au serveur sans SSH

3. **Contactez le support OVH**
   - Ils peuvent réinitialiser l'accès si nécessaire

## 📞 Informations importantes

- **IP VPS**: `51.75.160.211`
- **Utilisateur**: `ubuntu`
- **Domaine**: `escrimetalents.anis-mairi.com`
- **Port application**: `3000`
- **Nom app PM2**: `demo-fencing-vane`
- **Répertoire**: `/var/www/demo-fencing-vane`

## 🔗 Scripts disponibles

- `.\deploy\diagnostic-vps.ps1` - Diagnostic complet
- `.\deploy\restore-vps.ps1` - Restauration automatique
- `.\deploy\fix-ssh-connection.ps1` - Générer une clé SSH
- `.\deploy\copy-ssh-key.ps1` - Copier la clé sur le VPS
- `.\deploy\connect-vps.ps1` - Se connecter au VPS

## ✅ Après la récupération

Une fois tout restauré:

1. **Configurez SSL** (si pas déjà fait):
   ```bash
   ssh -i "$env:USERPROFILE\.ssh\id_ed25519_vps" ubuntu@51.75.160.211
   sudo certbot --nginx -d escrimetalents.anis-mairi.com
   ```

2. **Configurez le démarrage automatique de PM2**:
   ```bash
   pm2 startup
   pm2 save
   ```

3. **Surveillez les logs**:
   ```bash
   pm2 logs demo-fencing-vane
   ```

