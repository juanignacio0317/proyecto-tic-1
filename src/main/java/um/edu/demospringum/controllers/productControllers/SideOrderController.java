package um.edu.demospringum.controllers.productControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dtos.IngredientsDto;
import um.edu.demospringum.entities.Products.Beverage;
import um.edu.demospringum.entities.Products.SideOrder;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.IngredientService;
import um.edu.demospringum.servicies.ProductService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/sideOrders")
public class SideOrderController {

    private ProductService productService;

    @Autowired
    public SideOrderController(IngredientService ingredientService) {
        this.productService = productService;
    }

    @GetMapping("/")
    public ResponseEntity<List<IngredientsDto>> listSideOrders() {
        return ResponseEntity.ok(productService.listSideOrders());
    }

    @PostMapping("/create")
    public ResponseEntity<SideOrder> addSideOrder(@RequestBody IngredientsDto dto) throws ExistingIngredient {
        SideOrder newSideOrder = productService.addSideOrder(dto.getType(), dto.isAvailable(), dto.getPrice());
        return ResponseEntity.ok(newSideOrder);
    }

    @PutMapping("/{type}/availability")
    public ResponseEntity<Void> updateSideOrderAvailability(@PathVariable String type, @RequestParam boolean available) throws IngredientNotFound {
        productService.updateAvailabilitySideOrder(type, available);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{type}/price")
    public ResponseEntity<Void> updateSideOrderPrice(@PathVariable String type, @RequestParam BigDecimal price) throws IngredientNotFound {
        productService.updatePriceSideOrder(type, price);
        return ResponseEntity.noContent().build();
    }
}
