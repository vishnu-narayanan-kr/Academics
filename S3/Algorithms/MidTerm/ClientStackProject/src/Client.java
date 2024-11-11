/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class Client {
    private int client_Id;
    private String client_Name;
    private int client_Qty;
    private double client_Price;
    
    Client() {
        this.client_Id = 0;
        this.client_Name = "";
        this.client_Qty = 0;
        this.client_Price = 0.0;
    }
    
    Client(int client_Id, String client_Name, int client_Qty, double client_Price) {
        this.client_Id = client_Id;
        this.client_Name = client_Name;
        this.client_Qty = client_Qty;
        this.client_Price = client_Price;
    }
    
    public double getClientTotal() {
        return Math.round(this.client_Qty * this.client_Price * 100) / 100.0;
    }
    
    @Override
    public String toString() {
        return "The Client Information is : " + this.client_Id + "//" + this.client_Name + "//" + this.client_Qty + "//" + this.client_Price + "$ -> Client Total: " + this.getClientTotal() + "$";
    }

    public int getClient_Id() {
        return client_Id;
    }

    public void setClient_Id(int client_Id) {
        this.client_Id = client_Id;
    }

    public String getClient_Name() {
        return client_Name;
    }

    public void setClient_Name(String client_Name) {
        this.client_Name = client_Name;
    }

    public int getClient_Qty() {
        return client_Qty;
    }

    public void setClient_Qty(int client_Qty) {
        this.client_Qty = client_Qty;
    }

    public double getClient_Price() {
        return client_Price;
    }

    public void setClient_Price(double client_Price) {
        this.client_Price = client_Price;
    }
    
    
}
