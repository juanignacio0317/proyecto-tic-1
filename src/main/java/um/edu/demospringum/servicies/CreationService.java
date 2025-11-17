package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dtos.BurgerCreationRequest;
import um.edu.demospringum.dtos.PizzaCreationRequest;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.Burgingr.Meat;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.ClientOrder;
import um.edu.demospringum.entities.Creation;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.exceptions.ClientNotFound;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.ClientRepository;
import um.edu.demospringum.repositories.CreationRepository;
import um.edu.demospringum.repositories.productsRepo.*;
import um.edu.demospringum.repositories.ingredientesRepo.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service
public class CreationService {

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
    private PizzaRepository pizzaRepository;
    private BurgerRepository burgerRepository;

    private BreadRepository breadRepository;
    private MeatRepository meatRepository;

    private ClientRepository clientRepository;

    private BeverageRepository beverageRepository;
    private SideOrderRepository sideOrderRepository;

    @Autowired
    private ToppingRepository toppingRepo;

    public CreationService(ProductRepository productRepository, ClientOrderRepository clientOrderRepository, CreationRepository creationRepository, DoughRepository doughRepository, SauceRepository sauceRepository, SizeRepository sizeRepository, CheeseRepository cheeseRepository, PizzaRepository pizzaRepository, ClientRepository clientRepository, BeverageRepository beverageRepository, SideOrderRepository sideOrderRepository, BreadRepository breadRepository, MeatRepository meatRepository, BurgerRepository burgerRepository) {
        this.productRepository = productRepository;
        this.clientOrderRepository = clientOrderRepository;
        this.creationRepository = creationRepository;
        this.pizzaRepository = pizzaRepository;
        this.burgerRepository = burgerRepository;

        this.doughRepository = doughRepository;
        this.sauceRepository = sauceRepository;
        this.sizeRepository = sizeRepository;
        this.cheeseRepository = cheeseRepository;
        this.breadRepository = breadRepository;
        this.meatRepository = meatRepository;

        this.clientRepository = clientRepository;

        this.beverageRepository = beverageRepository;
        this.sideOrderRepository = sideOrderRepository;
    }

    @Transactional
    public PizzaCreationRequest createPizza(PizzaCreationRequest pizzaCreated) throws IngredientNotFound, ClientNotFound {

        //busco si existe el cliente
        Optional<Client> optionalClient = clientRepository.findById(pizzaCreated.getUserId());

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client was not found");
        }

        //busco si existen los ingredientes
        Optional<Dough> optionalDough = doughRepository.findByTypeDoughIgnoreCase(pizzaCreated.getDough());
        Optional<Sauce> optionalSauce = sauceRepository.findByTypeSauceIgnoreCase(pizzaCreated.getSauce());
        Optional<Size> optionalSize = sizeRepository.findByTypeSizeIgnoreCase(pizzaCreated.getSize());
        Optional<Cheese> optionalCheese = cheeseRepository.findByTypeCheeseIgnoreCase(pizzaCreated.getCheese());


        if (optionalDough.isEmpty()) {
            throw new IngredientNotFound("Dough type not found");
        }
        if (optionalSauce.isEmpty()) {
            throw new IngredientNotFound("Sauce type not found");
        }
        if (optionalSize.isEmpty()) {
            throw new IngredientNotFound("Size specified not found");
        }
        if (optionalCheese.isEmpty()) {
            throw new IngredientNotFound("Cheese type not found");
        }


        //creo la nueva pizza

        Pizza newPizza = new Pizza();
        newPizza.setPizzaDough(optionalDough.get());
        newPizza.setPizzaSauce(optionalSauce.get());
        newPizza.setPizzaSize(optionalSize.get());
        newPizza.setPizzaCheese(optionalCheese.get());

        //busco si la pizza ya ha sido creada

        Optional<Pizza> optionalPizza = pizzaRepository.findByDoughAndSauceAndSizeAndCheese(optionalDough.get(), optionalSauce.get(), optionalSize.get(), optionalCheese.get());

        //si es la primera vez que se crea la guardo como una nueva pizza
        if (optionalPizza.isEmpty()) {
            pizzaRepository.save(newPizza);
        }

        List<Topping> listaToppings = new LinkedList<>();
        pizzaCreated.getToppings().forEach(s -> {
            toppingRepo.findByTypeTopping(s).ifPresent(t -> listaToppings.add(t));
        });

        //creo la creacion
        Creation newCreation = new Creation();
        newCreation.setProduct(newPizza);
        newCreation.setToppings(listaToppings);
        newCreation.setCreationDate(pizzaCreated.getOrderDate());
        newCreation.setFavourite(false);
        newCreation.setClient(optionalClient.get());

        //verifico que la creacion no haya ya sido creada por el cliente
        Optional<Creation> optionalCreation = creationRepository.findByUserIdAndPizza(pizzaCreated.getUserId(), newPizza);
        if (optionalCreation.isEmpty() || optionalCreation.get().getToppings().equals(pizzaCreated.getToppings())) {
            creationRepository.save(newCreation);
        }


        ClientOrder newOrder = new ClientOrder();
        newOrder.setCreation(newCreation);
        newOrder.setOrderDate(pizzaCreated.getOrderDate());
        newOrder.setOrderStatus("in basket");
        newOrder.setClient(optionalClient.get());
        clientOrderRepository.save(newOrder);

        return pizzaCreated;
    }


    public BurgerCreationRequest createBurger(BurgerCreationRequest burgerCreated) throws IngredientNotFound, ClientNotFound {

        //busco si existe el cliente
        Optional<Client> optionalClient = clientRepository.findById(burgerCreated.getUserId());

        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client was not found");
        }

        //busco si existen los ingredientes
        Optional<Bread> optionalBread = breadRepository.findByTypeBreadIgnoreCase(burgerCreated.getBread());
        Optional<Meat> optionalMeat = meatRepository.findByTypeMeatIgnoreCase(burgerCreated.getMeat());
        Optional<Cheese> optionalCheese = cheeseRepository.findByTypeCheeseIgnoreCase(burgerCreated.getCheese());


        if (optionalBread.isEmpty()) {
            throw new IngredientNotFound("Bread type not found");
        }
        if (optionalMeat.isEmpty()) {
            throw new IngredientNotFound("Meat type not found");
        }

        if (optionalCheese.isEmpty()) {
            throw new IngredientNotFound("Cheese type not found");
        }


        //creo la nueva burger

        Burger newBurger = new Burger();
        newBurger.setBurgerBread(optionalBread.get());
        newBurger.setBurgerMeat(optionalMeat.get());
        newBurger.setBurgerCheese(optionalCheese.get());

        //busco si la pizza ya ha sido creada

        Optional<Burger> optionalBurger = burgerRepository.findByBreadAndMeatAndCheese(optionalBread.get(), optionalMeat.get(), optionalCheese.get());

        //si es la primera vez que se crea la guardo como una nueva pizza
        if (optionalBurger.isEmpty()) {
            pizzaRepository.save(newBurger);
        }

        //creo la creacion
        Creation newCreation = new Creation();
        newCreation.setProduct(newBurger);
        newCreation.setToppings(burgerCreated.getToppings());
        newCreation.setDressings(burgerCreated.getDressings());
        newCreation.setCreationDate(burgerCreated.getOrderDate());
        newCreation.setFavourite(false);
        newCreation.setClient(optionalClient.get());

        //verifico que la creacion no haya ya sido creada por el cliente
        Optional<Creation> optionalCreation = creationRepository.findByUserIdAndBurger(burgerCreated.getUserId(), newBurger);
        if (optionalCreation.isEmpty() || optionalCreation.get().getToppings().equals(burgerCreated.getToppings())) {
            creationRepository.save(newCreation);
        }


        ClientOrder newOrder = new ClientOrder();
        newOrder.setCreation(newCreation);
        newOrder.setOrderDate(burgerCreated.getOrderDate());
        newOrder.setOrderStatus("in basket");
        clientOrderRepository.save(newOrder);

        return burgerCreated;
    }

    public void addBeverage(ClientOrder order, String beverage) {
        Optional<Beverage> optionalBeverage = beverageRepository.findByTypeBeverageIgnoreCase(beverage);

        if (optionalBeverage.isEmpty()) {
            throw new IngredientNotFound("Type of beverage was not found");
        }

        order.setBeverage(optionalBeverage.get());
    }

    public void addSideOrder(ClientOrder order, String sideOrder) {
        Optional<SideOrder> optionalSideOrder = sideOrderRepository.findByTypeSideOrderIgnoreCase(sideOrder);

        if (optionalSideOrder.isEmpty()) {
            throw new IngredientNotFound("Type of side order was not found");
        }

        order.setSideorder(optionalSideOrder.get());
    }

    public void selectOrderAddress(Long clientOrderId, String address, Long userId) {
        Optional<ClientOrder> clientOrder = clientOrderRepository.findByClientOrderId(clientOrderId);
        clientOrder.get().setOrderAddress(address);
    }

    public void updateOrderStatus(ClientOrder order, String orderStatus) {
        order.setOrderStatus(orderStatus);
    }

}