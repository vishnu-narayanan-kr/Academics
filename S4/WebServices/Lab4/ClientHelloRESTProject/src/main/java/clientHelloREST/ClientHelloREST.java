package clientHelloREST;

import java.util.Scanner;

import org.glassfish.jersey.client.ClientConfig;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

public class ClientHelloREST {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// Send request to Web Server App WebHelloRESTProject
		
		// Consume REST Service
		String url = "http://localhost:8080/WebHelloWorldRESTProject/rest/HiHi";
		
		ClientConfig config = new ClientConfig();
		Client client = ClientBuilder.newClient(config);
		WebTarget target = client.target(url);
		
		String response;
		
		System.out.println("Application/JSON");
		response = target.request().accept(MediaType.APPLICATION_JSON)
				.get(String.class);
		System.out.println(response);
		
		System.out.println("\nText/HTML");
		response = target.request().accept(MediaType.TEXT_HTML)
				.get(String.class);
		System.out.println(response);
		
		System.out.println("\nText plain");
		response = target.request().accept(MediaType.TEXT_PLAIN)
				.get(String.class);
		System.out.println(response);
		
		System.out.println("\nCustome URL with user input");
		
		System.out.println("Enter a name: ");
		Scanner scanner = new Scanner(System.in);
		String name;
		
		name = scanner.next();
		
		target = client.target(url).path("/specify/" + name);
		response = target.request().accept(MediaType.TEXT_HTML)
				.get(String.class);
		System.out.println(response);
		
		System.out.println("\nCustom URL with Query Params");
		
		target = client.target(url).path("/specifyParameter")
				.queryParam("empId", 123)
				.queryParam("empName", "Vishnu Narayanan")
				.queryParam("empSalary", 85000.0);
		
		response = target.request().accept(MediaType.TEXT_HTML)
				.get(String.class);
		System.out.println(response);
		
		System.out.println("\nUsing third party services");
		System.out.println("Enter a US Zip code(56001): ");
		
		String zipcode = scanner.next();
		
		url = "http://api.zippopotam.us/us/" + zipcode;
		
		target = client.target(url);
		response = target.request().accept(MediaType.APPLICATION_JSON)
				.get(String.class);
		System.out.println(response);
		
		scanner.close();
	}

}
