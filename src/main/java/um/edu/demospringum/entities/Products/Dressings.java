package um.edu.demospringum.entities.Products;


import jakarta.persistence.*;

@Entity
@Table(name = "Dressings")

public class Dressings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dressingId;

    @Column(nullable = false)
    private String typeDressing;


}