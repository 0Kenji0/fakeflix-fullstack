package com.movie.rophim.Service;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

    public void sendOtp(String email) {
        // OTP disabled
    }

    public boolean verifyOtp(String email, String otp) {
        return false;
    }
}