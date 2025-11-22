package um.edu.demospringum.servicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.Products.*;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.repositories.productsRepo.BeverageRepository;
import um.edu.demospringum.repositories.productsRepo.DressingRepository;
import um.edu.demospringum.repositories.productsRepo.SideOrderRepository;
import um.edu.demospringum.repositories.productsRepo.ToppingRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private BeverageRepository beverageRepository;
    @Autowired
    private SideOrderRepository sideOrderRepository;
    @Autowired
    private ToppingRepository toppingRepository;
    @Autowired
    private DressingRepository dressingRepository;


    public ProductService(BeverageRepository beverageRepository, SideOrderRepository sideOrderRepository, ToppingRepository toppingRepository, DressingRepository dressingRepository){
        this.beverageRepository = beverageRepository;
        this.sideOrderRepository = sideOrderRepository;
        this.toppingRepository = toppingRepository;
        this.dressingRepository = dressingRepository;
    }

    private <T extends Ingredient> List<IngredientsDto> listMapToDto(List<T> ingredients) {
        List<IngredientsDto> ingredientAvailability = new ArrayList<>();
        for (int ingredient = 0; ingredient < ingredients.size(); ingredient++){
            ingredientAvailability.add(new IngredientsDto(
                    ingredients.get(ingredient).getId(),
                    ingredients.get(ingredient).getType(),
                    ingredients.get(ingredient).getAvailability(),
                    ingredients.get(ingredient).getPrice()
            ));
        }
        return ingredientAvailability;
    }

    public List<IngredientsDto> listBeverages() {return listMapToDto(beverageRepository.findAll()); }

    public List<IngredientsDto> listSideOrders() {return listMapToDto(sideOrderRepository.findAll()); }

    public List<IngredientsDto> listToppings() {return listMapToDto(toppingRepository.findAll()); }

    public List<IngredientsDto> listDressings() {return listMapToDto(dressingRepository.findAll()); }




    private <T extends Ingredient> IngredientsDto addMapToDto(String newIngredient, boolean available, BigDecimal price, List<T> ingredients) throws ExistingIngredient {
        for (int ingredient = 0; ingredient < ingredients.size(); ingredient++){
            if (ingredients.get(ingredient).getType().equalsIgnoreCase(newIngredient)){
                throw new ExistingIngredient("This product already exists");
            }
        }

        return new IngredientsDto(newIngredient, available, price);
    }

    public Beverage addBeverage (String newProduct, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto beverageDto = addMapToDto(newProduct, available, price,  beverageRepository.findAll());

        Beverage newBeverage = new Beverage();
        newBeverage.setTypeBeverage(beverageDto.getType());
        newBeverage.setBeverageAvailability(beverageDto.isAvailable());
        newBeverage.setBeveragePrice(beverageDto.getPrice());
        return beverageRepository.save(newBeverage);
    }

    public SideOrder addSideOrder (String newProduct, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto sideOrderDto = addMapToDto(newProduct, available, price,  sideOrderRepository.findAll());

        SideOrder newSideOrder = new SideOrder();
        newSideOrder.setTypeSideOrder(sideOrderDto.getType());
        newSideOrder.setSideOrderAvailability(sideOrderDto.isAvailable());
        newSideOrder.setSideOrderPrice(sideOrderDto.getPrice());
        return sideOrderRepository.save(newSideOrder);
    }

    public Topping addTopping (String newProduct, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto toppingDto = addMapToDto(newProduct, available, price,  toppingRepository.findAll());

        Topping newTopping = new Topping();
        newTopping.setTypeTopping(toppingDto.getType());
        newTopping.setToppingAvailability(toppingDto.isAvailable());
        newTopping.setToppingPrice(toppingDto.getPrice());
        return toppingRepository.save(newTopping);
    }

    public Dressing addDressing (String newProduct, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto dressingDto = addMapToDto(newProduct, available, price,  dressingRepository.findAll());

        Dressing newDressing = new Dressing();
        newDressing.setTypeDressing(dressingDto.getType());
        newDressing.setDressingAvailability(dressingDto.isAvailable());
        newDressing.setDressingPrice(dressingDto.getPrice());
        return dressingRepository.save(newDressing);
    }




    public void updateAvailabilityBeverage (String beverageToUpdate, boolean availability) throws IngredientNotFound {
        List<Beverage> beverages = beverageRepository.findAll();
        boolean beverageFound = false;

        for (int beverage = 0; beverage < beverages.size(); beverage ++){
            if (beverages.get(beverage).getTypeBeverage().equalsIgnoreCase(beverageToUpdate)){
                Beverage beverageInRepo = beverages.get(beverage);
                beverageInRepo.setBeverageAvailability(availability);
                beverageRepository.save(beverageInRepo);
                beverageFound = true;
                break;
            }
        }

        if (beverageFound == false){
            throw new IngredientNotFound("Beverage was not found");
        }
    }

    public void updateAvailabilitySideOrder (String sideOrderToUpdate, boolean availability) throws IngredientNotFound {
        List<SideOrder> sideOrders = sideOrderRepository.findAll();
        boolean sideOrderFound = false;

        for (int sideOrder = 0; sideOrder < sideOrders.size(); sideOrder ++){
            if (sideOrders.get(sideOrder).getTypeSideOrder().equalsIgnoreCase(sideOrderToUpdate)){
                SideOrder sideOrderInRepo = sideOrders.get(sideOrder);
                sideOrderInRepo.setSideOrderAvailability(availability);
                sideOrderRepository.save(sideOrderInRepo);
                sideOrderFound = true;
                break;
            }
        }

        if (sideOrderFound == false){
            throw new IngredientNotFound("Side order was not found");
        }
    }

    public void updateAvailabilityTopping (String toppingToUpdate, boolean availability) throws IngredientNotFound {
        List<Topping> toppings = toppingRepository.findAll();
        boolean toppingFound = false;

        for (int topping = 0; topping < toppings.size(); topping ++){
            if (toppings.get(topping).getTypeTopping().equalsIgnoreCase(toppingToUpdate)){
                Topping toppingInRepo = toppings.get(topping);
                toppingInRepo.setToppingAvailability(availability);
                toppingRepository.save(toppingInRepo);
                toppingFound = true;
                break;
            }
        }

        if (toppingFound == false){
            throw new IngredientNotFound("Topping was not found");
        }
    }

    public void updateAvailabilityDressing (String dressingToUpdate, boolean availability) throws IngredientNotFound {
        List<Dressing> dressings = dressingRepository.findAll();
        boolean dressingFound = false;

        for (int dressing = 0; dressing < dressings.size(); dressing ++){
            if (dressings.get(dressing).getTypeDressing().equalsIgnoreCase(dressingToUpdate)){
                Dressing dressingInRepo = dressings.get(dressing);
                dressingInRepo.setDressingAvailability(availability);
                dressingRepository.save(dressingInRepo);
                dressingFound = true;
                break;
            }
        }

        if (dressingFound == false){
            throw new IngredientNotFound("Dressing was not found");
        }
    }




    public void updatePriceBeverage (String beverageToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Beverage> beverages = beverageRepository.findAll();
        boolean beverageFound = false;

        for (int beverage = 0; beverage < beverages.size(); beverage ++){
            if (beverages.get(beverage).getTypeBeverage().equalsIgnoreCase(beverageToUpdate)){
                Beverage beverageInRepo = beverages.get(beverage);
                beverageInRepo.setBeveragePrice(price);
                beverageRepository.save(beverageInRepo);
                beverageFound = true;
                break;
            }
        }


        if (beverageFound == false){
            throw new IngredientNotFound("Beverage was not found");
        }
    }

    public void updatePriceSideOrder (String sideOrderToUpdate, BigDecimal price) throws IngredientNotFound{
        List<SideOrder> sideOrders = sideOrderRepository.findAll();
        boolean sideOrderFound = false;

        for (int sideOrder = 0; sideOrder < sideOrders.size(); sideOrder ++){
            if (sideOrders.get(sideOrder).getTypeSideOrder().equalsIgnoreCase(sideOrderToUpdate)){
                SideOrder sideOrderInRepo = sideOrders.get(sideOrder);
                sideOrderInRepo.setSideOrderPrice(price);
                sideOrderRepository.save(sideOrderInRepo);
                sideOrderFound = true;
                break;
            }
        }


        if (sideOrderFound == false){
            throw new IngredientNotFound("Side order was not found");
        }
    }

    public void updatePriceTopping (String toppingToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Topping> toppings = toppingRepository.findAll();
        boolean toppingFound = false;

        for (int topping = 0; topping < toppings.size(); topping ++){
            if (toppings.get(topping).getTypeTopping().equalsIgnoreCase(toppingToUpdate)){
                Topping toppingInRepo = toppings.get(topping);
                toppingInRepo.setToppingPrice(price);
                toppingRepository.save(toppingInRepo);
                toppingFound = true;
                break;
            }
        }


        if (toppingFound == false){
            throw new IngredientNotFound("Topping was not found");
        }
    }

    public void updatePriceDressing (String dressingToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Dressing> dressings = dressingRepository.findAll();
        boolean dressingFound = false;

        for (int dressing = 0; dressing < dressings.size(); dressing ++){
            if (dressings.get(dressing).getTypeDressing().equalsIgnoreCase(dressingToUpdate)){
                Dressing dressingInRepo = dressings.get(dressing);
                dressingInRepo.setDressingPrice(price);
                dressingRepository.save(dressingInRepo);
                dressingFound = true;
                break;
            }
        }


        if (dressingFound == false){
            throw new IngredientNotFound("Dressing was not found");
        }
    }





}