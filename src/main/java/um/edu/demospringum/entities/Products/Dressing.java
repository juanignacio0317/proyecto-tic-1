package um.edu.demospringum.entities.Products;


import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "dressing")

public class Dressing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int dressingId;

    @Column(nullable = false)
    private String typeDressing;

    @Column(nullable = false, scale = 2)
    private BigDecimal dressingPrice;


}