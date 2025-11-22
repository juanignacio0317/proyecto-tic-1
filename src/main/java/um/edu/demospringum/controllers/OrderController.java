package um.edu.demospringum.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.servicies.CreationService;

@RestController
@RequestMapping("/order")
public class OrderController {

    private CreationService creationService;

    public OrderController(CreationService creationService) {
        this.creationService = creationService;
    }

    @PostMapping("/{orderId}/beverage")
    public ResponseEntity<?> addBeverage(
            @PathVariable Long orderId,
            @RequestParam String beverage) {

        creationService.addBeverage(orderId, beverage);
        return ResponseEntity.ok("Beverage added");
    }

    @PostMapping("/{orderId}/sideorder")
    public ResponseEntity<?> addSideOrder(
            @PathVariable Long orderId,
            @RequestParam String sideOrder) {

        creationService.addSideOrder(orderId, sideOrder);
        return ResponseEntity.ok("Side order added");
    }

    @PostMapping("/{orderId}/address")
    public ResponseEntity<?> setOrderAddress(
            @PathVariable Long orderId,
            @RequestParam String address) {

        creationService.selectOrderAddress(orderId, address);
        return ResponseEntity.ok("Address chosen");
    }
}
