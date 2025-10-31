package um.edu.demospringum.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "administrator")

public class Administrator extends UserData implements Serializable {

    @Column(nullable = false)
    private String role = "ADMIN";
}

