package um.edu.demospringum.controllers.ingredientControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/breads")
@CrossOrigin(origins = "*")
public class BreadController {

    private IngredientService ingredientService;

    @Autowired
    public BreadController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public ResponseEntity<List<IngredientsDto>> listBreads() {
        return ResponseEntity.ok(ingredientService.listBreads());
    }

    @PostMapping("/create")
    public ResponseEntity<Bread> addBread(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        System.out.println("POST /api/breads/create llamado con: " + dto.getType());
        Bread newBread = ingredientService.addBread(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newBread);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateBreadAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        ingredientService.updateAvailabilityBread(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateBreadPrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        ingredientService.updatePriceBread(type, price);
        return ResponseEntity.noContent().build();
    }
}
