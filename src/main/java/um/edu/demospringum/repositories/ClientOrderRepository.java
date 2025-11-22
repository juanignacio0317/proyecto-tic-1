package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.ClientOrder;

import java.util.List;
import java.util.Optional;

public interface ClientOrderRepository extends JpaRepository<ClientOrder, Long> {
    Optional<ClientOrder> findById(Long id);
    List<ClientOrder> findByClient(Client client);
}
