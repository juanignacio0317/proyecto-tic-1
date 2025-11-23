package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.CreationItemDTO;
import um.edu.demospringum.entities.*;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.ClientRepository;
import um.edu.demospringum.repositories.CreationRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserCreationService {

    @Autowired
    private CreationRepository creationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientOrderRepository clientOrderRepository;

    public UserCreationService(CreationRepository creationRepository, ClientRepository clientRepository, ClientOrderRepository clientOrderRepository) {
        this.creationRepository = creationRepository;
        this.clientRepository = clientRepository;
        this.clientOrderRepository = clientOrderRepository;
    }


    public List<CreationItemDTO> getUserCreations(Long clientId) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        List<Creation> creations = creationRepository.findByClientOrderByCreationDateDesc(optionalClient.get());

        return creations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public List<CreationItemDTO> getUserFavoriteCreations(Long clientId) throws ClientNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        List<Creation> creations = creationRepository.findByClientAndFavouriteOrderByCreationDateDesc(
                optionalClient.get(),
                true
        );

        return creations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    @Transactional
    public void toggleFavourite(Long clientId, Long creationId) throws ClientNotFound, OrderNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        Optional<Creation> optionalCreation = creationRepository.findByCreationIdAndClient(
                creationId,
                optionalClient.get()
        );

        if (optionalCreation.isEmpty()) {
            throw new OrderNotFound("Creation not found or does not belong to this user");
        }

        Creation creation = optionalCreation.get();
        creation.setFavourite(!creation.isFavourite());
        creationRepository.save(creation);
    }


    @Transactional
    public void addCreationToCart(Long clientId, Long creationId) throws ClientNotFound, OrderNotFound {
        Optional<Client> optionalClient = clientRepository.findById(clientId);

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client not found");
        }

        Optional<Creation> optionalCreation = creationRepository.findByCreationIdAndClient(
                creationId,
                optionalClient.get()
        );

        if (optionalCreation.isEmpty()) {
            throw new OrderNotFound("Creation not found or does not belong to this user");
        }

        Creation creation = optionalCreation.get();

        // Crear una nueva orden en el carrito con esta creación
        ClientOrder newOrder = new ClientOrder();
        newOrder.setCreation(creation);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setOrderStatus("in basket");
        newOrder.setClient(optionalClient.get());

        clientOrderRepository.save(newOrder);
    }


    private CreationItemDTO convertToDTO(Creation creation) {
        CreationItemDTO dto = new CreationItemDTO();

        dto.setCreationId(creation.getCreationId());
        dto.setCreationDate(creation.getCreationDate());
        dto.setFavourite(creation.isFavourite());

        Product product = creation.getProduct();
        dto.setProductId(product.getProductId());
        dto.setProductType(product.getType());
        dto.setBasePrice(product.getPrice());

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

        dto.setTotalPrice(totalPrice);

        // Contar cuántas veces se ha pedido esta creación
        List<ClientOrder> orders = creation.getOrders();
        if (orders != null) {
            // Contar solo pedidos que no están en el carrito
            long orderCount = orders.stream()
                    .filter(order -> !"in basket".equalsIgnoreCase(order.getOrderStatus()))
                    .count();
            dto.setOrderCount((int) orderCount);
        } else {
            dto.setOrderCount(0);
        }

        return dto;
    }
}