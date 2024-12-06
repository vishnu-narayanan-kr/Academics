package webOnlineFoodDeliveryServiceREST.Order;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import webOnlineFoodDeliveryServiceREST.Utility;


public class Order implements Serializable{
	private static final long serialVersionUID = 1L;
	private String username;
	private List<OrderItem> items;
	private String orderId;
	private Double total;
	
	public String toString() {
		String order = "";
		
		order += orderId + "\t";
		order += username + "\t";
		order += calculateTotal() + "\t";
		order += items.toString() + "\n";
		
		return order;
	}
	
	public Order() {
		this.username = "";
		this.orderId = new Utility().getUID();
		this.items = new ArrayList<OrderItem>();
		this.total = 0.0;
	}
	
	public Double calculateTotal() {
		Double total = this.items.stream().mapToDouble(i -> i.getQty() * i.getPrice()).sum();
		return Math.round(total * 100) / 100.0;
	}
	
	public String getUsername() { 
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public List<OrderItem> getItems() {
		return items;
	}
	
	public void setItems(List<OrderItem> items) {
		this.items = items;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Double getTotal() {
		return this.calculateTotal();
	}

	public void setTotal(Double total) {
		this.total = this.calculateTotal();
	}
}
