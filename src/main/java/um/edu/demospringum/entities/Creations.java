package um.edu.demospringum.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "Creations")

public class Creations implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long UserId;

    @Column(nullable = false)
    private boolean celiac;

    @Column(nullable = false)
    private String notes;

    @Column(nullable = false, unique = true)
    private String number;

    @Column(nullable = false)
    private String city;
}