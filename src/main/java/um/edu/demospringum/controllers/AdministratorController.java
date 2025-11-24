package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.AdminResponse;
import um.edu.demospringum.dto.CreateAdminRequest;
import um.edu.demospringum.servicies.AdministratorService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/administrators")
@PreAuthorize("hasRole('ADMIN')")
public class AdministratorController {

    @Autowired
    private AdministratorService administratorService;


    @PostMapping
    public ResponseEntity<?> createAdministrator(@RequestBody CreateAdminRequest request) {
        try {
            AdminResponse admin = administratorService.createAdministrator(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }


    @GetMapping
    public ResponseEntity<List<AdminResponse>> getAllAdministrators() {
        List<AdminResponse> admins = administratorService.getAllAdministrators();
        return ResponseEntity.ok(admins);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getAdministratorById(@PathVariable Long id) {
        try {
            AdminResponse admin = administratorService.getAdministratorById(id);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdministrator(@PathVariable Long id) {
        try {
            administratorService.deleteAdministrator(id);
            return ResponseEntity.ok(new SuccessResponse("Administrador eliminado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Clases internas para respuestas
    private static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }

    private static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}