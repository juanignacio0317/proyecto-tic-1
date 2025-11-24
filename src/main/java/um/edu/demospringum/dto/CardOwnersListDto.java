package um.edu.demospringum.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class CardOwnersListDto {
    private String cardNumber;
    private int totalOwners;
    private List<CardOwnerInfoDto> owners;
}