=====================================
GESTION DE COMMANDES - README
Projet React Native + Node.js + MySQL
=====================================

DESCRIPTION
-----------
Application mobile de gestion de produits, clients, commandes et achats.
Développée avec React Native (Expo) pour le frontend et Node.js / Express
pour le backend, connectée à une base de données MySQL via Sequelize.


STRUCTURE DU PROJET
-------------------
Le projet est composé de deux dossiers séparés :

  gestion-commandes-api/     → le serveur backend Node.js
  gestion-commandes-app/     → l'application mobile React Native


PRÉREQUIS
---------
Avoir installé sur son PC :
  - Node.js (version LTS)
  - XAMPP (pour MySQL et Apache)
  - VS Code
  - Expo Go sur son téléphone (Android ou iOS)


COMMENT LANCER LE PROJET
-------------------------

Etape 1 - Démarrer la base de données

  Ouvrir le panneau de contrôle XAMPP
  Cliquer sur Start à côté de Apache
  Cliquer sur Start à côté de MySQL
  Les deux lignes doivent passer en vert

  Vérifier que la base de données "gestion_commandes" existe :
  Ouvrir http://localhost/phpmyadmin dans le navigateur
  La base doit contenir les tables : products, clients, orders,
  order_products, purchases


Etape 2 - Lancer le backend

  Ouvrir un terminal dans le dossier gestion-commandes-api
  Taper la commande :

    npm run dev

  Le terminal doit afficher :
    Serveur démarré sur le port 3000
    Connexion à MySQL réussie

  Laisser ce terminal ouvert pendant toute la session


Etape 3 - Lancer l'application mobile

  Ouvrir un second terminal dans le dossier gestion-commandes-app
  Taper la commande :

    npx expo start

  Pour accéder à l'app :
    - Sur navigateur : appuyer sur w dans le terminal
    - Sur téléphone : scanner le QR code avec Expo Go
      (téléphone et PC doivent être sur le même Wi-Fi)

  Si le Wi-Fi bloque la connexion, utiliser :

    npx expo start --tunnel


ADRESSE IP
----------
Si l'application ne se connecte pas au serveur depuis le téléphone,
l'adresse IP a peut-être changé.

Faire ipconfig dans PowerShell et noter l'adresse IPv4 Wi-Fi.
Puis mettre à jour cette ligne dans chaque fichier
(produits.tsx, clients.tsx, commandes.tsx, achats.tsx) :

  : 'http://NOUVELLE_IP:3000/api/...'

Sur navigateur web, localhost fonctionne directement sans changer l'IP.


STRUCTURE DE LA BASE DE DONNÉES
---------------------------------
products      : id, name, price, description
clients       : id, name, email, phone
orders        : id, client_id, date, total
order_products: id, order_id, product_id, quantity
purchases     : id, product_id, quantity, purchase_price, date


ROUTES API DISPONIBLES
-----------------------
Produits :
  GET    http://localhost:3000/api/products
  GET    http://localhost:3000/api/products/:id
  POST   http://localhost:3000/api/products
  PUT    http://localhost:3000/api/products/:id
  DELETE http://localhost:3000/api/products/:id

Clients :
  GET    http://localhost:3000/api/clients
  GET    http://localhost:3000/api/clients/:id
  POST   http://localhost:3000/api/clients
  PUT    http://localhost:3000/api/clients/:id
  DELETE http://localhost:3000/api/clients/:id

Commandes :
  GET    http://localhost:3000/api/orders
  GET    http://localhost:3000/api/orders/:id
  POST   http://localhost:3000/api/orders
  DELETE http://localhost:3000/api/orders/:id

Achats :
  GET    http://localhost:3000/api/purchases
  POST   http://localhost:3000/api/purchases
  DELETE http://localhost:3000/api/purchases/:id


EXEMPLE DE BODY POUR LES REQUETES POST
----------------------------------------
Ajouter un produit :
  {
    "name": "Smartphone",
    "price": 2500,
    "description": "Un smartphone performant"
  }

Ajouter un client :
  {
    "name": "Ali Ben Salah",
    "email": "ali@gmail.com",
    "phone": "0612345678"
  }

Créer une commande :
  {
    "client_id": 1,
    "date": "2026-04-27",
    "total": 3700,
    "product_ids": [1, 2]
  }

Ajouter un achat :
  {
    "product_id": 2,
    "quantity": 10,
    "purchase_price": 2000,
    "date": "2026-04-27"
  }


PROBLÈMES FRÉQUENTS
--------------------
MySQL ne démarre pas dans XAMPP :
  Le port 3306 est occupé par une autre instance MySQL.
  Ouvrir PowerShell en administrateur et taper :
    netstat -ano | findstr :3306
  Puis tuer le processus avec le PID trouvé :
    taskkill /PID xxxx /F
  Relancer MySQL dans XAMPP.

Erreur "Serveur inaccessible" sur téléphone :
  L'adresse IP a changé. Faire ipconfig et mettre à jour
  l'IP dans les fichiers tsx comme expliqué ci-dessus.

Tunnel Ngrok échoue :
  Utiliser npx expo start sans --tunnel et tester
  sur le navigateur avec la touche w.

Hot Reload ne fonctionne plus :
  Relancer avec npx expo start --tunnel
  ou secouer le téléphone dans Expo Go et appuyer sur Reload.


TECHNOLOGIES UTILISÉES
-----------------------
Frontend : React Native, Expo, TypeScript
Backend  : Node.js, Express.js
Base de données : MySQL (XAMPP), Sequelize ORM
Outils : Thunder Client, phpMyAdmin, nodemon
