package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.servicies.Ingredient;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "topping")
public class Topping implements Serializable, Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long toppingId;

    @Column(nullable = false)
    private String typeTopping;

    @Column(nullable = false)
    private String category; // "VEGETAL", "CHEESE", etc.

    @Column(nullable = false, scale = 2)
    private BigDecimal toppingPrice;


    @Column(nullable = false)
    private boolean toppingAvailability;



    public String getType(){
        return typeTopping;
    }

    public boolean getAvailability(){
        return toppingAvailability;
    }

    public BigDecimal getPrice(){
        return toppingPrice;
    }
}