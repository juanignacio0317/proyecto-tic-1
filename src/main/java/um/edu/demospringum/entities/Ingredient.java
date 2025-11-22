package um.edu.demospringum.entities;

import java.math.BigDecimal;

public interface Ingredient {
    Long getId();
    String getType();
    boolean getAvailability();
    BigDecimal getPrice();
}