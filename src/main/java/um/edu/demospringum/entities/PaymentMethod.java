package um.edu.demospringum.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@Getter
@Setter
@Table(name = "payment_method")

public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPM;

    @Column(nullable = false)
    private String cardHolderName;

    @Column(nullable = false)
    private String cardNumber;

    @Column(nullable = false)
    private String expirationDate;

    @Column(nullable = false)
    private String cardBrand;


    @Column(nullable = false)
    private String cvv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}

