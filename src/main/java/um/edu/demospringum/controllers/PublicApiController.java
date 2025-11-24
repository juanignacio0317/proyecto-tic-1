package um.edu.demospringum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import um.edu.demospringum.dto.*;
import um.edu.demospringum.entities.ClientOrder;
import um.edu.demospringum.servicies.BpsService;
import um.edu.demospringum.servicies.PaymentMethodService;
import um.edu.demospringum.servicies.ProductsDataService;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicApiController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @Autowired
    private BpsService bpsService;

    @Autowired
    private ProductsDataService productsDataService;

    @GetMapping("/card-owners/{cardNumber}")
    public ResponseEntity<?> getAllCardOwners(@PathVariable String cardNumber) {
        try {
            CardOwnersListDto ownersInfo = paymentMethodService.getAllCardOwners(cardNumber);
            return ResponseEntity.ok(ownersInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                    new ErrorResponse("Tarjeta no encontrada", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ErrorResponse("Error interno del servidor", e.getMessage())
            );
        }
    }


    @GetMapping("/card-owner/{cardNumber}")
    public ResponseEntity<?> getCardOwnerInfo(@PathVariable String cardNumber) {
        try {
            CardOwnerInfoDto ownerInfo = paymentMethodService.getCardOwnerInfo(cardNumber);
            return ResponseEntity.ok(ownerInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                    new ErrorResponse("Tarjeta no encontrada", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ErrorResponse("Error interno del servidor", e.getMessage())
            );
        }
    }

    @GetMapping("/bps/users/stats")
    public ResponseEntity<?> getUsersStats() {
        try {
            SystemUsersStatsDto stats = bpsService.getUsersStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ErrorResponse("Error al obtener estadísticas", e.getMessage())
            );
        }
    }

    @GetMapping("/bps/users/count")
    public ResponseEntity<?> getTotalUsersCount() {
        try {
            long totalUsers = bpsService.getTotalUsersCount();
            return ResponseEntity.ok(new CountResponse(totalUsers));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ErrorResponse("Error al obtener cantidad de usuarios", e.getMessage())
            );
        }
    }


    @GetMapping("/bps/users/detailed")
    public ResponseEntity<?> getAllUsersDetailed() {
        try {
            DetailedUsersResponseDto users = bpsService.getAllUsersDetailed();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ErrorResponse("Error al obtener usuarios detallados", e.getMessage())
            );
        }
    }


    @GetMapping("/stats/sales")
    public ResponseEntity<?> getAllSales() {
        try {
            List<ClientOrder> orders = productsDataService.listClientOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ErrorResponse("Error al obtener ventas", e.getMessage())
            );
        }
    }

    @GetMapping("/stats/sales/date/{date}")
    public ResponseEntity<?> getSalesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<ClientOrder> orders = productsDataService.listClientOrdersBetweenDates(date, date);
            return ResponseEntity.ok(new SalesResponse(
                    date,
                    date,
                    orders.size(),
                    orders
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ErrorResponse("Error al obtener ventas por fecha", e.getMessage())
            );
        }
    }


    @GetMapping("/stats/sales/between")
    public ResponseEntity<?> getSalesBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<ClientOrder> orders = productsDataService.listClientOrdersBetweenDates(startDate, endDate);
            return ResponseEntity.ok(new SalesResponse(
                    startDate,
                    endDate,
                    orders.size(),
                    orders
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ErrorResponse("Error al obtener ventas entre fechas", e.getMessage())
            );
        }
    }



    public static class ErrorResponse {
        private String error;
        private String message;

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class CountResponse {
        private long count;

        public CountResponse(long count) {
            this.count = count;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class SalesResponse {
        private LocalDate startDate;
        private LocalDate endDate;
        private int totalSales;
        private List<ClientOrder> sales;

        public SalesResponse(LocalDate startDate, LocalDate endDate, int totalSales, List<ClientOrder> sales) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.totalSales = totalSales;
            this.sales = sales;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public int getTotalSales() {
            return totalSales;
        }

        public void setTotalSales(int totalSales) {
            this.totalSales = totalSales;
        }

        public List<ClientOrder> getSales() {
            return sales;
        }

        public void setSales(List<ClientOrder> sales) {
            this.sales = sales;
        }
    }

}