package clientMathOperationsREST;

import java.util.Scanner;

import org.glassfish.jersey.client.ClientConfig;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

public class ClientMathOperationsREST {

	public static void main(String[] args) {
		String url = "http://localhost:8080/WebMathOperationsRESTProject/rest/MathOp";
		
		ClientConfig config = new ClientConfig();
		Client client = ClientBuilder.newClient(config);
		WebTarget target;
		
		String response;
		
		System.out.println("Enter x, y, and z separated by space: ");
		Scanner console = new Scanner(System.in);
		
		int x = console.nextInt();
		int y = console.nextInt();
		int z = console.nextInt();
		
		target  = client.target(url)
						.queryParam("x", x)
						.queryParam("y", y)
						.queryParam("z", z);
		
		response = target.request().accept(MediaType.TEXT_HTML)
				.get(String.class);
		System.out.println(response);
		
		System.out.println("\nDisplaying the list");
		target = client.target(url).path("listArray");
		response = target.request().accept(MediaType.TEXT_HTML)
				.get(String.class);
		System.out.println(response);
		
		System.out.println("\nSearch in HashMap using Path Parameter");
		System.out.println("Enter x value: ");
		x = console.nextInt();
		
		target = client.target(url).path("/OpHashMap/" + x);
		response = target.request().accept(MediaType.APPLICATION_JSON)
				.get(String.class);
		System.out.println(response);
		
		console.close();
	}

}
