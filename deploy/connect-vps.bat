@echo off
REM Script batch pour se connecter au VPS depuis CMD
REM Usage: connect-vps.bat

set VPS_IP=51.75.160.211
set VPS_USER=ubuntu

echo.
echo ========================================
echo   Connexion au VPS
echo ========================================
echo IP: %VPS_IP%
echo User: %VPS_USER%
echo.

REM Vérifier si SSH est disponible
where ssh >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] SSH n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Solutions possibles:
    echo 1. Installer OpenSSH Client:
    echo    - Ouvrir 'Parametres' ^> 'Applications' ^> 'Fonctionnalites optionnelles'
    echo    - Chercher 'OpenSSH Client' et l'installer
    echo.
    echo 2. OU installer Git Bash qui inclut SSH
    echo.
    echo 3. OU utiliser WSL (Windows Subsystem for Linux)
    echo.
    pause
    exit /b 1
)

REM Tester la connectivité réseau
echo Test de connectivite reseau...
ping -n 2 %VPS_IP% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Le serveur est accessible
) else (
    echo [ERREUR] Impossible de joindre le serveur
    echo Verifiez votre connexion internet et que le VPS est en ligne
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Authentification SSH
echo ========================================
echo.
set /p KEY_PATH="Chemin vers votre cle SSH privee (appuyez sur Entree pour utiliser l'authentification par mot de passe): "

REM Construire la commande SSH
set SSH_CMD=ssh
if defined KEY_PATH (
    if exist "%KEY_PATH%" (
        set SSH_CMD=ssh -i "%KEY_PATH%"
        echo [OK] Utilisation de la cle: %KEY_PATH%
    ) else (
        echo [ATTENTION] Cle non trouvee, utilisation de l'authentification par mot de passe
    )
)

set SSH_CMD=%SSH_CMD% %VPS_USER%@%VPS_IP%

echo.
echo ========================================
echo   Connexion en cours...
echo ========================================
echo Commande: %SSH_CMD%
echo.

REM Se connecter
%SSH_CMD%

pause

