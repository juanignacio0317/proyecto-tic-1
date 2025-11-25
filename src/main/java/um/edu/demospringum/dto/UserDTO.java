package um.edu.demospringum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.UserData;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String role;

    public static UserDTO fromEntity(UserData userData) {
        UserDTO dto = new UserDTO();
        dto.setUserId(userData.getUserId());
        dto.setName(userData.getName());
        dto.setSurname(userData.getSurname());
        dto.setEmail(userData.getEmail());
        dto.setRole(userData.getRole());

        if (userData instanceof Client) {
            dto.setPhone(((Client) userData).getPhone());
        } else {
            dto.setPhone(null);
        }

        return dto;
    }
}