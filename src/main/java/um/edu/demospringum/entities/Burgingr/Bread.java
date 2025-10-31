package um.edu.demospringum.entities.Burgingr;

import jakarta.persistence.*;
import um.edu.demospringum.entities.Products.Burger;

import java.util.List;

@Entity
@Table(name = "bread")

public class Bread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int breadId;

    @Column(nullable = false)
    private String typeBread;

    @OneToMany
    private List<Burger> burgers;

}
