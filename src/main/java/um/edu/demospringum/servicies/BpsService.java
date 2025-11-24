package um.edu.demospringum.servicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.demospringum.dto.DetailedUsersResponseDto;
import um.edu.demospringum.dto.SystemUsersStatsDto;
import um.edu.demospringum.dto.UserDetailsDto;
import um.edu.demospringum.entities.Administrator;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.AdministratorRepository;
import um.edu.demospringum.repositories.ClientRepository;
import um.edu.demospringum.repositories.UserDataRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BpsService {

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdministratorRepository administratorRepository;


    @Transactional(readOnly = true)
    public SystemUsersStatsDto getUsersStats() {
        long totalClients = clientRepository.countAllClients();
        long totalAdmins = administratorRepository.countAllAdministrators();
        long totalUsers = totalClients + totalAdmins;

        SystemUsersStatsDto stats = new SystemUsersStatsDto();
        stats.setTotalUsers(totalUsers);
        stats.setTotalClients(totalClients);
        stats.setTotalAdministrators(totalAdmins);


        return stats;
    }


    @Transactional(readOnly = true)
    public DetailedUsersResponseDto getAllUsersDetailed() {
        // Obtener todos los clientes
        List<Client> clients = clientRepository.findAll();
        List<UserDetailsDto> clientDtos = clients.stream()
                .map(client -> convertToUserDetailsDto(client, "CLIENT"))
                .collect(Collectors.toList());

        // Obtener todos los administradores
        List<Administrator> admins = administratorRepository.findAll();
        List<UserDetailsDto> adminDtos = admins.stream()
                .map(admin -> convertToUserDetailsDto(admin, "ADMINISTRATOR"))
                .collect(Collectors.toList());

        DetailedUsersResponseDto response = new DetailedUsersResponseDto();
        response.setTotalUsers(clientDtos.size() + adminDtos.size());
        response.setTotalClients(clientDtos.size());
        response.setTotalAdministrators(adminDtos.size());
        response.setClients(clientDtos);
        response.setAdministrators(adminDtos);

        return response;
    }


    @Transactional(readOnly = true)
    public long getTotalUsersCount() {
        return clientRepository.countAllClients() + administratorRepository.countAllAdministrators();
    }



    private UserDetailsDto convertToUserDetailsDto(UserData user, String userType) {
        UserDetailsDto dto = new UserDetailsDto();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setUserType(userType);
        return dto;
    }
}