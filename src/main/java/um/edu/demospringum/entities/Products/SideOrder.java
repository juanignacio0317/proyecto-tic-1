package um.edu.demospringum.entities.Products;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.servicies.Ingredient;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "side_order")

@Getter
@Setter
public class SideOrder implements Serializable, Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sideOrderId;

    @Column(nullable = false)
    private String typeSideOrder;

    @Column(nullable = false)
    private boolean sideOrderAvailability;

    @Column(nullable = false, scale = 2)
    private BigDecimal sideOrderPrice;

    @Override
    public int getId() {
        return this.sideOrderId;
    }
    public String getType(){
        return typeSideOrder;
    }

    public boolean getAvailability(){
        return sideOrderAvailability;
    }

    public BigDecimal getPrice(){
        return sideOrderPrice;
    }


}
