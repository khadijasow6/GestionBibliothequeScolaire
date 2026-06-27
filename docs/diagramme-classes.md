````markdown
# Diagramme UML de classes

Ce diagramme présente les principales classes de l’application de gestion de bibliothèque scolaire et leurs relations.

mermaid
classDiagram

    class User {
        +int id
        +string username
        +string first_name
        +string last_name
        +string role
        +string matricule
        +boolean is_active
    }

    class Category {
        +int id
        +string name
        +string description
        +datetime created_at
        +datetime updated_at
    }

    class Author {
        +int id
        +string first_name
        +string last_name
        +string biography
        +datetime created_at
        +datetime updated_at
    }

    class Book {
        +int id
        +string title
        +string isbn
        +string description
        +int publication_year
        +string publisher
        +datetime created_at
        +datetime updated_at
    }

    class BookCopy {
        +int id
        +string inventory_code
        +string status
        +string condition
        +date acquisition_date
        +datetime created_at
        +datetime updated_at
    }

    class Loan {
        +int id
        +datetime borrowed_at
        +datetime due_at
        +datetime returned_at
        +string status
        +datetime created_at
        +datetime updated_at
    }

    Category "1" --> "0..*" Book : contient
    Author "0..*" -- "0..*" Book : écrit
    Book "1" --> "0..*" BookCopy : possède
    User "1" --> "0..*" Loan : emprunte
    BookCopy "1" --> "0..*" Loan : concerne
    User "1" --> "0..*" Loan : enregistre


## Explication des relations

* Une catégorie peut contenir plusieurs livres.
* Un livre appartient à une seule catégorie.
* Un livre peut avoir un ou plusieurs auteurs.
* Un auteur peut écrire plusieurs livres.
* Un livre peut posséder plusieurs exemplaires.
* Un élève peut avoir plusieurs emprunts.
* Un exemplaire peut être emprunté plusieurs fois au cours du temps.
* Un bibliothécaire ou un administrateur enregistre les emprunts.


