package um.edu.demospringum.repositories.productsRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Products.Product;

public interface ProductRepository extends JpaRepository<Product, String> {
}
