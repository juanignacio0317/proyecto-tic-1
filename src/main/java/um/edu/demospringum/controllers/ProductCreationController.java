package um.edu.demospringum.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import um.edu.demospringum.dto.BurgerCreationRequest;
import um.edu.demospringum.dto.PizzaCreationRequest;
import um.edu.demospringum.servicies.CreationService;


@RestController
@RequestMapping("/create")
public class ProductCreationController {

    private CreationService creationService;

    @PostMapping("/pizza")
    public ResponseEntity<?> createPizzaCreation(@RequestBody PizzaCreationRequest pizzaToCreate) {
        return ResponseEntity.ok(creationService.createPizza(pizzaToCreate));
    }

    @PostMapping("/burger")
    public ResponseEntity<?> createBurgerCreation(@RequestBody BurgerCreationRequest burgerToCreate) {
        return ResponseEntity.ok(creationService.createBurger(burgerToCreate));
    }

}