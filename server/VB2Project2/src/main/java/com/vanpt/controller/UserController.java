package com.vanpt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.vanpt.dto.LoginFormDto;
import com.vanpt.dto.UserDto;
import com.vanpt.models.User;
import com.vanpt.service.UserService;

@RestController
public class UserController {

	@Autowired
	private UserService userService;

	@RequestMapping(method = RequestMethod.POST, value = "/api/signup")
	public ResponseEntity<Object> signUp(@RequestBody LoginFormDto loginForm) {
		try {
			User user = userService.addUser(loginForm.getUsername(), loginForm.getPassword());
			String token = user.generateToken();			
			return new ResponseEntity<>(token, HttpStatus.OK);
		} catch (RuntimeException e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/api/account")
	public ResponseEntity<Object> getUserInfo(@RequestHeader String token) {
		try {
			String[] parts = token.split("@", 2);
			int userId = Integer.parseInt(parts[0]);
			User user = userService.getUser(userId);
			user.validateToken(token);
			UserDto userDto = new UserDto();
			userDto.copyBasicInfo(user);
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
