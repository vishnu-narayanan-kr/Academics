package rectangleGUI;

public class Rectangle {
	private Double length;
	private Double width;
	
	public Double area() {
		return round(length * width);
	}
	
	public Double perimeter() {
		return round(2 * (length + width));
	}
	
	private Double round(Double value) {
		return Math.round(value * 100) / 100.00;
	}
	
	public Rectangle(Double length, Double width) {
		this.length = length;
		this.width = width;
	}

	public Rectangle() {
		this.length = 0.0;
		this.width = 0.0;
	}
	
	public Double getLength() {
		return length;
	}
	public void setLength(Double length) {
		this.length = length;
	}
	public Double getWidth() {
		return width;
	}
	public void setWidth(Double width) {
		this.width = width;
	}
	
	
}
