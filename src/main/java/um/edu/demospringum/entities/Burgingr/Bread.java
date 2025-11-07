package um.edu.demospringum.entities.Burgingr;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "bread")
public class Bread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long breadId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;
}