package um.edu.demospringum.entities;

import jakarta.persistence.*;
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

    //forzamos que el role siempre sea ADMIN
    @PrePersist
    @PreUpdate
    public void ensureAdminRole() {

        super.setRole("ADMIN");
        this.role = "ADMIN";
    }
}