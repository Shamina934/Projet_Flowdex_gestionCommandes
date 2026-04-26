Voici exactement quoi faire dans l'ordre :

**1 — Démarrer MySQL dans XAMPP**

Ouvre le panneau XAMPP → clique **Start** à côté de **MySQL** → attends que ça passe en vert.

---

**2 — Lancer le backend**

Ouvre un terminal dans VS Code dans le dossier `gestion-commandes-api` :

```
npm run dev
```

Tu dois voir :
```
Serveur démarré sur le port 3000
Connexion à MySQL réussie
```

---

**3 — Lancer l'app Expo**

Ouvre un **deuxième terminal** dans VS Code dans le dossier `gestion-commandes-app` :

```
npx expo start --tunnel
```

Scanne le QR code avec Expo Go sur ton téléphone.

---

**C'est tout !** Ces 3 étapes à chaque fois que tu reprends le projet. Le code lui est sauvegardé, tu n'as rien à réinstaller.