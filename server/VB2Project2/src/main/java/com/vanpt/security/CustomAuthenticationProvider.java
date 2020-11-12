package com.vanpt.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.vanpt.infrastructure.UserRepository;
import com.vanpt.models.UserInfo;
import com.vanpt.utils.CodeUtils;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {
	
	@Autowired
	UserRepository userRepository;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		UsernamePasswordAuthenticationToken authenticationToken = null;
		String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        
        Optional<UserInfo> user = userRepository.findByUsername(username);
        
        user.orElseThrow(() -> new UsernameNotFoundException("Username or password is invalid"));

		String passwordHash = null;
		try {
			passwordHash = CodeUtils.hashPassword(password, user.get().getSalt());
		} catch (Exception e) {
			e.printStackTrace();
		}

		if (passwordHash.equals(user.get().getPasswordHash())) {
        	Collection<GrantedAuthority> authorities = new ArrayList<>();
        	authenticationToken = new UsernamePasswordAuthenticationToken(
        			new User(username, password, authorities), password, authorities);        			
        }
        
		return authenticationToken;
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

}
