package um.edu.demospringum.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import um.edu.demospringum.entities.Products.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "creation")

@Getter
@Setter
public class Creation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long creationId;

    @ManyToOne
    @JoinColumn(name = "clientId")
    private Client client;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "productId")
    private Product product;


    @ManyToMany
    @JoinTable(
            name = "creation_toppings",
            joinColumns = @JoinColumn(name = "creation_id"),
            inverseJoinColumns = @JoinColumn(name = "topping_id")
    )
    private List<Topping> toppings = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "creation_dressings",
            joinColumns = @JoinColumn(name = "creation_id"),
            inverseJoinColumns = @JoinColumn(name = "dressing_id")
    )
    private List<Dressing> dressings = new ArrayList<>();


    @Column(nullable = false)
    private LocalDateTime creationDate;

    @Column(nullable = false)
    private boolean favourite = false;

    @OneToMany(mappedBy = "creation")
    private List<ClientOrder> orders;


}