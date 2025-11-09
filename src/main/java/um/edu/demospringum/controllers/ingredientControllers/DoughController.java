package um.edu.demospringum.controllers.ingredientControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/doughs")
public class DoughController {

    private IngredientService ingredientService;

    @Autowired
    public DoughController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("/")
    public ResponseEntity<List<IngredientsDto>> listdoughs() {
        return ResponseEntity.ok(ingredientService.listDoughs());
    }

    @PostMapping("/create")
    public ResponseEntity<Dough> addDough(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        Dough newDough = ingredientService.addDough(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newDough);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateDoughAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        ingredientService.updateAvailabilityDough(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateDoughPrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        ingredientService.updatePriceDough(type, price);
        return ResponseEntity.noContent().build();
    }
}
