package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.Burgingr.Meat;

@Getter
@Setter
@Entity
@Table(name = "burger")
public class Burger extends Product {

    @ManyToOne
    @JoinColumn(name = "breadId")
    private Bread burgerBread;

    @ManyToOne
    @JoinColumn(name = "meatId")
    private Meat burgerMeat;
}