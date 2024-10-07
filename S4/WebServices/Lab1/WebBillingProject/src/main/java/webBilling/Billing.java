package webBilling;

public class Billing {
	private String client_LName;
	private String client_FName;
	private String product_Name;
    private double prd_Price;
    private double prd_Qty;

    // not initializing static members from the file since they are assumed to be constant
    public static double Fed_Tax = 0.075;
    public static double Prv_Tax = 0.060;

    Billing() {
    	this.client_LName = "";
    	this.client_FName = "";
    	this.product_Name = "";
        this.prd_Price = 0;
        this.prd_Qty = 0;
    }
    
    Billing(String lname, String fname, String pname, double price, double qty) {
    	this.client_LName = lname;
    	this.client_FName = fname;
    	this.product_Name = pname;
        this.prd_Price = price;
        this.prd_Qty = qty;
    }
    
    public String getClient_LName() {
    	return this.client_LName;
    }
    
    public void setClient_LName(String client_LName) {
    	this.client_LName = client_LName;
    }
    
    public String getClient_FName() {
    	return this.client_FName;
    }
    
    public void setClient_FName(String client_FName) {
    	this.client_FName = client_FName;
    }
    public String getProduct_Name() {
    	return this.product_Name;
    }
    
    public void setProduct_Name(String product_Name) {
    	this.product_Name = product_Name;
    }
    public double getPrd_Price() {
        return prd_Price;
    }

    public void setPrd_Price(double prd_Price) {
        this.prd_Price = prd_Price;
    }

    public double getPrd_Qty() {
        return prd_Qty;
    }

    public void setPrd_Qty(double prd_Qty) {
        this.prd_Qty = prd_Qty;
    }

    public static double getFed_Tax() {
        return Fed_Tax;
    }

    public static void setFed_Tax(double Fed_Tax) {
        Billing.Fed_Tax = Fed_Tax;
    }

    public static double getPrv_Tax() {
        return Prv_Tax;
    }

    public static void setPrv_Tax(double Prv_Tax) {
        Billing.Prv_Tax = Prv_Tax;
    }

    @Override
    public String toString() {
        return "Billing[prd_Price: " + this.prd_Price + ",prd_Quantity: " + this.prd_Qty + "]";
    }

    public double CalculateBilling() {
        double total = this.prd_Qty * this.prd_Price;
        return total + total * Fed_Tax + total * Prv_Tax;
    }
}

