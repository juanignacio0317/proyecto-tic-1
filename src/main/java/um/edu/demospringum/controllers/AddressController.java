package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.AddressRequestDto;
import um.edu.demospringum.dto.AddressResponseDto;
import um.edu.demospringum.servicies.AddressService;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("/{clientId}")
    public ResponseEntity<AddressResponseDto> addAddress(
            @PathVariable Long clientId,
            @RequestBody AddressRequestDto requestDto) {

        System.out.println("🔍 POST /api/addresses/" + clientId);
        System.out.println("🔍 Address: " + requestDto.getAddress());

        try {
            AddressResponseDto response = addressService.addAddress(clientId, requestDto);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<AddressResponseDto> getClientAddresses(@PathVariable Long clientId) {
        System.out.println("🔍 GET /api/addresses/" + clientId);

        try {
            AddressResponseDto response = addressService.getClientAddresses(clientId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long clientId,
            @RequestBody AddressRequestDto requestDto) {

        System.out.println("🔍 DELETE /api/addresses/" + clientId);
        System.out.println("🔍 Address to delete: " + requestDto.getAddress());

        try {
            addressService.deleteAddress(clientId, requestDto.getAddress());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<AddressResponseDto> updateAddress(
            @PathVariable Long clientId,
            @RequestParam String oldAddress,
            @RequestBody AddressRequestDto requestDto) {

        System.out.println("🔍 PUT /api/addresses/" + clientId);
        System.out.println("🔍 Old address: " + oldAddress);
        System.out.println("🔍 New address: " + requestDto.getAddress());

        try {
            AddressResponseDto response = addressService.updateAddress(clientId, oldAddress, requestDto.getAddress());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}