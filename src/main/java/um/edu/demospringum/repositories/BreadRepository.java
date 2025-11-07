package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Burgingr.Bread;

public interface BreadRepository extends JpaRepository<Bread, Long> {
}