package um.edu.demospringum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String surname;
    private String role; // AGREGADO

    // Constructor original para compatibilidad
    public AuthResponse(String token, String email, String name, String surname) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.role = "USER"; // Por defecto
    }
}