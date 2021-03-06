package com.vanpt.controller;

import java.util.Base64;
import java.util.Optional;

import com.vanpt.dto.ChangePasswordDto;
import com.vanpt.utils.CodeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.vanpt.dto.UserDto;
import com.vanpt.infrastructure.UserRepository;
import com.vanpt.models.UserInfo;
import com.vanpt.security.AuthenticationRequest;
import com.vanpt.security.AuthenticationResponse;
import com.vanpt.security.MyUserDetailsService;
import com.vanpt.service.UserService;
import com.vanpt.utils.JwtUtil;

@RestController
@CrossOrigin(origins = "*", exposedHeaders = HttpHeaders.WWW_AUTHENTICATE)
public class UserController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private MyUserDetailsService userDetailsService;
	
	@RequestMapping("/api/hello")
	public String hello() {
		return "hello";
	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/register")
	public ResponseEntity<?> signUp(@RequestBody AuthenticationRequest request) {
		try {
			UserInfo user = userService.addUser(request.getUsername(), request.getPassword());
			String token = jwtUtil.generateToken(user.getUserName());
			return ResponseEntity.ok(new AuthenticationResponse(token));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/challenge")
	public ResponseEntity<?> challenge(@RequestHeader(HttpHeaders.AUTHORIZATION) String request) {
		try {
			if (request.startsWith("VB2PROJECT2 ")) {
				String content = request.replace("VB2PROJECT2 ", "");
				if (content.startsWith("c=")) {
					String username = content.substring(2);
					Optional<UserInfo> userInfo = userRepository.findByUsername(username);
					if (userInfo == null) {
						return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
								.header(HttpHeaders.WWW_AUTHENTICATE,
										CodeUtils.generateSecretKey() + "." + CodeUtils.generateSecretKey())
								.build();
					}
					String challenge = userService.generateChallenge(username);
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
							.header(HttpHeaders.WWW_AUTHENTICATE,
									userInfo.get().getSalt() + "." + challenge)
							.build();
				} else if (content.startsWith("r=")) {
					String[] parts = content.split(",", 2);
					String challengeResponse = parts[0].substring(2);
					String otpCode = parts[1].substring(2);

					String username = userService.getUsernameFromChallenge(challengeResponse);
					if (username.isEmpty()) {
						return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Wrong username or password");
					}
					Optional<UserInfo> userInfo = userRepository.findByUsername(username);
					if (userInfo == null) {
						throw new Exception("Could not find user: " + username);
					}
					UserInfo user = userInfo.get();
					if (user.getUse2fa()) {
						if (otpCode.isEmpty()) {
							return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
									.header(HttpHeaders.WWW_AUTHENTICATE, "OTP")
									.build();
						}

						String code = CodeUtils.getTOTPCode(user.getOtpSeed());
						if (!code.equals(otpCode)) {
							return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid OTP code");
						}
					}

					final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
					final String token = jwtUtil.generateToken(userDetails);
					System.out.println(username + ": " + token);
					userService.removeChallenge(challengeResponse);
					return ResponseEntity.ok(new AuthenticationResponse(token));
				} else {
					return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
				}
			} else {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/authenticate")
	public ResponseEntity<?> createAuthenticationToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String request) {
		try {
			String[] parts = request.split(",", 2);
			String base64Credentials = parts[0].replace("Basic ", "");
			byte[] bytes = Base64.getDecoder().decode(base64Credentials);
			String credentials = new String(bytes);
			String[] credParts = credentials.split(":", 2);
			String username = credParts[0];
			String password = credParts[1];
			String[] otpParts  = parts[1].split("=");
			String otpCode = "";
			if (otpParts.length == 2) {
				otpCode = otpParts[1];
			}
			try {
				authenticationManager.authenticate(
						new UsernamePasswordAuthenticationToken(username, password));
			} catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Wrong username or password");
			}
			UserInfo user = userRepository.findByUsername(username).get();
			if (user.getUse2fa()) {
				if (otpCode.isEmpty()) {
					return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
							.header(HttpHeaders.WWW_AUTHENTICATE, "OTP")
							.build();
				}

				String code = CodeUtils.getTOTPCode(user.getOtpSeed());
				if (!code.equals(otpCode)) {
					return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid OTP code");
				}
			}

			final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
			final String token = jwtUtil.generateToken(userDetails);
			System.out.println(username + ": " + token);
			return ResponseEntity.ok(new AuthenticationResponse(token));
		} catch (BadCredentialsException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/api/account")
	public ResponseEntity<Object> getUserInfo(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		try {
			token = token.replace("Bearer ", "");			
			String username = jwtUtil.extractUsername(token);
			Optional<UserInfo> user = userRepository.findByUsername(username);	
			user.orElseThrow(() -> new UsernameNotFoundException("Invalid token"));
			UserDto userDto = new UserDto();
			userDto.copyBasicInfo(user.get());
			return new ResponseEntity<>(userDto, HttpStatus.OK);
		} catch (UsernameNotFoundException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/getqrcode")
	public ResponseEntity<?> getQrCode(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		try {
			token = token.replace("Bearer ", "");
			String username = jwtUtil.extractUsername(token);
			Optional<UserInfo> user = userRepository.findByUsername(username);
			user.orElseThrow(() -> new UsernameNotFoundException("Invalid token"));
			String encodedImage = CodeUtils.getBase64QrCodeImage(user.get().getBarcodeUrl());
			return ResponseEntity.ok(encodedImage);
		} catch (UsernameNotFoundException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/activate2fa")
	public ResponseEntity<?> activate2fa(@RequestHeader("Authorization") String token) {
		try {
			token = token.replace("Bearer ", "");
			String username = jwtUtil.extractUsername(token);
			Optional<UserInfo> user = userRepository.findByUsername(username);
			user.orElseThrow(() -> new UsernameNotFoundException("Invalid token"));
			UserInfo userInfo = user.get();
			userInfo.setUse2fa(true);
			userRepository.save(userInfo);
			return ResponseEntity.ok().build();
		} catch (UsernameNotFoundException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/deactivate2fa")
	public ResponseEntity<?> deactivate2fa(@RequestHeader("Authorization") String token) {
		try {
			token = token.replace("Bearer ", "");
			String username = jwtUtil.extractUsername(token);
			Optional<UserInfo> user = userRepository.findByUsername(username);
			user.orElseThrow(() -> new UsernameNotFoundException("Invalid token"));
			UserInfo userInfo = user.get();
			userInfo.setUse2fa(false);
			userRepository.save(userInfo);
			return ResponseEntity.ok().build();
		} catch (UsernameNotFoundException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/updateuserinfo")
	public ResponseEntity<?> updateUserInfo(@RequestHeader("Authorization") String token, @RequestBody UserDto userDto) {
		try {
			token = token.replace("Bearer ", "");
			String username = jwtUtil.extractUsername(token);
			Optional<UserInfo> user = userRepository.findByUsername(username);
			user.orElseThrow(() -> new UsernameNotFoundException("Invalid token"));
			UserInfo userInfo = user.get();
			userInfo.setFirstName(userDto.getFirstName());
			userInfo.setLastName(userDto.getLastName());
			userInfo.setAddress(userDto.getAddress());
			userInfo.setEmail(userDto.getEmail());
			userInfo.setPhone(userDto.getPhone());
			userRepository.save(userInfo);
			return ResponseEntity.ok().build();
		} catch (UsernameNotFoundException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/changepassword")
	public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token, @RequestBody ChangePasswordDto changePasswordDto) {
		try {
			token = token.replace("Bearer ", "");
			String username = jwtUtil.extractUsername(token);
			Optional<UserInfo> user = userRepository.findByUsername(username);
			user.orElseThrow(() -> new UsernameNotFoundException("Invalid token"));
			UserInfo userInfo = user.get();
			userRepository.save(userInfo);
			return ResponseEntity.ok().build();
		} catch (UsernameNotFoundException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
}
