# 🚨 COMMENCEZ ICI - Récupération du VPS

## ⚡ Solution la Plus Rapide

**Exécutez simplement cette commande dans PowerShell:**

```powershell
.\deploy\quick-recovery.ps1
```

C'est tout! Le script va automatiquement:
- ✅ Vérifier/générer votre clé SSH
- ✅ Restaurer l'accès au VPS
- ✅ Réparer et redémarrer votre application
- ✅ Vérifier que tout fonctionne

## 📋 Si ça ne fonctionne pas

### Option 1: Diagnostic d'abord
```powershell
.\deploy\diagnostic-vps.ps1
```
Ce script vous dira exactement quel est le problème.

### Option 2: Guide complet
Lisez: [README-RECUPERATION.md](README-RECUPERATION.md)

### Option 3: Via le panneau OVH
1. Connectez-vous au panneau OVH: https://www.ovh.com/manager/
2. Allez dans **VPS** > Votre serveur > **Console VNC**
3. Connectez-vous directement
4. Exécutez:
   ```bash
   curl -s https://raw.githubusercontent.com/AnisMairi/demo-fencing-vane/main/deploy/restore-vps.sh | bash
   ```

## ✅ Après la récupération

Votre application sera accessible sur: **http://escrimetalents.anis-mairi.com**

---

**Besoin d'aide?** Consultez [README-RECUPERATION.md](README-RECUPERATION.md)

