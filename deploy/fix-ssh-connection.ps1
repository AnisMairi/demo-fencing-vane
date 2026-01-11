# Script pour résoudre le problème de connexion SSH
# Ce script va générer une clé SSH et vous aider à la configurer

Write-Host "🔧 Résolution du problème de connexion SSH" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$VPS_IP = "51.75.160.211"
$VPS_USER = "ubuntu"
$SSH_DIR = "$env:USERPROFILE\.ssh"
$KEY_NAME = "id_ed25519_vps"

# Vérifier si le dossier .ssh existe
if (-not (Test-Path $SSH_DIR)) {
    Write-Host "📁 Création du dossier .ssh..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $SSH_DIR -Force | Out-Null
    Write-Host "✓ Dossier créé: $SSH_DIR" -ForegroundColor Green
}

# Vérifier si une clé existe déjà
$keyPath = "$SSH_DIR\$KEY_NAME"
$pubKeyPath = "$keyPath.pub"

if (Test-Path $keyPath) {
    Write-Host "⚠ Une clé SSH existe déjà: $keyPath" -ForegroundColor Yellow
    $regenerate = Read-Host "Voulez-vous la régénérer? (o/n)"
    if ($regenerate -eq "o" -or $regenerate -eq "O") {
        Remove-Item $keyPath -Force -ErrorAction SilentlyContinue
        Remove-Item $pubKeyPath -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host "✓ Utilisation de la clé existante" -ForegroundColor Green
    }
}

# Générer une nouvelle clé si nécessaire
if (-not (Test-Path $keyPath)) {
    Write-Host ""
    Write-Host "🔑 Génération d'une nouvelle clé SSH..." -ForegroundColor Cyan
    Write-Host "Appuyez sur Entrée pour accepter les valeurs par défaut" -ForegroundColor Yellow
    Write-Host ""
    
    $passphrase = Read-Host "Entrez un mot de passe pour protéger votre clé (ou Entrée pour aucun)" -AsSecureString
    $passphrasePlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($passphrase))
    
    # Générer la clé
    $sshKeygenCmd = "ssh-keygen -t ed25519 -f `"$keyPath`" -C `"$env:USERNAME@vps-escrimetalents`""
    if ($passphrasePlain) {
        # Note: ssh-keygen en mode interactif demandera le passphrase
        Write-Host "Exécution de: ssh-keygen -t ed25519 -f `"$keyPath`"" -ForegroundColor Gray
        Write-Host "Vous devrez entrer le mot de passe deux fois" -ForegroundColor Yellow
    } else {
        $sshKeygenCmd += " -N `"`""
    }
    
    Invoke-Expression $sshKeygenCmd
    
    if (Test-Path $keyPath) {
        Write-Host "✓ Clé SSH générée avec succès!" -ForegroundColor Green
    } else {
        Write-Host "✗ Erreur lors de la génération de la clé" -ForegroundColor Red
        exit 1
    }
}

# Afficher la clé publique
Write-Host ""
Write-Host "📋 Votre clé publique SSH:" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
$publicKey = Get-Content $pubKeyPath
Write-Host $publicKey -ForegroundColor White
Write-Host ""

# Copier la clé dans le presse-papier
$publicKey | Set-Clipboard
Write-Host "✓ Clé publique copiée dans le presse-papier!" -ForegroundColor Green
Write-Host ""

# Instructions pour copier la clé sur le VPS
Write-Host "📝 Instructions pour configurer la clé sur le VPS:" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1: Utiliser ssh-copy-id (si disponible)" -ForegroundColor Yellow
Write-Host "  ssh-copy-id -i `"$pubKeyPath`" $VPS_USER@$VPS_IP" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Copier manuellement (RECOMMANDÉ si Option 1 ne fonctionne pas)" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. La clé publique est déjà dans votre presse-papier" -ForegroundColor White
Write-Host "  2. Connectez-vous au VPS avec un autre moyen (panneau OVH, autre clé, etc.)" -ForegroundColor White
Write-Host "  3. Sur le VPS, exécutez ces commandes:" -ForegroundColor White
Write-Host ""
Write-Host "     mkdir -p ~/.ssh" -ForegroundColor Gray
Write-Host "     chmod 700 ~/.ssh" -ForegroundColor Gray
Write-Host "     echo 'COLLER_LA_CLE_ICI' >> ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host "     chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Collez la clé publique (déjà dans votre presse-papier)" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Utiliser le script PowerShell pour copier automatiquement" -ForegroundColor Yellow
Write-Host "  .\deploy\copy-ssh-key.ps1" -ForegroundColor White
Write-Host ""

# Demander si l'utilisateur veut essayer de copier automatiquement
$tryAuto = Read-Host "Voulez-vous essayer de copier la clé automatiquement maintenant? (o/n)"
if ($tryAuto -eq "o" -or $tryAuto -eq "O") {
    Write-Host ""
    Write-Host "🔄 Tentative de copie automatique..." -ForegroundColor Cyan
    Write-Host "Vous devrez entrer le mot de passe du VPS" -ForegroundColor Yellow
    Write-Host ""
    
    # Essayer avec ssh-copy-id d'abord
    $sshCopyId = Get-Command ssh-copy-id -ErrorAction SilentlyContinue
    if ($sshCopyId) {
        Write-Host "Utilisation de ssh-copy-id..." -ForegroundColor Gray
        ssh-copy-id -i $pubKeyPath "$VPS_USER@$VPS_IP"
    } else {
        # Méthode manuelle avec PowerShell
        Write-Host "Copie manuelle de la clé..." -ForegroundColor Gray
        $publicKeyContent = Get-Content $pubKeyPath -Raw
        
        # Créer un script temporaire pour exécuter sur le VPS
        $remoteScript = @"
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo '$($publicKeyContent.Trim())' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
"@
        
        Write-Host "Exécution des commandes sur le VPS..." -ForegroundColor Gray
        Write-Host "Vous devrez entrer le mot de passe" -ForegroundColor Yellow
        echo $remoteScript | ssh "$VPS_USER@$VPS_IP" "bash"
    }
    
    Write-Host ""
    Write-Host "✅ Test de la connexion avec la clé SSH..." -ForegroundColor Cyan
    Write-Host ""
    
    # Tester la connexion
    ssh -i $keyPath "$VPS_USER@$VPS_IP" "echo 'Connexion réussie!'"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 SUCCÈS! La connexion SSH fonctionne maintenant!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Pour vous connecter à l'avenir, utilisez:" -ForegroundColor Cyan
        Write-Host "  ssh -i `"$keyPath`" $VPS_USER@$VPS_IP" -ForegroundColor White
        Write-Host ""
        Write-Host "Ou configurez un fichier ~/.ssh/config (voir le guide)" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "⚠ La copie automatique n'a pas fonctionné" -ForegroundColor Yellow
        Write-Host "Veuillez suivre les instructions manuelles ci-dessus" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📚 Pour plus d'aide, consultez:" -ForegroundColor Cyan
Write-Host "  - deploy/CONNEXION-SSH-RAPIDE.md" -ForegroundColor White
Write-Host "  - deploy/TROUBLESHOOTING-SSH.md" -ForegroundColor White

