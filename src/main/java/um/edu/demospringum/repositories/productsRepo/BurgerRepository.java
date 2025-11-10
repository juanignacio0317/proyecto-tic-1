package um.edu.demospringum.repositories.productsRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Products.Burger;

public interface BurgerRepository extends JpaRepository<Burger, Long> {
}