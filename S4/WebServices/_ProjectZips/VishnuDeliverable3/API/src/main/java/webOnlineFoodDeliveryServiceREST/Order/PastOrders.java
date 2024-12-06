package webOnlineFoodDeliveryServiceREST.Order;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import webOnlineFoodDeliveryServiceREST.Utility;

public class PastOrders implements Serializable {
	private static final long serialVersionUID = 1L;
	private static PastOrders instance;
	private List<Order> pastOrders;
	private Utility utility;
	
	private PastOrders() {
		pastOrders = new ArrayList<Order>();
		utility = new Utility();
		
		try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(utility.getPath("_Data/orders.ser")))) {
			pastOrders = (ArrayList<Order>) ois.readObject();
        } catch (IOException | ClassNotFoundException  e) {
            e.printStackTrace();
        }
	}
	
	public static PastOrders getInstance() {
		if(instance == null) {
			instance = new PastOrders();
		}
		
		return instance;
	}

	public List<Order> getOrders() {
		return pastOrders;
	}
}
