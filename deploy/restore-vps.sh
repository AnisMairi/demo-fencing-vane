#!/bin/bash

# Script de restauration complète du VPS
# À exécuter directement sur le VPS via SSH ou console OVH
# Usage: bash restore-vps.sh

set -e

echo "🚀 Restauration complète du VPS"
echo "================================"
echo ""

# Variables de configuration
APP_NAME="demo-fencing-vane"
APP_DIR="/var/www/demo-fencing-vane"
DOMAIN="escrimetalents.anis-mairi.com"
PORT=3000

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info() {
    echo -e "${GREEN}✓${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Mise à jour du système
echo "📦 Mise à jour du système..."
sudo apt update -qq
sudo apt upgrade -y -qq
info "Système à jour"

# 2. Installation des prérequis
echo ""
echo "📦 Installation des prérequis..."

# Node.js
if ! command -v node &> /dev/null; then
    warn "Node.js n'est pas installé, installation..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    info "Node.js installé: $(node --version)"
else
    info "Node.js déjà installé: $(node --version)"
fi

# PM2
if ! command -v pm2 &> /dev/null; then
    warn "PM2 n'est pas installé, installation..."
    sudo npm install -g pm2
    info "PM2 installé: $(pm2 --version)"
else
    info "PM2 déjà installé: $(pm2 --version)"
fi

# Nginx
if ! command -v nginx &> /dev/null; then
    warn "Nginx n'est pas installé, installation..."
    sudo apt install -y nginx
    sudo systemctl enable nginx
    info "Nginx installé"
else
    info "Nginx déjà installé"
fi

# Certbot (optionnel)
if ! command -v certbot &> /dev/null; then
    warn "Certbot n'est pas installé (optionnel pour SSL)"
    sudo apt install -y certbot python3-certbot-nginx 2>/dev/null || warn "Certbot non installé"
else
    info "Certbot déjà installé"
fi

# 3. Arrêter les anciennes instances PM2
echo ""
echo "🛑 Nettoyage des anciennes instances PM2..."
pm2 delete all 2>/dev/null || warn "Aucune instance PM2 à supprimer"
pm2 kill 2>/dev/null || true
info "PM2 nettoyé"

# 4. Configuration du répertoire
echo ""
echo "📁 Configuration du répertoire de l'application..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR
info "Répertoire configuré: $APP_DIR"

# 5. Vérifier si le code existe
echo ""
echo "📥 Vérification du code source..."
if [ -d "$APP_DIR/.git" ]; then
    info "Code source trouvé dans $APP_DIR"
    cd $APP_DIR
    git pull origin main || warn "Git pull échoué (peut être normal si pas de repo)"
else
    warn "Le code n'existe pas dans $APP_DIR"
    warn "Vous devrez copier le code manuellement ou cloner depuis Git"
    warn "Exemple: git clone https://github.com/AnisMairi/demo-fencing-vane.git $APP_DIR"
fi

# 6. Installation des dépendances et build
if [ -f "$APP_DIR/package.json" ]; then
    echo ""
    echo "📦 Installation des dépendances..."
    cd $APP_DIR
    npm install --production
    info "Dépendances installées"
    
    echo ""
    echo "🔨 Build de l'application Next.js..."
    npm run build
    info "Build terminé"
else
    warn "package.json introuvable dans $APP_DIR"
    warn "L'application ne peut pas être restaurée sans le code source"
fi

# 7. Configuration Nginx
echo ""
echo "⚙️  Configuration de Nginx..."
NGINX_CONFIG="/etc/nginx/sites-available/$APP_NAME"

sudo tee $NGINX_CONFIG > /dev/null <<EOF
# Configuration Nginx pour $APP_NAME
# Domaine: $DOMAIN

server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts pour les uploads de vidéos
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Cache pour les assets statiques
    location /_next/static {
        proxy_pass http://localhost:$PORT;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Activer le site
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Tester et recharger Nginx
if sudo nginx -t; then
    sudo systemctl reload nginx
    info "Nginx configuré et rechargé"
else
    error "Erreur dans la configuration Nginx"
    exit 1
fi

# 8. Démarrer l'application avec PM2
if [ -f "$APP_DIR/package.json" ]; then
    echo ""
    echo "🚀 Démarrage de l'application avec PM2..."
    cd $APP_DIR
    pm2 start npm --name $APP_NAME -- start
    pm2 save
    pm2 startup | grep -v PM2_HOME | bash || warn "PM2 startup configuré (peut nécessiter sudo)"
    info "Application démarrée avec PM2"
else
    warn "Application non démarrée (code source manquant)"
fi

# 9. Vérification finale
echo ""
echo "✅ Restauration terminée!"
echo ""
echo "📊 État des services:"
pm2 list
echo ""

# Test de l'application
echo "🌐 Test de l'application..."
if curl -s http://localhost:$PORT > /dev/null; then
    info "Application accessible sur le port $PORT"
else
    warn "Application non accessible sur le port $PORT"
    warn "Vérifiez les logs: pm2 logs $APP_NAME"
fi

echo ""
echo "🔧 Commandes utiles:"
echo "  - Voir les logs: pm2 logs $APP_NAME"
echo "  - Redémarrer: pm2 restart $APP_NAME"
echo "  - Statut: pm2 status"
echo "  - Nginx: sudo systemctl status nginx"
echo ""
echo "🌐 Accès:"
echo "  - HTTP: http://$DOMAIN"
echo ""

# Proposer SSL
if command -v certbot &> /dev/null; then
    if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        echo "🔒 SSL non configuré. Pour configurer SSL:"
        echo "  sudo certbot --nginx -d $DOMAIN"
        echo ""
    else
        info "SSL déjà configuré"
    fi
fi

