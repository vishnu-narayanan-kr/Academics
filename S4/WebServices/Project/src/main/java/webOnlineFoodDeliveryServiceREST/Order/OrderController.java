package webOnlineFoodDeliveryServiceREST.Order;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.List;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import webOnlineFoodDeliveryServiceREST.Utility;

@Path("Order")
public class OrderController {
	Utility utility = new Utility();
	
	@Path("Place")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Order placeOrder(Order order) {
		List<Order> orders = PastOrders.getInstance().getOrders();
		
		orders.add(order);
		
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(utility.getPath("_Data/orders.ser")))) {
            oos.writeObject(orders);
        } catch (IOException e) {
            e.printStackTrace();
        }
		
		return order;
	}
	
	@Path("View")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Order> viewOrders(@QueryParam("username") String username) {
		List<Order> orders = PastOrders.getInstance().getOrders();
		
		return orders.stream().filter(o -> o.getUsername().equals(username)).toList();
	}
}
