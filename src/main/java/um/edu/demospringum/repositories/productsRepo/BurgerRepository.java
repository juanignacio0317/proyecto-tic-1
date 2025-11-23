package um.edu.demospringum.repositories.productsRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.Burgingr.Meat;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.Burger;
import um.edu.demospringum.entities.Products.Pizza;

import java.util.Optional;

public interface BurgerRepository extends JpaRepository<Burger, Long> {

    // ✅ Usar findFirst para evitar error de múltiples resultados
    Optional<Burger> findFirstByBurgerBreadAndBurgerMeatAndBurgerCheese(
            Bread bread,
            Meat meat,
            Cheese cheese
    );
}