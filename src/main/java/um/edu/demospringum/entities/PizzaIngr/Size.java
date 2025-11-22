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
@Table(name = "size")


@Getter
@Setter
public class Size implements Serializable, Ingredient {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sizeId;

    @Column(nullable = false)
    private String typeSize;

    @Column(nullable = false)
    private boolean sizeAvailability;

    @Column(nullable = false, scale = 2)
    private BigDecimal sizePrice;

    @OneToMany
    private List<Pizza> pizzas;


    @Override
    public int getId() {
        return this.sizeId;
    }

    public String getType(){
        return typeSize;
    }

    public boolean getAvailability(){
        return sizeAvailability;
    }

    public BigDecimal getPrice(){
        return sizePrice;
    }
}
