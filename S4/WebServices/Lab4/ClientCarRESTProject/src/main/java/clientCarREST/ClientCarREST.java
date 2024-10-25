package clientCarREST;

import java.util.Scanner;

import org.glassfish.jersey.client.ClientConfig;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

public class ClientCarREST {
	
	
	public static void main(String[] args) {
		// Configure the client
		String url = "http://localhost:8080/WebCarRESTProject/rest/WebCar/";
		
		ClientConfig config = new ClientConfig();
		Client client = ClientBuilder.newClient(config);
		WebTarget target;
		
		String response;
		
		// TEXT output
		System.out.println("Car text output: ");
		target = client.target(url);
		response = target.request().accept(MediaType.TEXT_PLAIN).get(String.class);
		System.out.println(response);
		
		// JSON output
		System.out.println("Car JSON output: ");
		response = target.request().accept(MediaType.APPLICATION_JSON).get(String.class);
		System.out.println(response);
		
		// Search Function
		System.out.println("Enter a valid id to search: ");
		Scanner scanner = new Scanner(System.in);
		String id = scanner.nextLine();
		target = client.target(url + "searchCar/" + id);
		response = target.request().accept(MediaType.APPLICATION_JSON).get(String.class);
		System.out.println(response);
		
		// Marginal Benefit
		System.out.println("Display Margin Benefits as Revenue Total Course Fees- Operating Cost");
		System.out.println("Please enter total operation cost: ");
		Double operatingCost = scanner.nextDouble();
		
		Double totalCarDiscount;
		target = client.target(url + "TotalCarPriceDiscount");
		response = target.request().accept(MediaType.TEXT_PLAIN).get(String.class);
		totalCarDiscount = Double.parseDouble(response);
				
		Double benefits = totalCarDiscount - operatingCost;
		System.out.println("Car benifits is: " + benefits);
	}

}
