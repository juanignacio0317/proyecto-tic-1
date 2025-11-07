package um.edu.demospringum.repositories.ingredientesRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.PizzaIngr.Sauce;

import java.util.Optional;

public interface SauceRepository extends JpaRepository<Sauce, Integer> {
    Optional<Sauce> findByTypeSauceIgnoreCase(String typeSauce);
}
