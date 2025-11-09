package um.edu.demospringum.controllers.ingredientControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.Burgingr.Meat;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/meats")
public class MeatController {

    private IngredientService ingredientService;

    @Autowired
    public MeatController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("/")
    public ResponseEntity<List<IngredientsDto>> listMeats() {
        return ResponseEntity.ok(ingredientService.listMeats());
    }

    @PostMapping("/create")
    public ResponseEntity<Meat> addMeat(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        Meat newMeat = ingredientService.addMeat(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newMeat);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateMeatAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        ingredientService.updateAvailabilityMeat(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateMeatPrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        ingredientService.updatePriceMeat(type, price);
        return ResponseEntity.noContent().build();
    }
}
