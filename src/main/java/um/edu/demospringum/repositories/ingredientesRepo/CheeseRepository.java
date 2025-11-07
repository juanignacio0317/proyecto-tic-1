package um.edu.demospringum.repositories.ingredientesRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;

import java.util.Optional;

public interface CheeseRepository extends JpaRepository<Cheese, Integer> {
    Optional<Cheese> findByTypeCheeseIgnoreCase(String typeCheese);
}