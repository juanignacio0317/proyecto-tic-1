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
public class OrderHistoryDTO {
    private Long orderId;
    private Long creationId;
    private String productType;
    private LocalDateTime orderDate;
    private String orderStatus;
    private String orderAddress;

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

    // Precio
    private BigDecimal totalPrice;

    // Información adicional
    private boolean canCancel; // Solo si está "in queue"
}