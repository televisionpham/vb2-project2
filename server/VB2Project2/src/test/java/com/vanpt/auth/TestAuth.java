package com.vanpt.auth;

import java.io.IOException;

import org.testng.annotations.Test;

import com.google.zxing.WriterException;
import com.vanpt.utils.CodeUtils;

public class TestAuth {

	@Test
	public void can_generate_secret_key() {
		String key = CodeUtils.generateSecretKey();
		System.out.println(key);
	}
	
	@Test
	public void can_sync_with_google_authenticator() {
//		String secretKey = "M264TJTUUHQF23O6U6BMGWJF45HXX2F5";
//		String lastCode = null;
//		while (true) {
//		    String code = CodeUtils.getTOTPCode(secretKey);
//		    if (!code.equals(lastCode)) {
//		        System.out.println(code);
//		    }
//		    lastCode = code;
//		    try {
//		        Thread.sleep(1000);
//		    } catch (InterruptedException e) {};
//		}
	}
	
	@Test
	public void can_get_barcode_url() {
		String secretKey = "M264TJTUUHQF23O6U6BMGWJF45HXX2F5";
		String email = "test@gmail.com";
		String companyName = "Vanpt Co. Ltd.";
		String barcodeUrl = CodeUtils.getGoogleAuthenticatorBarCode(secretKey, email, companyName);
		System.out.println(barcodeUrl);
		try {
			CodeUtils.createQRCode(barcodeUrl, "F:\\Temp\\qrcode.png", 240, 240);
		} catch (WriterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Test
	public void can_get_base64_qr_code_image() {
		String secretKey = "M264TJTUUHQF23O6U6BMGWJF45HXX2F5";
		String email = "test@gmail.com";
		String companyName = "Vanpt Co. Ltd.";
		String barcodeUrl = CodeUtils.getGoogleAuthenticatorBarCode(secretKey, email, companyName);
		System.out.println(barcodeUrl);
		try {
			String encodeImage = CodeUtils.getBase64QrCodeImage(barcodeUrl);
			System.out.println(encodeImage);
		} catch (WriterException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void can_hash_password_with_salt() throws Exception {
		String salt = "DH3BFFEIIEPOPHAXTP2U4YUV3RLPP3HG";
		String password = "test";
		String result = CodeUtils.hashPassword(password, salt);
		System.out.println(result);
	}
}
