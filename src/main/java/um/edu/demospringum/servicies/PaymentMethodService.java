package um.edu.demospringum.servicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.demospringum.dto.CardOwnerInfoDto;
import um.edu.demospringum.dto.CardOwnersListDto;
import um.edu.demospringum.dto.PaymentMethodRequestDto;
import um.edu.demospringum.dto.PaymentMethodResponseDto;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.entities.PaymentMethod;
import um.edu.demospringum.repositories.ClientRepository;
import um.edu.demospringum.repositories.PaymentMethodRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public CardOwnersListDto getAllCardOwners(String cardNumber) {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAllByCardNumber(cardNumber);

        if (paymentMethods.isEmpty()) {
            throw new RuntimeException("Tarjeta no encontrada");
        }

        CardOwnersListDto response = new CardOwnersListDto();
        response.setCardNumber(maskCardNumber(cardNumber));
        response.setTotalOwners(paymentMethods.size());

        List<CardOwnerInfoDto> owners = paymentMethods.stream()
                .map(this::convertToCardOwnerInfo)
                .collect(Collectors.toList());

        response.setOwners(owners);

        return response;
    }


    @Transactional(readOnly = true)
    public CardOwnerInfoDto getCardOwnerInfo(String cardNumber) {
        PaymentMethod paymentMethod = paymentMethodRepository.findByCardNumber(cardNumber)
                .orElseThrow(() -> new RuntimeException("Tarjeta no encontrada"));

        return convertToCardOwnerInfo(paymentMethod);
    }


    private CardOwnerInfoDto convertToCardOwnerInfo(PaymentMethod paymentMethod) {
        Client client = paymentMethod.getClient();

        CardOwnerInfoDto dto = new CardOwnerInfoDto();

        // Datos del cliente
        dto.setClientId(client.getUserId());
        dto.setName(client.getName());
        dto.setSurname(client.getSurname());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setAddresses(client.getAddresses());

        // Datos de la tarjeta
        dto.setCardHolderName(paymentMethod.getCardHolderName());
        dto.setCardNumber(maskCardNumber(paymentMethod.getCardNumber()));
        dto.setExpirationDate(paymentMethod.getExpirationDate());
        dto.setCardBrand(paymentMethod.getCardBrand());

        return dto;
    }

    @Transactional
    public PaymentMethodResponseDto addPaymentMethod(Long clientId, PaymentMethodRequestDto requestDto) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setCardHolderName(requestDto.getCardHolderName());
        paymentMethod.setCardNumber(requestDto.getCardNumber());
        paymentMethod.setExpirationDate(requestDto.getExpirationDate());
        paymentMethod.setCardBrand(requestDto.getCardBrand());
        paymentMethod.setCvv(requestDto.getCvv());
        paymentMethod.setClient(client);

        PaymentMethod savedPaymentMethod = paymentMethodRepository.save(paymentMethod);

        return convertToResponseDto(savedPaymentMethod);
    }

    @Transactional(readOnly = true)
    public List<PaymentMethodResponseDto> getClientPaymentMethods(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        return client.getPaymentMethods().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePaymentMethod(Long clientId, Long paymentMethodId) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        if (!paymentMethod.getClient().getUserId().equals(clientId)) {
            throw new RuntimeException("Este método de pago no pertenece al cliente");
        }

        paymentMethodRepository.delete(paymentMethod);
    }

    @Transactional(readOnly = true)
    public PaymentMethodResponseDto getPaymentMethodById(Long clientId, Long paymentMethodId) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));

        if (!paymentMethod.getClient().getUserId().equals(clientId)) {
            throw new RuntimeException("Este método de pago no pertenece al cliente");
        }

        return convertToResponseDto(paymentMethod);
    }

    private PaymentMethodResponseDto convertToResponseDto(PaymentMethod paymentMethod) {
        PaymentMethodResponseDto dto = new PaymentMethodResponseDto();
        dto.setIdPM(paymentMethod.getIdPM());
        dto.setCardHolderName(paymentMethod.getCardHolderName());
        // Solo mostrar los últimos 4 dígitos por seguridad
        dto.setCardNumber(maskCardNumber(paymentMethod.getCardNumber()));
        dto.setExpirationDate(paymentMethod.getExpirationDate());
        dto.setCardBrand(paymentMethod.getCardBrand());
        return dto;
    }

    private String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }
}