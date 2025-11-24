package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.TicketSaleDTO;
import um.edu.demospringum.servicies.DGIService;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/dgi")
public class DGIController {

    @Autowired
    private DGIService dgiService;


    @GetMapping("/tickets-venta/{fecha}")
    public ResponseEntity<?> getTicketsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        try {
            List<TicketSaleDTO> tickets = dgiService.getTicketsByDate(fecha);

            if (tickets.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontraron tickets de venta para la fecha: " + fecha);
            }

            return ResponseEntity.ok(tickets);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener tickets: " + e.getMessage());
        }
    }


    @GetMapping("/tickets-venta")
    public ResponseEntity<?> getTicketsByDateParam(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        try {
            List<TicketSaleDTO> tickets = dgiService.getTicketsByDate(fecha);

            if (tickets.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontraron tickets de venta para la fecha: " + fecha);
            }

            return ResponseEntity.ok(tickets);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener tickets: " + e.getMessage());
        }
    }
}