package com.example.userservice.auth;

import com.example.userservice.user.model.User;
import com.example.userservice.user.repository.UserRepository;
import com.example.userservice.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is already taken!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        String selectedRole = loginRequest.get("role");

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        if (!user.getRole().equalsIgnoreCase(selectedRole)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid role for this user.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
    }
}