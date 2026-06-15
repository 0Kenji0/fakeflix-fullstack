package com.movie.rophim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class RophimApplication {

	public static void main(String[] args) {
		SpringApplication.run(RophimApplication.class, args);
	}

}
