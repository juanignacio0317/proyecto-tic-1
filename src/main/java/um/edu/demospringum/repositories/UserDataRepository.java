package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.UserData;

import java.util.Optional;

public interface UserDataRepository extends JpaRepository<UserData, Long> {
    Optional<UserData> findByEmail(String email);
    Boolean existsByEmail(String email);
}