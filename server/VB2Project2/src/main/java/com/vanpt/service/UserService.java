package com.vanpt.service;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vanpt.infrastructure.UserRepository;
import com.vanpt.models.UserInfo;
import com.vanpt.utils.CodeUtils;

import java.util.HashMap;
import java.util.Optional;

@Service
public class UserService {

	@Autowired	
	private UserRepository userRepository;

	private HashMap<String, String> challenges = new HashMap<>();
	
	public UserInfo addUser(String username, String password) throws Exception {
		boolean userExists = userRepository.countUser(username) != 0;
		if (userExists) {
			throw new RuntimeException("Người dùng đã tồn tại");
		}
		
		UserInfo userDto = new UserInfo();
		userDto.setUserName(username);
		userDto.setSalt(CodeUtils.generateSecretKey());
		userDto.setOtpSeed(CodeUtils.generateSecretKey());
		userDto.setPasswordHash(CodeUtils.hashPassword(password, userDto.getSalt()));
		UserInfo result = userRepository.save(userDto);
		return result;
	}

	public String generateChallenge(String username) {
		String challenge = CodeUtils.generateSecretKey();
		Optional<UserInfo> user = userRepository.findByUsername(username);
		if (user == null) {
			return challenge;
		}
		String hashChallenge = CodeUtils.hash(user.get().getPasswordHash() + challenge);
		challenges.put(hashChallenge, username);
		return challenge;
	}

	public String getUsernameFromChallenge(String hash) {
		if (challenges.containsKey(hash)) {
			return challenges.get(hash);
		} else {
			return "";
		}
	}

	public void removeChallenge(String hash) {
		if (challenges.containsKey(hash)) {
			challenges.remove(hash);
		}
	}
}
