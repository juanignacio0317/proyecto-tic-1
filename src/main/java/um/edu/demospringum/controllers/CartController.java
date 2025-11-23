package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.CartItemDTO;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.servicies.CartService;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Obtener todos los items del carrito de un cliente
     * GET /api/cart/{clientId}
     */
    @GetMapping("/{clientId}")
    public ResponseEntity<?> getCart(@PathVariable Long clientId) {
        try {
            List<CartItemDTO> cartItems = cartService.getCartItems(clientId);
            return ResponseEntity.ok(cartItems);
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener el carrito: " + e.getMessage());
        }
    }

    /**
     * Procesar el carrito (confirmar pedido)
     * POST /api/cart/{clientId}/process
     * Body: { "address": "Calle 123, Montevideo" }
     */
    @PostMapping("/{clientId}/process")
    public ResponseEntity<?> processCart(
            @PathVariable Long clientId,
            @RequestBody ProcessCartRequest request) {
        try {
            if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La dirección es obligatoria");
            }

            cartService.processCart(clientId, request.getAddress());
            return ResponseEntity.ok("Pedido procesado exitosamente");
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (OrderNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar el carrito: " + e.getMessage());
        }
    }

    /**
     * Eliminar un item del carrito
     * DELETE /api/cart/item/{orderId}
     */
    @DeleteMapping("/item/{orderId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long orderId) {
        try {
            cartService.removeFromCart(orderId);
            return ResponseEntity.ok("Item eliminado del carrito");
        } catch (OrderNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar del carrito: " + e.getMessage());
        }
    }

    /**
     * Obtener la dirección del cliente
     * GET /api/cart/{clientId}/address
     */
    @GetMapping("/{clientId}/address")
    public ResponseEntity<?> getClientAddress(@PathVariable Long clientId) {
        try {
            String address = cartService.getClientAddress(clientId);
            return ResponseEntity.ok(new AddressResponse(address));
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener la dirección: " + e.getMessage());
        }
    }

    // Clases internas para requests/responses
    public static class ProcessCartRequest {
        private String address;

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    public static class AddressResponse {
        private String address;

        public AddressResponse(String address) {
            this.address = address;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }
}