package webOnlineFoodDeliveryServiceSOAP;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.mindrot.jbcrypt.BCrypt;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebResult;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import jakarta.jws.soap.SOAPBinding.Style;

import webOnlineFoodDeliveryServiceREST.Utility;
import webOnlineFoodDeliveryServiceREST.Auth.AuthDetails;
import webOnlineFoodDeliveryServiceREST.Auth.RegisteredUsers;
import webOnlineFoodDeliveryServiceREST.Auth.User;

@WebService
@SOAPBinding(style = Style.RPC)
public class Auth {
	Utility utility;
	Map<String, User> registeredUsers;
	
	public Auth() {
		utility = new Utility();
		registeredUsers = RegisteredUsers.getInstance().getRegisteredUsers();
	}
	
	@WebMethod(operationName = "Login")
	@WebResult(name = "AuthDetails")
	public AuthDetails login(
			@WebParam(name="username") String username,
			@WebParam(name="password") String password
			) {
		
		User registeredUser = registeredUsers.get(username);
		
		boolean status = false;
		String token = "";
		AuthDetails authDetails = new AuthDetails();;
		
		if(registeredUser != null) {
			if(BCrypt.checkpw(password, registeredUser.getPassword())) {
				status = true;
				token = BCrypt.hashpw(username + LocalDateTime.now(), BCrypt.gensalt());
				registeredUser.setToken(token);
				RegisteredUsers.getInstance().updateUser(registeredUser);
				authDetails = new AuthDetails(token, "", registeredUser.getRole());
			}
		} else {
			status = false;
		}
		
		String message = status ? "login success" : "login failed";
		
		authDetails.setMessage(message);
		
		return authDetails;
	}
	
	@WebMethod(operationName = "Register")
	@WebResult(name = "message")
	public String register(
			@WebParam(name="username") String username,
			@WebParam(name="password") String password,
			@WebParam(name="role") String role
			) {
		String message = "";
		
		User user = new User(username, password, "", role);
		
		if(registeredUsers.containsKey(username)) {
			message = "username already exists!";
		} else {
			RegisteredUsers.getInstance().addUser(user);
			message = "success, please login";
		}
		
		return message;
	}
}
