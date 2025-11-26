package um.edu.demospringum.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String surname;
    private String phone;
    private String address;
    private String email;
    private String password;


    private PaymentMethodDto paymentMethod;

    @Data
    public static class PaymentMethodDto {
        private String cardHolderName;
        private String cardNumber;
        private String cardBrand;
        private String expirationDate;

        private String cvv;
    }
}