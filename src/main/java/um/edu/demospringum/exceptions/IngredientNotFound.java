package um.edu.demospringum.exceptions;

public class IngredientNotFound extends RuntimeException {
    public IngredientNotFound(String message) {
        super(message);
    }
}
