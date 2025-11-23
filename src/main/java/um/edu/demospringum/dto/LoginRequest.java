package um.edu.demospringum.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private Long userId;
    private String password;
}