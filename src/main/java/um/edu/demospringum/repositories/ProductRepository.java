package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import um.edu.demospringum.entities.Products.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}