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
@Table(name = "dressing")
public class Dressing  implements Serializable, Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dressingId;

    @Column(nullable = false)
    private String typeDressing;

    @Column(nullable = false, scale = 2)
    private BigDecimal dressingPrice;


    @Column(nullable = false)
    private boolean dressingAvailability;

    @Override
    public int getId() {
        return this.dressingId;
    }



    public String getType(){
        return typeDressing;
    }

    public boolean getAvailability(){
        return dressingAvailability;
    }

    public BigDecimal getPrice(){
        return dressingPrice;
    }
}