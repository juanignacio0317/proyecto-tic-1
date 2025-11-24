package um.edu.demospringum.servicies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import um.edu.demospringum.dto.AddressRequestDto;
import um.edu.demospringum.dto.AddressResponseDto;
import um.edu.demospringum.entities.Client;
import um.edu.demospringum.repositories.ClientRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class AddressService {

    @Autowired
    private ClientRepository clientRepository;

    @Transactional
    public AddressResponseDto addAddress(Long clientId, AddressRequestDto requestDto) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (client.getAddresses() == null) {
            client.setAddresses(new ArrayList<>());
        }

        // Verificar que no exista ya la misma dirección
        if (!client.getAddresses().contains(requestDto.getAddress())) {
            client.getAddresses().add(requestDto.getAddress());
            clientRepository.save(client);
        } else {
            throw new RuntimeException("Esta dirección ya existe");
        }

        AddressResponseDto response = new AddressResponseDto();
        response.setAddresses(client.getAddresses());
        return response;
    }

    @Transactional(readOnly = true)
    public AddressResponseDto getClientAddresses(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        AddressResponseDto response = new AddressResponseDto();
        response.setAddresses(client.getAddresses() != null ? client.getAddresses() : new ArrayList<>());
        return response;
    }

    @Transactional
    public void deleteAddress(Long clientId, String address) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (client.getAddresses() != null) {
            client.getAddresses().remove(address);
            clientRepository.save(client);
        } else {
            throw new RuntimeException("Dirección no encontrada");
        }
    }

    @Transactional
    public AddressResponseDto updateAddress(Long clientId, String oldAddress, String newAddress) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (client.getAddresses() != null) {
            int index = client.getAddresses().indexOf(oldAddress);
            if (index != -1) {
                client.getAddresses().set(index, newAddress);
                clientRepository.save(client);
            } else {
                throw new RuntimeException("Dirección no encontrada");
            }
        }

        AddressResponseDto response = new AddressResponseDto();
        response.setAddresses(client.getAddresses());
        return response;
    }
}