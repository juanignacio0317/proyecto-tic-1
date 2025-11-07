package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Products.Product;

public interface ProductRepository extends JpaRepository<String, Product> {
}
