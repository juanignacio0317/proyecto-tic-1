package um.edu.demospringum.entities.PizzaIngr;

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
@Table(name = "cheese")
public class Cheese implements Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cheeseId;

    @Column(nullable = false, unique = true)
    private String typeCheese;

    @Column(nullable = false)
    private boolean cheeseAvailability = true;

    @Column(nullable = false)
    private BigDecimal cheesePrice;

    @Override
    public int getId() {
        return this.cheeseId;
    }


    @Override
    public String getType() {
        return typeCheese;
    }

    @Override
    public boolean getAvailability() {
        return cheeseAvailability;
    }

    @Override
    public BigDecimal getPrice() {
        return cheesePrice;
    }
}