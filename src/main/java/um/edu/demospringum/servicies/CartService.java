package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.CartItemDTO;
import um.edu.demospringum.entities.*;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.ClientRepository;
import um.edu.demospringum.repositories.PaymentMethodRepository;
import um.edu.demospringum.servicies.CreationService;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CreationService creationService;

    @Autowired
    private ClientOrderRepository clientOrderRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public CartService(ClientOrderRepository clientOrderRepository,
                       ClientRepository clientRepository,
                       PaymentMethodRepository paymentMethodRepository) {
        this.clientOrderRepository = clientOrderRepository;
        this.clientRepository = clientRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public List<CartItemDTO> getCartItems(Long clientId) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        List<ClientOrder> orders = clientOrderRepository.findByClient(optionalClient.get());

        return orders.stream()
                .filter(order -> "in basket".equalsIgnoreCase(order.getOrderStatus()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

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

        BigDecimal totalPrice = product.getPrice();

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

        if (order.getBeverage() != null) {
            dto.setBeverage(order.getBeverage().getTypeBeverage());
            totalPrice = totalPrice.add(order.getBeverage().getPrice());
        }

        if (order.getSideOrder() != null) {
            dto.setSideOrder(order.getSideOrder().getTypeSideOrder());
            totalPrice = totalPrice.add(order.getSideOrder().getPrice());
        }

        dto.setTotalPrice(totalPrice);

        return dto;
    }

    @Transactional
    public void processCart(Long clientId, String selectedAddress, Long paymentMethodId)
            throws ClientNotFound, OrderNotFound {

        Optional<Client> optionalClient = clientRepository.findById(clientId);
        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }


        Optional<PaymentMethod> optionalPaymentMethod = paymentMethodRepository.findById(paymentMethodId);
        if (optionalPaymentMethod.isEmpty()) {
            throw new RuntimeException("Payment method not found");
        }

        PaymentMethod paymentMethod = optionalPaymentMethod.get();


        if (!paymentMethod.getClient().getUserId().equals(clientId)) {
            throw new RuntimeException("Payment method does not belong to this client");
        }

        List<ClientOrder> orders = clientOrderRepository.findByClient(optionalClient.get());

        List<ClientOrder> cartOrders = orders.stream()
                .filter(order -> "in basket".equalsIgnoreCase(order.getOrderStatus()))
                .collect(Collectors.toList());

        if (cartOrders.isEmpty()) {
            throw new OrderNotFound("No orders in cart");
        }

        for (ClientOrder order : cartOrders) {
            order.setOrderAddress(selectedAddress);
            order.setOrderStatus("in queue");
            order.setOrderDate(LocalDateTime.now());
            order.setPaymentMethod(paymentMethod); // ← NUEVO
            clientOrderRepository.save(order);
        }
    }

    @Transactional
    public void removeFromCart(Long orderId) throws OrderNotFound {
        Optional<ClientOrder> optionalOrder = clientOrderRepository.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new OrderNotFound("Order not found");
        }

        ClientOrder order = optionalOrder.get();

        if (!"in basket".equalsIgnoreCase(order.getOrderStatus())) {
            throw new OrderNotFound("Order is not in cart");
        }

        clientOrderRepository.delete(order);
    }

    public String getClientAddress(Long clientId) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        Client client = optionalClient.get();

        if (client.getAddresses() != null && !client.getAddresses().isEmpty()) {
            return client.getAddresses().get(0);
        }

        return "";
    }

    public List<String> getClientAddresses(Long clientId) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        Client client = optionalClient.get();

        return client.getAddresses() != null ? client.getAddresses() : new ArrayList<>();
    }

    @Transactional
    public void addBeverageToOrder(Long orderId, String beverageType) throws OrderNotFound, IngredientNotFound {
        Optional<ClientOrder> optionalOrder = clientOrderRepository.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new OrderNotFound("Order not found");
        }

        ClientOrder order = optionalOrder.get();

        if (!"in basket".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Order is not in cart");
        }

        creationService.addBeverage(orderId, beverageType);
    }

    @Transactional
    public void addSideOrderToOrder(Long orderId, String sideOrderType) throws OrderNotFound, IngredientNotFound {
        Optional<ClientOrder> optionalOrder = clientOrderRepository.findById(orderId);

        if (optionalOrder.isEmpty()) {
            throw new OrderNotFound("Order not found");
        }

        ClientOrder order = optionalOrder.get();

        if (!"in basket".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Order is not in cart");
        }

        creationService.addSideOrder(orderId, sideOrderType);
    }
}