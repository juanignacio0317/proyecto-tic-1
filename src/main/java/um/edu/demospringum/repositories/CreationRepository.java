package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.Creation;
import java.util.List;

public interface CreationRepository extends JpaRepository<Creation, Long> {
    List<Creation> findByClient(Client client);
}