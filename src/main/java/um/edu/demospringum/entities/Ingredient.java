package um.edu.demospringum.entities;

import java.math.BigDecimal;

public interface Ingredient {
    String getType();
    boolean getAvailability();
    BigDecimal getPrice();
}