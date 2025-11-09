package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.AuthResponse;
import um.edu.demospringum.dto.LoginRequest;
import um.edu.demospringum.dto.RegisterRequest;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.PaymentMethod;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.UserDataRepository;
import um.edu.demospringum.security.JwtUtil;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validaciones
            if (userDataRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("El email ya está registrado");
            }

            if (request.getPaymentMethod() == null) {
                return ResponseEntity.badRequest().body("Debes agregar un método de pago");
            }

            // Crear cliente
            Client client = new Client();
            client.setName(request.getName());
            client.setSurname(request.getSurname());
            client.setPhone(request.getPhone());
            client.setAddress(request.getAddress());
            client.setEmail(request.getEmail());
            client.setPassword(passwordEncoder.encode(request.getPassword()));
            client.setRole("USER");

            // Inicializar la lista de payment methods ANTES de guardar
            client.setPaymentMethods(new ArrayList<>());

            // Crear método de pago
            PaymentMethod pm = new PaymentMethod();
            pm.setCardHolderName(request.getPaymentMethod().getCardHolderName());

            String cardNumber = request.getPaymentMethod().getCardNumber().replaceAll("\\s+", "");
            pm.setCardNumber(cardNumber);

            pm.setCvv(request.getPaymentMethod().getCvv());
            pm.setCardBrand(request.getPaymentMethod().getCardBrand());
            pm.setExpirationDate(request.getPaymentMethod().getExpirationDate());

            // Establecer la relación bidireccional
            pm.setClient(client);
            client.getPaymentMethods().add(pm);

            // Guardar UNA SOLA VEZ (cascade se encarga del resto)
            client = userDataRepository.save(client);

            // Generar token
            String token = jwtUtil.generateToken(client.getEmail());

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    client.getEmail(),
                    client.getName(),
                    client.getSurname(),
                    client.getRole() // AGREGADO
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la cuenta: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            UserData userData = userDataRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            String token = jwtUtil.generateToken(userData.getEmail());

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    userData.getEmail(),
                    userData.getName(),
                    userData.getSurname(),
                    userData.getRole() // AGREGADO
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error en el login: " + e.getMessage());
        }
    }
}