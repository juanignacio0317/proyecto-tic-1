package um.edu.demospringum.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.UserDataRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDataRepository userDataRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserData userData = userDataRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        return User
                .withUsername(userData.getEmail())
                .password(userData.getPassword())
                .authorities("ROLE_" + userData.getRole())
                .build();
    }
}