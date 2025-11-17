package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.ClientOrder;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.Pizza;

import java.util.Optional;

public interface ClientOrderRepository extends JpaRepository<ClientOrder, Long> {
    Optional<ClientOrder> findByClientOrderId(Long clientOrderId);
}
