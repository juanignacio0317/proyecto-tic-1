package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.BurgerCreationRequest;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.Creation;
import um.edu.demospringum.entities.Products.Burger;
import um.edu.demospringum.entities.Products.Dressing;
import um.edu.demospringum.entities.Products.Topping;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.Burgingr.Meat;
import um.edu.demospringum.repositories.*;
import um.edu.demospringum.repositories.productsRepo.BurgerRepository;
import um.edu.demospringum.repositories.productsRepo.DressingRepository;
import um.edu.demospringum.repositories.productsRepo.ToppingRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/burgers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class BurgerController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CreationRepository creationRepository;

    @Autowired
    private BreadRepository breadRepository;

    @Autowired
    private MeatRepository meatRepository;

    @Autowired
    private ToppingRepository toppingRepository;

    @Autowired
    private DressingRepository dressingRepository;

    @Autowired
    private BurgerRepository burgerRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createBurger(
            @RequestBody BurgerCreationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }

        try {
            // Obtener el cliente
            Client client = clientRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

            // Validar que existan pan y carne
            if (request.getBreadId() == null || request.getMeatId() == null) {
                return ResponseEntity.badRequest().body("Debes seleccionar pan y carne");
            }

            // Crear la hamburguesa
            Burger burger = new Burger();
            burger.setType("BURGER");

            // Asignar pan
            Bread bread = breadRepository.findById(request.getBreadId())
                    .orElseThrow(() -> new RuntimeException("Pan no encontrado"));
            burger.setBurgerBread(bread);

            // Asignar carne
            Meat meat = meatRepository.findById(request.getMeatId())
                    .orElseThrow(() -> new RuntimeException("Carne no encontrada"));
            burger.setBurgerMeat(meat);

            // Calcular precio inicial
            double totalPrice = bread.getPrice() + meat.getPrice();

            // Obtener toppings
            List<Topping> toppings = new ArrayList<>();
            if (request.getToppingIds() != null && !request.getToppingIds().isEmpty()) {
                toppings = toppingRepository.findAllById(request.getToppingIds());
                totalPrice += toppings.stream().mapToDouble(Topping::getPrice).sum();
            }

            // Obtener dressings (salsas)
            List<Dressing> dressings = new ArrayList<>();
            if (request.getDressingIds() != null && !request.getDressingIds().isEmpty()) {
                dressings = dressingRepository.findAllById(request.getDressingIds());
                totalPrice += dressings.stream().mapToDouble(Dressing::getPrice).sum();
            }

            burger.setPrecio(totalPrice);

            // Guardar el burger primero
            burger = burgerRepository.save(burger);

            // Crear la creación
            Creation creation = new Creation();
            creation.setClient(client);
            creation.setProduct(burger);
            creation.setToppings(toppings);
            creation.setDressings(dressings);
            creation.setFechaCreacion(LocalDateTime.now());
            creation.setFavourite(false);

            // Guardar la creación
            creation = creationRepository.save(creation);

            // Preparar respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("creationId", creation.getCreationId());
            response.put("message", "Hamburguesa creada exitosamente");
            response.put("price", totalPrice);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Error al crear la hamburguesa: " + e.getMessage());
        }
    }

    // Endpoint para obtener todas las opciones disponibles
    @GetMapping("/options")
    public ResponseEntity<?> getBurgerOptions() {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("breads", breadRepository.findAll());
            options.put("meats", meatRepository.findAll());
            options.put("toppings", toppingRepository.findAll());
            options.put("dressings", dressingRepository.findAll());

            return ResponseEntity.ok(options);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error al obtener opciones: " + e.getMessage());
        }
    }
}