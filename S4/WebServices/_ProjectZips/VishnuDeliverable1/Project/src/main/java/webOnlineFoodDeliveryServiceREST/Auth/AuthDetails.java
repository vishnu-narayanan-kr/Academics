package webOnlineFoodDeliveryServiceREST.Auth;

public class AuthDetails {
	private boolean status;
	private String token;
	private String message;
	
	public AuthDetails(boolean status, String token, String message) {
		this.status = status;
		this.token = token;
		this.message = message;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
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
}
