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
public class Dough implements Serializable, Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doughId;

    @Column(nullable = false)
    private String typeDough;

    @Column(nullable = false)
    private boolean doughAvailability;

    @Column(nullable = false, scale = 2)
    private BigDecimal doughPrice;

    @OneToMany
    private List<Pizza> pizzas;

    @Override
    public int getId() {
        return this.doughId;
    }


    public String getType(){
        return typeDough;
    }

    public boolean getAvailability(){
        return doughAvailability;
    }

    public BigDecimal getPrice(){
        return doughPrice;
    }
}
