package com.vanpt.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.vanpt.dto.LoginFormDto;

@RestController
public class UserController {

	@RequestMapping(method = RequestMethod.POST, value = "/api/signup")
	public String signUp(@RequestBody LoginFormDto loginForm) {
		return "token";
	}
}
