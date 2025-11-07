package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Burgingr.Meat;

public interface MeatRepository extends JpaRepository<Meat, Long> {
}