package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.AdminOrderDTO;
import um.edu.demospringum.entities.*;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminOrderService {

    @Autowired
    private ClientOrderRepository clientOrderRepository;

    public AdminOrderService(ClientOrderRepository clientOrderRepository) {
        this.clientOrderRepository = clientOrderRepository;
    }


    public List<AdminOrderDTO> getActiveOrders() {
        List<ClientOrder> allOrders = clientOrderRepository.findAll();

        // Filtrar solo pedidos activos (no entregados ni en carrito)
        return allOrders.stream()
                .filter(order -> {
                    String status = order.getOrderStatus().toLowerCase();
                    return !status.equals("delivered") && !status.equals("in basket");
                })
                .map(this::convertToAdminDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene pedidos filtrados por estado
     */
    public List<AdminOrderDTO> getOrdersByStatus(String status) {
        List<ClientOrder> allOrders = clientOrderRepository.findAll();

        return allOrders.stream()
                .filter(order -> order.getOrderStatus().equalsIgnoreCase(status))
                .map(this::convertToAdminDTO)
                .collect(Collectors.toList());
    }

    /**
     * Actualiza el estado de un pedido
     * Estados permitidos: "in queue" -> "in preparation" -> "on the way" -> "delivered"
     */
    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus) throws OrderNotFound {
        Optional<ClientOrder> optionalOrder = clientOrderRepository.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new OrderNotFound("Order not found");
        }

        ClientOrder order = optionalOrder.get();

        // Validar transiciones de estado
        String currentStatus = order.getOrderStatus().toLowerCase();
        String targetStatus = newStatus.toLowerCase();

        // No permitir cambiar desde estados finales
        if (currentStatus.equals("delivered") || currentStatus.equals("in basket")) {
            throw new OrderNotFound("Cannot change status from " + currentStatus);
        }

        // Validar transición válida
        if (!isValidTransition(currentStatus, targetStatus)) {
            throw new OrderNotFound("Invalid status transition from " + currentStatus + " to " + targetStatus);
        }

        order.setOrderStatus(newStatus);
        clientOrderRepository.save(order);
    }

    /**
     * Valida que la transición de estado sea lógica
     */
    private boolean isValidTransition(String from, String to) {

        // in queue -> in preparation
        // in preparation -> on the way
        // on the way -> delivered

        switch (from) {
            case "in queue":
                return to.equals("in preparation");
            case "in preparation":
                return to.equals("on the way");
            case "on the way":
                return to.equals("delivered");
            default:
                return false;
        }
    }


    private AdminOrderDTO convertToAdminDTO(ClientOrder order) {
        AdminOrderDTO dto = new AdminOrderDTO();

        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderAddress(order.getOrderAddress());
        dto.setOrderStatus(order.getOrderStatus());

        // Información del cliente
        Client client = order.getClient();
        dto.setClientId(client.getUserId());
        dto.setClientName(client.getName() + " " + client.getSurname());
        dto.setClientEmail(client.getEmail());

        Creation creation = order.getCreation();
        dto.setCreationId(creation.getCreationId());

        Product product = creation.getProduct();
        dto.setProductType(product.getType());

        // Calcular precio total
        BigDecimal totalPrice = product.getPrice();

        // Procesar según el tipo de producto
        if (product instanceof Pizza) {
            Pizza pizza = (Pizza) product;
            dto.setDough(pizza.getDough().getTypeDough());
            dto.setSauce(pizza.getSauce().getTypeSauce());
            dto.setSize(pizza.getSize().getTypeSize());
            dto.setCheese(pizza.getCheese().getTypeCheese());
        } else if (product instanceof Burger) {
            Burger burger = (Burger) product;
            dto.setBread(burger.getBurgerBread().getTypeBread());
            dto.setMeat(burger.getBurgerMeat().getTypeMeat());
            if (burger.getBurgerCheese() != null) {
                dto.setCheese(burger.getBurgerCheese().getTypeCheese());
            }
        }

        // Toppings
        if (creation.getToppings() != null && !creation.getToppings().isEmpty()) {
            List<String> toppingNames = creation.getToppings().stream()
                    .map(Topping::getTypeTopping)
                    .collect(Collectors.toList());
            dto.setToppings(toppingNames);

            BigDecimal toppingsPrice = creation.getToppings().stream()
                    .map(Topping::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            totalPrice = totalPrice.add(toppingsPrice);
        }

        // Dressings
        if (creation.getDressings() != null && !creation.getDressings().isEmpty()) {
            List<String> dressingNames = creation.getDressings().stream()
                    .map(Dressing::getTypeDressing)
                    .collect(Collectors.toList());
            dto.setDressings(dressingNames);

            BigDecimal dressingsPrice = creation.getDressings().stream()
                    .map(Dressing::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            totalPrice = totalPrice.add(dressingsPrice);
        }

        // Bebida
        if (order.getBeverage() != null) {
            dto.setBeverage(order.getBeverage().getTypeBeverage());
            totalPrice = totalPrice.add(order.getBeverage().getPrice());
        }

        // Acompañamiento
        if (order.getSideOrder() != null) {
            dto.setSideOrder(order.getSideOrder().getTypeSideOrder());
            totalPrice = totalPrice.add(order.getSideOrder().getPrice());
        }

        dto.setTotalPrice(totalPrice);

        return dto;
    }


    public String getNextStatus(String currentStatus) {
        switch (currentStatus.toLowerCase()) {
            case "in queue":
                return "in preparation";
            case "in preparation":
                return "on the way";
            case "on the way":
                return "delivered";
            default:
                return null;
        }
    }
}