package um.edu.demospringum.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.ChangePasswordRequest;
import um.edu.demospringum.dto.UserDTO;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.UserDataRepository;
import um.edu.demospringum.security.JwtUtil;
import um.edu.demospringum.servicies.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserDataRepository userDataRepository;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserDataRepository userDataRepository, UserService userService, JwtUtil jwtUtil) {
        this.userDataRepository = userDataRepository;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public void createUser(@RequestBody UserData user){
        System.out.println(user.getName() + user.getSurname() + user.getPassword() + user.getEmail());
        userDataRepository.save(user);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("🔍 Token recibido: " + token);
            Long userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            System.out.println("🔍 UserId extraído: " + userId);

            UserData user = userService.getUserById(userId);
            System.out.println("🔍 Usuario encontrado: " + user.getEmail());

            return ResponseEntity.ok(UserDTO.fromEntity(user));
        } catch (Exception e) {
            System.err.println("❌ Error en getUserProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Passwords do not match"));
            }

            if (request.getNewPassword().length() < 6) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Password must be at least 6 characters"));
            }

            Long userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());

            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}