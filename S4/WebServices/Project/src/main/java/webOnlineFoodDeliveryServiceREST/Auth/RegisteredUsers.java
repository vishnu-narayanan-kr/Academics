package webOnlineFoodDeliveryServiceREST.Auth;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;

import webOnlineFoodDeliveryServiceREST.Utility;

public class RegisteredUsers {
	private static RegisteredUsers registeredUsers;
	private Map<String, User> users;
	private Utility utility;
	
	private RegisteredUsers() {
		users = new HashMap<String, User>();
		utility = new Utility();
		
		try {
			Scanner inFile = new Scanner(new File(utility.getPath("_Data/users.txt")));
			inFile.useDelimiter("[\t\r\n]+");
			
			while(inFile.hasNextLine()) {
				String username = inFile.next();
				String password = inFile.next();
				String token = inFile.next();
				
				User user = new User(username, password, token);
				users.put(username, user);
			} 
			
			inFile.close();
		} catch (FileNotFoundException e) {
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

	public String getFileString() {
		return users.values().stream().map(User::toString).collect(Collectors.joining(System.lineSeparator())); 
	}
}