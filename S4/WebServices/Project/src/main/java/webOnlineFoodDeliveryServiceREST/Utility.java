package webOnlineFoodDeliveryServiceREST;

import java.io.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import webOnlineFoodDeliveryServiceREST.Auth.User;
import webOnlineFoodDeliveryServiceREST.Menu.Menu;

public class Utility {
	private String absolutePath = "C:/Users/Dell/Documents/GitHub/Academics/S4/WebServices/Project/src/main/java/webOnlineFoodDeliveryServiceREST/";
	
	public String getPath() {
		return absolutePath;
	}
	
	public String getPath(String relativePath) {
		return absolutePath + relativePath;
	}
	
	public void writeToFile(String filename, String data) {
		try {
			BufferedWriter writer = new BufferedWriter(new FileWriter(getPath("_Data/")+ filename));
			writer.write(data);
			writer.close();			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	public String createSimpleAuthToken(User user) {
		return Integer.toString((user.getUsername() + user.getPassword() + Instant.now()).hashCode());
	}
	
	public String getUID() {
		return Integer.toString(Math.abs(Instant.now().hashCode()));
	}
	
	public void writeToSerializedFile(String filename, Object obj) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(getPath("_Data/" + filename + ".ser")))) {
            oos.writeObject(obj);
        } catch (IOException e) {
            e.printStackTrace();
        }
	}
	
	public Object readFromSerializedFile(String filename) {
		try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(getPath("_Data/" + filename + ".ser")))) {
			return ois.readObject();
        } catch (IOException | ClassNotFoundException  e) {
            e.printStackTrace();
            return null;
        }
	}
	
	// For initializing static data for the first time
	public Map<Integer, Menu> readMenusFromTextFile() {
		Map<Integer, Menu> menus = new HashMap<Integer, Menu>();
		
		try {
			Scanner inFile = new Scanner(new File(getPath("_Data/menus.txt")));
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
		
		return menus;
	}
}
