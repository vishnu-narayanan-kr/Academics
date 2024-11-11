/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class PayRollEmployee {
    private int emp_id;
    private String emp_name;
    private String emp_ssn;
    private int number_whr;
    private double h_rate;
    
    PayRollEmployee() {
        this.emp_id = 0;
        this.emp_name = "";
        this.emp_ssn = "";
        this.number_whr = 0;
        this.h_rate = 0.0;
    }
    
    @Override
    public String toString() {
        return "Object: PayRollEmployee [emp_id=" + this.emp_id + ", emp_name=" + this.emp_name + ", emp_ssn=" + this.emp_ssn + ", number_whr=" + this.number_whr + ", h_rate=" + this.h_rate + "]";
    }
    
    public static double Fed_Tax = 0.07;
    public static double Prv_Tax = 0.09;
    public static double QP_ins = 0.0055;
    public static double E_ins = 0.014;
    public static double Qpp = 0.045;
    public static double Union_d = 0.0165;

    public int getEmp_id() {
        return emp_id;
    }

    public void setEmp_id(int emp_id) {
        this.emp_id = emp_id;
    }

    public String getEmp_name() {
        return emp_name;
    }

    public void setEmp_name(String emp_name) {
        this.emp_name = emp_name;
    }

    public String getEmp_ssn() {
        return emp_ssn;
    }

    public void setEmp_ssn(String emp_ssn) {
        this.emp_ssn = emp_ssn;
    }

    public int getNumber_whr() {
        return number_whr;
    }

    public void setNumber_whr(int number_whr) {
        this.number_whr = number_whr;
    }

    public double getH_rate() {
        return h_rate;
    }

    public void setH_rate(double h_rate) {
        this.h_rate = h_rate;
    }
    
    public double calculate_TotalIncome() {
        return this.number_whr * this.h_rate;
    }
    
    public double calculate_TotalDeduction() {
        return this.calculate_TotalIncome() * (Fed_Tax + Prv_Tax + QP_ins + E_ins + Qpp + Union_d);
    }
    
    public double calculate_TotalNetIncome() {
        return this.calculate_TotalIncome() - this.calculate_TotalDeduction();
    }
}
