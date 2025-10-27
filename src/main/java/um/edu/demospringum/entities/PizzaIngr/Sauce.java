package um.edu.demospringum.entities.PizzaIngr;

import jakarta.persistence.*;
import um.edu.demospringum.entities.Products.Pizza;

import java.util.List;

@Entity
@Table(name = "Sauce")

public class Sauce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sauceId;

    @Column(nullable = false)
    private String typeSauce;

    @OneToMany
    private List<Pizza> pizzas;
}