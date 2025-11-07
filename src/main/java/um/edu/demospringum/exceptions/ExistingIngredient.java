package um.edu.demospringum.exceptions;

public class ExistingIngredient extends RuntimeException {
    public ExistingIngredient(String message) {
        super(message);
    }
}
