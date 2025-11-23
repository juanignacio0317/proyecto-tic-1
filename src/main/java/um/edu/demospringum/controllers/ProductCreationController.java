package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.BurgerCreationRequest;
import um.edu.demospringum.dto.PizzaCreationRequest;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.servicies.CreationService;

@RestController
@RequestMapping("/api/create") 
@CrossOrigin(origins = "http://localhost:3000")
public class ProductCreationController {

    @Autowired
    private CreationService creationService;

    @PostMapping("/pizza")
    public ResponseEntity<?> createPizzaCreation(@RequestBody PizzaCreationRequest pizzaToCreate) {
        try {
            PizzaCreationRequest createdPizza = creationService.createPizza(pizzaToCreate);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPizza);
        } catch (IngredientNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ingredient not found: " + e.getMessage());
        } catch (ClientNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Client not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating pizza: " + e.getMessage());
        }
    }

    @PostMapping("/burger")
    public ResponseEntity<?> createBurgerCreation(@RequestBody BurgerCreationRequest burgerToCreate) {
        try {
            BurgerCreationRequest createdBurger = creationService.createBurger(burgerToCreate);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBurger);
        } catch (IngredientNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ingredient not found: " + e.getMessage());
        } catch (ClientNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Client not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating burger: " + e.getMessage());
        }
    }
}