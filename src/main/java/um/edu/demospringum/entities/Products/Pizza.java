package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;

@Entity
@Table(name = "pizza")
public class Pizza extends Product {

    @ManyToOne
    @JoinColumn(name = "doughId")
    private Dough pizzaDough;

    @ManyToOne
    @JoinColumn(name = "sizeId")
    private Size pizzaSize;

    @ManyToOne
    @JoinColumn(name = "sauceId")
    private Sauce pizzaSauce;


}
