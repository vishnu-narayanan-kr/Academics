package webOnlineFoodDeliveryServiceREST.Menu;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;

import webOnlineFoodDeliveryServiceREST.Utility;

public class RegisteredMenus {
	private static RegisteredMenus registeredMenus;
	private Map<Integer, Menu> menus;
	private Utility utility;
	
	private RegisteredMenus() {
		menus = new HashMap<Integer, Menu>();
		utility = new Utility();
		
		try {
			Scanner inFile = new Scanner(new File(utility.getPath("_Data/menus.txt")));
			inFile.useDelimiter("[\t\r\n]+");
			
			while(inFile.hasNextLine()) {
				Integer rID = inFile.nextInt();
				String rName = inFile.next();
				Integer mID = inFile.nextInt();
				String mName = inFile.next();
				String desc = inFile.next();
				Double price = inFile.nextDouble();
				String category = inFile.next();
				
				Menu menu = new Menu(rID, rName, mID, mName, desc, price, category);
				menus.put(mID, menu);
			} 
			
			inFile.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
	
	public static RegisteredMenus getInstance() {
		if(registeredMenus == null) {
			registeredMenus = new RegisteredMenus();
		}
		
		return registeredMenus;
	}

	public Map<Integer, Menu> getRegisteredMenus() {
		return menus;
	}

	public String getFileString() {
		return menus.values().stream().map(Menu::toString).collect(Collectors.joining(System.lineSeparator())); 
	}
}