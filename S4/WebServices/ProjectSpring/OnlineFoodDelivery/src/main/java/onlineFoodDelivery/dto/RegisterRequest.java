package onlineFoodDelivery.dto;

import java.util.Set;

import lombok.Data;
import onlineFoodDelivery.model.ERole;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private Set<ERole> roles; // e.g., ["ROLE_CUSTOMER", "ROLE_MANAGER"]
}
