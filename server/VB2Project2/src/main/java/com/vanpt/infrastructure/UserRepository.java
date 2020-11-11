package com.vanpt.infrastructure;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vanpt.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

	@Query(value = "select count(*) from Users where Username = :username", nativeQuery = true)
	public Integer countUser(@Param("username") String username);
}
