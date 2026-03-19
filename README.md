# Cours Node.js - Normandie Web School

Bienvenue dans ce dépôt dédié à l'apprentissage de Node.js. Ce projet regroupe l'ensemble des exercices, démonstrations et projets réalisés durant le cursus.

---

## Présentation
L'objectif de ce cours est de maîtriser les fondamentaux de Node.js, de la gestion du système de fichiers à la création d'API REST robustes avec Express.

### Points abordés :
* Fondamentaux : Architecture Event Loop, modules natifs (fs, path, http).
* NPM : Gestion des dépendances et scripts.
* Express.js : Création de serveur, middlewares et routage.
* Base de données : Connexion et manipulation de données (SQLite).
* API REST : Bonnes pratiques et intégration.

---

## Prérequis
Avant de commencer, assurez-vous d'avoir installé :
* Node.js (Version LTS recommandée)
* npm (installé automatiquement avec Node)
* Un client API comme Postman ou Insomnia

---

## Installation et Utilisation

1. **Cloner le dépôt :**
   ```bash
   git clone [https://github.com/tomfrx12/cours_nodejs.git](https://github.com/tomfrx12/cours_nodejs.git)
   cd cours_nodejs
2. **Installer les dépendances :**
    ```bash
    npm install
3. **Lancer le projet :**
    * En mode développement (avec auto-reload via nodemon) :
        ```bash
        npm run dev
    * En mode production :
        ```bash
        npm start

## Structure du projet
Le dépôt est organisé de manière modulaire :
* /src : Code source principal de l'application.
* /exercices : Travaux pratiques réalisés durant les sessions.
* /config : Configuration de la base de données et variables d'environnement.
* /routes : Définition des endpoints de l'API.
* /models : Schémas de données.

## Auteur
Tom Fourneaux

Note : Ce dépôt est maintenu à des fins pédagogiques dans le cadre de la formation NWS.