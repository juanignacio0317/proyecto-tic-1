package um.edu.demospringum.servicies;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.entities.Products.Pizza;
import um.edu.demospringum.entities.Products.Product;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.repositories.ClientOrderRepository;
import um.edu.demospringum.repositories.CreationRepository;
import um.edu.demospringum.repositories.PizzaRepository;
import um.edu.demospringum.repositories.ProductRepository;
import um.edu.demospringum.repositories.ingredientesRepo.*;

import java.time.LocalDateTime;
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

    public CreationService(ProductRepository productRepository, ClientOrderRepository clientOrderRepository, CreationRepository creationRepository, DoughRepository doughRepository, SauceRepository sauceRepository, SizeRepository sizeRepository, CheeseRepository cheeseRepository, PizzaRepository pizzaRepository) {
        this.productRepository = productRepository;
        this.clientOrderRepository = clientOrderRepository;
        this.creationRepository = creationRepository;
        this.pizzaRepository = pizzaRepository;

        this.doughRepository = doughRepository;
        this.sauceRepository = sauceRepository;
        this.sizeRepository = sizeRepository;
        this.cheeseRepository = cheeseRepository;
    }

    @Transactional
    private Pizza createPizza(String dough, String sauce, String size, String cheese, Long userid, LocalDateTime fechaPedido) throws IngredientNotFound{
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

        Optional<Pizza> optionalPizza = pizzaRepository.findByDoughAndSauceAndSizeAndCheese(optionalDough.get(), optionalSauce.get(), optionalSize.get(), optionalCheese.get());

        if (optionalPizza.isEmpty()){
            Product newProduct = new  {
            }
        }

    }



}