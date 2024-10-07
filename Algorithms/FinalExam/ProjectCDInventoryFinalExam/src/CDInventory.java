/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class CDInventory {

    private int CD_No;
    private String CD_Name;
    private int CD_Qty;
    private double CD_Price;

    public CDInventory(int CD_No, String CD_Name, int CD_Qty, double CD_Price) {
        this.CD_No = CD_No;
        this.CD_Name = CD_Name;
        this.CD_Qty = CD_Qty;
        this.CD_Price = CD_Price;
    }

    @Override
    public String toString() {
        String output = "The information is ";

        output += CD_No + "//";
        output += CD_Name + "//";
        output += CD_Qty + "//";
        output += CD_Price + "//";
        output += calculateTotalInv() + "$";

        return output;
    }

    public double calculateTotalInv() {
        return Math.round(CD_Price * CD_Qty * 100.00) / 100.00;
    }

    public int getCD_No() {
        return CD_No;
    }

    public void setCD_No(int CD_No) {
        this.CD_No = CD_No;
    }

    public String getCD_Name() {
        return CD_Name;
    }

    public void setCD_Name(String CD_Name) {
        this.CD_Name = CD_Name;
    }

    public int getCD_Qty() {
        return CD_Qty;
    }

    public void setCD_Qty(int CD_Qty) {
        this.CD_Qty = CD_Qty;
    }

    public double getCD_Price() {
        return CD_Price;
    }

    public void setCD_Price(double CD_Price) {
        this.CD_Price = CD_Price;
    }

}
