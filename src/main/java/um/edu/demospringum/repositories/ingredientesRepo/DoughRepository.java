package um.edu.demospringum.repositories.ingredientesRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.PizzaIngr.Dough;

import java.util.Optional;

public interface DoughRepository extends JpaRepository<Dough, Integer> {
    Optional<Dough> findByTypeDoughIgnoreCase(String typeDough);
}
