package um.edu.demospringum.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentMethodRequestDto {
    private String cardHolderName;
    private String cardNumber;
    private String expirationDate;
    private String cardBrand;
    private String cvv;
}