package um.edu.demospringum.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.servicies.ProductsDataService;


//funciones para listar las creations de un cliente y los favoritos


@RestController
@RequestMapping("/creations")
public class ListCreationsController {

    private ProductsDataService productsDataService;

    public ListCreationsController(ProductsDataService productDataService) {
        this.productsDataService = productDataService;
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<?> listCreations(@PathVariable Long clientId) {
        return ResponseEntity.ok(productsDataService.listCreations(clientId));
    }

    @GetMapping("/{clientId}/favourites")
    public ResponseEntity<?> listFavourites(@PathVariable Long clientId) {
        return ResponseEntity.ok(productsDataService.listFavourites(clientId));
    }

    @PutMapping("/{creationId}/favourite")
    public ResponseEntity<?> updateFavourite(
            @PathVariable Long creationId,
            @RequestParam boolean favourite,
            @PathVariable Long clientId
    ) {
        productsDataService.updateFavourite(creationId, favourite, clientId);
        return ResponseEntity.ok("Favourite updated");
    }

}
