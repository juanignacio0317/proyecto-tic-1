package um.edu.demospringum.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
public class AdminOrderDTO {
    private Long orderId;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private Long creationId;
    private String productType; // "PIZZA" o "BURGER"
    private LocalDateTime orderDate;

    // Ingredientes principales
    private String dough;
    private String sauce;
    private String size;
    private String bread;
    private String meat;
    private String cheese;

    // Extras
    private List<String> toppings;
    private List<String> dressings;
    private String beverage;
    private String sideOrder;

    // Precio y estado
    private BigDecimal totalPrice;
    private String orderAddress;
    private String orderStatus;
}