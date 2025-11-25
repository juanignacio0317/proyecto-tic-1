package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.Burgingr.Meat;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.Beverage;
import um.edu.demospringum.entities.Products.SideOrder;
import um.edu.demospringum.entities.Products.Topping;
import um.edu.demospringum.entities.Products.Dressing;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;
import um.edu.demospringum.servicies.ProductService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/ingredients")
@CrossOrigin(origins = "*")
public class IngredientAdminController {

    @Autowired
    private IngredientService ingredientService;
    @Autowired
    private ProductService productService;

    // ==================== BREADS ====================

    @GetMapping("/breads")
    public ResponseEntity<List<IngredientsDto>> getAllBreads() {
        return ResponseEntity.ok(ingredientService.listBreads());
    }

    @PostMapping("/breads")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBread(@RequestBody IngredientsDto dto) {
        try {
            Bread newBread = ingredientService.addBread(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newBread);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el pan: " + e.getMessage());
        }
    }

    @PutMapping("/breads/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBreadAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            ingredientService.updateAvailabilityBread(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/breads/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBreadPrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            ingredientService.updatePriceBread(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== MEATS ====================

    @GetMapping("/meats")
    public ResponseEntity<List<IngredientsDto>> getAllMeats() {
        return ResponseEntity.ok(ingredientService.listMeats());
    }

    @PostMapping("/meats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createMeat(@RequestBody IngredientsDto dto) {
        try {
            Meat newMeat = ingredientService.addMeat(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newMeat);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la carne: " + e.getMessage());
        }
    }

    @PutMapping("/meats/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMeatAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            ingredientService.updateAvailabilityMeat(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/meats/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMeatPrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            ingredientService.updatePriceMeat(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== CHEESES ====================

    @GetMapping("/cheeses")
    public ResponseEntity<List<IngredientsDto>> getAllCheeses() {
        return ResponseEntity.ok(ingredientService.listCheeses());
    }

    @PostMapping("/cheeses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCheese(@RequestBody IngredientsDto dto) {
        try {
            Cheese newCheese = ingredientService.addCheese(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newCheese);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el queso: " + e.getMessage());
        }
    }

    @PutMapping("/cheeses/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCheeseAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            ingredientService.updateAvailabilityCheese(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/cheeses/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCheesePrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            ingredientService.updatePriceCheese(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== TOPPINGS ====================

    @GetMapping("/toppings")
    public ResponseEntity<List<IngredientsDto>> getAllToppings() {
        return ResponseEntity.ok(productService.listToppings());
    }

    @PostMapping("/toppings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTopping(@RequestBody IngredientsDto dto) {
        try {
            Topping newTopping = productService.addTopping(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newTopping);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el topping: " + e.getMessage());
        }
    }

    @PutMapping("/toppings/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateToppingAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            productService.updateAvailabilityTopping(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/toppings/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateToppingPrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            productService.updatePriceTopping(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== DRESSINGS (SALSAS) ====================

    @GetMapping("/dressings")
    public ResponseEntity<List<IngredientsDto>> getAllDressings() {
        return ResponseEntity.ok(productService.listDressings());
    }

    @PostMapping("/dressings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createDressing(@RequestBody IngredientsDto dto) {
        try {
            Dressing newDressing = productService.addDressing(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newDressing);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la salsa: " + e.getMessage());
        }
    }

    @PutMapping("/dressings/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDressingAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            productService.updateAvailabilityDressing(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/dressings/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDressingPrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            productService.updatePriceDressing(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== SIZES (TAMAÑOS) ====================

    @GetMapping("/sizes")
    public ResponseEntity<List<IngredientsDto>> getAllSizes() {
        return ResponseEntity.ok(ingredientService.listSizes());
    }

    @PostMapping("/sizes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSize(@RequestBody IngredientsDto dto) {
        try {
            Size newSize = ingredientService.addSize(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newSize);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el tamaño: " + e.getMessage());
        }
    }

    @PutMapping("/sizes/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSizeAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            ingredientService.updateAvailabilitySize(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/sizes/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSizePrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            ingredientService.updatePriceSize(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

// ==================== DOUGHS (MASAS) ====================

    @GetMapping("/doughs")
    public ResponseEntity<List<IngredientsDto>> getAllDoughs() {
        return ResponseEntity.ok(ingredientService.listDoughs());
    }

    @PostMapping("/doughs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createDough(@RequestBody IngredientsDto dto) {
        try {
            Dough newDough = ingredientService.addDough(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newDough);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la masa: " + e.getMessage());
        }
    }

    @PutMapping("/doughs/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDoughAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            ingredientService.updateAvailabilityDough(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/doughs/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDoughPrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            ingredientService.updatePriceDough(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

// ==================== SAUCES (SALSAS DE PIZZA) ====================

    @GetMapping("/sauces")
    public ResponseEntity<List<IngredientsDto>> getAllSauces() {
        return ResponseEntity.ok(ingredientService.listSauces());
    }

    @PostMapping("/sauces")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSauce(@RequestBody IngredientsDto dto) {
        try {
            Sauce newSauce = ingredientService.addSauce(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newSauce);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la salsa: " + e.getMessage());
        }
    }

    @PutMapping("/sauces/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSauceAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            ingredientService.updateAvailabilitySauce(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/sauces/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSaucePrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            ingredientService.updatePriceSauce(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

// ==================== BEVERAGES (BEBIDAS) ====================

    @GetMapping("/beverages")
    public ResponseEntity<List<IngredientsDto>> getAllBeverages() {
        return ResponseEntity.ok(productService.listBeverages());
    }

    @PostMapping("/beverages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createBeverage(@RequestBody IngredientsDto dto) {
        try {
            Beverage newBeverage = productService.addBeverage(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newBeverage);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la bebida: " + e.getMessage());
        }
    }

    @PutMapping("/beverages/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBeverageAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            productService.updateAvailabilityBeverage(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/beverages/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBeveragePrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            productService.updatePriceBeverage(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

// ==================== SIDE ORDERS (ACOMPAÑAMIENTOS) ====================

    @GetMapping("/sideorders")
    public ResponseEntity<List<IngredientsDto>> getAllSideOrders() {
        return ResponseEntity.ok(productService.listSideOrders());
    }

    @PostMapping("/sideorders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSideOrder(@RequestBody IngredientsDto dto) {
        try {
            SideOrder newSideOrder = productService.addSideOrder(
                    dto.getType(),
                    dto.isAvailable(),
                    dto.getPrice()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newSideOrder);
        } catch (ExistingIngredient e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el acompañamiento: " + e.getMessage());
        }
    }

    @PutMapping("/sideorders/{type}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSideOrderAvailability(
            @PathVariable String type,
            @RequestParam boolean available) {
        try {
            productService.updateAvailabilitySideOrder(type, available);
            return ResponseEntity.ok().body("Disponibilidad actualizada");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/sideorders/{type}/price")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSideOrderPrice(
            @PathVariable String type,
            @RequestParam BigDecimal price) {
        try {
            productService.updatePriceSideOrder(type, price);
            return ResponseEntity.ok().body("Precio actualizado");
        } catch (IngredientNotFound e) {
            return ResponseEntity.notFound().build();
        }
    }
}
