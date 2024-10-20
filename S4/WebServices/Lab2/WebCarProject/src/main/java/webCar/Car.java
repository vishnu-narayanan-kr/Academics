package webCar;

public class Car {
	private String vin;
	private String desc;
	private double price;
	
	public String toString() {
		String output = "";
		
		output += "car_vin: " + vin + ", ";
		output += "car_desc: " + desc + ", ";
		output += "car_price: " + price + ", ";
		output += "car_price with discount: " + discountPrice() + ", ";
		
		return output;
	}
	
	public Car() {
		this.vin = "";
		this.desc = "";
		this.price = 0.0;
	}
	
	public Car(String vin, String desc, double price) {
		this.vin = vin;
		this.desc = desc;
		this.price = price;
	}
	
	public double discountPrice() {
		return price * 0.9;
	}
	
	public String getVin() {
		return vin;
	}
	public void setVin(String vin) {
		this.vin = vin;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
}
