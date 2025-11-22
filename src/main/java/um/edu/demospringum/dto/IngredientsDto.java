package um.edu.demospringum.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor  // Constructor vacío
@AllArgsConstructor // Constructor con todos los campos
public class IngredientsDto {

    private Integer id;
    private String type;
    private boolean available;
    private BigDecimal price;

    // Constructor sin ID (para crear nuevos)
    public IngredientsDto(String type, boolean available, BigDecimal price) {
        this.type = type;
        this.available = available;
        this.price = price;
    }

    // Constructor con ID (para listar existentes)
    public IngredientsDto(int id, String type, boolean available, BigDecimal price) {
        this.id = id;
        this.type = type;
        this.available = available;
        this.price = price;
    }
}