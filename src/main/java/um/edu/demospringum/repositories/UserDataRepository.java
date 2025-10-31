package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import um.edu.demospringum.entities.UserData;

public interface UserDataRepository extends JpaRepository<UserData, Long> {
}
