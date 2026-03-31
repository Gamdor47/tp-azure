# Documentation Technique - TP Azure
## Déploiement d'une application Full Stack sur Azure

**Groupe :** [Ton nom]  
**Date :** 31/03/2026  
**Repository :** https://github.com/Gamdor47/tp-azure

---

## 1. Architecture de l'application

### Stack technique
- **Frontend :** React.js (Todo List)
- **Backend :** Node.js + Express.js
- **Base de données :** PostgreSQL

### URLs de production
- **Frontend :** https://calm-rock-06500591e.2.azurestaticapps.net
- **Backend :** https://tp-azure-backend.azurewebsites.net

---

## 2. Ressources Azure utilisées

### Resource Group
- **Nom :** rg-tp-azure
- **Région :** Sweden Central

### Azure Static Web Apps (Frontend)
- **Nom :** rg-tp-azure
- **Plan :** Free
- **Région :** Global
- **Justification :** Service managé optimisé pour les applications React, avec CDN intégré, HTTPS automatique et déploiement continu via GitHub Actions.

### Azure App Service (Backend)
- **Nom :** tp-azure-backend
- **Plan :** B1 (Basic)
- **Runtime :** Node.js 22 LTS
- **Région :** Sweden Central
- **Justification :** Service PaaS permettant de déployer des applications Node.js sans gérer l'infrastructure serveur. Scalabilité verticale et horizontale possible.

### Azure Database for PostgreSQL Flexible Server
- **Nom :** tp-azure-db-srv2
- **SKU :** Standard_B1ms (Burstable)
- **Version :** PostgreSQL 16
- **Région :** Sweden Central
- **Justification :** Service de base de données managé avec haute disponibilité, sauvegardes automatiques et mises à jour gérées par Azure.

---

## 3. Pipeline CI/CD

### Frontend (Azure Static Web Apps CI/CD)
- **Fichier :** `.github/workflows/azure-static-web-apps-calm-rock-06500591e.yml`
- **Déclencheur :** Push sur la branche `main`
- **Étapes :**
  1. Checkout du code
  2. Build React avec variables d'environnement
  3. Déploiement sur Azure Static Web Apps

### Backend (Backend CI/CD)
- **Fichier :** `.github/workflows/backend-deploy.yml`
- **Déclencheur :** Push sur la branche `main` (dossier `backend/`)
- **Étapes :**
  1. Checkout du code
  2. Installation des dépendances Node.js
  3. Exécution des tests automatisés
  4. Déploiement sur Azure App Service



## 4. Sécurité

### Gestion des secrets
- Les variables sensibles (DATABASE_URL, NODE_ENV) sont stockées dans les **App Settings** d'Azure App Service et non dans le code source.
- Les credentials Azure pour GitHub Actions sont stockés dans les **secrets GitHub** (`AZURE_CREDENTIALS`).
- Le fichier `.env` est exclu du repository via `.gitignore`.

### Réseau
- **HTTPS** activé par défaut sur Azure Static Web Apps et App Service.
- **Firewall PostgreSQL** : accès restreint aux services Azure uniquement (règle `AllowAzureServices`).
- **SSL** obligatoire pour les connexions à la base de données (`sslmode=require`).

### Identités et accès
- **Service Principal** Azure créé avec le rôle `Contributor` limité au Resource Group `rg-tp-azure` uniquement (principe du moindre privilège).

---

## 5. Communication entre les composants

Utilisateur
    ↓ HTTPS
Azure Static Web Apps (React)
    ↓ HTTPS (REACT_APP_API_URL)
Azure App Service (Node.js/Express)
    ↓ SSL (DATABASE_URL)
Azure PostgreSQL Flexible Server




## 6. Bonnes pratiques mises en place

-  Séparation frontend/backend/database
-  Variables d'environnement pour les secrets
-  HTTPS sur tous les composants
-  Firewall sur la base de données
-  Pipeline CI/CD avec tests automatisés
-  Principe du moindre privilège (Service Principal limité au Resource Group)
- `.gitignore` pour exclure les fichiers sensibles