package clientHelloFormREST;

import java.util.Scanner;

import org.glassfish.jersey.client.ClientConfig;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;

public class TestClientHelloForm {

	public static void main(String[] args) {
		String url = "http://localhost:8080/WebHelloFormRESTProject/rest/WebHelloForm/";
		
		ClientConfig config = new ClientConfig();
		Client client = ClientBuilder.newClient(config);
		WebTarget target = client.target(url);

		String response;
		
		Scanner console = new Scanner(System.in);
		
		// Testing AddName
		System.out.println("Please enter name to Add: ");
		String name = console.next();
		
		response = target.path("AddName")
				.queryParam("Name", name)
				.request()
				.accept(MediaType.TEXT_HTML)
				.get(String.class);
		System.out.println(response);
		
		// Testing UpdateName
		System.out.println("Please enter name to Update: ");
		name = console.next();
		
		response = target.path("UpdateName")
				.queryParam("Name", name)
				.request()
				.accept(MediaType.TEXT_HTML)
				.put(Entity.text(""))
				.readEntity(String.class);
		System.out.println(response);
		
		// Testing RemoveName
		System.out.println("Please enter name to Remove: ");
		name = console.next();
		
		response = target.path("RemoveName")
				.queryParam("Name", name)
				.request()
				.accept(MediaType.TEXT_HTML)
				.delete()
				.readEntity(String.class);
		System.out.println(response);
	}

}
