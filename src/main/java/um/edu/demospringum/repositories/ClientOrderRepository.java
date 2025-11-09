package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import um.edu.demospringum.entities.ClientOrder;

import java.time.LocalDateTime;
import java.util.List;

public interface ClientOrderRepository extends JpaRepository<ClientOrder, Long> {

}