package com.movie.rophim.Service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private final JavaMailSender mailSender;
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Long> otpExpiry = new ConcurrentHashMap<>();
    private static final long OTP_EXPIRY_MINUTES = 5;

    public void sendOtp(String email) {
        String otp = generateOtp();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Fakeflix - Mã xác thực OTP");
        message.setText(
                "Xin chào!\n\n" +
                        "Mã OTP của bạn là: " + otp + "\n\n" +
                        "Mã có hiệu lực trong " + OTP_EXPIRY_MINUTES + " phút.\n" +
                        "Không chia sẻ mã này với ai.\n\n" +
                        "Fakeflix Team"
        );

        try {
            log.info("Đang gửi OTP đến email: {}", email);
            mailSender.send(message);
            log.info("Đã gửi OTP thành công đến: {}", email);
        } catch (Exception e) {
            log.error("GỬI OTP THẤT BẠI cho email {}: {}", email, e.getMessage(), e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể gửi email OTP. Vui lòng kiểm tra lại email hoặc thử lại sau."
            );
        }

        // Chỉ lưu OTP vào store SAU KHI gửi mail thành công
        otpStore.put(email, otp);
        otpExpiry.put(email, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRY_MINUTES));
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