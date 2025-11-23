package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.CreationItemDTO;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.servicies.UserCreationService;

import java.util.List;

@RestController
@RequestMapping("/api/creations")
@CrossOrigin(origins = "http://localhost:3000")
public class UserCreationController {

    @Autowired
    private UserCreationService userCreationService;

    public UserCreationController(UserCreationService userCreationService) {
        this.userCreationService = userCreationService;
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserCreations(@PathVariable Long userId) {
        try {
            List<CreationItemDTO> creations = userCreationService.getUserCreations(userId);
            return ResponseEntity.ok(creations);
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener creaciones: " + e.getMessage());
        }
    }


    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<?> getUserFavoriteCreations(@PathVariable Long userId) {
        try {
            List<CreationItemDTO> creations = userCreationService.getUserFavoriteCreations(userId);
            return ResponseEntity.ok(creations);
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener creaciones favoritas: " + e.getMessage());
        }
    }


    @PostMapping("/{creationId}/favorite")
    public ResponseEntity<?> toggleFavorite(
            @PathVariable Long creationId,
            @RequestParam Long userId) {
        try {
            userCreationService.toggleFavourite(userId, creationId);
            return ResponseEntity.ok("Estado de favorito actualizado");
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (OrderNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al actualizar favorito: " + e.getMessage());
        }
    }


    @PostMapping("/{creationId}/add-to-cart")
    public ResponseEntity<?> addToCart(
            @PathVariable Long creationId,
            @RequestParam Long userId) {
        try {
            userCreationService.addCreationToCart(userId, creationId);
            return ResponseEntity.ok("Creación agregada al carrito");
        } catch (ClientNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (OrderNotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al agregar al carrito: " + e.getMessage());
        }
    }
}