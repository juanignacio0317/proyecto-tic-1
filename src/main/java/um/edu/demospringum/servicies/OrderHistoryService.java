package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.OrderHistoryDTO;
import um.edu.demospringum.entities.*;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.ClientRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderHistoryService {

    @Autowired
    private ClientOrderRepository clientOrderRepository;

    @Autowired
    private ClientRepository clientRepository;

    public OrderHistoryService(ClientOrderRepository clientOrderRepository, ClientRepository clientRepository) {
        this.clientOrderRepository = clientOrderRepository;
        this.clientRepository = clientRepository;
    }


    public List<OrderHistoryDTO> getUserOrders(Long clientId) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        List<ClientOrder> orders = clientOrderRepository.findByClient(optionalClient.get());

        // Filtrar pedidos que NO están en el carrito, ordenar por fecha descendente
        return orders.stream()
                .filter(order -> !"in basket".equalsIgnoreCase(order.getOrderStatus()))
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public List<OrderHistoryDTO> getUserOrdersByStatus(Long clientId, String status) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        List<ClientOrder> orders = clientOrderRepository.findByClient(optionalClient.get());

        return orders.stream()
                .filter(order -> order.getOrderStatus().equalsIgnoreCase(status))
                .sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    @Transactional
    public void cancelOrder(Long clientId, Long orderId) throws ClientNotFound, OrderNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        Optional<ClientOrder> optionalOrder = clientOrderRepository.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new OrderNotFound("Order not found");
        }

        ClientOrder order = optionalOrder.get();

        // Verificar que el pedido pertenece al cliente
        if (!order.getClient().getUserId().equals(clientId)) {
            throw new OrderNotFound("Order does not belong to this user");
        }

        // Solo permitir cancelar si está en cola
        if (!"in queue".equalsIgnoreCase(order.getOrderStatus())) {
            throw new OrderNotFound("Cannot cancel order in current status: " + order.getOrderStatus());
        }

        // Cambiar estado a "cancelled"
        order.setOrderStatus("cancelled");
        clientOrderRepository.save(order);
    }


    private OrderHistoryDTO convertToDTO(ClientOrder order) {
        OrderHistoryDTO dto = new OrderHistoryDTO();

        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderAddress(order.getOrderAddress());
        dto.setOrderStatus(order.getOrderStatus());

        // Determinar si se puede cancelar (solo en cola)
        dto.setCanCancel("in queue".equalsIgnoreCase(order.getOrderStatus()));

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
            dto.setMeatQuantity(burger.getMeatQuantity());
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
}