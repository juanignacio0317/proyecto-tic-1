package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.Creation;

import java.util.List;
import java.util.Optional;

public interface CreationRepository extends JpaRepository<Creation, Long> {

    List<Creation> findByClient(Client client);

    @Query(value = "SELECT * FROM creation WHERE client_id = :clientId AND product_id = :productId",
            nativeQuery = true)
    Optional<Creation> findByClientIdAndProductId(@Param("clientId") Long clientId,
                                                  @Param("productId") Long productId);

    List<Creation> findByClientAndFavouriteTrue(Client client);

    @Query(value = "SELECT * FROM creation WHERE client_id = :clientId",
            nativeQuery = true)
    List<Creation> findByClientId(@Param("clientId") Long clientId);
}