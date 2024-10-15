package webOnlineFoodDeliveryServiceREST.Auth;

import java.util.Map;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import webOnlineFoodDeliveryServiceREST.Utility;

@Path("Authentication")
public class WebAuthenticationController {
	Utility utility;
	Map<String, User> registeredUsers;
	
	public WebAuthenticationController() {
		utility = new Utility();
		registeredUsers = RegisteredUsers.getInstance().getRegisteredUsers();
	}
	
	@POST
	@Path("Login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public AuthDetails login(User user) {
		String username = user.getUsername();
		String password = user.getPassword();
		
		boolean status = false;
	
		if(registeredUsers.containsKey(username)) {
			if(registeredUsers.get(username).getPassword().equals(password)) {
				status = true;
			}
		} else {
			status = false;
		}
		
		String message = status ? "success" : "failed";
		
		return new AuthDetails(status, username + " " +  password.hashCode(), message);
	}
	
	@POST
	@Path("Register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String register(User user) {
		String message = "";
		
		if(registeredUsers.containsKey(user.getUsername())) {
			message = "username exists, use a different username";
		} else {
			registeredUsers.put(user.getUsername(), user);
			utility.writeToFile("users.txt", RegisteredUsers.getInstance().getFileString());
			message = "user register successfully";
		}
		
		return message;
	}
}
