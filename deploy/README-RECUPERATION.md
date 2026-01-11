# 🚨 Guide de Récupération Complète - VPS

## Situation
Vous avez perdu l'accès à votre VPS et vos applications ne fonctionnent plus.

## ⚡ Solution Rapide (Recommandée)

**Exécutez simplement ce script qui fait tout automatiquement:**

```powershell
.\deploy\quick-recovery.ps1
```

Ce script va:
1. ✅ Vérifier/générer votre clé SSH
2. ✅ Tester la connexion au VPS
3. ✅ Copier la clé si nécessaire
4. ✅ Restaurer complètement l'application
5. ✅ Vérifier que tout fonctionne

## 📋 Solutions Détaillées

### Option 1: Diagnostic d'abord

Si vous voulez d'abord comprendre ce qui ne va pas:

```powershell
.\deploy\diagnostic-vps.ps1
```

Ce script vous dira exactement quel est le problème.

### Option 2: Restauration manuelle étape par étape

Suivez le guide complet: [RECUPERATION-URGENCE.md](RECUPERATION-URGENCE.md)

## 🔧 Scripts Disponibles

| Script | Description | Usage |
|--------|-------------|-------|
| `quick-recovery.ps1` | **Récupération automatique complète** | `.\deploy\quick-recovery.ps1` |
| `diagnostic-vps.ps1` | Diagnostic de l'état du VPS | `.\deploy\diagnostic-vps.ps1` |
| `restore-vps.ps1` | Restauration via PowerShell | `.\deploy\restore-vps.ps1` |
| `restore-vps.sh` | Restauration bash (sur le VPS) | `bash restore-vps.sh` |
| `fix-ssh-connection.ps1` | Générer une clé SSH | `.\deploy\fix-ssh-connection.ps1` |
| `copy-ssh-key.ps1` | Copier la clé sur le VPS | `.\deploy\copy-ssh-key.ps1` |
| `connect-vps.ps1` | Se connecter au VPS | `.\deploy\connect-vps.ps1` |

## 🎯 Scénarios Courants

### Scénario 1: "Je n'ai plus accès au VPS"

1. Exécutez: `.\deploy\quick-recovery.ps1`
2. Si ça ne fonctionne pas, suivez: [RESOLUTION-MOT-DE-PASSE.md](RESOLUTION-MOT-DE-PASSE.md)

### Scénario 2: "Mon application ne fonctionne plus"

1. Connectez-vous au VPS: `ssh -i "$env:USERPROFILE\.ssh\id_ed25519_vps" ubuntu@51.75.160.211`
2. Exécutez: `bash /var/www/demo-fencing-vane/deploy/restore-vps.sh`
   OU depuis Windows: `.\deploy\restore-vps.ps1`

### Scénario 3: "Je ne sais pas ce qui ne va pas"

1. Exécutez: `.\deploy\diagnostic-vps.ps1`
2. Suivez les recommandations affichées

## 📞 Informations du VPS

- **IP**: `51.75.160.211`
- **Utilisateur**: `ubuntu`
- **Domaine**: `escrimetalents.anis-mairi.com`
- **Port App**: `3000`
- **Nom PM2**: `demo-fencing-vane`
- **Répertoire**: `/var/www/demo-fencing-vane`

## 🆘 Si Rien Ne Fonctionne

### Méthode 1: Via le Panneau OVH (Console VNC)

1. Connectez-vous au panneau OVH: https://www.ovh.com/manager/
2. Allez dans **VPS** > Votre serveur
3. Cliquez sur **Console VNC**
4. Connectez-vous directement
5. Téléchargez et exécutez le script de restauration:
   ```bash
   curl -s https://raw.githubusercontent.com/AnisMairi/demo-fencing-vane/main/deploy/restore-vps.sh | bash
   ```
   OU copiez le fichier `deploy/restore-vps.sh` sur le VPS et exécutez-le

### Méthode 2: Réinitialiser le mot de passe

1. Dans le panneau OVH, réinitialisez le mot de passe de l'utilisateur `ubuntu`
2. Attendez quelques minutes
3. Connectez-vous avec le nouveau mot de passe
4. Configurez une clé SSH (voir [RESOLUTION-MOT-DE-PASSE.md](RESOLUTION-MOT-DE-PASSE.md))

### Méthode 3: Support OVH

Contactez le support OVH si vous n'avez aucun accès.

## ✅ Après la Récupération

Une fois tout restauré:

1. **Vérifiez que l'application fonctionne:**
   ```bash
   curl http://localhost:3000
   pm2 list
   ```

2. **Configurez SSL** (si pas déjà fait):
   ```bash
   sudo certbot --nginx -d escrimetalents.anis-mairi.com
   ```

3. **Configurez le démarrage automatique:**
   ```bash
   pm2 startup
   pm2 save
   ```

4. **Surveillez les logs:**
   ```bash
   pm2 logs demo-fencing-vane
   ```

## 📚 Documentation Complète

- [RECUPERATION-URGENCE.md](RECUPERATION-URGENCE.md) - Guide détaillé de récupération
- [RESOLUTION-MOT-DE-PASSE.md](RESOLUTION-MOT-DE-PASSE.md) - Résolution des problèmes SSH
- [SOLUTION-RAPIDE.md](SOLUTION-RAPIDE.md) - Solution rapide pour Permission denied
- [TROUBLESHOOTING-SSH.md](TROUBLESHOOTING-SSH.md) - Dépannage SSH complet
- [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md) - Guide de déploiement normal

## 🔄 Commandes Utiles Après Récupération

```bash
# Se connecter au VPS
ssh -i "$env:USERPROFILE\.ssh\id_ed25519_vps" ubuntu@51.75.160.211

# Vérifier PM2
pm2 list
pm2 logs demo-fencing-vane
pm2 restart demo-fencing-vane

# Vérifier Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx

# Vérifier l'application
curl http://localhost:3000

# Voir les logs
pm2 logs demo-fencing-vane --lines 100
sudo tail -f /var/log/nginx/error.log
```

## 💡 Conseils

1. **Sauvegardez régulièrement** votre clé SSH dans un endroit sûr
2. **Configurez le démarrage automatique** de PM2 après chaque restauration
3. **Surveillez les logs** régulièrement pour détecter les problèmes tôt
4. **Testez la connexion SSH** régulièrement pour éviter les surprises

---

**Besoin d'aide?** Consultez les guides détaillés dans le dossier `deploy/`

