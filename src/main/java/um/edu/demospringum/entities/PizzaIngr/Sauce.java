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
@Table(name = "sauce")

@Getter
@Setter
public class Sauce implements Serializable, Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sauceId;

    @Column(nullable = false)
    private String typeSauce;

    @Column(nullable = false)
    private boolean sauceAvailability;

    @Column(nullable = false, scale = 2)
    private BigDecimal saucePrice;

    @OneToMany
    private List<Pizza> pizzas;

    public String getType(){
        return typeSauce;
    }

    public boolean getAvailability(){
        return sauceAvailability;
    }

    public BigDecimal getPrice(){
        return saucePrice;
    }

}