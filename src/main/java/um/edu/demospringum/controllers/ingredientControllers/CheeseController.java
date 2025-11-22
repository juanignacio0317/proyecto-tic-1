package um.edu.demospringum.controllers.ingredientControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cheeses")
@CrossOrigin(origins = "*")
public class CheeseController {

    @Autowired
    private IngredientService ingredientService;

    public CheeseController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public ResponseEntity<List<IngredientsDto>> listCheeses() {
        return ResponseEntity.ok(ingredientService.listCheeses());
    }

    @PostMapping("/create")
    public ResponseEntity<Cheese> addCheese(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        Cheese newCheese = ingredientService.addCheese(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newCheese);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateCheeseAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        ingredientService.updateAvailabilityCheese(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateCheesePrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        ingredientService.updatePriceCheese(type, price);
        return ResponseEntity.noContent().build();
    }
}