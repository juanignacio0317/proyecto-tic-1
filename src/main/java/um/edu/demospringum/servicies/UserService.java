package um.edu.demospringum.servicies;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.UserDataRepository;

@Service
public class UserService {
    private final UserDataRepository userDataRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserDataRepository userDataRepository, PasswordEncoder passwordEncoder){
        this.userDataRepository = userDataRepository;
        this.passwordEncoder = passwordEncoder;  // ← AGREGAR ESTA LÍNEA
    }

    public void createUser(UserData user){
        System.out.println(user.getName() + user.getSurname() + user.getPassword() + user.getEmail());
        userDataRepository.save(user);
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        UserData user = userDataRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userDataRepository.save(user);
    }

    public UserData getUserById(Long userId) {
        return userDataRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}