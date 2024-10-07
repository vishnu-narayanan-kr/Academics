package webMathOperationsREST;

public class MathOp {
	private int x;
	private int y;
	private int z;
	
	public MathOp() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	
	public MathOp(int x, int y, int z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	public String toString() {
		String output = "MathOp ";
		
		output += "[";
			output += "x = " + this.x + ", ";
			output += "y = " + this.y + ", ";
			output += "z = " + this.z;
		output += "]";
		return output;
	}
	
	public int CalculateSum() {
		return x + 2*y + 3*z;
	}
	
	public int CalculatePrd() {
		return x*2*y*3*z;
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public int getZ() {
		return z;
	}

	public void setZ(int z) {
		this.z = z;
	}
}
