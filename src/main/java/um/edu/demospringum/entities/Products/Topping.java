package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "topping")
public class Topping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long toppingId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // "VEGETAL", "CHEESE", etc.

    @Column(nullable = false)
    private double price;
}