package um.edu.demospringum.entities.Products;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.servicies.Ingredient;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "beverage")

@Getter
@Setter
public class Beverage implements Serializable, Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int beverageId;

    @Column(nullable = false)
    private String typeBeverage;

    @Column(nullable = false)
    private boolean beverageAvailability;

    @Column(nullable = false, scale = 2)
    private BigDecimal beveragePrice;

    @Override
    public int getId() {
        return this.beverageId;
    }


    public String getType(){
        return typeBeverage;
    }

    public boolean getAvailability(){
        return beverageAvailability;
    }

    public BigDecimal getPrice(){
        return beveragePrice;
    }


}
