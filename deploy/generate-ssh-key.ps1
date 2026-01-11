# Script pour generer une cle SSH et la configurer
# Usage: .\generate-ssh-key.ps1

$VPS_IP = "51.75.160.211"
$VPS_USER = "ubuntu"
$SSH_DIR = "$env:USERPROFILE\.ssh"
$KEY_NAME = "id_ed25519_vps"
$keyPath = "$SSH_DIR\$KEY_NAME"
$pubKeyPath = "$keyPath.pub"

Write-Host "Generation d'une cle SSH pour le VPS" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Creer le dossier .ssh si necessaire
if (-not (Test-Path $SSH_DIR)) {
    Write-Host "Creation du dossier .ssh..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $SSH_DIR -Force | Out-Null
    Write-Host "OK - Dossier cree: $SSH_DIR" -ForegroundColor Green
}

# Verifier si une cle existe deja
if (Test-Path $keyPath) {
    Write-Host "ATTENTION: Une cle SSH existe deja: $keyPath" -ForegroundColor Yellow
    $regenerate = Read-Host "Voulez-vous la regenerer? (o/n)"
    if ($regenerate -eq "o" -or $regenerate -eq "O") {
        Remove-Item $keyPath -Force -ErrorAction SilentlyContinue
        Remove-Item $pubKeyPath -Force -ErrorAction SilentlyContinue
        Write-Host "Ancienne cle supprimee" -ForegroundColor Green
    } else {
        Write-Host "Utilisation de la cle existante" -ForegroundColor Green
    }
}

# Generer une nouvelle cle si necessaire
if (-not (Test-Path $keyPath)) {
    Write-Host ""
    Write-Host "Generation d'une nouvelle cle SSH..." -ForegroundColor Cyan
    Write-Host "Appuyez sur Entree pour accepter les valeurs par defaut" -ForegroundColor Yellow
    Write-Host "Appuyez sur Entree deux fois pour ne pas mettre de mot de passe sur la cle" -ForegroundColor Yellow
    Write-Host ""
    
    # Generer la cle (sans passphrase pour simplifier)
    Write-Host "Execution de: ssh-keygen..." -ForegroundColor Gray
    Write-Host "Appuyez sur Entree deux fois pour ne pas mettre de mot de passe" -ForegroundColor Yellow
    Write-Host ""
    
    # Generer la cle en mode interactif
    ssh-keygen -t ed25519 -f $keyPath -C "$env:USERNAME@vps-escrimetalents"
    
    if (Test-Path $keyPath) {
        Write-Host "OK - Cle SSH generee avec succes!" -ForegroundColor Green
    } else {
        Write-Host "ERREUR: Echec de la generation de la cle" -ForegroundColor Red
        exit 1
    }
}

# Afficher la cle publique
Write-Host ""
Write-Host "Votre cle publique SSH:" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
$publicKey = Get-Content $pubKeyPath
Write-Host $publicKey -ForegroundColor White
Write-Host ""

# Copier la cle dans le presse-papier
$publicKey | Set-Clipboard
Write-Host "OK - Cle publique copiee dans le presse-papier!" -ForegroundColor Green
Write-Host ""

# Instructions
Write-Host "INSTRUCTIONS pour configurer la cle sur le VPS:" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "METHODE 1: Via le panneau OVH (RECOMMANDE si SSH ne fonctionne pas)" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Connectez-vous au panneau OVH" -ForegroundColor White
Write-Host "2. Allez dans votre VPS > Console VNC ou Console SSH" -ForegroundColor White
Write-Host "3. Connectez-vous directement depuis le panneau" -ForegroundColor White
Write-Host "4. Sur le VPS, executez ces commandes:" -ForegroundColor White
Write-Host ""
Write-Host "   mkdir -p ~/.ssh" -ForegroundColor Gray
Write-Host "   chmod 700 ~/.ssh" -ForegroundColor Gray
Write-Host "   nano ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Collez votre cle publique (deja dans le presse-papier)" -ForegroundColor White
Write-Host "6. Sauvegardez: Ctrl+O, Entree, Ctrl+X" -ForegroundColor White
Write-Host "7. Executez: chmod 600 ~/.ssh/authorized_keys" -ForegroundColor White
Write-Host ""
Write-Host "METHODE 2: Essayer de copier automatiquement (si vous avez un autre acces)" -ForegroundColor Yellow
Write-Host ""
Write-Host "  .\deploy\copy-ssh-key.ps1" -ForegroundColor White
Write-Host ""

# Demander si on veut essayer la copie automatique
$tryAuto = Read-Host "Voulez-vous essayer de copier la cle automatiquement maintenant? (o/n)"
if ($tryAuto -eq "o" -or $tryAuto -eq "O") {
    Write-Host ""
    Write-Host "Tentative de copie automatique..." -ForegroundColor Cyan
    Write-Host "NOTE: Cela peut echouer si l'authentification par mot de passe est desactivee" -ForegroundColor Yellow
    Write-Host ""
    
    $publicKeyContent = Get-Content $pubKeyPath -Raw
    $publicKeyContent = $publicKeyContent.Trim()
    
    # Essayer de copier via SSH
    $remoteCommands = "mkdir -p ~/.ssh`nchmod 700 ~/.ssh`necho '$publicKeyContent' >> ~/.ssh/authorized_keys`nchmod 600 ~/.ssh/authorized_keys`necho 'Cle SSH ajoutee avec succes!'"
    
    Write-Host "Tentative de connexion SSH..." -ForegroundColor Gray
    Write-Host "Si cela echoue, utilisez la METHODE 1 ci-dessus" -ForegroundColor Yellow
    Write-Host ""
    
    # Essayer la copie
    $remoteCommands | ssh "$VPS_USER@$VPS_IP" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "OK - Cle copiee avec succes!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Test de la connexion avec la cle..." -ForegroundColor Cyan
        ssh -i $keyPath "$VPS_USER@$VPS_IP" "echo 'Connexion reussie avec la cle SSH!'"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "SUCCES! Vous pouvez maintenant vous connecter sans mot de passe!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Pour vous connecter:" -ForegroundColor Cyan
            Write-Host "  ssh -i `"$keyPath`" $VPS_USER@$VPS_IP" -ForegroundColor White
        }
    } else {
        Write-Host ""
        Write-Host "ATTENTION: La copie automatique a echoue" -ForegroundColor Yellow
        Write-Host "Cela est normal si l'authentification par mot de passe est desactivee" -ForegroundColor Yellow
        Write-Host "Utilisez la METHODE 1 (via le panneau OVH) pour copier la cle manuellement" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Pour plus d'aide, consultez:" -ForegroundColor Cyan
Write-Host "  - deploy/RESOLUTION-MOT-DE-PASSE.md" -ForegroundColor White
Write-Host "  - deploy/CONNEXION-SSH-RAPIDE.md" -ForegroundColor White

