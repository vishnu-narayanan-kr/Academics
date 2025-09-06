package onlineFoodDelivery.Service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import onlineFoodDelivery.model.*;
import onlineFoodDelivery.repository.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Injected from SecurityConfig

    public User register(String username, String rawPassword, Set<ERole> roles) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username is already taken");
        }
        
        User user = new User();
        user.setUsername(username);

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(rawPassword));

        // Set roles
        Set<Role> userRoles = roles.stream()
            .map(roleName -> roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
            .collect(Collectors.toSet());
        user.setRoles(userRoles);

        return userRepository.save(user);
    }
}
