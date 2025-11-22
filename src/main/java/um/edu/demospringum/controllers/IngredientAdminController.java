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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
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
}
