package com.vanpt.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.vanpt.dto.UserDto;
import com.vanpt.infrastructure.UserRepository;
import com.vanpt.models.UserInfo;
import com.vanpt.security.AuthenticationRequest;
import com.vanpt.security.AuthenticationResponse;
import com.vanpt.security.MyUserDetailsService;
import com.vanpt.service.UserService;
import com.vanpt.utils.JwtUtil;

@RestController
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
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/api/authenticate")
	public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest request) throws Exception {
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));			
		} catch (BadCredentialsException e) {
			throw new Exception("Username or password is not correct", e);
		}
		
		final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
		final String token = jwtUtil.generateToken(userDetails);
		return ResponseEntity.ok(new AuthenticationResponse(token));
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/api/account")
	public ResponseEntity<Object> getUserInfo(@RequestHeader("Authorization") String token) {
		try {
			token = token.replace("Bearer ", "");			
			String username = jwtUtil.extractUsername(token);
			Optional<UserInfo> user = userRepository.findByUsername(username);	
			user.orElseThrow(() -> new UsernameNotFoundException("Username or password is invalid"));
			UserDto userDto = new UserDto();
			userDto.copyBasicInfo(user.get());
			return new ResponseEntity<>(userDto, HttpStatus.OK);
		} catch (RuntimeException e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
