package um.edu.demospringum.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AdminResponse {
    private Long userId;
    private String name;
    private String surname;
    private String email;
    private String role;
}