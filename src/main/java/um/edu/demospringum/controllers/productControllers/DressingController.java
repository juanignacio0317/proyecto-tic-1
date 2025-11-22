package um.edu.demospringum.controllers.productControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.Products.Beverage;
import um.edu.demospringum.entities.Products.Dressing;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;
import um.edu.demospringum.servicies.ProductService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/dressings")
@CrossOrigin(origins = "*")
public class DressingController {
    @Autowired
    private ProductService productService;

    @Autowired
    public DressingController(IngredientService ingredientService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<IngredientsDto>> listDressings() {
        return ResponseEntity.ok(productService.listDressings());
    }

    @PostMapping("/create")
    public ResponseEntity<Dressing> addDressing(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        Dressing newDressing = productService.addDressing(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newDressing);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateDressingAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        productService.updateAvailabilityDressing(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateDressingPrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        productService.updatePriceDressing(type, price);
        return ResponseEntity.noContent().build();
    }
}
