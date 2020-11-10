package com.vanpt.infrastructure;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.vanpt.models.User;

@Repository
public class UserRepository {

	@Autowired
	private SessionFactory sessionFactory;
	
	public int addUser(User user) {
		Session session = null;
		try {
			session = sessionFactory.openSession();
			session.beginTransaction();			
			int id = (int) session.save(user);
			session.getTransaction().commit();
			return id;
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
}
