package um.edu.demospringum.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentMethodResponseDto {
    private Long idPM;
    private String cardHolderName;
    private String cardNumber; // Los últimos 4 dígitos
    private String expirationDate;
    private String cardBrand;
}