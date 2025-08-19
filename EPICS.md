# Épopées et User Stories du MVP - Africage

Ce document définit les fonctionnalités clés à développer pour la première version de l'application Africage.

---

### Épopée 1 : Gestion des Utilisateurs et Authentification

**Objectif** : Permettre aux utilisateurs de créer un compte, de se connecter et de gérer leur profil.

*   **US1.1** : En tant que nouvel utilisateur, je peux m'inscrire sur la plateforme en fournissant mon nom, mon email et un mot de passe.
*   **US1.2** : En tant qu'utilisateur enregistré, je peux me connecter à mon compte avec mon email et mon mot de passe.
*   **US1.3** : En tant qu'utilisateur connecté, je peux me déconnecter de mon compte.
*   **US1.4** : En tant qu'utilisateur connecté, je peux consulter et modifier les informations de base de mon profil (nom, prénom, photo de profil).
*   **US1.5** : (Post-MVP) En tant qu'utilisateur, je veux pouvoir lancer un processus de vérification d'identité (KYC) pour augmenter mon niveau de confiance sur la plateforme.

---

### Épopée 2 : Gestion des Annonces de Colis (Pour l'Expéditeur)

**Objectif** : Permettre aux expéditeurs de publier et gérer leurs demandes d'envoi.

*   **US2.1** : En tant qu'expéditeur connecté, je peux créer une nouvelle annonce de colis en spécifiant ses détails : titre, description, poids, dimensions, adresses de départ et d'arrivée, et une photo.
*   **US2.2** : En tant qu'expéditeur, je peux voir la liste de toutes mes annonces (en attente, en cours, terminées) sur mon tableau de bord.
*   **US2.3** : En tant qu'expéditeur, je peux modifier ou supprimer une de mes annonces tant qu'elle n'a pas été acceptée par un voyageur.

---

### Épopée 3 : Gestion des Annonces de Trajets (Pour le Voyageur)

**Objectif** : Permettre aux voyageurs de proposer leurs services de transport.

*   **US3.1** : En tant que voyageur connecté, je peux publier un nouveau trajet en spécifiant l'itinéraire (ville de départ/arrivée), les dates, et la capacité de transport disponible (poids, volume).
*   **US3.2** : En tant que voyageur, je peux voir la liste de tous mes trajets publiés sur mon tableau de bord.
*   **US3.3** : En tant que voyageur, je peux parcourir la liste des colis disponibles qui correspondent à mes trajets.
*   **US3.4** : En tant que voyageur, je peux modifier ou supprimer un de mes trajets publiés.

---

### Épopée 4 : Mise en Relation et Transaction

**Objectif** : Faciliter l'accord entre un expéditeur et un voyageur, et suivre la transaction.

*   **US4.1** : En tant que voyageur, je peux faire une proposition pour transporter un colis.
*   **US4.2** : En tant qu'expéditeur, je peux consulter les propositions reçues pour mon colis et accepter celle qui me convient.
*   **US4.3** : Lorsqu'une proposition est acceptée, une "Transaction" est créée et un code de sécurité unique est généré pour la livraison.
*   **US4.4** : L'expéditeur et le voyageur peuvent suivre le statut de la transaction sur leur tableau de bord (Confirmé, En transit, Livré, Annulé).
*   **US4.5** : (Post-MVP) En tant qu'expéditeur, je peux payer pour la transaction via la plateforme.
*   **US4.6** : (Post-MVP) En tant qu'utilisateur (expéditeur ou voyageur), je peux laisser un avis sur l'autre partie une fois la transaction terminée.
