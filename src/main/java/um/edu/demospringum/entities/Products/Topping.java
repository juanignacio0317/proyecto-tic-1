package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.servicies.Ingredient;

import java.math.BigDecimal;

@Data
@Getter
@Setter
@Entity
@Table(name = "topping")
public class Topping implements Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long toppingId;

    @Column(nullable = false, unique = true)
    private String typeTopping;

    @Column(nullable = false)
    private boolean toppingAvailability = true;

    @Column(nullable = false)
    private BigDecimal toppingPrice;

    // Implementación de la interfaz Ingredient
    @Override
    public String getType() {
        return typeTopping;
    }

    @Override
    public boolean getAvailability() {
        return toppingAvailability;
    }

    @Override
    public BigDecimal getPrice() {
        return toppingPrice;
    }
}