package um.edu.demospringum.entities.Burgingr;

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
@Table(name = "bread")
public class Bread implements Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer breadId;

    @Column(nullable = false, unique = true)
    private String typeBread;

    @Column(nullable = false)
    private boolean breadAvailability = true;

    @Column(nullable = false)
    private BigDecimal breadPrice;

    // Implementación de la interfaz Ingredient
    @Override
    public String getType() {
        return typeBread;
    }

    @Override
    public boolean getAvailability() {
        return breadAvailability;
    }

    @Override
    public BigDecimal getPrice() {
        return breadPrice;
    }
}