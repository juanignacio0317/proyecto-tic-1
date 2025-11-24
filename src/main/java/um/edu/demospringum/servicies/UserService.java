package um.edu.demospringum.servicies;

import org.apache.catalina.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.UserDataRepository;

import java.util.List;

public class UserService {
    private UserDataRepository userDataRepository;


    public UserService(UserDataRepository userDataRepository){
        this.userDataRepository = userDataRepository;

    }

    public void createUser(UserData user){
        System.out.println(user.getName() + user.getSurname() + user.getPassword() + user.getEmail());

        userDataRepository.save(user);
    }

}
