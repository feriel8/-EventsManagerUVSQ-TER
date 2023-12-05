# Architecture 

afin de vous donner une idée sur ce qui se passe dans notre code on déroule l'étape de l'authentification :
 ## client: 
 En premier lieu on est dans le dossier client c'est là où on trouve la partie frontend par exemple: Plugins: chart pour afficher les graphes, moment pour afficher l'heure... webcam pour la caméra … Views: c’est côté HTML pour l’interface par exemple : login.html c’est la page qui s’affiche lorsqu'on veut se connecter voila une capture de ce qui nous sera affiché


 
 
![Ouvrir la photo](/docs/images/code/4.png)

Après la saisie du mot de passe et de l'émail on appuie sur n'importe quel bouton par exemple login et c'est loginctrl.js qui se trouve aussi dans le dossier client/views/login qui s'occupe de la suite, comme le montre le bout de code sur cette capture la fonction AutheService.loginwithPassword( ) récupère l'email et mot de passe saisie dans la page login.html grace a $scope et c'est la même chose qui se produit lorsqu'on appuie sur register mais dans ce cas dans la classe loginCtrl.js on fait appel à la fonction AutheService.register() 



![Ouvrir la photo](/docs/images/code/5.png)

Cette fonction **AutheService.loginwithPassword( )** on la trouve dans client/src/service elle prend l'email et le mot de passe comme paramètre de cette fonction  **.post('/auth/login', {  email: email, password: password  })**,qui fait appel à l'API grâce au  **.post**  dans le but d'envoyer les informations recueillies vers le backend comme le montre cette capture

![Ouvrir la photo](/docs/images/code/6.png)

## server: 
a présent on va vers server/routes c'est la ou on trouve notre api.js mais par mesure de sécurité au lieu de mettre tout dans api.js on a preferé crée auth.js pour héberger tout ce qui est en relation avec l'authentification 

![Ouvrir la photo](/docs/images/code/7.png)

![Ouvrir la photo](/docs/images/code/8.png)

vu qu'on a pas de token on a seulement l'email et le mot de passe on utilise la fonction **UserController.loginWithPassword(email, password....)**
qui nous renvoie au dossier server/controllers et puis vers la classe **UserController.js** qui gère le contrôle de la validité des informations saisie par l'utilisateur comme vous pouvez le voir dans cette capture il vérifie si vous avez bien saisie un mot de passe si non on aura le message: **"Please enter a password"** et puis il vérifie  le format de l'email 

![Ouvrir la photo](/docs/images/code/9.png)

après cette vérification , il va chercher le user dans notre base de donnée qui a le même émail que celui saisie et quand il le trouve il vérifie si c'est le même  mot de passe que celui dans la base de donnée avec la fonction **User.findOneByEmail(email)  
  .select("+password")** , si tout est vérifié il nous renvoie **return callback(null, token, u);** un token depuis la base de donnée , a partir de là on fait le chemin inverse il le renvoie vers l'API puis il sort du backend vers le frontend pour les envoyé vers **client.src/services/AuthService.js** puis vers **controllers client/views/login/loginctrl.js** 

![Ouvrir la photo](/docs/images/code/10.png)

arriver a cette etape et le succées de l'authentification est vérifié  il nous derige vers dashboard

![Ouvrir la photo](/docs/images/code/11.png)

  




