package com.example.adminservice.auth;

import com.example.adminservice.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.get("username"), loginRequest.get("password"))
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
    }
}