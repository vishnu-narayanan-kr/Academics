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
		
		boolean status = false;
	
		if(registeredUsers.containsKey(username)) {
			if(registeredUsers.get(username).getPassword().equals(user.getPasswordHash())) {
				status = true;
				registeredUsers.get(username).setToken(utility.createSimpleAuthToken(user));
				utility.writeToFile("users.txt", RegisteredUsers.getInstance().getFileString());
			}
		} else {
			status = false;
		}
		
		String message = status ? "login success" : "login failed";
		
		return new AuthDetails(status, utility.createSimpleAuthToken(user), message);
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
			user.setPassword(Integer.toString(user.getPassword().hashCode()));
			registeredUsers.put(user.getUsername(), user);
			utility.writeToFile("users.txt", RegisteredUsers.getInstance().getFileString());
			message = "user register successfully";
		}
		
		return message;
	}
}
