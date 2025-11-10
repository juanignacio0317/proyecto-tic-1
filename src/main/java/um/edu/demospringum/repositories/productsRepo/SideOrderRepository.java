package um.edu.demospringum.repositories.productsRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.SideOrder;

import java.util.Optional;

public interface SideOrderRepository extends JpaRepository<SideOrder, Long> {
    Optional<SideOrder> findByTypeSideOrderIgnoreCase(String typeSideOrder);
}
