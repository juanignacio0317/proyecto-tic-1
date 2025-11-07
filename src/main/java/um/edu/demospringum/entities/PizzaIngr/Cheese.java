package um.edu.demospringum.entities.PizzaIngr;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.entities.Products.Pizza;
import um.edu.demospringum.servicies.Ingredient;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "dough")

@Setter
@Getter
public class Cheese implements Serializable, Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cheeseId;

    @Column(nullable = false)
    private String typeCheese;

    @Column(nullable = false)
    private boolean cheeseAvailability;

    @Column(nullable = false, scale = 2)
    private BigDecimal cheesePrice;

    @OneToMany
    private List<Pizza> pizzas;


    public String getType() {
        return typeCheese;
    }

    public boolean getAvailability() {
        return cheeseAvailability;
    }

    public BigDecimal getPrice() {
        return cheesePrice;
    }


}