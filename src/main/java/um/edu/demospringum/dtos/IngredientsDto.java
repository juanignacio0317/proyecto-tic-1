package um.edu.demospringum.dtos;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
public class IngredientsDto {

    private String type;
    private boolean available;
    private BigDecimal price;

    public IngredientsDto(String type, boolean available, BigDecimal price) {
        this.type = type;
        this.available = available;
        this.price = price;
    }
}
