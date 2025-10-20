package um.edu.demospringum.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "Client")
public class Client extends User implements Serializable {


    private String addresses;              //uso tad?
}
