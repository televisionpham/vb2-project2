package com.vanpt.models;

import java.security.Key;
import java.util.Calendar;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.vanpt.utils.CodeUtils;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Entity
@Table(name = "Users")
public class UserInfo {

	@Id
	@Column(name = "Id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name = "UserName")
	private String userName;
	
	@Column(name = "PasswordHash")
	private String passwordHash;
	
	@Column(name = "FirstName")
	private String firstName;
	
	@Column(name = "LastName")
	private String lastName;
	
	@Column(name = "Address")
	private String address;
	
	@Column(name = "Email")
	private String email;
	
	@Column(name = "Phone")
	private String phone;
	
	@Column(name = "Use2FA")
	private Boolean use2fa = false;
	
	@Column(name = "Salt")
	private String salt;
	
	@Column(name = "OtpSeed")
	private String otpSeed;	
	
	@Column(name = "Active")
	private Boolean active = true;

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

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
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

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public String getOtpSeed() {
		return otpSeed;
	}

	public void setOtpSeed(String otpSeed) {
		this.otpSeed = otpSeed;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Username: ").append(this.userName).append("\n");
		sb.append("First name: ").append(this.firstName).append("\n");
		sb.append("Last name: ").append(this.lastName).append("\n");
		sb.append("Email: ").append(this.email).append("\n");
		sb.append("Phone: ").append(this.phone).append("\n");
		sb.append("Address: ").append(this.address).append("\n");
		
		return sb.toString();
	}	

	public String getBarcodeUrl() {
		String barcodeUrl = CodeUtils.getGoogleAuthenticatorBarCode(this.otpSeed, this.userName, "VB2 Project 2 - 2FA Demo");
		return barcodeUrl;
	}

}
