package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "topping")

public class Topping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int toppingId;

    @Column(nullable = false)
    private String typeTopping;

    @Column(nullable = false, scale = 2)
    private BigDecimal toppingPrice;


}