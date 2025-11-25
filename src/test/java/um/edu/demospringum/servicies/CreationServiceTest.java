package um.edu.demospringum.servicies;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import um.edu.demospringum.dto.BurgerCreationRequest;
import um.edu.demospringum.dto.PizzaCreationRequest;
import um.edu.demospringum.entities.Products.Beverage;
import um.edu.demospringum.entities.Products.Burger;
import um.edu.demospringum.entities.Products.Pizza;
import um.edu.demospringum.entities.Products.SideOrder;
import um.edu.demospringum.entities.UserData;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.CreationRepository;
import um.edu.demospringum.repositories.UserDataRepository;
import um.edu.demospringum.repositories.productsRepo.BurgerRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CreationServiceTest {

    @Autowired
    private CreationService creationService;
    private BurgerCreationRequest burgerCreationRequest;
    private PizzaCreationRequest pizzaCreationRequest;

    private EntityManager entityManager;

    @Autowired
    private BurgerRepository burgerRepository;
    @Autowired
    private CreationRepository creationRepository;
    @Autowired
    private ClientOrderRepository clientOrderRepository;
    @Autowired
    private UserDataRepository userDataRepository;

    @BeforeEach
    void setup(){
        this.burgerCreationRequest = new BurgerCreationRequest();
        this.pizzaCreationRequest = new PizzaCreationRequest();

        //createUser();

    }

   /* void createUser(){
        UserData client = new UserData();
        client.setUserId(1234L);
        userDataRepository.save(client);


    }*/

    @Test
    void createBurger() {

        UserData client = new UserData();
        client.setUserId(12345L);
        userDataRepository.save(client);
        entityManager.flush();
        entityManager.clear();

        burgerCreationRequest.setBread("pan integral");
        burgerCreationRequest.setCheese(null);
        burgerCreationRequest.setMeat("vaca");
        ArrayList<String> dressings = new ArrayList<>();
        dressings.add("ketchup");
        dressings.add("mayonesa");
        burgerCreationRequest.setDressings(dressings);
        ArrayList<String> toppings = new ArrayList<>();
        toppings.add("tomate");
        toppings.add("lechuga");
        burgerCreationRequest.setToppings(toppings);
        burgerCreationRequest.setOrderDate(LocalDateTime.now());
        burgerCreationRequest.setUserId(12345L);

        creationService.createBurger(burgerCreationRequest);

        //me fijo si la creation añadida al creationrepo es igual al burgerrequest que pase como parametro a createburger
        assertEquals(creationRepository.findAll().get(0).getCreationDate(), burgerCreationRequest.getOrderDate());
        assertEquals(creationRepository.findAll().get(0).getToppings(), toppings);
        assertEquals(creationRepository.findAll().get(0).getDressings(), dressings);
        assertEquals(creationRepository.findAll().get(0).getProduct().getType(), "burger");
        assertEquals(creationRepository.findAll().get(0).getClient().getUserId(), burgerCreationRequest.getUserId());

        Burger burger = (Burger)creationRepository.findAll().get(0).getProduct();
        assertEquals(burger.getBurgerBread(), burgerCreationRequest.getBread());
        assertEquals(burger.getBurgerMeat(), burgerCreationRequest.getMeat());
        assertEquals(burger.getBurgerCheese(), burgerCreationRequest.getCheese());

        //hago lo mismo pero para el clientorder repo
        assertEquals(clientOrderRepository.findAll().get(0).getOrderDate(), burgerCreationRequest.getOrderDate());
        assertEquals(clientOrderRepository.findAll().get(0).getCreation().getToppings(), toppings);
        assertEquals(clientOrderRepository.findAll().get(0).getCreation().getDressings(), dressings);
        assertEquals(clientOrderRepository.findAll().get(0).getCreation().getProduct().getType(), "burger");
        assertEquals(clientOrderRepository.findAll().get(0).getClient().getUserId(), burgerCreationRequest.getUserId());

        Burger burgerOrder = (Burger)clientOrderRepository.findAll().get(0).getCreation().getProduct();
        assertEquals(burgerOrder.getBurgerBread(), burgerCreationRequest.getBread());
        assertEquals(burgerOrder.getBurgerMeat(), burgerCreationRequest.getMeat());
        assertEquals(burgerOrder.getBurgerCheese(), burgerCreationRequest.getCheese());
    }

   /* @Test
    void createPizza() {
        pizzaCreationRequest.setCheese("mozzarella");
        pizzaCreationRequest.setDough("masa madre");
        pizzaCreationRequest.setSize("grande");
        pizzaCreationRequest.setSauce("tomate");
        ArrayList<String> toppings = new ArrayList<>();
        toppings.add("tomate");
        toppings.add("lechuga");
        pizzaCreationRequest.setToppings(toppings);
        pizzaCreationRequest.setUserId(123L);
        pizzaCreationRequest.setOrderDate(LocalDateTime.now());

        creationService.createPizza(pizzaCreationRequest);


        //me fijo si la creation añadida al creationrepo es igual al pizzarequest que pase como parametro a createpizza
        assertEquals(creationRepository.findAll().get(0).getCreationDate(), pizzaCreationRequest.getOrderDate());
        assertEquals(creationRepository.findAll().get(0).getToppings(), toppings);
        assertEquals(creationRepository.findAll().get(0).getProduct().getType(), "pizza");
        assertEquals(creationRepository.findAll().get(0).getClient().getUserId(), pizzaCreationRequest.getUserId());

        Pizza pizza = (Pizza)creationRepository.findAll().get(0).getProduct();
        assertEquals(pizza.getSize(), pizzaCreationRequest.getSize());
        assertEquals(pizza.getSauce(), pizzaCreationRequest.getSauce());
        assertEquals(pizza.getDough(), pizzaCreationRequest.getDough());
        assertEquals(pizza.getCheese(), pizzaCreationRequest.getCheese());

        //hago lo mismo pero para el clientorder repo
        assertEquals(clientOrderRepository.findAll().get(0).getOrderDate(), pizzaCreationRequest.getOrderDate());
        assertEquals(clientOrderRepository.findAll().get(0).getCreation().getToppings(), toppings);
        assertEquals(clientOrderRepository.findAll().get(0).getCreation().getProduct().getType(), "pizza");
        assertEquals(clientOrderRepository.findAll().get(0).getClient().getUserId(), pizzaCreationRequest.getUserId());

        Pizza pizzaOrder = (Pizza)clientOrderRepository.findAll().get(0).getCreation().getProduct();
        assertEquals(pizzaOrder.getSize(), pizzaCreationRequest.getSize());
        assertEquals(pizzaOrder.getSauce(), pizzaCreationRequest.getSauce());
        assertEquals(pizzaOrder.getDough(), pizzaCreationRequest.getDough());
        assertEquals(pizzaOrder.getCheese(), pizzaCreationRequest.getCheese());

    }



    @Test
    void addBeverage() {
        pizzaCreationRequest.setCheese("mozzarella");
        pizzaCreationRequest.setDough("masa madre");
        pizzaCreationRequest.setSize("grande");
        pizzaCreationRequest.setSauce("tomate");
        ArrayList<String> toppings = new ArrayList<>();
        toppings.add("tomate");
        toppings.add("lechuga");
        pizzaCreationRequest.setToppings(toppings);
        pizzaCreationRequest.setUserId(123L);
        pizzaCreationRequest.setOrderDate(LocalDateTime.now());

        creationService.createPizza(pizzaCreationRequest);


        Beverage beverage = new Beverage();
        beverage.setTypeBeverage("pepsi");

        creationService.addBeverage(clientOrderRepository.findAll().get(0).getId(), beverage.getTypeBeverage());

        assertEquals(clientOrderRepository.findAll().get(0).getBeverage().getTypeBeverage(), beverage.getType());

    }

    @Test
    void addSideOrder() {
        pizzaCreationRequest.setCheese("mozzarella");
        pizzaCreationRequest.setDough("masa madre");
        pizzaCreationRequest.setSize("grande");
        pizzaCreationRequest.setSauce("tomate");
        ArrayList<String> toppings = new ArrayList<>();
        toppings.add("tomate");
        toppings.add("lechuga");
        pizzaCreationRequest.setToppings(toppings);
        pizzaCreationRequest.setUserId(123L);
        pizzaCreationRequest.setOrderDate(LocalDateTime.now());

        creationService.createPizza(pizzaCreationRequest);



        SideOrder sideOrder = new SideOrder();
        sideOrder.setTypeSideOrder("papas fritas");

        creationService.addSideOrder(clientOrderRepository.findAll().get(0).getId(), sideOrder.getTypeSideOrder());

        assertEquals(clientOrderRepository.findAll().get(0).getSideOrder().getTypeSideOrder(), sideOrder.getType());


    }

    @Test
    void selectOrderAddress() {
        pizzaCreationRequest.setCheese("mozzarella");
        pizzaCreationRequest.setDough("masa madre");
        pizzaCreationRequest.setSize("grande");
        pizzaCreationRequest.setSauce("tomate");
        ArrayList<String> toppings = new ArrayList<>();
        toppings.add("tomate");
        toppings.add("lechuga");
        pizzaCreationRequest.setToppings(toppings);
        pizzaCreationRequest.setUserId(123L);
        pizzaCreationRequest.setOrderDate(LocalDateTime.now());

        creationService.createPizza(pizzaCreationRequest);





        creationService.selectOrderAddress(clientOrderRepository.findAll().get(0).getId(), "Avenida Bolivia");

        assertEquals(clientOrderRepository.findAll().get(0).getOrderAddress(), "Avenida Bolivia");

    }*/
}