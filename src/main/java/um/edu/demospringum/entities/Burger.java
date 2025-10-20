package um.edu.demospringum.entities;

import java.io.Serializable;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Burger")
public class Burger extends Product {

}