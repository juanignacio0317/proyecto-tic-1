package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.entities.Burgingr.*;
import um.edu.demospringum.entities.PizzaIngr.*;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.repositories.ingredientesRepo.*;
import um.edu.demospringum.repositories.productsRepo.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/init-data")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@PreAuthorize("hasRole('ADMIN')")
public class DataInitializationController {

    @Autowired
    private BreadRepository breadRepository;

    @Autowired
    private MeatRepository meatRepository;

    @Autowired
    private CheeseRepository cheeseRepository;

    @Autowired
    private ToppingRepository toppingRepository;

    @Autowired
    private DressingRepository dressingRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private DoughRepository doughRepository;

    @Autowired
    private SauceRepository sauceRepository;

    @Autowired
    private BeverageRepository beverageRepository;

    @Autowired
    private SideOrderRepository sideOrderRepository;

    @PostMapping("/breads")
    public ResponseEntity<?> initBreads() {
        try {
            String[][] breadsData = {
                    {"Pan de Papa", "40.00"},
                    {"Pan Integral", "45.00"},
                    {"Pan Sin Gluten", "60.00"},
                    {"Pan Brioche", "50.00"}
            };

            int created = 0;
            for (String[] data : breadsData) {
                if (!breadRepository.findByTypeBreadIgnoreCase(data[0]).isPresent()) {
                    Bread bread = new Bread();
                    bread.setTypeBread(data[0]);
                    bread.setBreadPrice(new BigDecimal(data[1]));
                    bread.setBreadAvailability(true);
                    breadRepository.save(bread);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Panes predeterminados cargados");
            response.put("created", created);
            response.put("total", breadsData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/meats")
    public ResponseEntity<?> initMeats() {
        try {
            String[][] meatsData = {
                    {"Carne de Vaca", "100.00"},
                    {"Pollo", "80.00"},
                    {"Cerdo", "90.00"},
                    {"Salmón", "120.00"},
                    {"Lentejas", "70.00"},
                    {"Soja", "75.00"}
            };

            int created = 0;
            for (String[] data : meatsData) {
                if (!meatRepository.findByTypeMeatIgnoreCase(data[0]).isPresent()) {
                    Meat meat = new Meat();
                    meat.setTypeMeat(data[0]);
                    meat.setMeatPrice(new BigDecimal(data[1]));
                    meat.setMeatAvailability(true);
                    meatRepository.save(meat);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Carnes predeterminadas cargadas");
            response.put("created", created);
            response.put("total", meatsData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/cheeses")
    public ResponseEntity<?> initCheeses() {
        try {
            String[][] cheesesData = {
                    {"Cheddar", "50.00"},
                    {"Muzzarella", "45.00"},
                    {"Azul", "60.00"},
                    {"Suizo", "55.00"}
            };

            int created = 0;
            for (String[] data : cheesesData) {
                if (!cheeseRepository.findByTypeCheeseIgnoreCase(data[0]).isPresent()) {
                    Cheese cheese = new Cheese();
                    cheese.setTypeCheese(data[0]);
                    cheese.setCheesePrice(new BigDecimal(data[1]));
                    cheese.setCheeseAvailability(true);
                    cheeseRepository.save(cheese);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Quesos predeterminados cargados");
            response.put("created", created);
            response.put("total", cheesesData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/toppings")
    public ResponseEntity<?> initToppings() {
        try {
            String[][] toppingsData = {
                    {"Lechuga", "20.00"},
                    {"Tomate", "25.00"},
                    {"Cebolla", "20.00"},
                    {"Pepino", "25.00"},
                    {"Bacon", "60.00"},
                    {"Huevo Frito", "40.00"},
                    {"Champiñones", "45.00"},
                    {"Jalapeños", "35.00"},
                    {"Cebolla Caramelizada", "40.00"},
                    {"Aguacate", "55.00"}
            };

            int created = 0;
            for (String[] data : toppingsData) {
                if (!toppingRepository.findByTypeTopping(data[0]).isPresent()) {
                    Topping topping = new Topping();
                    topping.setTypeTopping(data[0]);
                    topping.setToppingPrice(new BigDecimal(data[1]));
                    topping.setToppingAvailability(true);
                    toppingRepository.save(topping);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Toppings predeterminados cargados");
            response.put("created", created);
            response.put("total", toppingsData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/dressings")
    public ResponseEntity<?> initDressings() {
        try {
            String[][] dressingsData = {
                    {"Mayonesa", "15.00"},
                    {"Ketchup", "15.00"},
                    {"Mostaza", "15.00"},
                    {"Salsa BBQ", "20.00"},
                    {"Alioli", "25.00"},
                    {"Salsa Especial", "30.00"},
                    {"Ranch", "25.00"},
                    {"Chimichurri", "25.00"}
            };

            int created = 0;
            for (String[] data : dressingsData) {
                if (!dressingRepository.findByTypeDressing(data[0]).isPresent()) {
                    Dressing dressing = new Dressing();
                    dressing.setTypeDressing(data[0]);
                    dressing.setDressingPrice(new BigDecimal(data[1]));
                    dressing.setDressingAvailability(true);
                    dressingRepository.save(dressing);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Aderezos predeterminados cargados");
            response.put("created", created);
            response.put("total", dressingsData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/sizes")
    public ResponseEntity<?> initSizes() {
        try {
            String[][] sizesData = {
                    {"Pequeña", "200.00"},
                    {"Mediana", "300.00"},
                    {"Grande", "400.00"}
            };

            int created = 0;
            for (String[] data : sizesData) {
                if (!sizeRepository.findByTypeSizeIgnoreCase(data[0]).isPresent()) {
                    Size size = new Size();
                    size.setTypeSize(data[0]);
                    size.setSizePrice(new BigDecimal(data[1]));
                    size.setSizeAvailability(true);
                    sizeRepository.save(size);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tamaños predeterminados cargados");
            response.put("created", created);
            response.put("total", sizesData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/doughs")
    public ResponseEntity<?> initDoughs() {
        try {
            String[][] doughsData = {
                    {"Napolitana", "50.00"},
                    {"Integral", "60.00"},
                    {"Sin Gluten", "80.00"}
            };

            int created = 0;
            for (String[] data : doughsData) {
                if (!doughRepository.findByTypeDoughIgnoreCase(data[0]).isPresent()) {
                    Dough dough = new Dough();
                    dough.setTypeDough(data[0]);
                    dough.setDoughPrice(new BigDecimal(data[1]));
                    dough.setDoughAvailability(true);
                    doughRepository.save(dough);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Masas predeterminadas cargadas");
            response.put("created", created);
            response.put("total", doughsData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/sauces")
    public ResponseEntity<?> initSauces() {
        try {
            String[][] saucesData = {
                    {"Tomate", "30.00"},
                    {"Pomodoro", "40.00"},
                    {"Cuatro Quesos", "50.00"},
                    {"Blanca", "45.00"}
            };

            int created = 0;
            for (String[] data : saucesData) {
                if (!sauceRepository.findByTypeSauceIgnoreCase(data[0]).isPresent()) {
                    Sauce sauce = new Sauce();
                    sauce.setTypeSauce(data[0]);
                    sauce.setSaucePrice(new BigDecimal(data[1]));
                    sauce.setSauceAvailability(true);
                    sauceRepository.save(sauce);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Salsas predeterminadas cargadas");
            response.put("created", created);
            response.put("total", saucesData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/beverages")
    public ResponseEntity<?> initBeverages() {
        try {
            String[][] beveragesData = {
                    {"Coca Cola", "50.00"},
                    {"Coca Cola Zero", "50.00"},
                    {"Sprite", "50.00"},
                    {"Fanta", "50.00"},
                    {"Agua Mineral", "30.00"},
                    {"Cerveza", "80.00"}
            };

            int created = 0;
            for (String[] data : beveragesData) {
                if (!beverageRepository.findByTypeBeverageIgnoreCase(data[0]).isPresent()) {
                    Beverage beverage = new Beverage();
                    beverage.setTypeBeverage(data[0]);
                    beverage.setBeveragePrice(new BigDecimal(data[1]));
                    beverage.setBeverageAvailability(true);
                    beverageRepository.save(beverage);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bebidas predeterminadas cargadas");
            response.put("created", created);
            response.put("total", beveragesData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/sideorders")
    public ResponseEntity<?> initSideOrders() {
        try {
            String[][] sideOrdersData = {
                    {"Papas Fritas", "80.00"},
                    {"Aros de Cebolla", "90.00"},
                    {"Nuggets", "100.00"},
                    {"Ensalada", "70.00"}
            };

            int created = 0;
            for (String[] data : sideOrdersData) {
                if (!sideOrderRepository.findByTypeSideOrderIgnoreCase(data[0]).isPresent()) {
                    SideOrder sideOrder = new SideOrder();
                    sideOrder.setTypeSideOrder(data[0]);
                    sideOrder.setSideOrderPrice(new BigDecimal(data[1]));
                    sideOrder.setSideOrderAvailability(true);
                    sideOrderRepository.save(sideOrder);
                    created++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Acompañamientos predeterminados cargados");
            response.put("created", created);
            response.put("total", sideOrdersData.length);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}