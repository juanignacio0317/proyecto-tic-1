package um.edu.demospringum.servicies;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.CreationRepository;
import um.edu.demospringum.repositories.ingredientesRepo.CheeseRepository;
import um.edu.demospringum.repositories.ingredientesRepo.DoughRepository;
import um.edu.demospringum.repositories.ingredientesRepo.SauceRepository;
import um.edu.demospringum.repositories.ingredientesRepo.SizeRepository;
import um.edu.demospringum.repositories.productsRepo.PizzaRepository;
import um.edu.demospringum.repositories.productsRepo.ProductRepository;

import java.time.LocalDateTime;

@Service
public class ProductsDataService {

    @Autowired
    private ProductRepository productRepository;
    private ClientOrderRepository clientOrderRepository;
    private CreationRepository creationRepository;

    private DoughRepository doughRepository;
    private SauceRepository sauceRepository;
    private SizeRepository sizeRepository;
    private CheeseRepository cheeseRepository;
    private PizzaRepository pizzaRepository;

    public ProductsDataService(ProductRepository productRepository, ClientOrderRepository clientOrderRepository, CreationRepository creationRepository, DoughRepository doughRepository, SauceRepository sauceRepository, SizeRepository sizeRepository, CheeseRepository cheeseRepository, PizzaRepository pizzaRepository) {
        this.productRepository = productRepository;
        this.clientOrderRepository = clientOrderRepository;
        this.creationRepository = creationRepository;
        this.pizzaRepository = pizzaRepository;

        this.doughRepository = doughRepository;
        this.sauceRepository = sauceRepository;
        this.sizeRepository = sizeRepository;
        this.cheeseRepository = cheeseRepository;
    }


    private void listClientOrders(){}

    private void listClientOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate){

    }

    private void listOrdersBetweenDates(){}


    private void listFavourites(){}

    private void updateFavourites(){}

    private void listTopProducts(){}

    private void listTopPizzas(){}

    private void listTopBurgers(){}



}
