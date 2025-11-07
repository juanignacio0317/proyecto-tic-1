package um.edu.demospringum.repositories.ingredientesRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Burgingr.Bread;

import java.util.Optional;

public interface BreadRepository extends JpaRepository<Bread, Integer> {
    Optional<Bread> findByTypeBreadIgnoreCase(String typeBread);
}
