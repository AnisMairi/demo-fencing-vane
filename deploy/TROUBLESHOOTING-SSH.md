# Guide de dépannage - Connexion SSH au VPS

## 🔧 Problèmes courants et solutions

### 1. "ssh : command not found" ou "ssh n'est pas reconnu"

**Problème**: SSH n'est pas installé sur Windows.

**Solutions**:

#### Option A: Installer OpenSSH Client (Recommandé)
1. Ouvrir **Paramètres Windows** (Win + I)
2. Aller dans **Applications** > **Fonctionnalités facultatives**
3. Cliquer sur **Ajouter une fonctionnalité**
4. Chercher **"OpenSSH Client"**
5. Installer et redémarrer le terminal

#### Option B: Utiliser Git Bash
Si vous avez Git installé, utilisez Git Bash qui inclut SSH:
- Ouvrir Git Bash
- Utiliser les mêmes commandes SSH

#### Option C: Utiliser WSL (Windows Subsystem for Linux)
```powershell
# Dans PowerShell en tant qu'administrateur
wsl --install
# Puis utiliser WSL pour les commandes SSH
```

### 2. "Connection refused" ou "Connection timed out"

**Problème**: Le serveur ne répond pas ou le port SSH est bloqué.

**Vérifications**:
```cmd
REM Tester la connectivité réseau
ping 51.75.160.211

REM Tester le port SSH (nécessite PowerShell ou outils réseau)
telnet 51.75.160.211 22
```

**Solutions**:
- Vérifier que le VPS est en ligne dans votre panneau OVH
- Vérifier votre connexion internet
- Vérifier que le firewall Windows ne bloque pas SSH
- Vérifier que le firewall du VPS autorise le port 22

### 3. "Permission denied (publickey)"

**Problème**: Authentification échouée.

**Solutions**:

#### Si vous avez une clé SSH:
```cmd
REM Spécifier le chemin de la clé
ssh -i "C:\chemin\vers\votre\cle_privée" ubuntu@51.75.160.211
```

#### Si vous n'avez pas de clé SSH:
1. Générer une clé SSH:
```cmd
ssh-keygen -t ed25519 -C "votre-email@example.com"
```

2. Copier la clé publique sur le VPS:
```cmd
type %USERPROFILE%\.ssh\id_ed25519.pub
REM Copier le contenu, puis sur le VPS:
REM echo "contenu_de_la_cle" >> ~/.ssh/authorized_keys
```

#### Utiliser l'authentification par mot de passe:
Si le serveur le permet, vous pouvez utiliser:
```cmd
ssh ubuntu@51.75.160.211
REM Entrer le mot de passe quand demandé
```

### 4. "Host key verification failed"

**Problème**: La clé d'hôte a changé ou n'est pas reconnue.

**Solution**:
```cmd
REM Supprimer l'ancienne entrée
ssh-keygen -R 51.75.160.211

REM Puis se reconnecter
ssh ubuntu@51.75.160.211
```

### 5. "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED"

**Problème**: L'empreinte de la clé d'hôte a changé (peut indiquer un problème de sécurité).

**Solution**:
```cmd
REM Supprimer l'entrée dans known_hosts
notepad %USERPROFILE%\.ssh\known_hosts
REM Supprimer la ligne contenant 51.75.160.211

REM OU utiliser la commande
ssh-keygen -R 51.75.160.211
```

## 🚀 Commandes utiles

### Connexion basique
```cmd
ssh ubuntu@51.75.160.211
```

### Connexion avec clé SSH
```cmd
ssh -i "C:\Users\VotreNom\.ssh\id_rsa" ubuntu@51.75.160.211
```

### Connexion avec port personnalisé (si différent de 22)
```cmd
ssh -p 2222 ubuntu@51.75.160.211
```

### Connexion avec verbose (pour déboguer)
```cmd
ssh -v ubuntu@51.75.160.211
```

### Copier un fichier vers le VPS (SCP)
```cmd
scp fichier.txt ubuntu@51.75.160.211:~/
```

### Copier un fichier depuis le VPS
```cmd
scp ubuntu@51.75.160.211:~/fichier.txt ./
```

## 📋 Informations de connexion

- **IP VPS**: `51.75.160.211`
- **Utilisateur**: `ubuntu`
- **Port SSH**: `22` (par défaut)

## 🔍 Diagnostic rapide

Utilisez le script PowerShell pour diagnostiquer automatiquement:
```powershell
.\deploy\connect-vps.ps1
```

Ou le script batch pour CMD:
```cmd
deploy\connect-vps.bat
```

## 💡 Astuces

1. **Utiliser un fichier de configuration SSH** (`~/.ssh/config`):
```
Host vps-escrimetalents
    HostName 51.75.160.211
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
```

Puis simplement:
```cmd
ssh vps-escrimetalents
```

2. **Utiliser PuTTY** (alternative graphique):
   - Télécharger PuTTY depuis https://www.putty.org/
   - Configurer la connexion avec l'IP et l'utilisateur
   - Sauvegarder la session pour réutilisation

3. **Utiliser VS Code Remote SSH**:
   - Installer l'extension "Remote - SSH"
   - Se connecter directement depuis VS Code

