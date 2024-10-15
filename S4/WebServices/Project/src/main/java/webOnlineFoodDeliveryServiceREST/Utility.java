package webOnlineFoodDeliveryServiceREST;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

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
}
