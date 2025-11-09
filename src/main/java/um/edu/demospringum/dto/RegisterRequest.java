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

    // Datos del método de pago
    private PaymentMethodDto paymentMethod;

    @Data
    public static class PaymentMethodDto {
        private String cardHolderName;
        private String cardNumber; // Número completo (lo procesaremos en el backend)
        private String cardBrand; // "Visa" o "Mastercard"
        private String expirationDate; // MM/YY
        // CVV no se guarda, solo se valida
        private String cvv;
    }
}