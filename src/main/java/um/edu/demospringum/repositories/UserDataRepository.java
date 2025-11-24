package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import um.edu.demospringum.entities.UserData;

import java.util.List;
import java.util.Optional;

public interface UserDataRepository extends JpaRepository<UserData, Long> {
    Optional<UserData> findByEmail(String email);
    Boolean existsByEmail(String email);
    long countByRole(String role);
    List<UserData> findByRole(String role);

    @Query("SELECT COUNT(u) FROM UserData u")
    long countAllUsers();
}