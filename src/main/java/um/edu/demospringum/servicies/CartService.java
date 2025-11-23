package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.CartItemDTO;
import um.edu.demospringum.entities.*;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.ClientRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private ClientOrderRepository clientOrderRepository;

    @Autowired
    private ClientRepository clientRepository;

    public CartService(ClientOrderRepository clientOrderRepository, ClientRepository clientRepository) {
        this.clientOrderRepository = clientOrderRepository;
        this.clientRepository = clientRepository;
    }

    /**
     * Obtiene todos los pedidos en el carrito (estado "in basket") de un cliente
     */
    public List<CartItemDTO> getCartItems(Long clientId) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        List<ClientOrder> orders = clientOrderRepository.findByClient(optionalClient.get());

        // Filtrar solo los que están en el carrito
        return orders.stream()
                .filter(order -> "in basket".equalsIgnoreCase(order.getOrderStatus()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convierte un ClientOrder a CartItemDTO
     */
    private CartItemDTO convertToDTO(ClientOrder order) {
        CartItemDTO dto = new CartItemDTO();

        dto.setOrderId(order.getId());
        dto.setCreationId(order.getCreation().getCreationId());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderAddress(order.getOrderAddress());
        dto.setOrderStatus(order.getOrderStatus());

        Creation creation = order.getCreation();
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

            // Sumar precio de toppings
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

            // Sumar precio de dressings
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

    /**
     * Procesa todos los pedidos del carrito:
     * - Asigna la dirección seleccionada
     * - Cambia el estado a "in queue"
     */
    @Transactional
    public void processCart(Long clientId, String selectedAddress) throws ClientNotFound, OrderNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        List<ClientOrder> orders = clientOrderRepository.findByClient(optionalClient.get());

        // Filtrar pedidos en el carrito
        List<ClientOrder> cartOrders = orders.stream()
                .filter(order -> "in basket".equalsIgnoreCase(order.getOrderStatus()))
                .collect(Collectors.toList());

        if (cartOrders.isEmpty()) {
            throw new OrderNotFound("No orders in cart");
        }

        // Actualizar cada pedido
        for (ClientOrder order : cartOrders) {
            order.setOrderAddress(selectedAddress);
            order.setOrderStatus("in queue");
            order.setOrderDate(LocalDateTime.now()); // Actualizar fecha de procesamiento
            clientOrderRepository.save(order);
        }
    }

    /**
     * Elimina un pedido del carrito
     */
    @Transactional
    public void removeFromCart(Long orderId) throws OrderNotFound {
        Optional<ClientOrder> optionalOrder = clientOrderRepository.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new OrderNotFound("Order not found");
        }

        ClientOrder order = optionalOrder.get();

        // Solo permitir eliminar si está en el carrito
        if (!"in basket".equalsIgnoreCase(order.getOrderStatus())) {
            throw new OrderNotFound("Order is not in cart");
        }

        clientOrderRepository.delete(order);
    }

    /**
     * Obtiene las direcciones del cliente
     */
    public String getClientAddress(Long clientId) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        return optionalClient.get().getAddress();
    }
}