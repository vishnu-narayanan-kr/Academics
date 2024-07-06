/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class Billing {

    private double prd_Price;
    private double prd_Qty;

    // not initializing static members from the file since they are assumed to be constant
    public static double Fed_Tax = 0.07;
    public static double Prv_Tax = 0.06;

    Billing() {
        this.prd_Price = 0;
        this.prd_Qty = 0;
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
