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
public class CreationItemDTO {
    private Long creationId;
    private Long productId;
    private String productType; // "PIZZA" o "BURGER"
    private LocalDateTime creationDate;
    private boolean favourite;


    private String dough;
    private String sauce;
    private String size;


    private String bread;
    private String meat;


    private String cheese;


    private List<String> toppings;
    private List<String> dressings;


    private BigDecimal basePrice;
    private BigDecimal totalPrice;


    private int orderCount;
}