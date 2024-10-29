package clientOnlineFoodDeliveryServiceREST;

public class User {
	private String username;
	private String password;
	private String token;
	
	public String toString() {
		String output = "";
		
		output += username + "\t";
		output += password + "\t";
		output += token;
		
		return output;
	}
	
	public String getPasswordHash() {
		return Integer.toString(password.hashCode());
	}
	
	public User() {
		this.username = "";
		this.password = "";
		this.token = null;
	}
	
	public User(String username, String password, String token) {
		this.username = username;
		this.password = password;
		this.token = token;
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
	
	
}

