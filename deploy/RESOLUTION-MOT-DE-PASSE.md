# 🔐 Résolution du problème "Permission denied"

## Problème

Vous obtenez "Permission denied" même avec le bon mot de passe. Cela peut être dû à:

1. **L'authentification par mot de passe est désactivée** sur le serveur (sécurité)
2. **Le compte est verrouillé** ou a des restrictions
3. **Problème de clavier** (caractères spéciaux, layout différent)
4. **Le serveur n'accepte que les clés SSH**

## ✅ Solution recommandée: Configurer une clé SSH

C'est la méthode la plus sécurisée et la plus fiable.

### Étape 1: Générer une clé SSH

Exécutez le script PowerShell:
```powershell
.\deploy\fix-ssh-connection.ps1
```

OU manuellement:
```cmd
ssh-keygen -t ed25519 -f "%USERPROFILE%\.ssh\id_ed25519_vps" -C "votre-email@example.com"
```

### Étape 2: Copier la clé sur le VPS

**Option A: Script automatique (essayez d'abord)**
```powershell
.\deploy\copy-ssh-key.ps1
```

**Option B: Via le panneau OVH (si SSH ne fonctionne pas)**

1. Connectez-vous au **panneau OVH**
2. Allez dans votre VPS > **Console VNC** ou **Console SSH**
3. Connectez-vous directement depuis le panneau
4. Exécutez ces commandes:

```bash
# Créer le dossier .ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Éditer le fichier authorized_keys
nano ~/.ssh/authorized_keys
```

5. **Collez votre clé publique** (vous pouvez la voir avec):
```cmd
type %USERPROFILE%\.ssh\id_ed25519_vps.pub
```

6. Sauvegarder (Ctrl+O, Entrée, Ctrl+X dans nano)

7. Définir les permissions:
```bash
chmod 600 ~/.ssh/authorized_keys
```

### Étape 3: Tester la connexion

```cmd
ssh -i "%USERPROFILE%\.ssh\id_ed25519_vps" ubuntu@51.75.160.211
```

## 🔧 Autres solutions

### Solution 1: Vérifier via le panneau OVH

1. Connectez-vous à **OVH Manager**
2. Allez dans **VPS** > Votre serveur
3. Utilisez la **Console VNC** pour accéder directement au serveur
4. Vérifiez le compte utilisateur:
```bash
# Vérifier que l'utilisateur ubuntu existe
id ubuntu

# Vérifier les permissions SSH
ls -la ~/.ssh/

# Vérifier la configuration SSH
sudo nano /etc/ssh/sshd_config
```

### Solution 2: Réinitialiser le mot de passe (via OVH)

1. Dans le panneau OVH, allez dans votre VPS
2. **Réinitialiser le mot de passe** de l'utilisateur `ubuntu`
3. Attendez quelques minutes
4. Réessayez la connexion

### Solution 3: Vérifier la configuration SSH du serveur

Si vous avez accès au serveur (via console OVH), vérifiez:

```bash
# Vérifier que l'authentification par mot de passe est activée
sudo grep -i "PasswordAuthentication" /etc/ssh/sshd_config

# Devrait afficher: PasswordAuthentication yes
# Si c'est "no", changez-le:
sudo nano /etc/ssh/sshd_config
# Changez PasswordAuthentication no en PasswordAuthentication yes
sudo systemctl restart sshd
```

### Solution 4: Créer un nouvel utilisateur

Si le problème persiste, créez un nouvel utilisateur:

```bash
# Sur le VPS (via console OVH)
sudo adduser nouvel_utilisateur
sudo usermod -aG sudo nouvel_utilisateur

# Copier votre clé SSH pour ce nouvel utilisateur
sudo mkdir -p /home/nouvel_utilisateur/.ssh
sudo cp ~/.ssh/authorized_keys /home/nouvel_utilisateur/.ssh/
sudo chown -R nouvel_utilisateur:nouvel_utilisateur /home/nouvel_utilisateur/.ssh
sudo chmod 700 /home/nouvel_utilisateur/.ssh
sudo chmod 600 /home/nouvel_utilisateur/.ssh/authorized_keys
```

## 🎯 Configuration SSH simplifiée

Après avoir configuré votre clé SSH, créez un fichier `C:\Users\anism\.ssh\config`:

```
Host vps-escrimetalents
    HostName 51.75.160.211
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519_vps
    IdentitiesOnly yes
```

Ensuite, connectez-vous simplement avec:
```cmd
ssh vps-escrimetalents
```

## 📞 Si rien ne fonctionne

1. **Contactez le support OVH** - Ils peuvent réinitialiser l'accès
2. **Utilisez la console VNC** du panneau OVH pour accéder directement
3. **Vérifiez les logs** sur le serveur:
```bash
sudo tail -f /var/log/auth.log
# Puis essayez de vous connecter et regardez les erreurs
```

## ✅ Checklist de dépannage

- [ ] SSH est installé sur Windows
- [ ] Le serveur répond au ping
- [ ] Le port 22 est accessible
- [ ] Une clé SSH a été générée
- [ ] La clé publique a été copiée sur le VPS
- [ ] Les permissions sont correctes (~/.ssh = 700, authorized_keys = 600)
- [ ] La configuration SSH du serveur autorise les clés publiques

