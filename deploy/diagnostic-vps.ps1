# Script de diagnostic complet pour le VPS
# Usage: .\deploy\diagnostic-vps.ps1

$VPS_IP = "51.75.160.211"
$VPS_USER = "ubuntu"
$SSH_DIR = "$env:USERPROFILE\.ssh"
$KEY_NAME = "id_ed25519_vps"
$keyPath = "$SSH_DIR\$KEY_NAME"

Write-Host "🔍 Diagnostic complet du VPS" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier SSH sur Windows
Write-Host "1️⃣  Vérification de SSH sur Windows..." -ForegroundColor Yellow
if (Get-Command ssh -ErrorAction SilentlyContinue) {
    Write-Host "   ✓ SSH est installé" -ForegroundColor Green
} else {
    Write-Host "   ✗ SSH n'est pas installé" -ForegroundColor Red
    Write-Host "   → Installez OpenSSH Client depuis Paramètres Windows" -ForegroundColor Yellow
    exit 1
}

# 2. Vérifier la connectivité réseau
Write-Host ""
Write-Host "2️⃣  Test de connectivité réseau..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName $VPS_IP -Count 2 -Quiet
if ($ping) {
    Write-Host "   ✓ Le serveur répond au ping" -ForegroundColor Green
} else {
    Write-Host "   ✗ Le serveur ne répond pas au ping" -ForegroundColor Red
    Write-Host "   → Vérifiez que le VPS est en ligne dans le panneau OVH" -ForegroundColor Yellow
}

# 3. Vérifier le port SSH
Write-Host ""
Write-Host "3️⃣  Test du port SSH (22)..." -ForegroundColor Yellow
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect($VPS_IP, 22, $null, $null)
    $wait = $connection.AsyncWaitHandle.WaitOne(3000, $false)
    if ($wait) {
        $tcpClient.EndConnect($connection)
        Write-Host "   ✓ Le port SSH est ouvert" -ForegroundColor Green
        $tcpClient.Close()
    } else {
        Write-Host "   ✗ Le port SSH ne répond pas (timeout)" -ForegroundColor Red
        Write-Host "   → Le serveur peut être en panne ou le firewall bloque le port 22" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Erreur de connexion au port SSH: $_" -ForegroundColor Red
}

# 4. Vérifier la clé SSH
Write-Host ""
Write-Host "4️⃣  Vérification de la clé SSH..." -ForegroundColor Yellow
if (Test-Path $keyPath) {
    Write-Host "   ✓ Clé SSH trouvée: $keyPath" -ForegroundColor Green
    
    # Tester la connexion avec la clé
    Write-Host ""
    Write-Host "   🔐 Test de connexion SSH avec la clé..." -ForegroundColor Cyan
    $testResult = ssh -i $keyPath -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "echo 'Connexion réussie!'" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Connexion SSH réussie avec la clé!" -ForegroundColor Green
        
        # Vérifier l'état du VPS
        Write-Host ""
        Write-Host "5️⃣  Diagnostic de l'état du VPS..." -ForegroundColor Yellow
        Write-Host "   (Cela peut prendre quelques secondes...)" -ForegroundColor Gray
        
        # Vérifier les services
        $servicesCmd = 'systemctl is-active nginx 2>/dev/null; if [ $? -ne 0 ]; then echo "services-check"; fi'
        $services = ssh -i $keyPath "$VPS_USER@$VPS_IP" $servicesCmd 2>&1
        Write-Host "   Services: $services" -ForegroundColor Gray
        
        # Vérifier PM2
        $pm2Cmd = 'pm2 list 2>/dev/null; if [ $? -ne 0 ]; then echo "PM2 non disponible"; fi'
        $pm2Status = ssh -i $keyPath "$VPS_USER@$VPS_IP" $pm2Cmd 2>&1
        Write-Host ""
        Write-Host "   📊 État PM2:" -ForegroundColor Cyan
        Write-Host $pm2Status -ForegroundColor White
        
        # Vérifier l'application
        $appStatusCmd = 'if curl -s http://localhost:3000 > /dev/null; then echo "App accessible"; else echo "App non accessible"; fi'
        $appStatus = ssh -i $keyPath "$VPS_USER@$VPS_IP" $appStatusCmd 2>&1
        Write-Host ""
        Write-Host "   🌐 Application:" -ForegroundColor Cyan
        Write-Host "   $appStatus" -ForegroundColor White
        
        # Vérifier Nginx
        $nginxStatus = ssh -i $keyPath "$VPS_USER@$VPS_IP" "sudo systemctl status nginx --no-pager | head -3" 2>&1
        Write-Host ""
        Write-Host "   🌐 Nginx:" -ForegroundColor Cyan
        Write-Host $nginxStatus -ForegroundColor White
        
    } else {
        Write-Host "   ✗ Connexion SSH échouée avec la clé" -ForegroundColor Red
        Write-Host "   → La clé n'est peut-être pas configurée sur le VPS" -ForegroundColor Yellow
        Write-Host "   → Exécutez: .\deploy\fix-ssh-connection.ps1" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✗ Clé SSH introuvable: $keyPath" -ForegroundColor Red
    Write-Host "   → Générez une clé avec: .\deploy\fix-ssh-connection.ps1" -ForegroundColor Yellow
}

# 5. Résumé et recommandations
Write-Host ""
Write-Host "📋 Résumé et recommandations" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

if ($ping -and (Test-Path $keyPath) -and $LASTEXITCODE -eq 0) {
    Write-Host "✅ VPS accessible et fonctionnel" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Pour restaurer l'application, exécutez:" -ForegroundColor Yellow
    Write-Host "   .\deploy\restore-vps.ps1" -ForegroundColor White
} else {
    Write-Host "⚠️  Problèmes détectés" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Actions recommandées:" -ForegroundColor Yellow
    if (-not $ping) {
        Write-Host "   1. Vérifiez que le VPS est en ligne dans le panneau OVH" -ForegroundColor White
    }
    if (-not (Test-Path $keyPath)) {
        Write-Host "   2. Générez une clé SSH: .\deploy\fix-ssh-connection.ps1" -ForegroundColor White
    }
    if ((Test-Path $keyPath) -and $LASTEXITCODE -ne 0) {
        Write-Host "   3. Configurez la clé SSH sur le VPS: .\deploy\copy-ssh-key.ps1" -ForegroundColor White
        Write-Host "      OU via le panneau OVH (Console VNC)" -ForegroundColor Gray
    }
}

Write-Host ""

