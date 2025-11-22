package um.edu.demospringum.repositories.productsRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.Beverage;

import java.util.Optional;

public interface BeverageRepository extends JpaRepository<Beverage, Long> {
    Optional<Beverage> findByTypeBeverageIgnoreCase(String typeBeverage);
}
