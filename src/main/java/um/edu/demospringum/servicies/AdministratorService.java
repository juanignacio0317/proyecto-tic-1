package um.edu.demospringum.servicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.demospringum.dto.AdminResponse;
import um.edu.demospringum.dto.CreateAdminRequest;
import um.edu.demospringum.entities.Administrator;
import um.edu.demospringum.repositories.AdministratorRepository;
import um.edu.demospringum.repositories.UserDataRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdministratorService {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Transactional
    public AdminResponse createAdministrator(CreateAdminRequest request) {
        // Validar que no exista el email
        if (userDataRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con ese email");
        }

        // Validar datos básicos
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("El nombre es requerido");
        }
        if (request.getSurname() == null || request.getSurname().trim().isEmpty()) {
            throw new RuntimeException("El apellido es requerido");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("El email es requerido");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
        }

        // Crear el administrador
        Administrator admin = new Administrator();
        admin.setName(request.getName());
        admin.setSurname(request.getSurname());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole("ADMIN"); // Asegurar que sea ADMIN

        Administrator savedAdmin = administratorRepository.save(admin);

        // Retornar DTO
        return mapToResponse(savedAdmin);
    }


    public List<AdminResponse> getAllAdministrators() {
        return administratorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public AdminResponse getAdministratorById(Long id) {
        Administrator admin = administratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
        return mapToResponse(admin);
    }


    @Transactional
    public void deleteAdministrator(Long id) {
        if (!administratorRepository.existsById(id)) {
            throw new RuntimeException("Administrador no encontrado");
        }
        administratorRepository.deleteById(id);
    }


    private AdminResponse mapToResponse(Administrator admin) {
        AdminResponse response = new AdminResponse();
        response.setUserId(admin.getUserId());
        response.setName(admin.getName());
        response.setSurname(admin.getSurname());
        response.setEmail(admin.getEmail());
        response.setRole(admin.getRole());
        return response;
    }
}