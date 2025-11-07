package um.edu.demospringum.repositories.ingredientesRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.Burgingr.Meat;

import java.util.Optional;

public interface MeatRepository extends JpaRepository<Meat, Integer> {
    Optional<Meat> findByTypeMeatIgnoreCase(String typeMeat);
}
