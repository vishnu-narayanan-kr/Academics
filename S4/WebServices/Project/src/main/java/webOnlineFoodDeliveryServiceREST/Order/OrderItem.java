package webOnlineFoodDeliveryServiceREST.Order;

import webOnlineFoodDeliveryServiceREST.Menu.Menu;

public class OrderItem extends Menu {
	private static final long serialVersionUID = 1L;
	private Integer qty;
	
	@Override
	public String toString() {
		return super.toString() + "\t" + qty;
	}
	
	public OrderItem() {
		super();
		this.qty = 0;
	}

	public Integer getQty() {
		return qty;
	}

	public void setQty(Integer qty) {
		this.qty = qty;
	}
}
