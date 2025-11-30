package com.dynamicridesharing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;   
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableAsync      // Enables background thread processing for tasks like sending emails
@EnableScheduling // Enables scheduled tasks for ride reminders
public class DynamicRideSharingApplication {

	public static void main(String[] args) {
		SpringApplication.run(DynamicRideSharingApplication.class, args);
	}

}
