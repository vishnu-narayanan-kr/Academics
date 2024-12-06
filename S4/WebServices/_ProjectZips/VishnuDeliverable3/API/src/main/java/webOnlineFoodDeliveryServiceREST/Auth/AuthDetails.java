package webOnlineFoodDeliveryServiceREST.Auth;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "AuthDetails")
@XmlAccessorType(XmlAccessType.FIELD)
public class AuthDetails {
	@XmlElement
	private String token;
	@XmlElement
	private String message;
	@XmlElement
	private String role;
	
	public AuthDetails() {
		this.token = "";
		this.message = "";
		this.role = "";
	}
	
	public AuthDetails(String token, String message, String role) {
		this.token = token;
		this.message = message;
		this.role = role;
	}
	
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}
