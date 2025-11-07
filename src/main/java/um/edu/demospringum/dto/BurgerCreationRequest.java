package um.edu.demospringum.dto;

import lombok.Data;
import java.util.List;

@Data
public class BurgerCreationRequest {
    private Long breadId;
    private Long meatId;
    private List<Long> toppingIds;  // Incluye quesos y vegetales
    private List<Long> dressingIds; // Salsas
}