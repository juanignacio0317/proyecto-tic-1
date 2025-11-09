package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import um.edu.demospringum.entities.PaymentMethod;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    // Puedes agregar métodos personalizados aquí si los necesitas
    // Por ejemplo:
    // List<PaymentMethod> findByUserId(Long userId);
}