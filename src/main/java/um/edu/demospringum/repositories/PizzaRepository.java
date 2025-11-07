package um.edu.demospringum.repositories;

import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.Pizza;

import java.util.Optional;

public interface PizzaRepository extends ProductRepository {
    Optional<Pizza> findByDoughAndSauceAndSizeAndCheese(Dough dough, Sauce sauce, Size size, Cheese cheese);
}