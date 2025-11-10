package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.hibernate.metamodel.mapping.ForeignKeyDescriptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
import um.edu.demospringum.repositories.productsRepo.BeverageRepository;
import um.edu.demospringum.repositories.productsRepo.PizzaRepository;
import um.edu.demospringum.repositories.productsRepo.ProductRepository;
import um.edu.demospringum.repositories.ingredientesRepo.*;
import um.edu.demospringum.repositories.productsRepo.SideOrderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CreationService {

    @Autowired
    private ProductRepository productRepository;
    private ClientOrderRepository clientOrderRepository;
    private CreationRepository creationRepository;

    private DoughRepository doughRepository;
    private SauceRepository sauceRepository;
    private SizeRepository sizeRepository;
    private CheeseRepository cheeseRepository;
    private PizzaRepository pizzaRepository;

    private BreadRepository breadRepository;
    private MeatRepository meatRepository;

    private ClientRepository clientRepository;

    private BeverageRepository beverageRepository;
    private SideOrderRepository sideOrderRepository;

    public CreationService(ProductRepository productRepository, ClientOrderRepository clientOrderRepository, CreationRepository creationRepository, DoughRepository doughRepository, SauceRepository sauceRepository, SizeRepository sizeRepository, CheeseRepository cheeseRepository, PizzaRepository pizzaRepository, ClientRepository clientRepository, BeverageRepository beverageRepository, SideOrderRepository sideOrderRepository, BreadRepository breadRepository, MeatRepository meatRepository) {
        this.productRepository = productRepository;
        this.clientOrderRepository = clientOrderRepository;
        this.creationRepository = creationRepository;
        this.pizzaRepository = pizzaRepository;

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
    private Pizza createPizza(String dough, String sauce, String size, String cheese, List<Topping> toppings, Long userId, LocalDateTime orderDate) throws IngredientNotFound, ClientNotFound{

        //busco si existe el cliente
        Client optionalClient = clientRepository.findById(request.getClientid());

        if (optionalClient.isEmpty()){
            throw new ClientNotFound("Client was not found");
        }

        //busco si existen los ingredientes
        Optional<Dough> optionalDough = doughRepository.findByTypeDoughIgnoreCase(dough);
        Optional<Sauce> optionalSauce = sauceRepository.findByTypeSauceIgnoreCase(sauce);
        Optional<Size> optionalSize = sizeRepository.findByTypeSizeIgnoreCase(size);
        Optional<Cheese> optionalCheese = cheeseRepository.findByTypeCheeseIgnoreCase(cheese);


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
        if (optionalPizza.isEmpty()){
            pizzaRepository.save(newPizza);
        }

        //creo la creacion
        Creation newCreation = new Creation();
        newCreation.setProduct(newPizza);
        newCreation.setToppings(toppings);
        newCreation.setCreationDate(orderDate);
        newCreation.setFavourite(false);
        newCreation.setClient();

        //verifico que la creacion no haya ya sido creada por el cliente
        Optional<Creation> optionalCreation = creationRepository.findByUserIdAndPizza(userId, newPizza);
        if (optionalCreation.isEmpty() || optionalCreation.get().getToppings().equals(toppings)){
            creationRepository.save(newCreation);
        }


        ClientOrder newOrder = new ClientOrder();
        newOrder.setCreation(newCreation);
        newOrder.setOrderDate(orderDate);
        newOrder.setOrderStatus("in basket");
        clientOrderRepository.save(newOrder);

        return newPizza;
    }



    private Burger createBurger(String bread, String meat, String cheese, List<Topping> toppings, List<Dressing> dressings, Long userId, LocalDateTime orderDate) throws IngredientNotFound, ClientNotFound{

        //busco si existe el cliente
        Client optionalClient = clientRepository.findById(request.getClientid());

        if (optionalClient.isEmpty()){
            throw new ClientNotFound("Client was not found");
        }

        //busco si existen los ingredientes
        Optional<Bread> optionalBread = breadRepository.findByTypeBreadIgnoreCase(bread);
        Optional<Meat> optionalMeat = meatRepository.findByTypeMeatIgnoreCase(meat);
        Optional<Cheese> optionalCheese = cheeseRepository.findByTypeCheeseIgnoreCase(cheese);


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

        Optional<Pizza> optionalPizza = pizzaRepository.findByDoughAndSauceAndSizeAndCheese(optionalDough.get(), optionalSauce.get(), optionalSize.get(), optionalCheese.get());

        //si es la primera vez que se crea la guardo como una nueva pizza
        if (optionalPizza.isEmpty()){
            pizzaRepository.save(newPizza);
        }

        //creo la creacion
        Creation newCreation = new Creation();
        newCreation.setProduct(newPizza);
        newCreation.setToppings(toppings);
        newCreation.setCreationDate(orderDate);
        newCreation.setFavourite(false);
        newCreation.setClient();

        //verifico que la creacion no haya ya sido creada por el cliente
        Optional<Creation> optionalCreation = creationRepository.findByUserIdAndPizza(userId, newPizza);
        if (optionalCreation.isEmpty() || optionalCreation.get().getToppings().equals(toppings)){
            creationRepository.save(newCreation);
        }


        ClientOrder newOrder = new ClientOrder();
        newOrder.setCreation(newCreation);
        newOrder.setOrderDate(orderDate);
        newOrder.setOrderStatus("in basket");
        clientOrderRepository.save(newOrder);

        return newPizza;
    }

    private void addBeverage(ClientOrder order, String beverage){
        Optional<Beverage> optionalBeverage = beverageRepository.findByTypeBeverageIgnoreCase(beverage);

        if (optionalBeverage.isEmpty()){
            throw new IngredientNotFound("Type of beverage was not found");
        }

        order.setBeverage(optionalBeverage.get());
    }

    private void addSideOrder(ClientOrder order, String sideOrder){
        Optional<SideOrder> optionalSideOrder = sideOrderRepository.findByTypeSideOrderIgnoreCase(sideOrder);

        if (optionalSideOrder.isEmpty()){
            throw new IngredientNotFound("Type of side order was not found");
        }

        order.setSideorder(optionalSideOrder.get());
    }

    private void selectOrderAddress(){}

    private void updateOrderStatus(ClientOrder order, String orderStatus){
        order.setOrderStatus(orderStatus);
    }

}