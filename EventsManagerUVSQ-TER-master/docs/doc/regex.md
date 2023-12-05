# ETUDE REGEX


 # Qu'est-ce qu'une expression régulière ?	
 une expression régulière  est une chaîne de caractères qui décrit, selon une syntaxe précise, un ensemble de chaînes de caractères possibles. Les expressions régulières sont également appelées **regex** un mot-valise formé depuis l'anglais _regular expression_)
 Initialement créées pour décrire les langages formels, les expressions régulières sont utilisées dans l'analyse et la manipulation des langages informatiques ; les compilateurs et les interpréteurs sont ainsi basés sur elles.
 
RegExp facilite et accélère la recherche et la correspondance des chaînes. Par exemple, dans les moteurs de recherche, les journaux, les éditeurs, etc., il est nécessaire de filtrer/faire correspondre les textes facilement et efficacement. C'est là qu'interviennent les modèles RegExp, définissant des modèles de recherche avec une séquence de caractères.
.
### 1-Pourquoi on utilise les expression régulières :
elle sont utiles dans :
#### -Recherche/correspondance de chaînes.
#### -Validation des entrées.
#### -Récupération Web:
Le scraping web consiste à extraire des données de sites web. En utilisant RegExp, les développeurs sont en mesure de réaliser facilement cette tâche. À titre d'exemple, les développeurs ont la possibilité d'extraire les sous-chaînes de Strings en pointant sur une page Web et en extrayant les données qui correspondent à leur modèle.
#### -Conflit de données:
Les données extraites d'une page Web offrent de nombreuses possibilités. Par exemple, il suffit d'évaluer et d'organiser les données Web dans le format souhaité pour prendre les décisions appropriées. Avec RegExp, l'agrégation et la cartographie des données permettent de les utiliser à des fins d'analyse.

Comme exemple nous avons la validation des emails avec notre fonction regex.

### 2-Example de la validation des  e mails 
La validation des e-mails est un point très important lors de la validation d'un formulaire HTML.
 Un e-mail est composé d'une chaîne de caractères (un sous-ensemble de caractères ASCII) séparée par le symbole @ : un " info_personnelle " et un domaine, c'est-à-dire info_personnelle@domaine. La longueur de la partie info_personnelle peut aller jusqu'à 64 caractères et le nom de domaine peut aller jusqu'à 253 caractères.
La partie info_personnelle peut être composée des caractères ASCII suivants:

L'alphabet majuscules (AZ) et minuscules (az).
Chiffres (0-9).
Caractères spéciaux  ! # $ % & ' * + - / = ? ^ _ ` { | } ~
Caractère. (point) à condition qu'il ne soit pas le premier ou le dernier caractère et qu'il ne se présente pas l'un après l'autre.
La partie du nom de domaine [par exemple com, org, net, in, us, info] contient des lettres, des chiffres, des traits d'union et des points.

Voici quelque exemple dans notre code :

![Exmple1](/docs/images/code/1.png)

![Exmple2](/docs/images/code/2.png)

![Exmple3](/docs/images/code/3.png)


### Les références :
[livre détaillé sur REGEX créé a partir des contributeurs de stackoverflow](https://riptutorial.com/Download/regular-expressions-fr.pdf)

[Exemple simple de l'utilisation de REGEX sur github](https://github.com/sarra-muarrif/validateEmail)

[Video de Validation d'email avec expression régulière en javascript ](https://www.youtube.com/watch?v=5GVBe4vwW8o)

[definition et interet de RegEx et exemple en JavaScript](https://blog.sessionstack.com/how-javascript-works-regular-expressions-regexp-e187e9082913)

[questions-réponses sur le site stackoverflow a propos regex](https://stackoverflow.com/questions/8262635/validating-an-inputted-email-and-password-in-javascript)

