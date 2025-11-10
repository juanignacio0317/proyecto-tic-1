package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.ClientOrder;

public interface ClientOrderRepository extends JpaRepository<ClientOrder, Long> {
}
