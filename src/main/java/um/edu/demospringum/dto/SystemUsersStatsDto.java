package um.edu.demospringum.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SystemUsersStatsDto {
    private long totalUsers;
    private long totalClients;
    private long totalAdministrators;

}