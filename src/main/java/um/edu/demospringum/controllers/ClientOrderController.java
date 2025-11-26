package um.edu.demospringum.controllers;

import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.entities.ClientOrder;
import um.edu.demospringum.servicies.ProductsDataService;

import java.time.LocalDate;

//funciones de listar orders para el cliente y para el admin


@RestController
@RequestMapping("/orders")
public class ClientOrderController {

    private ProductsDataService productsDataService;

    public ClientOrderController(ProductsDataService productsDataService) {
        this.productsDataService = productsDataService;
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> listOrders(@PathVariable Long clientId) {
        return ResponseEntity.ok(productsDataService.listOrders(clientId));
    }

    @GetMapping("/client/{clientId}/between")
    public ResponseEntity<?> listOrdersBetweenDates(
            @PathVariable Long clientId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        return ResponseEntity.ok(
                productsDataService.listOrdersBetweenDates(clientId, startDate, endDate)
        );
    }

    @GetMapping("/all")
    public ResponseEntity<?> listClientOrders() {
        return ResponseEntity.ok(productsDataService.listClientOrders());
    }

    @GetMapping("/all/between")
    public ResponseEntity<?> listClientOrdersBetweenDates(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        return ResponseEntity.ok(
                productsDataService.listClientOrdersBetweenDates(startDate, endDate)
        );
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable ClientOrder orderId,
            @RequestParam String status
    ) {
        productsDataService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok("Order status updated");
    }
}
