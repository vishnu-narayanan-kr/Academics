package webBillingService;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "Billing")
@XmlAccessorType(XmlAccessType.FIELD)
public class Billing {
	@XmlElement
	private int client_ID;
	@XmlElement
	private String client_LName;
	@XmlElement
	private String client_FName;
	@XmlElement
	private String product_Name;
	@XmlElement
    private double prd_Price;
	@XmlElement
    private double prd_Qty;

    // not initializing static members from the file since they are assumed to be constant
    public static double Fed_Tax = 0.075;
    public static double Prv_Tax = 0.060;

    Billing() {
    	this.client_ID = 0;
    	this.client_LName = "";
    	this.client_FName = "";
    	this.product_Name = "";
        this.prd_Price = 0;
        this.prd_Qty = 0;
    }
    
    Billing(int client_ID, String lname, String fname, String pname, double price, double qty) {
    	this.client_ID = client_ID;
    	this.client_LName = lname;
    	this.client_FName = fname;
    	this.product_Name = pname;
        this.prd_Price = price;
        this.prd_Qty = qty;
    }
    
    public int getClient_ID() {
		return client_ID;
	}

	public void setClient_ID(int client_ID) {
		this.client_ID = client_ID;
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
    	String output = "Billing[";
    	
    	output += "client_id: " + client_ID + ", ";
    	output += "client_LName: " + client_LName + ", ";
    	output += "client_FName: " + client_FName + ", ";
    	output += "product_Name: " + product_Name + ", ";
    	output += "product_Price: " + prd_Price + "$, ";
    	output += "product_Quantity: " + prd_Qty + ", ";
    	output += "Total Billing: " + CalculateBilling() + "$";
    	
    	output += "]";
    	
        return output;
    }

    public double CalculateBilling() {
        double total = this.prd_Qty * this.prd_Price;
        total += total * Fed_Tax + total * Prv_Tax;
        return Math.round(total * 100) / 100.0;
    }
}
