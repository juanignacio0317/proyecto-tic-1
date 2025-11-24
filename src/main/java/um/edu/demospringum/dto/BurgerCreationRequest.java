package um.edu.demospringum.dto;

import lombok.Getter;
import um.edu.demospringum.entities.Products.Burger;
import um.edu.demospringum.entities.Products.Dressing;
import um.edu.demospringum.entities.Products.Topping;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.IngredientNotFound;

import java.time.LocalDateTime;
import java.util.List;

public class BurgerCreationRequest {

    private String bread;
    private String meat;
    private String cheese;
    private List<String> toppings;
    private List<String> dressings;
    private Long userId;
    private LocalDateTime orderDate;
    private Integer meatQuantity;

    public String getBread() {return bread;}
    public void setBread(String bread) { this.bread = bread; }

    public String getMeat() { return meat; }
    public void setMeat(String meat) { this.meat = meat; }

    public String getCheese() { return cheese; }
    public void setCheese(String cheese) { this.cheese = cheese; }

    public List<String> getToppings() { return toppings; }
    public void setToppings(List<String> toppings) { this.toppings = toppings; }

    public List<String> getDressings() { return dressings; }
    public void setDressings(List<String> dressings) { this.dressings = dressings; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public Integer getMeatQuantity() { return meatQuantity; }
    public void setMeatQuantity(Integer meatQuantity) { this.meatQuantity = meatQuantity; }
}