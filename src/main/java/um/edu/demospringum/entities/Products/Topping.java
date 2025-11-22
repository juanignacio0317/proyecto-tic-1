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
    private int toppingId;

    @Column(nullable = false, unique = true)
    private String typeTopping;



    @Column(nullable = false)
    private BigDecimal toppingPrice;

    // Implementación de la interfaz Ingredient
    @Override
    public String getType() {
        return typeTopping;
    }
    @Override
    public int getId() {
        return this.toppingId;
    }

    @Column(nullable = false)
    private boolean toppingAvailability;



    @Override
    public boolean getAvailability() {
        return toppingAvailability;
    }

    @Override
    public BigDecimal getPrice() {
        return toppingPrice;
    }
}