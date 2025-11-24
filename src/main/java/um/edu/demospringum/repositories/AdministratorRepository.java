package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import um.edu.demospringum.entities.Administrator;

import java.util.Optional;

public interface AdministratorRepository extends JpaRepository<Administrator, Long> {
    Optional<Administrator> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("SELECT COUNT(a) FROM Administrator a")
    long countAllAdministrators();
}