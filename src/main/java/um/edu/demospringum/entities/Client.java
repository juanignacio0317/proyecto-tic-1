package um.edu.demospringum.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "client")
public class Client extends UserData implements Serializable {
    @Column(name = "phone")
    private String phone;

    @ElementCollection
    @CollectionTable(name = "client_addresses", joinColumns = @JoinColumn(name = "client_id"))
    @Column(name = "address")
    private List<String> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Creation> creations;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClientOrder> orders;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentMethod> paymentMethods;
}