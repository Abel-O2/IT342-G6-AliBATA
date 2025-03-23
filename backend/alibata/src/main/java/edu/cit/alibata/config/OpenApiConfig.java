package edu.cit.alibata.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

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
    }
)
public class OpenApiConfig {

}
