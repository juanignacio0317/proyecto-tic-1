package um.edu.demospringum.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Client")
public class Client extends User implements Serializable {


    private String addresses;              //uso tad?

    @OneToMany(mappedBy = "Client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Creations> creations;

    private List<Order> orders;

}
