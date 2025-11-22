package um.edu.demospringum.dto;


import um.edu.demospringum.entities.Products.Topping;

import java.time.LocalDateTime;
import java.util.List;

public class PizzaCreationRequest {

    private String dough;
    private String sauce;
    private String size;
    private String cheese;
    private List<String> toppings; // o List<Long> si los toppings se eligen por ID
    private Long userId;           // cliente que está creando la pizza
    private LocalDateTime orderDate;

    // Getters y setters
    public String getDough() { return dough; }
    public void setDough(String dough) { this.dough = dough; }

    public String getSauce() { return sauce; }
    public void setSauce(String sauce) { this.sauce = sauce; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getCheese() { return cheese; }
    public void setCheese(String cheese) { this.cheese = cheese; }

    public List<String> getToppings() { return toppings; }
    public void setToppings(List<String> toppings) { this.toppings = toppings; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
}

