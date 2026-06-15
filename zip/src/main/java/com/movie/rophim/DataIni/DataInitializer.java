package com.movie.rophim.DataIni;

import com.movie.rophim.Entity.user.Role;
import com.movie.rophim.Repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (roleRepository.count() == 0) {
            // FIX: bỏ prefix ROLE_ vì CustomUserDetailsService đã tự thêm
            roleRepository.save(Role.builder().name("USER").build());
            roleRepository.save(Role.builder().name("ADMIN").build());
        }
    }

}
