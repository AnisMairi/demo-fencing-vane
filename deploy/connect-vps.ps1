# Script PowerShell pour se connecter au VPS
# Usage: .\connect-vps.ps1

$VPS_IP = "51.75.160.211"
$VPS_USER = "ubuntu"

Write-Host "🔌 Connexion au VPS..." -ForegroundColor Cyan
Write-Host "IP: $VPS_IP" -ForegroundColor Yellow
Write-Host "User: $VPS_USER" -ForegroundColor Yellow
Write-Host ""

# Vérifier si SSH est disponible
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ SSH n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions possibles:" -ForegroundColor Yellow
    Write-Host "1. Installer OpenSSH Client:" -ForegroundColor White
    Write-Host "   - Ouvrir 'Paramètres' > 'Applications' > 'Fonctionnalités facultatives'" -ForegroundColor Gray
    Write-Host "   - Chercher 'OpenSSH Client' et l'installer" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. OU installer Git Bash qui inclut SSH" -ForegroundColor White
    Write-Host ""
    Write-Host "3. OU utiliser WSL (Windows Subsystem for Linux)" -ForegroundColor White
    exit 1
}

# Tester la connectivité réseau
Write-Host "🌐 Test de connectivité réseau..." -ForegroundColor Cyan
$ping = Test-Connection -ComputerName $VPS_IP -Count 2 -Quiet
if ($ping) {
    Write-Host "✓ Le serveur est accessible" -ForegroundColor Green
} else {
    Write-Host "✗ Impossible de joindre le serveur" -ForegroundColor Red
    Write-Host "Vérifiez votre connexion internet et que le VPS est en ligne" -ForegroundColor Yellow
    exit 1
}

# Tester le port SSH (22)
Write-Host "🔍 Test du port SSH (22)..." -ForegroundColor Cyan
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect($VPS_IP, 22, $null, $null)
    $wait = $connection.AsyncWaitHandle.WaitOne(3000, $false)
    if ($wait) {
        $tcpClient.EndConnect($connection)
        Write-Host "✓ Le port SSH est ouvert" -ForegroundColor Green
        $tcpClient.Close()
    } else {
        Write-Host "✗ Le port SSH ne répond pas (timeout)" -ForegroundColor Red
        Write-Host "Le serveur peut être en panne ou le firewall bloque le port 22" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ Erreur de connexion au port SSH: $_" -ForegroundColor Red
    exit 1
}

# Demander le chemin de la clé SSH si nécessaire
Write-Host ""
Write-Host "🔑 Authentification SSH..." -ForegroundColor Cyan
$keyPath = Read-Host "Chemin vers votre clé SSH privée (appuyez sur Entrée pour utiliser l'authentification par mot de passe)"

# Construire la commande SSH
$sshCommand = "ssh"
if ($keyPath -and (Test-Path $keyPath)) {
    $sshCommand += " -i `"$keyPath`""
    Write-Host "✓ Utilisation de la clé: $keyPath" -ForegroundColor Green
} elseif ($keyPath) {
    Write-Host "⚠ Clé non trouvée, utilisation de l'authentification par mot de passe" -ForegroundColor Yellow
}

$sshCommand += " $VPS_USER@$VPS_IP"

Write-Host ""
Write-Host "🚀 Connexion en cours..." -ForegroundColor Cyan
Write-Host "Commande: $sshCommand" -ForegroundColor Gray
Write-Host ""

# Se connecter
Invoke-Expression $sshCommand
