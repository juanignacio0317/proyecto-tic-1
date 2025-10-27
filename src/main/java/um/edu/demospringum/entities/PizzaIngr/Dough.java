package um.edu.demospringum.entities.PizzaIngr;

import jakarta.persistence.*;
import um.edu.demospringum.entities.Products.Pizza;

import java.util.List;

@Entity
@Table(name = "Dough")

public class Dough {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doughId;

    @Column(nullable = false)
    private String typeDough;

    @OneToMany
    private List<Pizza> pizzas;
}
