
# ETUDE CQRS

## Qu'est-ce que le pattern CQRS

CQRS, pour Command Query Responsibility Segregation est une architecture logiciel qui repose sur un principe simple : la séparation des responsabilités en matière de commande et de requête sépare les opérations de lecture Query et d'écriture et mise à jour  (Command ) pour un magasin de données. 

![enter image description here](https://miro.medium.com/max/1024/1*de6XnFji7h-ciacWiHDCfw.png)

### La couche de lecture des données (Query)

Il s’agit d’une couche qui fonctionne uniquement en lecture seule. Aucune modification n’est apportée aux données. On utilise généralement des objets et tables spécifiques à l’interface utilisateur. Ici un seul objectif : aller le plus vite possible. Les contrôles sont donc réduits au minimum (on ne passe pas par la couche domaine dont on parlera plus tard) et en base de données, les données sont dénormalisées au maximum, quitte à avoir de la redondance. Cette méthode permet de récupérer seulement les données dont on a besoin, sans avoir à parcourir de nombreuses tables au travers desquelles les données seraient éparpillées.

Cette couche est généralement composée de services qui exposent les données et d’interfaces légères qui requêtent les données.
## La couche modification des données (Command)

Dans cette couche, on observe davantage d’intermédiaires. Toute modification des données (mise à jour, création, suppression…) passe par cette couche. Ici, chaque action est contextualisée. On ne se contente pas de demander la modification de telle ou telle donnée, la commande porte en elle la notion d’intention : pour quelle raison je souhaite modifier les données. Par exemple, on pourrait avoir une commande _ClientDéménage_ qui impacterait les informations adresse, ville et code postal de l’utilisateur. Dans cet exemple, on sait pourquoi on a modifié ces informations : parce que l’utilisateur a déménagé.

Pour cette partie, on envoie généralement chacune de ces commandes sur un bus, commandes qui seront traitées par des _command handlers_ associées. Ces _command handlers_ vont transmettre les informations de chaque commande au domaine.

## Pourquoi opter pour CQRS ?
-   En séparant la lecture de l’écriture des données, il est possible d’optimiser indépendamment ces deux aspects de l’application. 
-   Chaque opération étant faite dans son propre contexte, elle peut être modifiée sans incidence sur les autres.
-   La gestion des permissions et de la sécurité peut être simplifiée.



Voila un exemple a quoi va ressembler votre repertoire 
![Ouvrir la photo](/docs/images/code/14.png)
## Example d'utilsation dans notre programme
L’implémentation de CQRS dans notre application nous a permis d'optimiser ses performances, son évolutivité et sa sécurité. 
La flexibilité accordée par la migration vers CQRS permet d’améliorer les capacités d’évolution d’un système au fil du temps et empêche les commandes de mise à jour de provoquer des conflits de fusion au niveau du domaine. 
On a divisé notre notre projet  en deux : les classes pour la requête et les autres pour la mise à jour (Command).
Voila un aperçu de l' utilisation du cqrs dans notre code


![Ouvrir la photo](/docs/images/code/13.PNG)

### Les références :
[CQRS et Couche Application](https://www.youtube.com/watch?v=HHZ6eayZFfU)

[CQRS pattern avantages et inconvénients](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

[Martin Fowler - CQRS](https://martinfowler.com/bliki/CQRS.html)


[Articles divers sur CQRS ](https://github.com/mehdihadeli/awesome-software-architecture/blob/main/docs/architectural-patterns/cqrs.md)
