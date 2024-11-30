package webOnlineFoodDeliveryServiceREST.Auth;

import java.io.Serializable;

import org.mindrot.jbcrypt.BCrypt;

public class User implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String username;
	private String password;
	private String token;
	private String role;
	
	public String toString() {
		String output = "";
		
		output += username + "\t";
		output += password + "\t";
		output += role + "\t";
		output += token;
		
		return output;
	}
	
	public String getPasswordHash() {
		return BCrypt.hashpw(password, BCrypt.gensalt());
		// return Integer.toString(password.hashCode());
	}
	
	public User() {
		this.username = "";
		this.password = "";
		this.token = "";
		this.role = "customer";
	}
	
	public User(String username, String password, String token, String role) {
		this.username = username;
		this.password = password;
		this.token = token;
		this.role = role;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}
