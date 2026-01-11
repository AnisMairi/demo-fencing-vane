# Script de restauration complète du VPS
# Usage: .\deploy\restore-vps.ps1

$VPS_IP = "51.75.160.211"
$VPS_USER = "ubuntu"
$SSH_DIR = "$env:USERPROFILE\.ssh"
$KEY_NAME = "id_ed25519_vps"
$keyPath = "$SSH_DIR\$KEY_NAME"
$APP_NAME = "demo-fencing-vane"
$APP_DIR = "/var/www/demo-fencing-vane"
$DOMAIN = "escrimetalents.anis-mairi.com"
$PORT = 3000

Write-Host "🔧 Restauration complète du VPS" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Vérifier la clé SSH
if (-not (Test-Path $keyPath)) {
    Write-Host "✗ Clé SSH introuvable: $keyPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Générez d'abord une clé avec:" -ForegroundColor Yellow
    Write-Host "  .\deploy\fix-ssh-connection.ps1" -ForegroundColor White
    exit 1
}

Write-Host "✓ Clé SSH trouvée" -ForegroundColor Green
Write-Host ""

# Tester la connexion
Write-Host "🔐 Test de connexion SSH..." -ForegroundColor Yellow
$testConnection = ssh -i $keyPath -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "echo 'OK'" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Impossible de se connecter au VPS" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifiez:" -ForegroundColor Yellow
    Write-Host "  1. Que le VPS est en ligne" -ForegroundColor White
    Write-Host "  2. Que la clé SSH est configurée sur le VPS" -ForegroundColor White
    Write-Host "  3. Exécutez: .\deploy\copy-ssh-key.ps1" -ForegroundColor White
    exit 1
}

Write-Host "✓ Connexion SSH réussie" -ForegroundColor Green
Write-Host ""

# Script de restauration à exécuter sur le VPS
$restoreScript = @"
#!/bin/bash
set -e

echo "🚀 Démarrage de la restauration..."
echo ""

APP_NAME="$APP_NAME"
APP_DIR="$APP_DIR"
DOMAIN="$DOMAIN"
PORT=$PORT

# 1. Vérifier et installer les prérequis
echo "📦 Vérification des prérequis..."
if ! command -v node &> /dev/null; then
    echo "Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "Installation de PM2..."
    sudo npm install -g pm2
fi

if ! command -v nginx &> /dev/null; then
    echo "Installation de Nginx..."
    sudo apt update
    sudo apt install -y nginx
    sudo systemctl enable nginx
fi

# 2. Arrêter les anciennes instances PM2
echo ""
echo "🛑 Arrêt des anciennes instances..."
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# 3. Vérifier/créer le répertoire de l'application
echo ""
echo "📁 Configuration du répertoire..."
sudo mkdir -p `$APP_DIR
sudo chown -R `$USER:`$USER `$APP_DIR

# 4. Vérifier si le code existe
if [ ! -d "`$APP_DIR/.git" ]; then
    echo "⚠️  Le code n'existe pas dans `$APP_DIR"
    echo "   Vous devrez copier le code manuellement ou cloner depuis Git"
else
    echo "✓ Code trouvé dans `$APP_DIR"
    cd `$APP_DIR
    git pull origin main || echo "⚠️  Git pull échoué"
fi

# 5. Installer les dépendances et builder
if [ -f "`$APP_DIR/package.json" ]; then
    echo ""
    echo "📦 Installation des dépendances..."
    cd `$APP_DIR
    npm install --production
    
    echo ""
    echo "🔨 Build de l'application..."
    npm run build
else
    echo "⚠️  package.json introuvable - l'application ne peut pas être restaurée"
    echo "   Copiez d'abord le code dans `$APP_DIR"
fi

# 6. Configuration Nginx
echo ""
echo "⚙️  Configuration de Nginx..."
sudo tee /etc/nginx/sites-available/`$APP_NAME > /dev/null <<'NGINX_EOF'
server {
    listen 80;
    server_name `$DOMAIN;

    location / {
        proxy_pass http://localhost:`$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
        proxy_cache_bypass `$http_upgrade;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location /_next/static {
        proxy_pass http://localhost:`$PORT;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

sudo ln -sf /etc/nginx/sites-available/`$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Tester et recharger Nginx
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✓ Nginx configuré et rechargé"
else
    echo "✗ Erreur dans la configuration Nginx"
fi

# 7. Démarrer l'application avec PM2
if [ -f "`$APP_DIR/package.json" ]; then
    echo ""
    echo "🚀 Démarrage de l'application avec PM2..."
    cd `$APP_DIR
    pm2 start npm --name `$APP_NAME -- start
    pm2 save
    pm2 startup | grep -v PM2_HOME | bash || true
    echo "✓ Application démarrée"
fi

# 8. Vérification finale
echo ""
echo "✅ Restauration terminée!"
echo ""
echo "📊 État des services:"
pm2 list
echo ""
echo "🌐 Test de l'application:"
curl -s http://localhost:`$PORT > /dev/null && echo "✓ Application accessible sur le port `$PORT" || echo "✗ Application non accessible"
echo ""
"@

# Copier le script sur le VPS et l'exécuter
Write-Host "📤 Envoi du script de restauration sur le VPS..." -ForegroundColor Yellow
$restoreScript | ssh -i $keyPath "$VPS_USER@$VPS_IP" "bash"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Restauration terminée avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔍 Vérification finale..." -ForegroundColor Cyan
    
    # Vérifier l'état
    ssh -i $keyPath "$VPS_USER@$VPS_IP" "pm2 list && echo '' && curl -s http://localhost:$PORT > /dev/null && echo '✓ App accessible' || echo '✗ App non accessible'"
    
    Write-Host ""
    Write-Host "🌐 Accès à l'application:" -ForegroundColor Cyan
    Write-Host "   http://$DOMAIN" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Commandes utiles:" -ForegroundColor Cyan
    Write-Host "   ssh -i `"$keyPath`" $VPS_USER@$VPS_IP" -ForegroundColor White
    Write-Host "   pm2 logs $APP_NAME" -ForegroundColor White
    Write-Host "   pm2 restart $APP_NAME" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✗ Erreur lors de la restauration" -ForegroundColor Red
    Write-Host "   Vérifiez les logs ci-dessus pour plus de détails" -ForegroundColor Yellow
}

Write-Host ""

