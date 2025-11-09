package um.edu.demospringum.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "client_order")

@Getter
@Setter
public class ClientOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "clientId", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "creationId", nullable = false)
    private Creation creation;

    @Column(nullable = false)
    private LocalDateTime fechaPedido;

    @Column(nullable = false)
    private String status;
}