package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Products.Dressing;

public interface DressingRepository extends JpaRepository<Dressing, Long> {
}