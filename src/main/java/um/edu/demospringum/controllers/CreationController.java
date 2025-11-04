package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.Creation;
import um.edu.demospringum.repositories.ClientRepository;
import um.edu.demospringum.repositories.CreationRepository;

import java.util.List;

@RestController
@RequestMapping("/api/creations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CreationController {

    @Autowired
    private CreationRepository creationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/my")
    public ResponseEntity<List<Creation>> getMyCreations(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        Client client = clientRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        List<Creation> creations = creationRepository.findByClient(client);
        return ResponseEntity.ok(creations);
    }
}