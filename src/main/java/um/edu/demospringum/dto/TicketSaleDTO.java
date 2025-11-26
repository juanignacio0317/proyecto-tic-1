package um.edu.demospringum.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TicketSaleDTO {
    private Long orderId;
    private LocalDateTime fechaVenta;
    private BigDecimal montoTotal;
    private List<TicketItemDTO> detalle;
    private String nombreCliente;
    private String direccionEntrega;
    private String numeroTarjeta;
}