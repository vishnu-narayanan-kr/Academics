package clientBillingREST;

import java.util.Scanner;

import org.glassfish.jersey.client.ClientConfig;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

public class ClientBillingREST {

	public static void main(String[] args) {
		// Configure the client
		String url = "http://localhost:8080/WebBillingRESTProject/rest/WebBilling/";
		
		ClientConfig config = new ClientConfig();
		Client client = ClientBuilder.newClient(config);
		WebTarget target;
		
		String response;
		
		// TEXT output
		System.out.println("Billing text output: ");
		target = client.target(url);
		response = target.request().accept(MediaType.TEXT_PLAIN).get(String.class);
		System.out.println(response);
		
		// HTML output
		System.out.println("Billing HTML output: ");
		response = target.request().accept(MediaType.TEXT_HTML).get(String.class);
		System.out.println(response);
		
		// Search Function
		System.out.println("Enter a valid id to search: ");
		Scanner scanner = new Scanner(System.in);
		Integer id = scanner.nextInt();
		target = client.target(url + "searchBilling/" + id);
		response = target.request().accept(MediaType.APPLICATION_JSON).get(String.class);
		System.out.println(response);
	}


}
