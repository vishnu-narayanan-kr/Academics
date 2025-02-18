package webOnlineFoodDeliveryServiceREST.Auth;

import java.time.LocalDateTime;
import java.util.Map;

import org.mindrot.jbcrypt.BCrypt;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import webOnlineFoodDeliveryServiceREST.Utility;

import java.sql.Connection;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

@Path("Authentication")
public class WebAuthenticationController { 
	Utility utility;
	Map<String, User> registeredUsers;
	
	public WebAuthenticationController() {
		utility = new Utility();
		registeredUsers = RegisteredUsers.getInstance().getRegisteredUsers();
		
		Context ctx;
		DataSource ds;
		
		try {
			ctx = new InitialContext();
			ds = (DataSource) ctx.lookup("jdbc/MyMSSQLDS");
			Connection conn = ds.getConnection();
		} catch (NamingException | SQLException e) {
			e.printStackTrace();
		}

	}
	
	@POST
	@Path("Login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public AuthDetails login(User user) {
		String username = user.getUsername();
		
		boolean status = false;
		String token = "";
		
		User registeredUser = registeredUsers.get(username);
	
		if(registeredUser != null) {
			if(BCrypt.checkpw(user.getPassword(), registeredUser.getPassword())) {
				status = true;
				token = BCrypt.hashpw(username + LocalDateTime.now(), BCrypt.gensalt());
				registeredUser.setToken(token);
				RegisteredUsers.getInstance().updateUser(registeredUser);
			}
		} else {
			status = false;
		}
		
		String message = status ? "login success" : "login failed";
		
		if (registeredUser == null) {
			registeredUser = new User();
		}
		
		return new AuthDetails(token, message, registeredUser.getRole());
	}
	
	@POST
	@Path("Register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String register(User user) {
		String message = "";
		
		if(registeredUsers.containsKey(user.getUsername())) {
			message = "username already exists!";
		} else {
			RegisteredUsers.getInstance().addUser(user);
			message = "success, please login";
		}
		
		return message;
	}
}
