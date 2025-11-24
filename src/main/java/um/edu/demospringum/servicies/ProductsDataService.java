package um.edu.demospringum.servicies;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.TopProductDto;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.ClientOrder;
import um.edu.demospringum.entities.Creation;
import um.edu.demospringum.entities.Products.Burger;
import um.edu.demospringum.entities.Products.Pizza;
import um.edu.demospringum.entities.Products.Product;
import um.edu.demospringum.exceptions.CreationNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.ClientRepository;
import um.edu.demospringum.repositories.CreationRepository;
import um.edu.demospringum.repositories.ingredientesRepo.CheeseRepository;
import um.edu.demospringum.repositories.ingredientesRepo.DoughRepository;
import um.edu.demospringum.repositories.ingredientesRepo.SauceRepository;
import um.edu.demospringum.repositories.ingredientesRepo.SizeRepository;
import um.edu.demospringum.repositories.productsRepo.PizzaRepository;
import um.edu.demospringum.repositories.productsRepo.ProductRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductsDataService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ClientOrderRepository clientOrderRepository;
    @Autowired
    private CreationRepository creationRepository;

    @Autowired
    private DoughRepository doughRepository;
    @Autowired
    private SauceRepository sauceRepository;
    @Autowired
    private SizeRepository sizeRepository;
    @Autowired
    private CheeseRepository cheeseRepository;
    @Autowired
    private PizzaRepository pizzaRepository;
    @Autowired
    private ClientRepository clientRepository;

    public ProductsDataService(ProductRepository productRepository, ClientOrderRepository clientOrderRepository, CreationRepository creationRepository, DoughRepository doughRepository, SauceRepository sauceRepository, SizeRepository sizeRepository, CheeseRepository cheeseRepository, PizzaRepository pizzaRepository, ClientRepository clientRepository) {
        this.productRepository = productRepository;
        this.clientOrderRepository = clientOrderRepository;
        this.creationRepository = creationRepository;
        this.pizzaRepository = pizzaRepository;

        this.doughRepository = doughRepository;
        this.sauceRepository = sauceRepository;
        this.sizeRepository = sizeRepository;
        this.cheeseRepository = cheeseRepository;

        this.clientRepository = clientRepository;
    }


    //funcion para que el admin pueda ver la lista de todos los pedidos
    public List<ClientOrder> listClientOrders() {
        return clientOrderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate"));
    }


    //funcion para el admin
    public List<ClientOrder> listClientOrdersBetweenDates(LocalDate startDate, LocalDate endDate) {

        List<ClientOrder> allOrders = clientOrderRepository.findAll();
        List<ClientOrder> filteredOrders = new LinkedList<>();

        for (ClientOrder order : allOrders) {
            LocalDate orderDay = order.getOrderDate().toLocalDate();

            if ((orderDay.isEqual(startDate) || orderDay.isAfter(startDate)) && (orderDay.isEqual(endDate) || orderDay.isBefore(endDate))) {
                filteredOrders.add(order);
            }
        }

        return filteredOrders;
    }


    //funcion para el admin
    public void updateOrderStatus(ClientOrder order, String orderStatus) {
        order.setOrderStatus(orderStatus);
    }


    //funcion que devuelve todos los pedidos de un cliente
    public List<ClientOrder> listOrders(Long clientId) {
        Client client = clientRepository.findById(clientId).get();
        return clientOrderRepository.findByClient(client);
    }

    public List<ClientOrder> listOrdersBetweenDates(Long clientId, LocalDate startDate, LocalDate endDate) {

        Client client = clientRepository.findById(clientId).get();
        List<ClientOrder> clientOrders = clientOrderRepository.findByClient(client);

        List<ClientOrder> filteredOrders = new LinkedList<>();

        for (ClientOrder order : clientOrders) {
            LocalDate orderDay = order.getOrderDate().toLocalDate();

            if ((orderDay.isEqual(startDate) || orderDay.isAfter(startDate)) && (orderDay.isEqual(endDate) || orderDay.isBefore(endDate))) {
                filteredOrders.add(order);
            }
        }

        return filteredOrders;

    }

    public List<Creation> listCreations(Long clientId){
        return creationRepository.findByClient(clientRepository.findById(clientId).get());
    }

    public List<Creation> listFavourites(Long clientId){
        Optional<Client> optionalClient = clientRepository.findById(clientId);
        return creationRepository.findByClientAndFavouriteTrue(optionalClient.get());
    }

    public void updateFavourite(Long creationId, boolean favourite, Long clientId) throws CreationNotFound {

        Optional<Creation> optional = creationRepository.findById(creationId);

        if (optional.isEmpty()) {
            throw new CreationNotFound("Creation not found");
        }

        Creation creation = optional.get();

        creation.setFavourite(favourite);
        creationRepository.save(creation);
    }



    //funciones para listar productos top (puede servir para admin o para clients)

    private TopProductDto buildDTO(Product product, Long count) {
        TopProductDto dto = new TopProductDto();
        dto.setProductId(product.getProductId());
        dto.setCount(count);

        if (product instanceof Pizza pizza) {
            dto.setProductType("pizza");
            dto.setDough(pizza.getDough().getType());
            dto.setSize(pizza.getSize().getType());
            dto.setSauce(pizza.getSauce().getType());
            dto.setPizzaCheese(pizza.getCheese().getType());
        }
        else if (product instanceof Burger burger) {
            dto.setProductType("burger");
            dto.setMeat(burger.getBurgerMeat().getType());
            dto.setBread(burger.getBurgerBread().getType());
            dto.setMeatQuantity(burger.getMeatQuantity());

            if (burger.getBurgerCheese() != null) {
                dto.setBurgerCheese(burger.getBurgerCheese().getType());
            } else {
                dto.setBurgerCheese("SIN QUESO");
            }
        }

        return dto;
    }

    private void sortByCountDesc(List<TopProductDto> list) {
        for (int i = 0; i < list.size() - 1; i++) {
            int maxIndex = i;

            for (int j = i + 1; j < list.size(); j++) {
                if (list.get(j).getCount() > list.get(maxIndex).getCount()) {
                    maxIndex = j;
                }
            }

            // swap
            TopProductDto temp = list.get(i);
            list.set(i, list.get(maxIndex));
            list.set(maxIndex, temp);
        }
    }

    public List<TopProductDto> listTopProducts() {
        List<ClientOrder> orders = clientOrderRepository.findAll();

        List<Product> uniqueProducts = new ArrayList<>();
        List<Long> counts = new ArrayList<>();

        for (ClientOrder order : orders) {
            Creation creation = order.getCreation();
            if (creation == null) continue;

            Product product = creation.getProduct();
            if (product == null) continue;

            Long productId = product.getProductId();

            int index = -1;
            for (int i = 0; i < uniqueProducts.size(); i++) {
                if (uniqueProducts.get(i).getProductId().equals(productId)) {
                    index = i;
                    break;
                }
            }

            if (index == -1) {
                uniqueProducts.add(product);
                counts.add(1L);
            } else {
                counts.set(index, counts.get(index) + 1);
            }
        }

        List<TopProductDto> result = new ArrayList<>();
        for (int i = 0; i < uniqueProducts.size(); i++) {
            result.add(buildDTO(uniqueProducts.get(i), counts.get(i)));
        }

        sortByCountDesc(result);
        return result;
    }


    public List<TopProductDto> listTopPizzas() {
        List<ClientOrder> orders = clientOrderRepository.findAll();

        List<Pizza> uniquePizzas = new ArrayList<>();
        List<Long> counts = new ArrayList<>();

        for (ClientOrder order : orders) {
            Creation creation = order.getCreation();
            if (creation == null) continue;

            Product product = creation.getProduct();
            if (!(product instanceof Pizza pizza)) continue;

            Long productId = pizza.getProductId();

            // buscar si ya existe
            int index = -1;
            for (int i = 0; i < uniquePizzas.size(); i++) {
                if (uniquePizzas.get(i).getProductId().equals(productId)) {
                    index = i;
                    break;
                }
            }

            if (index == -1) {
                uniquePizzas.add(pizza);
                counts.add(1L);
            } else {
                counts.set(index, counts.get(index) + 1);
            }
        }

        // armar DTOs
        List<TopProductDto> result = new ArrayList<>();
        for (int i = 0; i < uniquePizzas.size(); i++) {
            result.add(buildDTO(uniquePizzas.get(i), counts.get(i)));
        }

        sortByCountDesc(result);

        return result;
    }


    public List<TopProductDto> listTopBurgers() {
        List<ClientOrder> orders = clientOrderRepository.findAll();

        List<Burger> uniqueBurgers = new ArrayList<>();
        List<Long> counts = new ArrayList<>();

        for (ClientOrder order : orders) {
            Creation creation = order.getCreation();
            if (creation == null) continue;

            Product product = creation.getProduct();
            if (!(product instanceof Burger burger)) continue;

            Long productId = burger.getProductId();

            int index = -1;
            for (int i = 0; i < uniqueBurgers.size(); i++) {
                if (uniqueBurgers.get(i).getProductId().equals(productId)) {
                    index = i;
                    break;
                }
            }

            if (index == -1) {
                uniqueBurgers.add(burger);
                counts.add(1L);
            } else {
                counts.set(index, counts.get(index) + 1);
            }
        }

        // armar DTOs
        List<TopProductDto> result = new ArrayList<>();
        for (int i = 0; i < uniqueBurgers.size(); i++) {
            result.add(buildDTO(uniqueBurgers.get(i), counts.get(i)));
        }

        sortByCountDesc(result);
        return result;
    }



}
