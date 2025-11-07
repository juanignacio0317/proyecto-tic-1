package um.edu.demospringum.repositories.ingredientesRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.PizzaIngr.Size;

import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Integer> {
    Optional<Size> findByTypeSizeIgnoreCase(String typeSize);
}
