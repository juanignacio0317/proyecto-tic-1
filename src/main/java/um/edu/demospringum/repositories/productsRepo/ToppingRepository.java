package um.edu.demospringum.repositories.productsRepo;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.Products.Topping;

import java.util.Optional;

public interface ToppingRepository extends JpaRepository<Topping, Long> {

    public Optional<Topping> findByTypeTopping(String typeTopping);
}