package um.edu.demospringum.servicies;


import java.math.BigDecimal;

public interface Ingredient {
    String getType();
    boolean getAvailability();
    BigDecimal getPrice();
    }

