# Script de recuperation rapide - Tout-en-un
# Usage: .\deploy\quick-recovery.ps1

$VPS_IP = "51.75.160.211"
$VPS_USER = "ubuntu"
$SSH_DIR = "$env:USERPROFILE\.ssh"
$KEY_NAME = "id_ed25519_vps"
$keyPath = "$SSH_DIR\$KEY_NAME"

Write-Host "Recuperation rapide du VPS" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Verifier/generer la cle SSH
Write-Host "1. Verification de la cle SSH..." -ForegroundColor Yellow
if (-not (Test-Path $keyPath)) {
    Write-Host "   ATTENTION: Cle SSH introuvable, generation..." -ForegroundColor Yellow
    Write-Host ""
    & "$PSScriptRoot\fix-ssh-connection.ps1"
    
    if (-not (Test-Path $keyPath)) {
        Write-Host ""
        Write-Host "ECHEC: Echec de la generation de la cle SSH" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   OK - Cle SSH trouvee" -ForegroundColor Green
}

# Etape 2: Tester la connexion
Write-Host ""
Write-Host "2. Test de connexion SSH..." -ForegroundColor Yellow

# D'abord tester le ping
Write-Host "   Test de ping..." -ForegroundColor Gray
$ping = Test-Connection -ComputerName $VPS_IP -Count 2 -Quiet
if (-not $ping) {
    Write-Host "   ECHEC: Le serveur ne repond pas au ping" -ForegroundColor Red
    Write-Host ""
    Write-Host "   DIAGNOSTIC:" -ForegroundColor Yellow
    Write-Host "   - Le VPS est peut-etre en panne ou redemarre" -ForegroundColor White
    Write-Host "   - Verifiez dans le panneau OVH que le VPS est en ligne" -ForegroundColor White
    Write-Host "   - Attendez quelques minutes si le VPS redemarre" -ForegroundColor White
    Write-Host ""
    Write-Host "   SOLUTION:" -ForegroundColor Yellow
    Write-Host "   1. Connectez-vous au panneau OVH: https://www.ovh.com/manager/" -ForegroundColor White
    Write-Host "   2. Verifiez l'etat de votre VPS" -ForegroundColor White
    Write-Host "   3. Utilisez la Console VNC pour acceder directement au VPS" -ForegroundColor White
    Write-Host "   4. Executez le script de restauration depuis la console:" -ForegroundColor White
    Write-Host "      curl -s https://raw.githubusercontent.com/AnisMairi/demo-fencing-vane/main/deploy/restore-vps.sh | bash" -ForegroundColor Cyan
    exit 1
}
Write-Host "   OK - Le serveur repond au ping" -ForegroundColor Green

# Tester le port SSH
Write-Host "   Test du port SSH (22)..." -ForegroundColor Gray
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect($VPS_IP, 22, $null, $null)
    $wait = $connection.AsyncWaitHandle.WaitOne(5000, $false)
    if ($wait) {
        $tcpClient.EndConnect($connection)
        $tcpClient.Close()
        Write-Host "   OK - Le port SSH est ouvert" -ForegroundColor Green
    } else {
        Write-Host "   ECHEC: Le port SSH ne repond pas (timeout)" -ForegroundColor Red
        Write-Host ""
        Write-Host "   Le service SSH peut etre arrete ou le firewall bloque le port 22" -ForegroundColor Yellow
        Write-Host "   Utilisez la Console VNC du panneau OVH pour acceder au VPS" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "   ECHEC: Impossible de se connecter au port SSH" -ForegroundColor Red
    Write-Host "   Erreur: $_" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Utilisez la Console VNC du panneau OVH pour acceder au VPS" -ForegroundColor White
    exit 1
}

# Tester la connexion SSH avec la cle
Write-Host "   Test de connexion SSH avec la cle..." -ForegroundColor Gray
$testConnection = ssh -i $keyPath -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o BatchMode=yes "$VPS_USER@$VPS_IP" "echo 'OK'" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ECHEC: Connexion SSH echouee" -ForegroundColor Red
    Write-Host ""
    Write-Host "   DIAGNOSTIC:" -ForegroundColor Yellow
    Write-Host "   - La cle SSH n'est peut-etre pas configuree sur le VPS" -ForegroundColor White
    Write-Host "   - L'authentification par mot de passe peut etre desactivee" -ForegroundColor White
    Write-Host ""
    Write-Host "   SOLUTION RECOMMANDEE: Utiliser la Console VNC du panneau OVH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   1. Connectez-vous au panneau OVH: https://www.ovh.com/manager/" -ForegroundColor White
    Write-Host "   2. Allez dans VPS > Votre serveur > Console VNC" -ForegroundColor White
    Write-Host "   3. Connectez-vous avec votre mot de passe" -ForegroundColor White
    Write-Host "   4. Executez ces commandes sur le VPS:" -ForegroundColor White
    Write-Host ""
    
    # Afficher la cle publique
    if (Test-Path "$keyPath.pub") {
        $publicKey = Get-Content "$keyPath.pub" -Raw
        $publicKey = $publicKey.Trim()
        Write-Host "   # Copier cette cle dans ~/.ssh/authorized_keys:" -ForegroundColor Cyan
        Write-Host "   mkdir -p ~/.ssh" -ForegroundColor Gray
        Write-Host "   chmod 700 ~/.ssh" -ForegroundColor Gray
        Write-Host "   nano ~/.ssh/authorized_keys" -ForegroundColor Gray
        Write-Host "   # Collez cette cle:" -ForegroundColor Cyan
        Write-Host "   $publicKey" -ForegroundColor White
        Write-Host "   # Sauvegardez (Ctrl+O, Entree, Ctrl+X)" -ForegroundColor Cyan
        Write-Host "   chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "   5. OU executez directement le script de restauration:" -ForegroundColor White
    Write-Host "      curl -s https://raw.githubusercontent.com/AnisMairi/demo-fencing-vane/main/deploy/restore-vps.sh | bash" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Pour plus de details, consultez: deploy/RESOLUTION-MOT-DE-PASSE.md" -ForegroundColor Gray
    exit 1
}

Write-Host "   OK - Connexion SSH reussie" -ForegroundColor Green

# Etape 3: Telecharger et executer le script de restauration
Write-Host ""
Write-Host "3. Telechargement du script de restauration..." -ForegroundColor Yellow

# Copier le script de restauration sur le VPS
$restoreScriptPath = Join-Path $PSScriptRoot "restore-vps.sh"
if (Test-Path $restoreScriptPath) {
    Write-Host "   OK - Script trouve localement" -ForegroundColor Green
    
    # Lire le script et l'envoyer
    $scriptContent = Get-Content $restoreScriptPath -Raw
    Write-Host "   Envoi du script sur le VPS..." -ForegroundColor Yellow
    
    $scriptContent | ssh -i $keyPath "$VPS_USER@$VPS_IP" "bash"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCES: Recuperation terminee avec succes!" -ForegroundColor Green
        Write-Host ""
        
        # Verification finale
        Write-Host "Verification finale..." -ForegroundColor Cyan
        $verifyScript = @'
pm2 list
echo ""
if curl -s http://localhost:3000 > /dev/null; then
    echo "OK - Application accessible"
else
    echo "ATTENTION - Application non accessible - verifiez les logs: pm2 logs demo-fencing-vane"
fi
'@
        ssh -i $keyPath "$VPS_USER@$VPS_IP" $verifyScript
        
        Write-Host ""
        Write-Host "Acces a l'application:" -ForegroundColor Cyan
        Write-Host "   http://escrimetalents.anis-mairi.com" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "ATTENTION: Recuperation terminee avec des avertissements" -ForegroundColor Yellow
        Write-Host "   Verifiez les messages ci-dessus pour plus de details" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ATTENTION: Script local introuvable, telechargement depuis GitHub..." -ForegroundColor Yellow
    
    # Telecharger depuis GitHub (si disponible) ou utiliser le script inline
    ssh -i $keyPath "$VPS_USER@$VPS_IP" "curl -s https://raw.githubusercontent.com/AnisMairi/demo-fencing-vane/main/deploy/restore-vps.sh | bash" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCES: Recuperation terminee!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "ATTENTION: Telechargement echoue, execution du script inline..." -ForegroundColor Yellow
        
        # Executer le script de restauration PowerShell a la place
        & "$PSScriptRoot\restore-vps.ps1"
    }
}

Write-Host ""
Write-Host "Pour plus d'aide:" -ForegroundColor Cyan
Write-Host "   - deploy/RECUPERATION-URGENCE.md" -ForegroundColor White
Write-Host "   - deploy/diagnostic-vps.ps1" -ForegroundColor White
Write-Host ""
