package um.edu.demospringum.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class DetailedUsersResponseDto {
    private long totalUsers;
    private long totalClients;
    private long totalAdministrators;
    private List<UserDetailsDto> clients;
    private List<UserDetailsDto> administrators;
}