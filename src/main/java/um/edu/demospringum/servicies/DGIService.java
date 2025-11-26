package um.edu.demospringum.servicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.TicketItemDTO;
import um.edu.demospringum.dto.TicketSaleDTO;
import um.edu.demospringum.entities.ClientOrder;
import um.edu.demospringum.entities.Creation;
import um.edu.demospringum.entities.PaymentMethod;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.repositories.ClientOrderRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DGIService {

    @Autowired
    private ClientOrderRepository clientOrderRepository;


    public List<TicketSaleDTO> getTicketsByDate(LocalDate fecha) {
        LocalDateTime startOfDay = fecha.atStartOfDay();
        LocalDateTime endOfDay = fecha.plusDays(1).atStartOfDay();

        List<ClientOrder> orders = clientOrderRepository.findByOrderDateBetween(startOfDay, endOfDay);

        return orders.stream()
                .filter(order -> order.getPaymentMethod() != null)  // ← LÍNEA AGREGADA
                .map(this::convertToTicketVentaDTO)
                .collect(Collectors.toList());
    }


    private TicketSaleDTO convertToTicketVentaDTO(ClientOrder order) {
        TicketSaleDTO ticket = new TicketSaleDTO();

        ticket.setOrderId(order.getId());
        ticket.setFechaVenta(order.getOrderDate());

        List<TicketItemDTO> detalle = new ArrayList<>();
        BigDecimal montoTotal = BigDecimal.ZERO;

        Creation creation = order.getCreation();
        if (creation != null) {
            Product product = creation.getProduct();

            if (product != null) {
                String productName = getProductDetailedName(product);
                TicketItemDTO productItem = new TicketItemDTO(
                        productName,
                        1,
                        product.getPrice(),
                        product.getPrice()
                );
                detalle.add(productItem);
                montoTotal = montoTotal.add(product.getPrice());
            }

            if (creation.getToppings() != null) {
                for (Topping topping : creation.getToppings()) {
                    TicketItemDTO toppingItem = new TicketItemDTO(
                            "Topping: " + topping.getType(),
                            1,
                            topping.getPrice(),
                            topping.getPrice()
                    );
                    detalle.add(toppingItem);
                    montoTotal = montoTotal.add(topping.getPrice());
                }
            }

            if (creation.getDressings() != null) {
                for (Dressing dressing : creation.getDressings()) {
                    TicketItemDTO dressingItem = new TicketItemDTO(
                            "Aderezo: " + dressing.getType(),
                            1,
                            dressing.getPrice(),
                            dressing.getPrice()
                    );
                    detalle.add(dressingItem);
                    montoTotal = montoTotal.add(dressing.getPrice());
                }
            }
        }

        if (order.getBeverage() != null) {
            Beverage beverage = order.getBeverage();
            TicketItemDTO beverageItem = new TicketItemDTO(
                    "Bebida: " + beverage.getType(),
                    1,
                    beverage.getPrice(),
                    beverage.getPrice()
            );
            detalle.add(beverageItem);
            montoTotal = montoTotal.add(beverage.getPrice());
        }

        if (order.getSideOrder() != null) {
            SideOrder sideOrder = order.getSideOrder();
            TicketItemDTO sideOrderItem = new TicketItemDTO(
                    "Acompañamiento: " + sideOrder.getType(),
                    1,
                    sideOrder.getPrice(),
                    sideOrder.getPrice()
            );
            detalle.add(sideOrderItem);
            montoTotal = montoTotal.add(sideOrder.getPrice());
        }

        ticket.setDetalle(detalle);
        ticket.setMontoTotal(montoTotal);

        if (order.getClient() != null) {
            ticket.setNombreCliente(order.getClient().getName() + " " + order.getClient().getSurname());
        }

        ticket.setDireccionEntrega(order.getOrderAddress());

        ticket.setNumeroTarjeta(getLastFourDigitsOfCard(order));

        return ticket;
    }

    private String getProductDetailedName(Product product) {
        if (product instanceof Pizza) {
            Pizza pizza = (Pizza) product;
            StringBuilder name = new StringBuilder("Pizza ");

            if (pizza.getSize() != null) {
                name.append(pizza.getSize().getType()).append(" ");
            }
            if (pizza.getDough() != null) {
                name.append("masa ").append(pizza.getDough().getType()).append(" ");
            }
            if (pizza.getSauce() != null) {
                name.append("salsa ").append(pizza.getSauce().getType()).append(" ");
            }
            if (pizza.getCheese() != null) {
                name.append("queso ").append(pizza.getCheese().getType());
            }

            return name.toString().trim();

        } else if (product instanceof Burger) {
            Burger burger = (Burger) product;
            StringBuilder name = new StringBuilder("Hamburguesa ");

            if (burger.getBurgerMeat() != null) {
                name.append(burger.getBurgerMeat().getType()).append(" ");
            }
            if (burger.getBurgerBread() != null) {
                name.append("pan ").append(burger.getBurgerBread().getType()).append(" ");
            }
            if (burger.getBurgerCheese() != null) {
                name.append("queso ").append(burger.getBurgerCheese().getType());
            }

            return name.toString().trim();
        }

        return product.getType();
    }


    private String getLastFourDigitsOfCard(ClientOrder order) {
        PaymentMethod paymentMethod = order.getPaymentMethod();

        if (paymentMethod != null && paymentMethod.getCardNumber() != null) {
            String cardNumber = paymentMethod.getCardNumber();

            if (cardNumber.length() >= 4) {
                return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
            }
        }

        return "N/A";
    }
}