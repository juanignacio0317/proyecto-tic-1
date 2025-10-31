package um.edu.demospringum.entities.PizzaIngr;

import jakarta.persistence.*;
import um.edu.demospringum.entities.Products.Pizza;

import java.util.List;

@Entity
@Table(name = "size")

public class Size {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sizeId;

    @Column(nullable = false)
    private String typeSize;

    @OneToMany
    private List<Pizza> pizzas;
}
