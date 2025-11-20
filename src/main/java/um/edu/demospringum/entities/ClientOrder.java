package um.edu.demospringum.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.entities.Products.Beverage;
import um.edu.demospringum.entities.Products.SideOrder;

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
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private String orderStatus;

    @Column
    private String orderAddress;


    @ManyToOne
    @JoinColumn(name = "beverageId")
    private Beverage beverage;

    @ManyToOne
    @JoinColumn(name = "sideOrderId")
    private SideOrder sideOrder;



}