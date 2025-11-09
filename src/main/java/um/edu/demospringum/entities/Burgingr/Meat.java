package um.edu.demospringum.entities.Burgingr;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.entities.Products.Burger;
import um.edu.demospringum.servicies.Ingredient;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "meat")

public class Meat implements Serializable, Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int meatId;

    @Column(nullable = false)
    private String typeMeat;

    @Column(nullable = false)
    private int meatQuantity;

    @Column(nullable = false)
    private boolean meatAvailability;

    @Column(nullable = false, scale = 2)
    private BigDecimal meatPrice;

    @OneToMany
    private List<Burger> burgers;


    public String getType(){
        return typeMeat;
    }

    public boolean getAvailability(){
        return meatAvailability;
    }

    public BigDecimal getPrice(){
        return meatPrice;
    }
}