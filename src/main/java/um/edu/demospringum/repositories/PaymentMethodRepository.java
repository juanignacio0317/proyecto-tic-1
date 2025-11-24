package um.edu.demospringum.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import um.edu.demospringum.entities.PaymentMethod;

import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    Optional<PaymentMethod> findByCardNumber(String cardNumber);
    List<PaymentMethod> findAllByCardNumber(String cardNumber);
}