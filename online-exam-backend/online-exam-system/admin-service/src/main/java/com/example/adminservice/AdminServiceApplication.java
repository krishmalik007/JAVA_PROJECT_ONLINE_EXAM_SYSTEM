package com.example.adminservice;

import com.example.adminservice.user.model.User;
import com.example.adminservice.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {"com.example.adminservice.user.repository", "com.example.adminservice.exam.repository"})
@EntityScan(basePackages = {"com.example.adminservice.user.model", "com.example.adminservice.exam.model"})
public class AdminServiceApplication {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(AdminServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner createAdminOnStartup() {
        return args -> {
            Optional<User> adminExists = userRepository.findByUsername("admin");
            if (!adminExists.isPresent()) {
                User admin = new User();
                admin.setUsername("admin1");
                admin.setEmail("admin123@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("Default admin user created: admin1");
            }
        };
    }
}