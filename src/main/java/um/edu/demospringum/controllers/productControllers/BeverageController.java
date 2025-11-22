package um.edu.demospringum.controllers.productControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.Products.Beverage;
import um.edu.demospringum.entities.Products.Product;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;
import um.edu.demospringum.servicies.ProductService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/beverages")
public class BeverageController {

    private ProductService productService;

    @Autowired
    public BeverageController(IngredientService ingredientService) {
        this.productService = productService;
    }

    @GetMapping("/")
    public ResponseEntity<List<IngredientsDto>> listBeverages() {
        return ResponseEntity.ok(productService.listBeverages());
    }

    @PostMapping("/create")
    public ResponseEntity<Beverage> addBeverage(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        Beverage newBeverage = productService.addBeverage(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newBeverage);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateBeverageAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        productService.updateAvailabilityBeverage(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateBeveragePrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        productService.updatePriceBeverage(type, price);
        return ResponseEntity.noContent().build();
    }
}
