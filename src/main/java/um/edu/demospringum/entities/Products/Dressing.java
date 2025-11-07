package um.edu.demospringum.entities.Products;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "dressing")
public class Dressing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dressingId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;
}