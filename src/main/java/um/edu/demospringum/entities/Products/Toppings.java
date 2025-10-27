package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Toppings")

public class Toppings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int toppingId;

    @Column(nullable = false)
    private String typeTopping;


}