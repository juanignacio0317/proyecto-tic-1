package um.edu.demospringum.servicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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