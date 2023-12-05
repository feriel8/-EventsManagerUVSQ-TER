# ## EventsManagerUVSQ-TER

CHETOUAH HADJAR 22109918

DRIF YASSER EL HABIB 22107524 

AKROUNE FERIEL 21807878 



# 1. __Généralités__
Cette application web a pour but principal de faciliter  l'organisation des inscriptions a des événements.

Liste des fonctionnalités: 

Participants à l'événement :

- Connexion avec e-mail et mot de passe + Réinitialiser le mot de passe
- Lien de vérification automatique des e-mails
- Page d'inscription pour les participants à l'événement
- Page de confirmation pour les participants à l'événement
- E-mail automatique après confirmation de participation
- Possibilité de modifier les informations dans l'application à l'événement
-Autogénération d'un QR pour chaque participant après confirmation


Compte administrateur :

- Page de statistiques sur l'inscription à l'événement
- Page de paramètres pour modifier la date de début et de fin d'inscription
- Page des utilisateurs pour accepter ou rejeter les participants à l'événement
- Page de checkin pour scanner le QR code des participants confirmés le jour de l'événement.
- Page d'envoi d'e-mails marketing aux participants à l'événement


Site : [https://uvsqconf.herokuapp.com](https://uvsqconf.herokuapp.com) 
```bash
Admin Username: ter@uvsq.com 
password: party
```


# 2. __Technologies utilisées__

On a utilisé la technologie AngularJS pour le front-end et NodeJS pour le backend avec MongoDB comme base de données.

[Architechture de l'application ](/docs/doc/architecture.md)


# 3. Installation et Deployment local

Version nodeJS necessaire: 10.13+

Installation de dépendences:

```bash
npm install
```

Lancement de l'application :

```bash
gulp server
```



# 4. Partie Etude


[4.1 CQRS - Command and Query Responsibility Segregation ](/docs/doc/cqrs.md)


[4.2 Regex - Regular expression](/docs/doc/regex.md)
