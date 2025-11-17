package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.Creation;
import um.edu.demospringum.entities.Products.Burger;
import um.edu.demospringum.entities.Products.Pizza;

import java.util.List;
import java.util.Optional;

public interface CreationRepository extends JpaRepository<Creation, Long> {
    List<Creation> findByClient(Client client);

    Optional<Creation> findByUserIdAndPizza(Long userId, Pizza pizza);
    Optional<Creation> findByUserIdAndBurger(Long userId, Burger burger);

}