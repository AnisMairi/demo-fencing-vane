# Solution rapide - Permission denied

## Le probleme

Vous obtenez "Permission denied" meme avec le bon mot de passe. C'est normal - le serveur n'accepte probablement que les cles SSH (plus securise).

## Solution: Configurer une cle SSH

### Etape 1: Generer une cle SSH sur votre PC

Dans PowerShell ou CMD, executez:

```cmd
ssh-keygen -t ed25519 -f "%USERPROFILE%\.ssh\id_ed25519_vps" -C "vps-escrimetalents"
```

- Appuyez sur **Entree** deux fois pour ne pas mettre de mot de passe sur la cle
- Votre cle sera creee dans `C:\Users\anism\.ssh\`

### Etape 2: Afficher votre cle publique

```cmd
type %USERPROFILE%\.ssh\id_ed25519_vps.pub
```

**Copiez TOUT le texte affiche** (commence par "ssh-ed25519 ...")

### Etape 3: Copier la cle sur le VPS via le panneau OVH

1. **Connectez-vous au panneau OVH**: https://www.ovh.com/manager/
2. Allez dans **VPS** > Votre serveur
3. Cliquez sur **Console VNC** ou **Console SSH**
4. Connectez-vous directement depuis le panneau (cela devrait fonctionner)
5. Sur le VPS, executez ces commandes:

```bash
# Creer le dossier .ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Editer le fichier authorized_keys
nano ~/.ssh/authorized_keys
```

6. **Collez votre cle publique** dans le fichier (celle que vous avez copiee a l'etape 2)
7. **Sauvegardez**: 
   - Appuyez sur `Ctrl+O`
   - Appuyez sur `Entree`
   - Appuyez sur `Ctrl+X`
8. Definir les permissions:

```bash
chmod 600 ~/.ssh/authorized_keys
```

### Etape 4: Tester la connexion

Depuis votre PC Windows:

```cmd
ssh -i "%USERPROFILE%\.ssh\id_ed25519_vps" ubuntu@51.75.160.211
```

Vous devriez maintenant vous connecter **sans mot de passe**!

## Alternative: Script automatique

Si vous preferez, vous pouvez utiliser le script PowerShell:

```powershell
.\deploy\generate-ssh-key.ps1
```

Le script va:
- Generer la cle SSH
- La copier dans le presse-papier
- Vous donner les instructions

## Configuration simplifiee (optionnel)

Apres avoir configure la cle, creez un fichier `C:\Users\anism\.ssh\config`:

```
Host vps-escrimetalents
    HostName 51.75.160.211
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519_vps
```

Ensuite, connectez-vous simplement avec:

```cmd
ssh vps-escrimetalents
```

## Si vous n'avez pas acces au panneau OVH

1. **Reinitialisez le mot de passe** dans le panneau OVH
2. Attendez quelques minutes
3. Reessayez la connexion SSH avec le nouveau mot de passe
4. Puis configurez la cle SSH comme ci-dessus

## Aide supplementaire

- `deploy/RESOLUTION-MOT-DE-PASSE.md` - Guide detaille
- `deploy/CONNEXION-SSH-RAPIDE.md` - Guide general SSH
- `deploy/TROUBLESHOOTING-SSH.md` - Depannage complet

