package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.PaymentMethodRequestDto;
import um.edu.demospringum.dto.PaymentMethodResponseDto;
import um.edu.demospringum.servicies.PaymentMethodService;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @PostMapping("/{clientId}")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentMethodResponseDto> addPaymentMethod(
            @PathVariable Long clientId,
            @RequestBody PaymentMethodRequestDto requestDto) {
        try {
            PaymentMethodResponseDto response = paymentMethodService.addPaymentMethod(clientId, requestDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{clientId}")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PaymentMethodResponseDto>> getClientPaymentMethods(
            @PathVariable Long clientId) {
        try {
            List<PaymentMethodResponseDto> paymentMethods =
                    paymentMethodService.getClientPaymentMethods(clientId);
            return ResponseEntity.ok(paymentMethods);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{clientId}/{paymentMethodId}")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<PaymentMethodResponseDto> getPaymentMethodById(
            @PathVariable Long clientId,
            @PathVariable Long paymentMethodId) {
        try {
            PaymentMethodResponseDto paymentMethod =
                    paymentMethodService.getPaymentMethodById(clientId, paymentMethodId);
            return ResponseEntity.ok(paymentMethod);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{clientId}/{paymentMethodId}")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deletePaymentMethod(
            @PathVariable Long clientId,
            @PathVariable Long paymentMethodId) {
        try {
            paymentMethodService.deletePaymentMethod(clientId, paymentMethodId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}