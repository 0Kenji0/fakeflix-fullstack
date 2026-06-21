package com.movie.rophim.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class OtpService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name:Fakeflix}")
    private String senderName;

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Long> otpExpiry = new ConcurrentHashMap<>();
    private static final long OTP_EXPIRY_MINUTES = 5;

    public void sendOtp(String email) {
        String otp = generateOtp();
        otpStore.put(email, otp);
        otpExpiry.put(email, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRY_MINUTES));

        String html = "<div style=\"font-family:sans-serif\">"
                + "<p>Xin chào!</p>"
                + "<p>Mã OTP của bạn là: <strong style=\"font-size:20px\">" + otp + "</strong></p>"
                + "<p>Mã có hiệu lực trong " + OTP_EXPIRY_MINUTES + " phút. Không chia sẻ mã này với ai.</p>"
                + "<p>Fakeflix Team</p>"
                + "</div>";

        try {
            ObjectNode sender = objectMapper.createObjectNode();
            sender.put("name", senderName);
            sender.put("email", senderEmail);

            ObjectNode recipient = objectMapper.createObjectNode();
            recipient.put("email", email);

            ObjectNode body = objectMapper.createObjectNode();
            body.set("sender", sender);
            body.putArray("to").add(recipient);
            body.put("subject", "Fakeflix - Mã xác thực OTP");
            body.put("htmlContent", html);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BREVO_API_URL))
                    .header("accept", "application/json")
                    .header("api-key", brevoApiKey)
                    .header("content-type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Đã gửi OTP qua Brevo tới: {}", email);
            } else {
                log.error("GỬI OTP THẤT BẠI cho email {}: HTTP {} - {}", email, response.statusCode(), response.body());
                throw new RuntimeException("Gửi email thất bại: " + response.body());
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("GỬI OTP THẤT BẠI cho email {}: {}", email, e.getMessage());
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }

    public boolean verifyOtp(String email, String otp) {
        String stored = otpStore.get(email);
        Long expiry = otpExpiry.get(email);

        if (stored == null || expiry == null) return false;
        if (System.currentTimeMillis() > expiry) {
            otpStore.remove(email);
            otpExpiry.remove(email);
            return false;
        }
        if (!stored.equals(otp)) return false;

        otpStore.remove(email);
        otpExpiry.remove(email);
        return true;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}