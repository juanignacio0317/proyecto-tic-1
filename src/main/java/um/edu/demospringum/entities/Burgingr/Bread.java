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
@Table(name = "bread")

public class Bread implements Serializable, Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int breadId;

    @Column(nullable = false)
    private String typeBread;

    @Column(nullable = false)
    private boolean breadAvailability;

    @Column(nullable = false, scale = 2)
    private BigDecimal breadPrice;


    @Override
    public int getId() {
        return this.breadId;
    }

    @OneToMany
    private List<Burger> burgers;

    public String getType(){
        return typeBread;
    }

    public boolean getAvailability(){
        return breadAvailability;
    }

    public BigDecimal getPrice(){
        return breadPrice;
    }

}