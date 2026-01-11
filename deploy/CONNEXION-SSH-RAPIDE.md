# Guide de connexion SSH rapide

## ✅ Diagnostic

Votre connexion SSH **fonctionne** ! Le serveur est accessible et répond correctement.

Le problème est que vous devez entrer un **mot de passe** à chaque connexion car aucune clé SSH n'est configurée.

## 🚀 Solutions

### Option 1: Se connecter avec mot de passe (rapide)

Dans CMD ou PowerShell, tapez simplement:
```cmd
ssh ubuntu@51.75.160.211
```

Quand on vous demande le mot de passe, **tapez-le** (il ne s'affichera pas à l'écran pour des raisons de sécurité) et appuyez sur Entrée.

### Option 2: Configurer une clé SSH (recommandé - pas de mot de passe)

#### Étape 1: Générer une clé SSH (si vous n'en avez pas)

```cmd
ssh-keygen -t ed25519 -C "votre-email@example.com"
```

- Appuyez sur Entrée pour accepter l'emplacement par défaut (`C:\Users\anism\.ssh\id_ed25519`)
- Entrez un mot de passe pour protéger votre clé (ou appuyez sur Entrée pour ne pas en mettre)
- Votre clé sera créée dans `C:\Users\anism\.ssh\`

#### Étape 2: Copier la clé publique sur le VPS

**Méthode A: Utiliser ssh-copy-id (si disponible)**
```cmd
ssh-copy-id ubuntu@51.75.160.211
```

**Méthode B: Copier manuellement**
```cmd
REM 1. Afficher votre clé publique
type %USERPROFILE%\.ssh\id_ed25519.pub

REM 2. Copier TOUT le contenu affiché (commence par "ssh-ed25519 ...")

REM 3. Se connecter au VPS avec le mot de passe
ssh ubuntu@51.75.160.211

REM 4. Sur le VPS, exécuter ces commandes:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "COLLER_VOTRE_CLE_PUBLIQUE_ICI" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

#### Étape 3: Tester la connexion sans mot de passe

```cmd
ssh ubuntu@51.75.160.211
```

Vous devriez maintenant vous connecter **sans mot de passe** ! 🎉

## 📝 Utiliser les scripts fournis

### Script PowerShell (recommandé)
```powershell
.\deploy\connect-vps.ps1
```

### Script Batch pour CMD
```cmd
deploy\connect-vps.bat
```

Ces scripts:
- ✅ Vérifient que SSH est installé
- ✅ Testent la connectivité réseau
- ✅ Testent le port SSH
- ✅ Vous guident pour la connexion

## 🔧 Configuration SSH avancée (optionnel)

Créez un fichier `C:\Users\anism\.ssh\config` avec ce contenu:

```
Host vps-escrimetalents
    HostName 51.75.160.211
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
```

Ensuite, vous pourrez simplement taper:
```cmd
ssh vps-escrimetalents
```

## ❓ Problèmes courants

### "Permission denied (publickey,password)"
- Vérifiez que vous avez le bon mot de passe
- Vérifiez que votre clé SSH est bien copiée sur le serveur

### "Connection refused"
- Vérifiez que le VPS est en ligne
- Vérifiez votre connexion internet

### Le mot de passe ne s'affiche pas
- **C'est normal !** Pour des raisons de sécurité, le mot de passe ne s'affiche pas pendant que vous le tapez
- Tapez-le quand même et appuyez sur Entrée

## 📞 Informations de connexion

- **IP**: `51.75.160.211`
- **Utilisateur**: `ubuntu`
- **Port**: `22` (par défaut)

