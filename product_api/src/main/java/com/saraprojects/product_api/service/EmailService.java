package com.saraprojects.product_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name}")
    private String senderName;

    public EmailService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Assíncrono e não-bloqueante de propósito: se o envio falhar (Brevo fora do ar,
    // cota excedida, etc.), o cadastro do usuário NÃO deve ser afetado — o código
    // já foi mostrado na tela, o e-mail é só um canal complementar de backup.
    @Async
    public void sendEmployeeCodeEmail(String toEmail, String toName, String employeeCode) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> body = Map.of(
                    "sender", Map.of("name", senderName, "email", senderEmail),
                    "to", List.of(Map.of("email", toEmail, "name", toName)),
                    "subject", "Your employee access code",
                    "htmlContent", buildEmailContent(toName, employeeCode)
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(BREVO_API_URL, request, String.class);

        } catch (Exception e) {
            // Não relança a exceção: falha de e-mail não pode derrubar o fluxo de cadastro
            System.err.println("Failed to send employee code email: " + e.getMessage());
        }
    }

    private String buildEmailContent(String name, String employeeCode) {
        return "<p>Hi " + name + ",</p>"
                + "<p>Your employee access code is:</p>"
                + "<h2>" + employeeCode + "</h2>"
                + "<p>Use it together with your password to sign in.</p>";
    }
}