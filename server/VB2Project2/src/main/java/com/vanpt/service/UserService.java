package com.vanpt.service;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vanpt.infrastructure.UserRepository;
import com.vanpt.models.UserInfo;
import com.vanpt.utils.CodeUtils;

@Service
public class UserService {

	@Autowired	
	private UserRepository userRepository;
	
	public UserInfo addUser(String username, String password) throws Exception {
		boolean userExists = userRepository.countUser(username) != 0;
		if (userExists) {
			throw new RuntimeException("Người dùng đã tồn tại");
		}
		
		UserInfo userDto = new UserInfo();
		userDto.setUserName(username);
		userDto.setSalt(CodeUtils.generateSecretKey());
		userDto.setOtpSeed(CodeUtils.generateSecretKey());
	 		
		StringBuilder passwordHash = new StringBuilder();
		passwordHash.append(CodeUtils.hash(userDto.getSalt())).append(CodeUtils.hash(password));
		userDto.setPasswordHash(passwordHash.toString());
		UserInfo result = userRepository.save(userDto);
		return result;
	}

	public UserInfo getUser(int userId) {
		try {
			UserInfo result = userRepository.getOne(userId);
			return result;
		} catch (EntityNotFoundException e) {
			throw e;
		}	
	}
}
