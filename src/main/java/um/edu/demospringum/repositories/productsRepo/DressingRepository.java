package um.edu.demospringum.repositories.productsRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Products.Dressing;

import java.util.Optional;

public interface DressingRepository extends JpaRepository<Dressing, Long> {
    Optional<Dressing> findByTypeDressing(String typeDressing);

}