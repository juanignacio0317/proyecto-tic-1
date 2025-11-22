package um.edu.demospringum.controllers.productControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.Products.Beverage;
import um.edu.demospringum.entities.Products.Topping;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;
import um.edu.demospringum.servicies.ProductService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/toppings")
public class ToppingController {

    private ProductService productService;

    @Autowired
    public ToppingController(IngredientService ingredientService) {
        this.productService = productService;
    }

    @GetMapping("/")
    public ResponseEntity<List<IngredientsDto>> listToppings() {
        return ResponseEntity.ok(productService.listToppings());
    }

    @PostMapping("/create")
    public ResponseEntity<Topping> addTopping(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        Topping newTopping = productService.addTopping(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newTopping);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateToppingAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        productService.updateAvailabilityTopping(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateToppingPrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        productService.updatePriceTopping(type, price);
        return ResponseEntity.noContent().build();
    }
}
