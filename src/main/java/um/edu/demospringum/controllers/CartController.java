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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CartController {

    @Autowired
    private CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

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

    @PostMapping("/{clientId}/process")
    public ResponseEntity<?> processCart(
            @PathVariable Long clientId,
            @RequestBody ProcessCartRequest request) {
        try {
            if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La dirección es obligatoria");
            }

            if (request.getPaymentMethodId() == null) {
                return ResponseEntity.badRequest().body("El método de pago es obligatorio");
            }

            cartService.processCart(clientId, request.getAddress(), request.getPaymentMethodId());
            return ResponseEntity.ok("Pedido procesado exitosamente");
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (OrderNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar el carrito: " + e.getMessage());
        }
    }

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

    @GetMapping("/{clientId}/addresses")
    public ResponseEntity<?> getClientAddresses(@PathVariable Long clientId) {
        try {
            List<String> addresses = cartService.getClientAddresses(clientId);
            return ResponseEntity.ok(new AddressesResponse(addresses));
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener las direcciones: " + e.getMessage());
        }
    }

    public static class ProcessCartRequest {
        private String address;
        private Long paymentMethodId; // ← NUEVO

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public Long getPaymentMethodId() {
            return paymentMethodId;
        }

        public void setPaymentMethodId(Long paymentMethodId) {
            this.paymentMethodId = paymentMethodId;
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

    public static class AddressesResponse {
        private List<String> addresses;

        public AddressesResponse(List<String> addresses) {
            this.addresses = addresses;
        }

        public List<String> getAddresses() {
            return addresses;
        }

        public void setAddresses(List<String> addresses) {
            this.addresses = addresses;
        }
    }
}