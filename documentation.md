 TP Azure - Déploiement Full Stack
Auteur : Groupe 7
Date :** 31/03/2026  
Repository :https://github.com/Gamdor47/tp-azure



 1. Présentation de l'application

Nous avons déployé une application Todo List composée de trois couches :
- Un frontend React accessible depuis Internet
- Un backend Node.js/Express qui expose une API REST
- Une base de données PostgreSQL qui stocke les tâches

**URLs de production :**
- Frontend : https://calm-rock-06500591e.2.azurestaticapps.net
- Backend : https://tp-azure-backend.azurewebsites.net
- API todos : https://tp-azure-backend.azurewebsites.net/todos

2. Architecture
```
Internet
   │
   ▼
Azure Static Web Apps (React)
   │ HTTPS
   ▼
Azure App Service - tp-azure-backend (Node.js 22)
   │ intégré au VNet (backend-subnet 10.0.1.0/24)
   │ SSL
   ▼
Azure PostgreSQL Flexible Server - tp-azure-db-srv2
   │
   ▼
Azure Key Vault - tp-azure-keyvault
(secrets lus via Managed Identity)

Monitoring : Application Insights - tp-azure-insights

3. Ressources Azure

Resource Group : rg-tp-azure, région Sweden Central (seule région disponible sur l'abonnement étudiant Azure for Students).

Azure Static Web Apps — hébergement du frontend React. Plan gratuit avec CDN mondial intégré, HTTPS automatique et déploiement continu via GitHub Actions. Ce service est optimisé pour les applications JavaScript statiques.

Azure App Service (Plan B1 Linux) — hébergement du backend Node.js 22 LTS. Service PaaS qui permet de déployer sans gérer de serveur. HTTPS forcé activé, intégration VNet configurée pour sécuriser les communications internes.

Azure Database for PostgreSQL Flexible Server — base de données managée version 16. Sauvegardes automatiques, SSL obligatoire sur toutes les connexions, firewall restreint aux services Azure uniquement. La table todos est créée automatiquement au démarrage du backend.

Azure Virtual Network (VNet) — réseau privé 10.0.0.0/16 avec deux sous-réseaux :
- backend-subnet (10.0.1.0/24) : héberge l'App Service
- db-subnet (10.0.2.0/24) : prévu pour isoler la base de données

L'App Service est intégré au VNet via VNet Integration, ce qui permet au backend de communiquer en réseau privé.

Azure Key Vault — stockage sécurisé des secrets. La chaîne de connexion DATABASE_URL est stockée dans le Key Vault et référencée dans l'App Service via une référence Key Vault. L'App Service accède au Key Vault via une Managed Identity système, sans aucun mot de passe dans le code ou dans les variables d'environnement en clair.

Application Insights— monitoring en temps réel de l'application. Connecté à l'App Service via la clé d'instrumentation. Permet de suivre les requêtes, les erreurs et les performances.


 4. Sécurité

Gestion des secrets :
- La DATABASE_URL est stockée dans Azure Key Vault
- L'App Service la lit via une référence Key Vault (@Microsoft.KeyVault(...))
- L'App Service utilise une Managed Identity système pour s'authentifier auprès du Key Vault
- Aucun secret n'est présent dans le code source ni dans Git
- Le fichier .env est exclu via .gitignore

Réseau :
- HTTPS forcé sur le backend (httpsOnly: true)
- SSL obligatoire sur la connexion PostgreSQL (sslmode=require)
- Firewall PostgreSQL : accès restreint aux services Azure uniquement (règle AllowAzureServices 0.0.0.0)
- VNet Integration entre l'App Service et le réseau privé

Identités et accès :
- Service Principal GitHub Actions avec rôle Contributor limité au Resource Group uniquement (principe du moindre privilège)
- Managed Identity App Service avec rôle Key Vault Secrets User limité au Key Vault uniquement


 5. CI/CD

Pipeline frontend (.github/workflows/azure-static-web-apps-calm-rock-06500591e.yml)

Déclenché à chaque push sur la branche main. Le pipeline build le frontend React avec la variable REACT_APP_API_URL pointant vers le backend Azure, puis déploie automatiquement sur Azure Static Web Apps.

Pipeline backend (.github/workflows/backend-deploy.yml)

Déclenché à chaque push sur main dans le dossier backend/. Le pipeline :
1. Lance un service PostgreSQL de test (Docker)
2. Installe les dépendances Node.js
3. Démarre le serveur et exécute les tests automatisés (GET / et GET /todos)
4. Si les tests passent, déploie sur Azure App Service via le Service Principal

Les pipelines ont été écrits manuellement et non auto-générés.

 6. Limitations liées à l'abonnement étudiant

Plusieurs fonctionnalités n'ont pas pu être mises en place car elles sont bloquées par la politique de l'abonnement Azure for Students :

Private Endpoint pour PostgreSQL — aurait permis d'isoler complètement la base de données dans le VNet, accessible uniquement depuis le backend via une IP privée. La commande az network private-endpoint create a retourné une erreur RequestDisallowedByAzure.

Auto-scaling — aurait permis de configurer une règle de scaling automatique basée sur l'utilisation CPU (ex: scale up si CPU > 70%). La commande az monitor autoscale create a retourné une erreur RequestDisallowedByAzure.

Slots de déploiement (staging/production) — aurait permis un déploiement blue/green avec un environnement de staging avant la mise en production. Non disponible sur le plan Basic, nécessite le plan Standard.

En production réelle, ces trois fonctionnalités seraient indispensables.