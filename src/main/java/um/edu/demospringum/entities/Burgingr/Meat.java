package um.edu.demospringum.entities.Burgingr;

import jakarta.persistence.*;
import um.edu.demospringum.entities.Products.Burger;

import java.util.List;

@Entity
@Table(name = "meat")

public class Meat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int meatId;

    @Column(nullable = false)
    private String typeMeat;

    @Column(nullable = false)
    private int meatQuantity;

    @OneToMany
    private List<Burger> burgers;

}
