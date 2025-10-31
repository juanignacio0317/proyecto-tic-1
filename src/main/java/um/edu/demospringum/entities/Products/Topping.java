package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;

@Entity
@Table(name = "topping")

public class Topping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int toppingId;

    @Column(nullable = false)
    private String typeTopping;


}