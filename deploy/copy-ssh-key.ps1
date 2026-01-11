# Script pour copier automatiquement la clé SSH sur le VPS
# Usage: .\copy-ssh-key.ps1

$VPS_IP = "51.75.160.211"
$VPS_USER = "ubuntu"
$SSH_DIR = "$env:USERPROFILE\.ssh"
$KEY_NAME = "id_ed25519_vps"
$keyPath = "$SSH_DIR\$KEY_NAME"
$pubKeyPath = "$keyPath.pub"

Write-Host "🔑 Copie de la clé SSH sur le VPS" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que la clé existe
if (-not (Test-Path $pubKeyPath)) {
    Write-Host "✗ Clé SSH introuvable: $pubKeyPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Générez d'abord une clé avec:" -ForegroundColor Yellow
    Write-Host "  .\deploy\fix-ssh-connection.ps1" -ForegroundColor White
    exit 1
}

Write-Host "✓ Clé trouvée: $pubKeyPath" -ForegroundColor Green
Write-Host ""

# Lire la clé publique
$publicKey = Get-Content $pubKeyPath -Raw
$publicKey = $publicKey.Trim()

Write-Host "📋 Clé publique à copier:" -ForegroundColor Cyan
Write-Host $publicKey -ForegroundColor White
Write-Host ""

# Méthode 1: Essayer ssh-copy-id
$sshCopyId = Get-Command ssh-copy-id -ErrorAction SilentlyContinue
if ($sshCopyId) {
    Write-Host "🔄 Méthode 1: Utilisation de ssh-copy-id..." -ForegroundColor Cyan
    Write-Host "Vous devrez entrer le mot de passe du VPS" -ForegroundColor Yellow
    Write-Host ""
    
    ssh-copy-id -i $pubKeyPath "$VPS_USER@$VPS_IP"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Clé copiée avec succès!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🧪 Test de la connexion..." -ForegroundColor Cyan
        ssh -i $keyPath "$VPS_USER@$VPS_IP" "echo 'Connexion réussie!'"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "🎉 SUCCÈS! Vous pouvez maintenant vous connecter sans mot de passe!" -ForegroundColor Green
            exit 0
        }
    }
}

# Méthode 2: Copie manuelle via SSH
Write-Host ""
Write-Host "🔄 Méthode 2: Copie manuelle via SSH..." -ForegroundColor Cyan
Write-Host "Vous devrez entrer le mot de passe du VPS" -ForegroundColor Yellow
Write-Host ""

# Créer le script à exécuter sur le VPS
$remoteCommands = @"
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo '$publicKey' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo 'Clé SSH ajoutée avec succès!'
"@

# Exécuter les commandes
Write-Host "Exécution des commandes sur le VPS..." -ForegroundColor Gray
$remoteCommands | ssh "$VPS_USER@$VPS_IP"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Clé copiée avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🧪 Test de la connexion avec la clé..." -ForegroundColor Cyan
    ssh -i $keyPath "$VPS_USER@$VPS_IP" "echo 'Connexion réussie avec la clé SSH!'"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 SUCCÈS! Vous pouvez maintenant vous connecter sans mot de passe!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Pour vous connecter:" -ForegroundColor Cyan
        Write-Host "  ssh -i `"$keyPath`" $VPS_USER@$VPS_IP" -ForegroundColor White
        Write-Host ""
        Write-Host "Ou configurez ~/.ssh/config pour simplifier (voir CONNEXION-SSH-RAPIDE.md)" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "⚠ La connexion avec la clé a échoué" -ForegroundColor Yellow
        Write-Host "Vérifiez que la clé a bien été copiée sur le VPS" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "✗ Échec de la copie automatique" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Instructions manuelles:" -ForegroundColor Cyan
    Write-Host "1. Connectez-vous au VPS via le panneau OVH ou un autre moyen" -ForegroundColor White
    Write-Host "2. Exécutez ces commandes sur le VPS:" -ForegroundColor White
    Write-Host ""
    Write-Host "   mkdir -p ~/.ssh" -ForegroundColor Gray
    Write-Host "   chmod 700 ~/.ssh" -ForegroundColor Gray
    Write-Host "   nano ~/.ssh/authorized_keys" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Collez cette clé dans le fichier:" -ForegroundColor White
    Write-Host $publicKey -ForegroundColor White
    Write-Host ""
    Write-Host "4. Sauvegardez (Ctrl+O, Entrée, Ctrl+X)" -ForegroundColor White
    Write-Host "5. Exécutez: chmod 600 ~/.ssh/authorized_keys" -ForegroundColor White
}

