package um.edu.demospringum.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class CardOwnerInfoDto {
    private Long clientId;
    private String name;
    private String surname;
    private String email;
    private String phone;
    private List<String> addresses;

    private String cardHolderName;
    private String cardNumber;
    private String expirationDate;
    private String cardBrand;

}