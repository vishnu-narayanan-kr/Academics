package webCar;

public class Car {
	private String vin;
	private String desc;
	private double price;
	
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
