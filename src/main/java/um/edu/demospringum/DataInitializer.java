package um.edu.demospringum;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import um.edu.demospringum.entities.Administrator;
import um.edu.demospringum.repositories.AdministratorRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdminUser(AdministratorRepository administratorRepository,
                                    PasswordEncoder passwordEncoder) {
        return args -> {
            // Verificar si ya existe un administrador
            if (administratorRepository.findByEmail("admin@pizzumburgum.com").isEmpty()) {
                Administrator admin = new Administrator();
                admin.setName("Administrador");
                admin.setSurname("Sistema");
                admin.setEmail("admin@admin.com");
                admin.setPassword(passwordEncoder.encode("adminadmin"));

                administratorRepository.save(admin);


                System.out.println(" ADMINISTRADOR INICIAL CREADO");;
                System.out.println("Email:      admin@pizzumburgum.com");
                System.out.println("Contraseña: adminadmin");

            } else {
                System.out.println("ℹEl administrador ya existe en la base de datos");
            }
        };
    }
}