package um.edu.demospringum.controllers;

import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.entities.Products.Product;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.UserDataRepository;

@RestController
@RequestMapping("users")
public class UserController {

    private UserDataRepository userDataRepository;


    public UserController(UserDataRepository userDataRepository){
        this.userDataRepository = userDataRepository;

    }

    @PostMapping
    public void createUser(@RequestBody UserData user){
        System.out.println(user.getName() + user.getSurname() + user.getPassword() + user.getEmail());

        userDataRepository.save(user);
    }

    //@GetMapping


}
