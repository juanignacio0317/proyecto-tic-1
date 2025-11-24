package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import um.edu.demospringum.entities.Client;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);

    Optional<Client> findById(long userId);
    @Query("SELECT COUNT(c) FROM Client c")
    long countAllClients();
}