package um.edu.demospringum.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import um.edu.demospringum.servicies.ProductsDataService;

@RestController
@RequestMapping("/stats/products")
public class ProductStatsController {

    private ProductsDataService productsDataService;

    public ProductStatsController(ProductsDataService productsDataService) {
        this.productsDataService = productsDataService;
    }

    @GetMapping("/top")
    public ResponseEntity<?> listTopProducts() {
        return ResponseEntity.ok(productsDataService.listTopProducts());
    }

    @GetMapping("/top/pizzas")
    public ResponseEntity<?> listTopPizzas() {
        return ResponseEntity.ok(productsDataService.listTopPizzas());
    }

    @GetMapping("/top/burgers")
    public ResponseEntity<?> listTopBurgers() {
        return ResponseEntity.ok(productsDataService.listTopBurgers());
    }
}
