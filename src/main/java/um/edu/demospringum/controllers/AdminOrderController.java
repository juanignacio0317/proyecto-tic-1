package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.AdminOrderDTO;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.servicies.AdminOrderService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminOrderController {

    @Autowired
    private AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }


    @GetMapping("/active")
    public ResponseEntity<?> getActiveOrders() {
        try {
            List<AdminOrderDTO> orders = adminOrderService.getActiveOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener pedidos: " + e.getMessage());
        }
    }


    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status) {
        try {
            List<AdminOrderDTO> orders = adminOrderService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener pedidos: " + e.getMessage());
        }
    }


    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateStatusRequest request) {
        try {
            if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El estado es obligatorio");
            }

            adminOrderService.updateOrderStatus(orderId, request.getStatus());
            return ResponseEntity.ok("Estado actualizado exitosamente");
        } catch (OrderNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al actualizar estado: " + e.getMessage());
        }
    }


    @PostMapping("/{orderId}/advance")
    public ResponseEntity<?> advanceOrderStatus(@PathVariable Long orderId) {
        try {
            // Obtener el pedido actual
            List<AdminOrderDTO> allOrders = adminOrderService.getActiveOrders();
            AdminOrderDTO order = allOrders.stream()
                    .filter(o -> o.getOrderId().equals(orderId))
                    .findFirst()
                    .orElseThrow(() -> new OrderNotFound("Order not found"));

            // Obtener el siguiente estado
            String nextStatus = adminOrderService.getNextStatus(order.getOrderStatus());

            if (nextStatus == null) {
                return ResponseEntity.badRequest().body("No hay siguiente estado disponible");
            }


            adminOrderService.updateOrderStatus(orderId, nextStatus);
            return ResponseEntity.ok("Pedido avanzado a: " + nextStatus);
        } catch (OrderNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al avanzar pedido: " + e.getMessage());
        }
    }


    public static class UpdateStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}