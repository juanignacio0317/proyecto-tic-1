package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.BurgerCreationRequest;
import um.edu.demospringum.dto.PizzaCreationRequest;
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
import um.edu.demospringum.exceptions.OrderNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.ClientRepository;
import um.edu.demospringum.repositories.CreationRepository;
import um.edu.demospringum.repositories.productsRepo.*;
import um.edu.demospringum.repositories.ingredientesRepo.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    @Autowired
    private PizzaRepository pizzaRepository;
    @Autowired
    private BurgerRepository burgerRepository;
    @Autowired
    private BreadRepository breadRepository;
    @Autowired
    private MeatRepository meatRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private BeverageRepository beverageRepository;
    @Autowired
    private SideOrderRepository sideOrderRepository;
    @Autowired
    private ToppingRepository toppingRepository;
    @Autowired
    private DressingRepository dressingRepository;

    public CreationService(ProductRepository productRepository, ClientOrderRepository clientOrderRepository, CreationRepository creationRepository, DoughRepository doughRepository, SauceRepository sauceRepository, SizeRepository sizeRepository, CheeseRepository cheeseRepository, PizzaRepository pizzaRepository, ClientRepository clientRepository, BeverageRepository beverageRepository, SideOrderRepository sideOrderRepository, BreadRepository breadRepository, MeatRepository meatRepository, BurgerRepository burgerRepository, ToppingRepository toppingRepository, DressingRepository dressingRepository) {
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

        this.toppingRepository = toppingRepository;
        this.dressingRepository = dressingRepository;
    }

    //funcion para comparar listas de toppings/dressings devuelve true si son diferentes (si son diferentes se crea una nueva creation)
    private boolean listsComparison(List<?> a, List<?> b) {
        Map<Object, Long> countA = a.stream()
                .collect(Collectors.groupingBy(x -> x, Collectors.counting()));

        Map<Object, Long> countB = b.stream()
                .collect(Collectors.groupingBy(x -> x, Collectors.counting()));

        return !countA.equals(countB);
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
        newPizza.setDough(optionalDough.get());
        newPizza.setSauce(optionalSauce.get());
        newPizza.setSize(optionalSize.get());
        newPizza.setCheese(optionalCheese.get());

        //busco si la pizza ya ha sido creada

        Optional<Pizza> optionalPizza = pizzaRepository.findByDoughAndSauceAndSizeAndCheese(optionalDough.get(), optionalSauce.get(), optionalSize.get(), optionalCheese.get());

        //si es la primera vez que se crea la guardo como una nueva pizza
        if (optionalPizza.isEmpty()) {
            pizzaRepository.save(newPizza);
        }

        List<Topping> toppingsList = new LinkedList<>();
        pizzaCreated.getToppings().forEach(s -> {
            toppingRepository.findByTypeTopping(s).ifPresent(t -> toppingsList.add(t));
        });

        //creo la creacion
        Creation newCreation = new Creation();
        newCreation.setProduct(newPizza);
        newCreation.setToppings(toppingsList);
        newCreation.setCreationDate(pizzaCreated.getOrderDate());
        newCreation.setFavourite(false);
        newCreation.setClient(optionalClient.get());

        //verifico que la creacion no haya ya sido creada por el cliente
        Optional<Creation> optionalCreation = creationRepository.findByClientIdAndProductId(pizzaCreated.getUserId(), newPizza.getProductId());
        if (optionalCreation.isEmpty() ||
                listsComparison(optionalCreation.get().getToppings(), toppingsList)){
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

        // 1. Buscar el cliente
        Optional<Client> optionalClient = clientRepository.findById(burgerCreated.getUserId());
        if (optionalClient.isEmpty()) {
            throw new ClientNotFound("Client was not found");
        }

        // 2. Buscar ingredientes obligatorios
        Optional<Bread> optionalBread = breadRepository.findByTypeBreadIgnoreCase(burgerCreated.getBread());
        Optional<Meat> optionalMeat = meatRepository.findByTypeMeatIgnoreCase(burgerCreated.getMeat());

        if (optionalBread.isEmpty()) {
            throw new IngredientNotFound("Bread type not found");
        }
        if (optionalMeat.isEmpty()) {
            throw new IngredientNotFound("Meat type not found");
        }

        // 3. Buscar queso (opcional)
        Optional<Cheese> optionalCheese = Optional.empty();
        String cheeseType = burgerCreated.getCheese();

        if (cheeseType != null &&
                !cheeseType.isEmpty() &&
                !cheeseType.equalsIgnoreCase("null") &&
                !cheeseType.equalsIgnoreCase("sin queso")) {

            optionalCheese = cheeseRepository.findByTypeCheeseIgnoreCase(cheeseType);
            if (optionalCheese.isEmpty()) {
                throw new IngredientNotFound("Cheese type not found: " + cheeseType);
            }
        }

        // 4. Cargar toppings
        List<Topping> toppingsList = new LinkedList<>();
        BigDecimal toppingsPrice = BigDecimal.ZERO;
        if (burgerCreated.getToppings() != null) {
            for (String toppingName : burgerCreated.getToppings()) {
                Optional<Topping> optionalTopping = toppingRepository.findByTypeTopping(toppingName);
                if (optionalTopping.isPresent()) {
                    Topping topping = optionalTopping.get();
                    toppingsList.add(topping);
                    toppingsPrice = toppingsPrice.add(topping.getPrice());
                }
            }
        }

        // 5. Cargar dressings
        List<Dressing> dressingsList = new LinkedList<>();
        BigDecimal dressingsPrice = BigDecimal.ZERO;
        if (burgerCreated.getDressings() != null) {
            for (String dressingName : burgerCreated.getDressings()) {
                Optional<Dressing> optionalDressing = dressingRepository.findByTypeDressing(dressingName);
                if (optionalDressing.isPresent()) {
                    Dressing dressing = optionalDressing.get();
                    dressingsList.add(dressing);
                    dressingsPrice = dressingsPrice.add(dressing.getPrice());
                }
            }
        }

        // 6. Calcular precio total
        BigDecimal totalPrice = BigDecimal.ZERO;
        totalPrice = totalPrice.add(optionalBread.get().getPrice());
        totalPrice = totalPrice.add(optionalMeat.get().getPrice());
        if (optionalCheese.isPresent()) {
            totalPrice = totalPrice.add(optionalCheese.get().getPrice());
        }
        totalPrice = totalPrice.add(toppingsPrice);
        totalPrice = totalPrice.add(dressingsPrice);

        // 7. Buscar o crear Burger (SOLO pan + carne + queso)
        // ✅ CAMBIO: Usar findFirst para evitar error de múltiples resultados
        Optional<Burger> optionalBurger = burgerRepository.findFirstByBurgerBreadAndBurgerMeatAndBurgerCheese(
                optionalBread.get(),
                optionalMeat.get(),
                optionalCheese.orElse(null)
        );

        Burger burger;

        if (optionalBurger.isPresent()) {
            // Reutilizar burger existente
            burger = optionalBurger.get();
        } else {
            // Crear nueva burger
            burger = new Burger();
            burger.setType("BURGER");


            // Precio base (solo ingredientes principales)
            BigDecimal basePrice = optionalBread.get().getPrice()
                    .add(optionalMeat.get().getPrice());
            if (optionalCheese.isPresent()) {
                basePrice = basePrice.add(optionalCheese.get().getPrice());
            }
            burger.setPrice(basePrice);

            burger.setBurgerBread(optionalBread.get());
            burger.setBurgerMeat(optionalMeat.get());
            if (optionalCheese.isPresent()) {
                burger.setBurgerCheese(optionalCheese.get());
            }

            burger = burgerRepository.save(burger);
        }

        // 8. ✅ IMPORTANTE: Verificar si ya existe esta MISMA Creation para este cliente
        // Buscar todas las creations de este cliente con este burger
        List<Creation> existingCreations = creationRepository.findByClientAndProduct(
                optionalClient.get(),
                burger
        );

        Creation creation = null;
        boolean creationExists = false;

        // Verificar si alguna creation tiene los MISMOS toppings y dressings
        for (Creation existingCreation : existingCreations) {
            boolean sameToppings = !listsComparison(existingCreation.getToppings(), toppingsList);
            boolean sameDressings = !listsComparison(existingCreation.getDressings(), dressingsList);

            if (sameToppings && sameDressings) {
                // Ya existe esta creation exacta para este cliente
                creation = existingCreation;
                creationExists = true;
                break;
            }
        }

        // 9. Crear nueva creation solo si NO existe
        if (!creationExists) {
            creation = new Creation();
            creation.setProduct(burger);
            creation.setToppings(toppingsList);
            creation.setDressings(dressingsList);
            creation.setCreationDate(LocalDateTime.now());
            creation.setFavourite(false);
            creation.setClient(optionalClient.get());
            creation = creationRepository.save(creation);
        }

        // 10. Crear orden (SIEMPRE se crea una nueva orden)
        ClientOrder newOrder = new ClientOrder();
        newOrder.setCreation(creation);
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setOrderStatus("in basket");
        newOrder.setClient(optionalClient.get());
        clientOrderRepository.save(newOrder);

        return burgerCreated;
    }

    public void addBeverage(Long clientOrderId, String beverage) throws OrderNotFound, IngredientNotFound {
        Optional<Beverage> optionalBeverage = beverageRepository.findByTypeBeverageIgnoreCase(beverage);
        Optional<ClientOrder> optionalClientOrder = clientOrderRepository.findById(clientOrderId);

        if (optionalBeverage.isEmpty()) {
            throw new IngredientNotFound("Type of beverage was not found");
        }

        if (optionalClientOrder.isEmpty()) {
            throw new OrderNotFound("The order was not found");
        }
        optionalClientOrder.get().setBeverage(optionalBeverage.get());
        clientOrderRepository.save(optionalClientOrder.get());
    }

    public void addSideOrder(Long clientOrderId, String sideOrder) throws OrderNotFound, IngredientNotFound {
        Optional<SideOrder> optionalSideOrder = sideOrderRepository.findByTypeSideOrderIgnoreCase(sideOrder);
        Optional<ClientOrder> optionalClientOrder = clientOrderRepository.findById(clientOrderId);

        if (optionalSideOrder.isEmpty()) {
            throw new IngredientNotFound("Type of beverage was not found");
        }

        if (optionalClientOrder.isEmpty()) {
            throw new OrderNotFound("The order was not found");
        }
        optionalClientOrder.get().setSideOrder(optionalSideOrder.get());
        clientOrderRepository.save(optionalClientOrder.get());
    }

    public void selectOrderAddress(Long clientOrderId, String address) throws OrderNotFound {
        Optional<ClientOrder> optionalClientOrder = clientOrderRepository.findById(clientOrderId);

        if (optionalClientOrder.isEmpty()) {
            throw new OrderNotFound("The order was not found");
        }
        optionalClientOrder.get().setOrderAddress(address);
        clientOrderRepository.save(optionalClientOrder.get());
    }


}