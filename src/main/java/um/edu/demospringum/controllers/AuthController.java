package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.AuthResponse;
import um.edu.demospringum.dto.LoginRequest;
import um.edu.demospringum.dto.RegisterRequest;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.UserDataRepository;
import um.edu.demospringum.security.JwtUtil;

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
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userDataRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }


        Client client = new Client();
        client.setName(request.getName());
        client.setSurname(request.getSurname());
        client.setEmail(request.getEmail());
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setRole("USER");


        userDataRepository.save(client);

        String token = jwtUtil.generateToken(client.getEmail());

        return ResponseEntity.ok(new AuthResponse(
                token,
                client.getEmail(),
                client.getName(),
                client.getSurname()
        ));
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
                    userData.getSurname()
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas");
        }
    }
}