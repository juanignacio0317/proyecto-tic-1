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
@Table(name = "dressing")
public class Dressing implements Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dressingId;

    @Column(nullable = false, unique = true)
    private String typeDressing;

    @Column(nullable = false)
    private boolean dressingAvailability = true;

    @Column(nullable = false)
    private BigDecimal dressingPrice;

    // Implementación de la interfaz Ingredient
    @Override
    public String getType() {
        return typeDressing;
    }

    @Override
    public boolean getAvailability() {
        return dressingAvailability;
    }

    @Override
    public BigDecimal getPrice() {
        return dressingPrice;
    }
}