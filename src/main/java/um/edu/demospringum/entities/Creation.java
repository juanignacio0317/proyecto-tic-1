package um.edu.demospringum.entities;

import jakarta.persistence.*;
import um.edu.demospringum.entities.Products.Dressing;
import um.edu.demospringum.entities.Products.Product;
import um.edu.demospringum.entities.Products.Topping;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "creation")
public class Creation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long creationId;

    @ManyToOne
    @JoinColumn(name = "clientId")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    @ManyToMany
    @JoinTable(
            name = "creation_toppings",
            joinColumns = @JoinColumn(name = "creation_id"),
            inverseJoinColumns = @JoinColumn(name = "topping_id")
    )
    private List<Topping> toppings = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "creation_dressings",
            joinColumns = @JoinColumn(name = "creation_id"),
            inverseJoinColumns = @JoinColumn(name = "dressing_id")
    )
    private List<Dressing> dressings = new ArrayList<>();

    @Column(nullable = false)
    private boolean favourite;

    @OneToMany
    private List<ClientOrder> orders;


}
