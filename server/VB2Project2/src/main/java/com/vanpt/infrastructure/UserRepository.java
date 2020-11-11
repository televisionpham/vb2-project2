package com.vanpt.infrastructure;

import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vanpt.models.UserInfo;

@Repository
public interface UserRepository extends JpaRepository<UserInfo, Integer> {

	@Query(value = "select count(*) from Users where Username = :username", nativeQuery = true)
	public Integer countUser(@Param("username") String username);
	
	@Query(value = "select top(1) * from Users where Username = :username", nativeQuery = true)
	public Optional<UserInfo> findByUsername(@Param("username") String username);
}
