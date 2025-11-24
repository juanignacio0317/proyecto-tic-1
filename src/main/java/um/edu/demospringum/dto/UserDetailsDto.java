package um.edu.demospringum.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class UserDetailsDto {
    private Long userId;
    private String name;
    private String surname;
    private String email;
    private String role;
    private String userType; // "CLIENT" o "ADMINISTRATOR"
}