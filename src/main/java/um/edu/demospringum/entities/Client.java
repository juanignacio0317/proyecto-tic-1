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
@Table(name = "clients")
public class Client extends User implements Serializable {

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentMethod> paymentMethods = new ArrayList<>();


    public void addAddress(Address address) {
        addresses.add(address);
        address.setClient(this);
    }

    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setClient(null);
    }

    public void addPaymentMethod(PaymentMethod method) {
        paymentMethods.add(method);
        method.setClient(this);
    }

    public void removePaymentMethod(PaymentMethod method) {
        paymentMethods.remove(method);
        method.setClient(null);
    }
}
