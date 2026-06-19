package com.movie.rophim.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final JavaMailSender mailSender;
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Long> otpExpiry = new ConcurrentHashMap<>();
    private static final long OTP_EXPIRY_MINUTES = 5;

    public void sendOtp(String email) {
        String otp = generateOtp();
        otpStore.put(email, otp);
        otpExpiry.put(email, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRY_MINUTES));

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
        mailSender.send(message);
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