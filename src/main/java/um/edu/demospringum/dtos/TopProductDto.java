package um.edu.demospringum.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopProductDto {
    private Long productId;
    private String productType;
    private Long count;

    // pizza
    private String dough;
    private String size;
    private String sauce;
    private String pizzaCheese;

    // burger
    private String meat;
    private String bread;
    private String burgerCheese;


}
