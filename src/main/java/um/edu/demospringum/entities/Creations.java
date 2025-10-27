package um.edu.demospringum.entities;

import jakarta.persistence.*;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.Dressings;
import um.edu.demospringum.entities.Products.Product;
import um.edu.demospringum.entities.Products.Toppings;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Creations")
public class Creations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long creationId;

    @ManyToOne
    @JoinColumn(name = "clientId")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product productSize;

    @ManyToMany
    @JoinTable(
            name = "creation_toppings",
            joinColumns = @JoinColumn(name = "creation_id"),
            inverseJoinColumns = @JoinColumn(name = "topping_id")
    )
    private List<Toppings> toppings = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "creation_dressings",
            joinColumns = @JoinColumn(name = "creation_id"),
            inverseJoinColumns = @JoinColumn(name = "dressing_id")
    )
    private List<Dressings> dressings = new ArrayList<>();

    @Column(nullable = false)
    private boolean favourite;

    private List<Order> orders;


}
