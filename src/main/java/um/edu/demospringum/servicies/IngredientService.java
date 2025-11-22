package um.edu.demospringum.servicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import um.edu.demospringum.dto.IngredientsDto;
import um.edu.demospringum.entities.Burgingr.Bread;
import um.edu.demospringum.entities.Burgingr.Meat;
import um.edu.demospringum.entities.PizzaIngr.Cheese;
import um.edu.demospringum.entities.PizzaIngr.Dough;
import um.edu.demospringum.entities.PizzaIngr.Sauce;
import um.edu.demospringum.entities.PizzaIngr.Size;
import um.edu.demospringum.exceptions.ExistingIngredient;
import um.edu.demospringum.exceptions.IngredientNotFound;
import um.edu.demospringum.repositories.ingredientesRepo.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class IngredientService {

    @Autowired
    private BreadRepository breadRepository;
    @Autowired
    private MeatRepository meatRepository;
    @Autowired
    private DoughRepository doughRepository;
    @Autowired
    private SauceRepository sauceRepository;
    @Autowired
    private SizeRepository sizeRepository;
    @Autowired
    private CheeseRepository cheeseRepository;

    public IngredientService(BreadRepository breadRepository, MeatRepository meatRepository, DoughRepository doughRepository, SauceRepository sauceRepository, SizeRepository sizeRepository, CheeseRepository cheeseRepository){
        this.breadRepository = breadRepository;
        this.meatRepository = meatRepository;
        this.doughRepository = doughRepository;
        this.sauceRepository = sauceRepository;
        this.sizeRepository = sizeRepository;
        this.cheeseRepository = cheeseRepository;
    }


    private <T extends Ingredient> List<IngredientsDto> listMapToDto(List<T> ingredients) {
        List<IngredientsDto> ingredientAvailability = new ArrayList<>();
        for (int ingredient = 0; ingredient < ingredients.size(); ingredient++) {
            ingredientAvailability.add(new IngredientsDto(
                    ingredients.get(ingredient).getId(),           // AGREGAR ID
                    ingredients.get(ingredient).getType(),
                    ingredients.get(ingredient).getAvailability(),
                    ingredients.get(ingredient).getPrice()
            ));
        }
        return ingredientAvailability;
    }

    public List<IngredientsDto> listBreads() {return listMapToDto(breadRepository.findAll()); }

    public List<IngredientsDto> listMeats (){
        return listMapToDto(meatRepository.findAll());
    }

    public List<IngredientsDto> listDoughs (){
        return listMapToDto(doughRepository.findAll());
    }

    public List<IngredientsDto>listSauces (){
        return listMapToDto(sauceRepository.findAll());
    }

    public List<IngredientsDto> listSizes (){
        return listMapToDto(sizeRepository.findAll());
    }

    public List<IngredientsDto> listCheeses (){
        return listMapToDto(cheeseRepository.findAll());
    }



    private <T extends Ingredient> IngredientsDto addMapToDto(String newIngredient, boolean available, BigDecimal price, List<T> ingredients) throws ExistingIngredient{
        for (int ingredient = 0; ingredient < ingredients.size(); ingredient++){
            if (ingredients.get(ingredient).getType().equalsIgnoreCase(newIngredient)){
                throw new ExistingIngredient("This ingredient already exists");
            }
        }

        return new IngredientsDto(newIngredient, available, price);
    }

    public Bread addBread (String newIngredient, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto breadDto = addMapToDto(newIngredient, available, price,  breadRepository.findAll());

        Bread newBread = new Bread();
        newBread.setTypeBread(breadDto.getType());
        newBread.setBreadAvailability(breadDto.isAvailable());
        newBread.setBreadPrice(breadDto.getPrice());
        return breadRepository.save(newBread);
    }

    public Meat addMeat (String newIngredient, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto meatDto = addMapToDto(newIngredient, available, price, meatRepository.findAll());

        Meat newMeat = new Meat();
        newMeat.setTypeMeat(meatDto.getType());
        newMeat.setMeatAvailability(meatDto.isAvailable());
        newMeat.setMeatPrice(meatDto.getPrice());
        return meatRepository.save(newMeat);

    }

    public Dough addDough (String newIngredient, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto doughDto = addMapToDto(newIngredient, available, price, doughRepository.findAll());

        Dough newDough = new Dough();
        newDough.setTypeDough(doughDto.getType());
        newDough.setDoughAvailability(doughDto.isAvailable());
        newDough.setDoughPrice(doughDto.getPrice());
        return doughRepository.save(newDough);
    }

    public Sauce addSauce (String newIngredient, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto sauceDto = addMapToDto(newIngredient, available, price, sauceRepository.findAll());

        Sauce newSauce = new Sauce();
        newSauce.setTypeSauce(sauceDto.getType());
        newSauce.setSauceAvailability(sauceDto.isAvailable());
        newSauce.setSaucePrice(sauceDto.getPrice());
        return sauceRepository.save(newSauce);
    }

    public Size addSize (String newIngredient, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto sizeDto = addMapToDto(newIngredient, available, price, sizeRepository.findAll());

        Size newSize = new Size();
        newSize.setTypeSize(sizeDto.getType());
        newSize.setSizeAvailability(sizeDto.isAvailable());
        newSize.setSizePrice(sizeDto.getPrice());
        return sizeRepository.save(newSize);
    }

    public Cheese addCheese (String newIngredient, boolean available, BigDecimal price) throws ExistingIngredient{
        IngredientsDto sizeDto = addMapToDto(newIngredient, available, price, cheeseRepository.findAll());

        Cheese newCheese = new Cheese();
        newCheese.setTypeCheese(sizeDto.getType());
        newCheese.setCheeseAvailability(sizeDto.isAvailable());
        newCheese.setCheesePrice(sizeDto.getPrice());
        return cheeseRepository.save(newCheese);
    }




    public void updateAvailabilityBread (String breadToUpdate, boolean availability) throws IngredientNotFound{
        List<Bread> breads = breadRepository.findAll();
        boolean breadFound = false;

        for (int bread = 0; bread < breads.size(); bread ++){
            if (breads.get(bread).getTypeBread().equalsIgnoreCase(breadToUpdate)){
                Bread breadInRepo = breads.get(bread);
                breadInRepo.setBreadAvailability(availability);
                breadRepository.save(breadInRepo);
                breadFound = true;
                break;
            }
        }

        if (breadFound == false){
            throw new IngredientNotFound("Type of bread was not found");
        }
    }

    public void updateAvailabilityMeat (String meatToUpdate, boolean availability) throws IngredientNotFound{
        List<Meat> meats = meatRepository.findAll();
        boolean meatFound = false;

        for (int meat = 0; meat < meats.size(); meat ++){
            if (meats.get(meat).getTypeMeat().equalsIgnoreCase(meatToUpdate)){
                Meat meatInRepo = meats.get(meat);
                meatInRepo.setMeatAvailability(availability);
                meatRepository.save(meatInRepo);
                meatFound = true;
                break;
            }
        }

        if (meatFound == false){
            throw new IngredientNotFound("Type of meat was not found");
        }
    }

    public void updateAvailabilityDough (String doughToUpdate, boolean availability) throws IngredientNotFound{
        List<Dough> doughs = doughRepository.findAll();
        boolean doughFound = false;

        for (int dough = 0; dough < doughs.size(); dough ++){
            if (doughs.get(dough).getTypeDough().equalsIgnoreCase(doughToUpdate)){
                Dough doughInRepo = doughs.get(dough);
                doughInRepo.setDoughAvailability(availability);
                doughRepository.save(doughInRepo);
                doughFound = true;
                break;
            }
        }

        if (doughFound == false){
            throw new IngredientNotFound("Type of dough was not found");
        }
    }

    public void updateAvailabilitySauce (String sauceToUpdate, boolean availability) throws IngredientNotFound{
        List<Sauce> sauces = sauceRepository.findAll();
        boolean sauceFound = false;

        for (int sauce = 0; sauce < sauces.size(); sauce ++){
            if (sauces.get(sauce).getTypeSauce().equalsIgnoreCase(sauceToUpdate)){
                Sauce sauceInRepo = sauces.get(sauce);
                sauceInRepo.setSauceAvailability(availability);
                sauceRepository.save(sauceInRepo);
                sauceFound = true;
                break;
            }
        }

        if (sauceFound == false){
            throw new IngredientNotFound("Type of sauce was not found");
        }
    }

    public void updateAvailabilitySize (String sizeToUpdate, boolean availability) throws IngredientNotFound{
        List<Size> sizes = sizeRepository.findAll();
        boolean sizeFound = false;

        for (int size = 0; size < sizes.size(); size ++){
            if (sizes.get(size).getTypeSize().equalsIgnoreCase(sizeToUpdate)){
                Size sizeInRepo = sizes.get(size);
                sizeInRepo.setSizeAvailability(availability);
                sizeRepository.save(sizeInRepo);
                sizeFound = true;
                break;
            }
        }

        if (sizeFound == false){
            throw new IngredientNotFound("Size specified was not found");
        }
    }

    public void updateAvailabilityCheese (String cheeseToUpdate, boolean availability) throws IngredientNotFound{
        List<Cheese> cheeses = cheeseRepository.findAll();
        boolean cheeseFound = false;

        for (int cheese = 0; cheese < cheeses.size(); cheese ++){
            if (cheeses.get(cheese).getTypeCheese().equalsIgnoreCase(cheeseToUpdate)){
                Cheese cheeseInRepo = cheeses.get(cheese);
                cheeseInRepo.setCheeseAvailability(availability);
                cheeseRepository.save(cheeseInRepo);
                cheeseFound = true;
                break;
            }
        }

        if (cheeseFound == false){
            throw new IngredientNotFound("Type of cheese was not found");
        }
    }



    public void updatePriceBread (String breadToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Bread> breads = breadRepository.findAll();
        boolean breadFound = false;

        for (int bread = 0; bread < breads.size(); bread ++){
            if (breads.get(bread).getTypeBread().equalsIgnoreCase(breadToUpdate)){
                Bread breadInRepo = breads.get(bread);
                breadInRepo.setBreadPrice(price);
                breadRepository.save(breadInRepo);
                breadFound = true;
                break;
            }
        }

        if (breadFound == false){
            throw new IngredientNotFound("Type of bread was not found");
        }
    }

    public void updatePriceMeat (String meatToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Meat> meats = meatRepository.findAll();
        boolean meatFound = false;

        for (int meat = 0; meat < meats.size(); meat ++){
            if (meats.get(meat).getTypeMeat().equalsIgnoreCase(meatToUpdate)){
                Meat meatInRepo = meats.get(meat);
                meatInRepo.setMeatPrice(price);
                meatRepository.save(meatInRepo);
                meatFound = true;
                break;
            }
        }

        if (meatFound == false){
            throw new IngredientNotFound("Type of meat was not found");
        }
    }

    public void updatePriceDough (String doughToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Dough> doughs = doughRepository.findAll();
        boolean doughFound = false;

        for (int dough = 0; dough < doughs.size(); dough ++){
            if (doughs.get(dough).getTypeDough().equalsIgnoreCase(doughToUpdate)){
                Dough doughInRepo = doughs.get(dough);
                doughInRepo.setDoughPrice(price);
                doughRepository.save(doughInRepo);
                doughFound = true;
                break;
            }
        }

        if (doughFound == false){
            throw new IngredientNotFound("Type of dough was not found");
        }
    }

    public void updatePriceSauce (String sauceToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Sauce> sauces = sauceRepository.findAll();
        boolean sauceFound = false;

        for (int sauce= 0; sauce < sauces.size(); sauce ++){
            if (sauces.get(sauce).getTypeSauce().equalsIgnoreCase(sauceToUpdate)){
                Sauce sauceInRepo = sauces.get(sauce);
                sauceInRepo.setSaucePrice(price);
                sauceRepository.save(sauceInRepo);
                sauceFound = true;
                break;
            }
        }

        if (sauceFound == false){
            throw new IngredientNotFound("Type of sauce was not found");
        }
    }

    public void updatePriceSize (String sizeToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Size> sizes = sizeRepository.findAll();
        boolean sizeFound = false;

        for (int size = 0; size < sizes.size(); size ++){
            if (sizes.get(size).getTypeSize().equalsIgnoreCase(sizeToUpdate)){
                Size sizeInRepo = sizes.get(size);
                sizeInRepo.setSizePrice(price);
                sizeRepository.save(sizeInRepo);
                sizeFound = true;
                break;
            }
        }

        if (sizeFound == false){
            throw new IngredientNotFound("Size specified was not found");
        }
    }

    public void updatePriceCheese (String cheeseToUpdate, BigDecimal price) throws IngredientNotFound{
        List<Cheese> cheeses = cheeseRepository.findAll();
        boolean cheeseFound = false;

        for (int cheese = 0; cheese < cheeses.size(); cheese ++){
            if (cheeses.get(cheese).getTypeCheese().equalsIgnoreCase(cheeseToUpdate)){
                Cheese cheeseInRepo = cheeses.get(cheese);
                cheeseInRepo.setCheesePrice(price);
                cheeseRepository.save(cheeseInRepo);
                cheeseFound = true;
                break;
            }
        }

        if (cheeseFound == false){
            throw new IngredientNotFound("Type of cheese was not found");
        }
    }

}