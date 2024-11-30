package webOnlineFoodDeliveryServiceREST.Auth;

import java.util.HashMap;
import java.util.Map;

import webOnlineFoodDeliveryServiceREST.Utility;

public class RegisteredUsers {
	private static RegisteredUsers registeredUsers;
	private Map<String, User> users;
	private Utility utility;
	
	@SuppressWarnings("unchecked")
	private RegisteredUsers() {
		utility = new Utility();
		
		try {
			users = (Map<String, User>) utility.readFromSerializedFile("users");
			
			if (users == null) {
				users = new HashMap<String, User>();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static RegisteredUsers getInstance() {
		if(registeredUsers == null) {
			registeredUsers = new RegisteredUsers();
		}
		
		return registeredUsers;
	}

	public Map<String, User> getRegisteredUsers() {
		return users;
	}
	
	public void addUser(User user) {
		user.setPassword(user.getPasswordHash());
		users.put(user.getUsername(), user);
		utility.writeToSerializedFile("users", users);
	}
	
	public void updateUser(User user) {
		users.put(user.getUsername(), user);
		utility.writeToSerializedFile("users", users);
	}
}