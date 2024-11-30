package webOnlineFoodDeliveryServiceREST.Menu;

import java.util.*;

import webOnlineFoodDeliveryServiceREST.Utility;

public class RegisteredMenus {
	private static RegisteredMenus registeredMenus;
	private Map<Integer, Menu> menus;
	private Utility utility;
	
	@SuppressWarnings("unchecked")
	private RegisteredMenus() {
		menus = new HashMap<Integer, Menu>();
		utility = new Utility();

		menus = (Map<Integer, Menu>) utility.readFromSerializedFile("menus");
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
	
	public void addMenu(Menu menu) {
		int id = menus.keySet().stream().max((a, b) -> Integer.compare(a, b)).get() + 1;
		
		menu.setMealId(id);
		menus.put(id, menu);
		
		utility.writeToSerializedFile("menus", menus);
	}
	
	public void updateMenu(Menu menu) {
		int id = menu.getMealId();
		
		menus.put(id, menu);
		utility.writeToSerializedFile("menus", menus);
	}
	
	public void delete(int id) {
		menus.remove(id);
		utility.writeToSerializedFile("menus", menus);
	}
}