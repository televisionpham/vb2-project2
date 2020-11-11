package com.vanpt.dto;

import com.vanpt.models.User;

public class UserDto {
	
	private Integer id;
	
	private String userName;

	private String firstName;

	private String lastName;

	private String address;

	private String email;
	
	private String phone;

	private Boolean use2fa;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Boolean getUse2fa() {
		return use2fa;
	}

	public void setUse2fa(Boolean use2fa) {
		this.use2fa = use2fa;
	}

	public void copyBasicInfo(User user)
	{
		this.id = user.getId();
		this.userName = user.getUserName();
		this.firstName = user.getFirstName();
		this.lastName = user.getLastName();
		this.address = user.getAddress();
		this.email = user.getEmail();
		this.phone = user.getPhone();
		this.use2fa = user.getUse2fa();
	}
}
