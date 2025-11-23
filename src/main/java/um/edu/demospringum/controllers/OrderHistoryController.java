package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.OrderHistoryDTO;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.servicies.OrderHistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderHistoryController {

    @Autowired
    private OrderHistoryService orderHistoryService;

    public OrderHistoryController(OrderHistoryService orderHistoryService) {
        this.orderHistoryService = orderHistoryService;
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        try {
            List<OrderHistoryDTO> orders = orderHistoryService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener pedidos: " + e.getMessage());
        }
    }


    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<?> getUserOrdersByStatus(
            @PathVariable Long userId,
            @PathVariable String status) {
        try {
            List<OrderHistoryDTO> orders = orderHistoryService.getUserOrdersByStatus(userId, status);
            return ResponseEntity.ok(orders);
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener pedidos: " + e.getMessage());
        }
    }


    @DeleteMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam Long userId) {
        try {
            orderHistoryService.cancelOrder(userId, orderId);
            return ResponseEntity.ok("Pedido cancelado exitosamente");
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (OrderNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al cancelar pedido: " + e.getMessage());
        }
    }
}