package edu.cit.alibata.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@Profile("dev")
@Configuration
@OpenAPIDefinition(
    info = @Info (
        contact = @Contact (
            name = "Samuel",
            email = "abrenicasamuel@gmail.com"
        ),
        description = "OpenAPI Documentation for AliBATA - Backend",
        title = "AliBATA API Documentation",
        version = "1.0"
    ),
    servers = {
        @Server(
            description = "Local ENV",
            url = "http://localhost:8080"
        )
    },
    security = {
        @SecurityRequirement(name="bearerAuth")
    }
)

@SecurityScheme(
    name = "bearerAuth",
    description = "JWT auth",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {

}
