package clientOnlineFoodDeliveryServiceREST;

import org.glassfish.jersey.client.ClientConfig;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import org.glassfish.jersey.jackson.JacksonFeature;

class Utility {
	private static String apiURL = "http://localhost:8080/WebOnlineFoodDeliveryServiceProject/rest";
	private static ClientConfig config = new ClientConfig();
	private static Client client = ClientBuilder.newBuilder()
			.withConfig(config)
			.register(JacksonFeature.class)
			.build();
	
	public static WebTarget getTarget(String path) {
		if(path.charAt(0) != '/') {
			path = "/" + path;
		}
		
		return(client.target(apiURL + path));
	}
}
