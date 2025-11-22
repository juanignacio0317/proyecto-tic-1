package um.edu.demospringum.controllers.ingredientControllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/sizes")
@CrossOrigin(origins = "*")
public class SizeController {

    private IngredientService ingredientService;

    @Autowired
    public SizeController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public ResponseEntity<List<IngredientsDto>> listSizes() {
        return ResponseEntity.ok(ingredientService.listSizes());
    }

    @PostMapping("/create")
    public ResponseEntity<Size> addSize(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        Size newSize = ingredientService.addSize(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newSize);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateSizeAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        ingredientService.updateAvailabilitySize(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateSizePrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        ingredientService.updatePriceSize(type, price);
        return ResponseEntity.noContent().build();
    }
}
