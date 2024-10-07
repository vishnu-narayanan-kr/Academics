package webCarREST;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;
import java.io.File;
import java.io.FileNotFoundException;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("WebCar")
public class WebCarResource {
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String displayHTMLCarInfo() {
		String outputHTML = "";
		
		outputHTML += "<html>";
		outputHTML += "<body>";
		
		try {
			Scanner inFile = new Scanner(new File("C:/Users/Dell/Documents/GitHub/Academics/S4/WebServices/Lab3/WebCarRESTProject/src/main/java/webCarREST/Car.in"));
			Map<String, Car> carHashMap = new HashMap<String, Car>();
			
			inFile.useDelimiter("[\t\r\n]+");
			
			while(inFile.hasNext()) {
				String vin = inFile.next();
				String desc = inFile.next();
				double price = inFile.nextDouble();
				
				carHashMap.put(vin, new Car(vin, desc, price));
			}
			
			inFile.close();
			
			outputHTML += "<h2>Print Car Elements of the HashMap</h2>";
			outputHTML += "<table border=\"1\">";
			outputHTML += "<tbody>";
			outputHTML += carHashMap.values().stream().map(v -> "<tr><td>" + v.getVin() + "</td><td>" + v.getDesc() + "</td><td>" + v.getPrice() + "</td><td>" + v.discountPrice() + "</td></tr>").collect(Collectors.joining(""));
			outputHTML += "<tbody>";
			outputHTML += "</table>";
			
			outputHTML += "<h2>Print Car Elements of the HashMap Sorted by discount price</h2>";
			outputHTML += "<table border=\"1\">";
			outputHTML += "<tbody>";
			outputHTML += carHashMap.values().stream().sorted(Comparator.comparingDouble(Car::discountPrice)).map(v -> "<tr><td>" + v.getVin() + "</td><td>" + v.getDesc() + "</td><td>" + v.getPrice() + "</td><td>" + v.discountPrice() + "</td></tr>").collect(Collectors.joining(""));
			outputHTML += "<tbody>";
			outputHTML += "</table>";
		} catch (FileNotFoundException e) {
			outputHTML += "<p>Car File NOT found!</p>";
			e.printStackTrace();
		}
		
		outputHTML += "</body>";
		outputHTML += "</html>";
		
		return outputHTML;
	}
}
