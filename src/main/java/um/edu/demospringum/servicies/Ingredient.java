package um.edu.demospringum.servicies;


import java.math.BigDecimal;

public interface Ingredient {
    int getId();
    String getType();
    boolean getAvailability();
    BigDecimal getPrice();
    }

