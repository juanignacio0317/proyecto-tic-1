package um.edu.demospringum.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddressResponseDto {
    private List<String> addresses;
}