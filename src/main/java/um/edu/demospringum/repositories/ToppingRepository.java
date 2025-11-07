package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Products.Topping;

public interface ToppingRepository extends JpaRepository<Topping, Long> {
}