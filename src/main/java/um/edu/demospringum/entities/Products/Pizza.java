package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;


@Entity
@Table(name = "pizza")

@Getter
@Setter
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

    @ManyToOne
    @JoinColumn(name = "cheeseId")
    private Cheese pizzaCheese;


}
