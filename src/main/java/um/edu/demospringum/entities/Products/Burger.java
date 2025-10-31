package um.edu.demospringum.entities.Products;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import um.edu.demospringum.entities.Burgingr.Bread;

@Entity
@Table(name = "burger")
public class Burger extends Product {


    @ManyToOne
    @JoinColumn(name = "breadId")
    private Bread burgerBread;

    @ManyToOne
    @JoinColumn(name = "meatId")
    private Bread burgermeat;

    }