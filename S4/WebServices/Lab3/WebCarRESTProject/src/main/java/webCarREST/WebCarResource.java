package webCarREST;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;
import java.io.File;
import java.io.FileNotFoundException;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("WebCar")
public class WebCarResource {
	private Map<String, Car> carHashMap = new HashMap<String, Car>();
	
	public WebCarResource() {
		try {
		Scanner inFile = new Scanner(new File("C:/Users/Dell/Documents/GitHub/Academics/S4/WebServices/Lab3/WebCarRESTProject/src/main/java/webCarREST/Car.in"));
	
		inFile.useDelimiter("[\t\r\n]+");
		
		while(inFile.hasNext()) {
			String vin = inFile.next();
			String desc = inFile.next();
			double price = inFile.nextDouble();
			
			carHashMap.put(vin, new Car(vin, desc, price));
		}
		
		inFile.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
 	
	@GET
	@Produces(MediaType.TEXT_HTML)
	public String displayHTMLCarInfo() {
		String outputHTML = "";
		
		outputHTML += "<html>";
		outputHTML += "<body>";

			
		outputHTML += "<h2>Print Car Elements of the HashMap</h2>";
		outputHTML += "<table border=\"1\">";
		outputHTML += "<tbody>";
		outputHTML += carHashMap.values().stream().map(v -> "<tr><td>" + v.getVin() + "</td><td>" + v.getDesc() + "</td><td>" + v.getPrice() + "</td><td>" + v.discountPrice() + "</td></tr>").collect(Collectors.joining(""));
		outputHTML += "<tbody>";
		outputHTML += "</table>";
		
		double totalDiscountPrice = carHashMap.values().stream().mapToDouble(Car::discountPrice).sum();
		outputHTML += "<h3>The total car price after discount is: " + totalDiscountPrice + "</h3>";
				
		outputHTML += "<h2>Print Car Elements of the HashMap Sorted by discount price</h2>";
		outputHTML += "<table border=\"1\">";
		outputHTML += "<tbody>";
		outputHTML += carHashMap.values().stream().sorted(Comparator.comparingDouble(Car::discountPrice)).map(v -> "<tr><td>" + v.getVin() + "</td><td>" + v.getDesc() + "</td><td>" + v.getPrice() + "</td><td>" + v.discountPrice() + "</td></tr>").collect(Collectors.joining(""));
		outputHTML += "<tbody>";
		outputHTML += "</table>";

		
		outputHTML += "</body>";
		outputHTML += "</html>";
		
		return outputHTML;
	}
	
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String displayTextCarInfo() {
		String outputText = "";
		outputText += carHashMap.values().stream().map(Car::toString).collect(Collectors.joining("\n"));
		double totalDiscountPrice = carHashMap.values().stream().mapToDouble(Car::discountPrice).sum();
		outputText += "\n\n The Total Car Price after discount: " + totalDiscountPrice;
		return outputText;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Car> displayJSONCarInfo() {
		ArrayList<Car> carList = new ArrayList<Car>();
		carHashMap.values().forEach((v) -> carList.add(v));
		return carList;
	}
	
	@Path("/searchCar/{vin}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Car searchJSONCarInfo(@PathParam("vin") String vin) {
		Car car = carHashMap.get(vin);
		
		return car;
	}
}
